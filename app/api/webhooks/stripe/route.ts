import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateQuote, createProject } from '@/lib/firebase-services';
import { calculatePrice } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { projectId, clientName, paymentType, planType } = session.metadata || {};

    if (projectId) {
      try {
        await updateQuote(projectId, {
          status: 'accepted',
        });

        const projectType = planType || 'site';
        const { days } = calculatePrice(projectType, [], 'basic', 'normal');

        await createProject({
          userId: session.client_reference_id || session.customer_email || 'unknown',
          name: `${projectType} - ${new Date().toLocaleDateString('pt-BR')}`,
          description: `Plano: ${planType} | Pagamento: ${paymentType} | Checkout ID: ${session.id}`,
          price: session.amount_total ? session.amount_total / 100 : 0,
          deadline: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
          features: [],
        });

        console.log('Payment successful for project:', projectId);
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}