import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeInput,
  checkRateLimit,
  isPhoneBlocked,
  blockPhone,
  logSecurityEvent,
  detectInjectionAttempt,
  validatePhoneNumber
} from '@/lib/whatsapp-security';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'estudiok_verify_2024';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          await processMessage(change.value);
        }
      }
    }

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function processMessage(value: any) {
  if (!value.messages || value.messages.length === 0) return;

  for (const message of value.messages) {
    const phone = message.from;
    const messageType = message.type;
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    if (!validatePhoneNumber(phone)) {
      logSecurityEvent(phone, 'invalid_phone', true, 'Invalid phone number format');
      continue;
    }

    if (isPhoneBlocked(phone)) {
      logSecurityEvent(phone, 'blocked_attempt', true, 'Blocked phone attempted contact');
      continue;
    }

    const rateCheck = checkRateLimit(phone);
    if (!rateCheck.allowed) {
      logSecurityEvent(phone, 'rate_limited', true, rateCheck.reason);
      continue;
    }

    if (messageType === 'text') {
      const text = message.text?.body || '';

      if (detectInjectionAttempt(text)) {
        blockPhone(phone, 'Injection attempt detected');
        logSecurityEvent(phone, 'injection_blocked', true, 'Malicious input detected');
        continue;
      }

      const sanitizedText = sanitizeInput(text);
      await handleTextMessage(phone, sanitizedText, timestamp);
    }
  }
}

async function handleTextMessage(phone: string, text: string, timestamp: Date) {
  const lowerText = text.toLowerCase().trim();

  logSecurityEvent(phone, 'message_received', false, text.substring(0, 100));

  if (lowerText === 'oi' || lowerText === 'olá' || lowerText === 'ola' || lowerText === 'hello') {
    await sendBotReply(phone, `Olá! 👋 Bem-vindo à ESTUDIOK!

Escolha uma opção:
1️⃣ - Ver nossos serviços
2️⃣ - Fazer orçamento
3️⃣ - Suporte
4️⃣ - Ver portfolio

Digite o número da opção desejada.`);
    return;
  }

  switch (lowerText) {
    case '1':
      await sendBotReply(phone, `🚀 NOSSOS SERVIÇOS:

📱 Sites Profissionais
- Landing pages
- Sites institucionais
- Blogs

🛒 E-commerce
- Lojas virtuais completas
- Integração com pagamentos

📱 Apps Mobile
- iOS e Android
- Apps personalizados

💡 Sistemas Web
- CRM, ERP
- Automações

Digite 2 para fazer um orçamento!`);
      break;

    case '2':
      await sendBotReply(phone, `📝 ORÇAMENTO

Para fazer seu orçamento, acesse:
https://estudiok.com.br/orcamento

Ou me conte brevemente:
- Tipo de projeto (site, app, sistema)
- Seu nome
- Seu email

Responderei em até 24h!`);
      break;

    case '3':
      await sendBotReply(phone, `🎧 SUPORTE

Para suporte técnico:
📧 suporte@estudiok.com.br
📞 (11) 99999-9999

Horário: 9h às 18h (seg-sex)

O que precisa?
- Problema técnico
- Dúvida sobre projeto
- Outro assunto`);
      break;

    case '4':
      await sendBotReply(phone, `🎨 PORTFOLIO

Veja nossos projetos em:
https://estudiok.com.br/portfolio

Projetos em destaque:
✅ Sites institucionais
✅ E-comces
✅ Apps mobile
✅ Sistemas web

Qual tipo de projeto te interessa?`);
      break;

    default:
      await sendBotReply(phone, `Recebi sua mensagem! ✅

Um atendente entrará em contato em breve.

Enquanto isso, você pode:
1️⃣ - Ver serviços
2️⃣ - Fazer orçamento
3️⃣ - Suporte
4️⃣ - Ver portfolio

Digite o número da opção.`);
  }
}

async function sendBotReply(phone: string, message: string) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log('WhatsApp bot would reply:', { phone, message: message.substring(0, 50) + '...' });
    return;
  }

  try {
    await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message }
        }),
      }
    );
  } catch (error) {
    console.error('Error sending bot reply:', error);
  }
}
