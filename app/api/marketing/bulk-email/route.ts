import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

interface BulkEmailRequest {
  recipients: { email: string; name?: string }[];
  subject: string;
  body: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BulkEmailRequest = await request.json();

    if (!data.recipients || data.recipients.length === 0) {
      return NextResponse.json({ error: 'Nenhum destinatário fornecido' }, { status: 400 });
    }

    if (!data.subject || !data.body) {
      return NextResponse.json({ error: 'Assunto e corpo do email são obrigatórios' }, { status: 400 });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as { email: string; error: string }[],
    };

    // Resend supports bulk sending via an array of 'to' addresses, 
    // but for personalized content (using names), we must send individually or use batches.
    // To allow personalization (e.g. "Olá {{nome}}"), we iterate.
    
    const BATCH_SIZE = 50;
    for (let i = 0; i < data.recipients.length; i += BATCH_SIZE) {
      const batch = data.recipients.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (recipient) => {
          try {
            // Simple personalization: replace {{nome}} with recipient name
            const personalizedBody = data.body.replace(/{{nome}}/g, recipient.name || 'empreendedor');
            
            await resend.emails.send({
              from: 'ESTUDIOK <noreply@estudiok.com.br>',
              to: recipient.email,
              subject: data.subject,
              html: personalizedBody,
            });
            results.success++;
          } catch (error: any) {
            results.failed++;
            results.errors.push({ 
              email: recipient.email, 
              error: error.message || 'Erro desconhecido' 
            });
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: `Envio concluído: ${results.success} enviados, ${results.failed} falhas`,
      details: results,
    });

  } catch (error: any) {
    console.error('Erro no disparo em massa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
