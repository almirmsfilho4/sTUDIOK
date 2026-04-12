import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/lead-scoring';

export async function POST(request: NextRequest) {
  try {
    await processEmailQueue();
    return NextResponse.json({ success: true, message: 'Email queue processed' });
  } catch (error) {
    console.error('Email queue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Email Queue API',
    actions: ['POST to process queue']
  });
}