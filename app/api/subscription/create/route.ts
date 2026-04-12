import { NextRequest, NextResponse } from 'next/server';
import { createDocument } from '@/lib/firebase-services';

const PLAN_PRICES = {
  starter: { amount: 9700, name: 'ESTUDIOK Starter' },
  profissional: { amount: 19700, name: 'ESTUDIOK Profissional' },
  business: { amount: 39700, name: 'ESTUDIOK Business' }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail, userName } = body;

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const plan = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    if (!plan) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 });
    }

    const subscriptionId = `sub_${Date.now()}_${userId}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studiok.com';

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken || accessToken.startsWith('TEST-')) {
      const mockPreference = {
        id: `mock_${subscriptionId}`,
        init_point: `${siteUrl}/checkout/subscription/${subscriptionId}?plan=${planId}&mock=true`,
        sandbox_init_point: `${siteUrl}/checkout/subscription/${subscriptionId}?plan=${planId}&mock=true`,
      };
      
      await createDocument('subscriptions', {
        id: subscriptionId,
        userId,
        planId,
        status: 'pending',
        amount: plan.amount,
        preferenceId: mockPreference.id,
        createdAt: new Date(),
      });

      return NextResponse.json(mockPreference);
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          title: plan.name,
          unit_price: plan.amount,
          quantity: 1,
          description: `Assinatura mensal ${plan.name} - ESTUDIOK`,
          category_id: 'services',
        }],
        payer: {
          email: userEmail,
          name: userName,
        },
        back_urls: {
          success: `${siteUrl}/planos/success?subscription=${subscriptionId}`,
          failure: `${siteUrl}/planos?error=payment_failed`,
          pending: `${siteUrl}/planos?error=payment_pending`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/webhooks/mercadopago?source=web`,
        metadata: {
          subscription_id: subscriptionId,
          plan_id: planId,
          user_id: userId,
          type: 'subscription',
        },
        expires: false,
        recurring: true,
        trial_period_days: 7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mercado Pago error:', error);
      return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
    }

    const preference = await response.json();

    await createDocument('subscriptions', {
      id: subscriptionId,
      userId,
      planId,
      status: 'pending',
      amount: plan.amount,
      preferenceId: preference.id,
      createdAt: new Date(),
    });

    return NextResponse.json(preference);
  } catch (error) {
    console.error('Subscription payment error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
