import { NextRequest, NextResponse } from 'next/server';
import { updateProject, updateDocument, getDocuments } from '@/lib/firebase-services';

interface MercadoPagoPayment {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  status_detail: string;
  metadata?: {
    quote_id?: string;
    project_type?: string;
    amount?: number;
    subscription_id?: string;
    plan_id?: string;
    user_id?: string;
    type?: string;
  };
  transaction_amount?: number;
  date_created: string;
  date_last_updated: string;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production' && secret) {
      const signature = request.headers.get('x-signature');
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      // In a real implementation, verify the signature here
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Fetch payment details from Mercado Pago API
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      
      if (!accessToken) {
        console.error('Mercado Pago access token not configured');
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
      }

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch payment details:', response.statusText);
        return NextResponse.json({ error: 'Payment details fetch failed' }, { status: 500 });
      }

      const payment: MercadoPagoPayment = await response.json();
      
      const paymentType = payment.metadata?.type;

      if (paymentType === 'subscription') {
        const subscriptionId = payment.metadata?.subscription_id;
        const userId = payment.metadata?.user_id;
        
        if (subscriptionId && userId) {
          const subscriptions = await getDocuments('subscriptions');
          const sub = (subscriptions as any[]).find(
            s => s.id === subscriptionId && s.userId === userId
          );

          if (sub) {
            const nextBillingDate = new Date();
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

            await updateDocument('subscriptions', sub.id, {
              status: payment.status === 'approved' ? 'active' : 'pending',
              paymentId: payment.id,
              paymentStatus: payment.status,
              paidAmount: payment.transaction_amount || 0,
              lastPaymentDate: new Date(),
              nextBillingDate: payment.status === 'approved' ? nextBillingDate : null,
            });

            console.log(`Subscription ${subscriptionId} updated to status: ${payment.status}`);
          }
        }
      } else {
        const quoteId = payment.metadata?.quote_id;
        
        if (!quoteId) {
          console.error('No quote ID in payment metadata');
          return NextResponse.json({ error: 'Invalid payment metadata' }, { status: 400 });
        }

        let projectStatus = 'pending';
        let paidAmount = 0;

        switch (payment.status) {
          case 'approved':
            projectStatus = 'in_progress';
            paidAmount = payment.transaction_amount || 0;
            break;
          case 'pending':
            projectStatus = 'pending_payment';
            break;
          case 'rejected':
          case 'cancelled':
            projectStatus = 'cancelled';
            break;
        }

        await updateProject(quoteId, {
          status: projectStatus,
          paidAmount: paidAmount,
          paymentId: payment.id,
          paymentStatus: payment.status,
          paymentDate: new Date(),
        });

        console.log(`Project ${quoteId} updated to status: ${projectStatus}`);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}