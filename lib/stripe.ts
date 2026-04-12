import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export interface CreateCheckoutParams {
  priceAmount: number;
  projectName: string;
  clientName: string;
  clientEmail: string;
  projectId: string;
  planType: 'site' | 'ecommerce' | 'app' | 'system';
  paymentType: 'total' | ' entrada';
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const { priceAmount, projectName, clientName, clientEmail, projectId, planType, paymentType } = params;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `ESTUDIOK - ${projectName}`,
            description: `Plano: ${planType} | Pagamento: ${paymentType === 'total' ? 'Pagamento Único (10% desconto)' : 'Entrada + Parcelas'}`,
          },
          unit_amount: Math.round(priceAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/checkout/${projectId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/${projectId}`,
    customer_email: clientEmail,
    metadata: {
      projectId,
      clientName,
      paymentType,
      planType,
    },
  });

  return session;
}

export async function retrieveCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
}