export interface WhatsAppMessage {
  to: string;
  templateName: string;
  parameters?: Record<string, string>;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: string;
    sub_type?: string;
    parameters?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

const TEMPLATES: Record<string, WhatsAppTemplate> = {
  welcome: {
    name: 'welcome',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' }
        ]
      }
    ]
  },
  orcamento_recebido: {
    name: 'orcamento_recebido',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' },
          { type: 'text', text: '{{2}}' }
        ]
      }
    ]
  },
  pagamento_confirmado: {
    name: 'pagamento_confirmado',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' },
          { type: 'text', text: '{{2}}' }
        ]
      }
    ]
  },
  projeto_entregue: {
    name: 'projeto_entregue',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' }
        ]
      }
    ]
  },
  followup: {
    name: 'followup',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' }
        ]
      }
    ]
  }
};

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log('WhatsApp not configured - skipping message:', message);
    return { success: false, error: 'WhatsApp not configured' };
  }

  const template = TEMPLATES[message.templateName];
  if (!template) {
    return { success: false, error: `Template ${message.templateName} not found` };
  }

  const phoneNumber = message.to.replace(/\D/g, '');
  const formattedPhone = phoneNumber.startsWith('55') ? phoneNumber : `55${phoneNumber}`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: template
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('WhatsApp API error:', data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendWelcomeMessage(phone: string, name: string): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'welcome',
    parameters: { 1: name }
  });
  return result.success;
}

export async function sendOrcamentoRecebidoMessage(phone: string, nome: string, valor: string): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'orcamento_recebido',
    parameters: { 1: nome, 2: valor }
  });
  return result.success;
}

export async function sendPagamentoConfirmadoMessage(phone: string, projeto: string, valor: string): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'pagamento_confirmado',
    parameters: { 1: projeto, 2: valor }
  });
  return result.success;
}

export async function sendProjetoEntregueMessage(phone: string, projeto: string): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'projeto_entregue',
    parameters: { 1: projeto }
  });
  return result.success;
}

export async function sendFollowUpMessage(phone: string, mensagem: string): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'followup',
    parameters: { 1: mensagem }
  });
  return result.success;
}