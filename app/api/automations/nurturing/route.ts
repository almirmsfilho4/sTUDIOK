import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/firebase-services';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NURTURING_EMAILS = [
  {
    day: 1,
    subject: 'O que esperar do seu projeto? 🎯',
    template: '跟进1'
  },
  {
    day: 3,
    subject: 'Tem dúvidas? Estamos aqui! 💬',
    template: '跟进2'
  },
  {
    day: 7,
    subject: 'Última chance: Offer especial 🔥',
    template: '跟进3'
  }
];

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    
    if (action === 'run') {
      await runNurturingSequence();
      return NextResponse.json({ success: true, message: 'Nurturing sequence run completed' });
    }
    
    return NextResponse.json({ status: 'ready' });
  } catch (error) {
    console.error('Nurturing error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

async function runNurturingSequence() {
  const quotes = await getDocuments('quotes');
  const now = new Date();
  
  for (const quote of quotes as any[]) {
    if (!quote.email || quote.status !== 'pending') continue;
    
    const createdAt = quote.createdAt?.toDate ? quote.createdAt.toDate() : new Date(quote.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    for (const email of NURTURING_EMAILS) {
      if (daysSinceCreation === email.day) {
        const alreadySent = quote.nurturingSent?.includes(email.template);
        
        if (!alreadySent) {
          await sendNurturingEmail(quote, email);
        }
      }
    }
  }
}

async function sendNurturingEmail(quote: any, emailConfig: typeof NURTURING_EMAILS[0]) {
  const templates: Record<string, string> = {
    '跟进1': `
      <h2>Olá, ${quote.name}! 👋</h2>
      <p>Recebemos seu orçamento e estamos ansiosos para trabalhar com você!</p>
      <p>Nos próximos dias, nossa equipe entrará em contato com uma proposta detalhada.</p>
      <p>Enquanto isso, que tal ver alguns dos nossos projetos?</p>
      <a href="https://estudiok.com.br/portfolio" style="background:#00D4FF;color:black;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Portfólio</a>
    `,
    '跟进2': `
      <h2>Olá, ${quote.name}! 👋</h2>
      <p>Já se passaram alguns dias desde seu orçamento. Tem alguma dúvida?</p>
      <p>Nossa equipe está pronta para te ajudar!</p>
      <p>Responda este email ou chame no WhatsApp: (32) 98421-4444</p>
    `,
    '跟进3': `
      <h2>Última chance! 🔥</h2>
      <p>${quote.name}, esta é sua última chance de garantir 30% de desconto!</p>
      <p>Oferta válida por tempo limitado.</p>
      <a href="https://estudiok.com.br/orcamento" style="background:#00D4FF;color:black;padding:12px 24px;text-decoration:none;border-radius:8px;">Garantir Desconto</a>
    `
  };

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ESTUDIOK <onboarding@resend.dev>',
        to: [quote.email],
        subject: emailConfig.subject,
        html: templates[emailConfig.template]
      })
    });
    
    console.log(`Sent ${emailConfig.template} to ${quote.email}`);
  } catch (error) {
    console.error('Failed to send nurturing email:', error);
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    emails: NURTURING_EMAILS.map(e => ({ day: e.day, subject: e.subject }))
  });
}