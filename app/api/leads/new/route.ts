import { NextRequest, NextResponse } from 'next/server';
import { createQuote } from '@/lib/firebase-services';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const quoteId = await createQuote({
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.projectType,
      features: data.features || [],
      complexity: data.complexity || 'medium',
      deadline: data.deadline || 'normal',
      price: data.budget ? parseInt(data.budget) : 0,
      estimatedDays: 15,
      sessionId: `lead_${Date.now()}`,
      source: data.source || 'website',
      description: data.description
    });

    await notifyNewLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.projectType,
      message: data.description
    });

    return NextResponse.json({ success: true, quoteId });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Erro ao processar solicitação' }, { status: 500 });
  }
}

async function notifyNewLead(lead: { name: string; email: string; phone: string; projectType: string; message: string }) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'ESTUDIOK Lead <noreply@estudiok.com.br>',
      to: ['estudiokgames@gmail.com'],
      subject: `🔥 NOVO LEAD: ${lead.name} - ${lead.projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0A0A0A; color: white;">
          <h2 style="color: #00D4FF;">🔥 Novo Lead Recebido!</h2>
          
          <div style="background: #1A1A1A; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>WhatsApp:</strong> ${lead.phone}</p>
            <p><strong>Projeto:</strong> ${lead.projectType}</p>
            <p><strong>Mensagem:</strong> ${lead.message || 'Não informada'}</p>
          </div>
          
          <a href="https://estudiok.com.br/admin/leads" style="background: #00D4FF; color: black; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Ver no Admin →
          </a>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send lead notification:', error);
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ready', endpoint: 'POST /api/leads/new' });
}