import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/firebase-services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, leadId, data } = body;
    
    if (action === 'add-interaction') {
      await createDocument('leadInteractions', {
        leadId,
        type: data.type,
        notes: data.notes,
        createdAt: new Date(),
        createdBy: data.createdBy || 'system'
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId');
  
  if (!leadId) {
    return NextResponse.json({ error: 'leadId required' }, { status: 400 });
  }
  
  try {
    const interactions = await getDocuments('leadInteractions');
    const filtered = (interactions as any[]).filter(i => i.leadId === leadId);
    
    return NextResponse.json({ interactions: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}