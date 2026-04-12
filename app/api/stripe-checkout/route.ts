import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      priceAmount,
      projectName,
      clientName,
      clientEmail,
      projectId,
      planType,
      paymentType,
    } = body;

    if (!priceAmount || !projectName || !clientEmail || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      priceAmount,
      projectName,
      clientName,
      clientEmail,
      projectId,
      planType: planType || 'site',
      paymentType: paymentType || 'entrada',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}