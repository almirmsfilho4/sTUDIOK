import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, updateDocument } from '@/lib/firebase-services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, userId } = body;

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const subscriptions = await getDocuments('subscriptions');
    const sub = (subscriptions as any[]).find(
      s => s.id === subscriptionId && s.userId === userId
    );

    if (!sub) {
      return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 });
    }

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    await updateDocument('subscriptions', sub.id, {
      status: 'active',
      startedAt: new Date(),
      nextBillingDate: nextBillingDate,
      activatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
