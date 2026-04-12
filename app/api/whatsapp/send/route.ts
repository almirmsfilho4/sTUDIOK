import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, sendWelcomeMessage, sendOrcamentoRecebidoMessage, sendPagamentoConfirmadoMessage, sendProjetoEntregueMessage } from '@/lib/whatsapp-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, ...params } = body;

    let success = false;

    switch (action) {
      case 'welcome':
        success = await sendWelcomeMessage(phone, params.name || 'Cliente');
        break;
      case 'orcamento_recebido':
        success = await sendOrcamentoRecebidoMessage(phone, params.nome || '', params.valor || '');
        break;
      case 'pagamento_confirmado':
        success = await sendPagamentoConfirmadoMessage(phone, params.projeto || '', params.valor || '');
        break;
      case 'projeto_entregue':
        success = await sendProjetoEntregueMessage(phone, params.projeto || '');
        break;
      default:
        const result = await sendWhatsAppMessage({
          to: phone,
          templateName: params.template || 'followup',
          parameters: params.parameters || {}
        });
        success = result.success;
    }

    if (success) {
      return NextResponse.json({ success: true, message: 'WhatsApp message sent' });
    } else {
      return NextResponse.json({ success: false, message: 'WhatsApp not configured or failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'WhatsApp API ready',
    templates: ['welcome', 'orcamento_recebido', 'pagamento_confirmado', 'projeto_entregue', 'followup']
  });
}