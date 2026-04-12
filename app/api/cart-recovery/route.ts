import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendRecoveryEmails } from '@/lib/cart-recovery';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'run_recovery') {
      await checkAndSendRecoveryEmails();
      return NextResponse.json({ success: true, message: 'Recovery emails processed' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Cart recovery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Cart recovery API',
    actions: ['run_recovery']
  });
}