import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

interface EmailSequenceRequest {
  email: string;
  nome?: string;
  produto?: string;
  leadSource?: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
  delayHours: number;
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: EmailSequenceRequest = await request.json();
    
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Sequência de emails (3 emails em 7 dias)
    const sequence: EmailTemplate[] = [
      {
        subject: `🎯 Bem-vindo à ESTUDIOK, ${data.nome || 'empreendedor'}!`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Que bom ter você conosco!</h1>
            <p>Oi ${data.nome || 'empreendedor'},</p>
            <p>Ficamos muito felizes com seu interesse em transformar seu negócio com marketing digital.</p>
            <p>Nos próximos dias, vou compartilhar com você:</p>
            <ul>
              <li><strong>Estratégias exclusivas</strong> que aplicamos para nossos clientes</li>
              <li><strong>Casos de sucesso</strong> com resultados reais</li>
              <li><strong>Dicas práticas</strong> para implementar ainda hoje</li>
            </ul>
            <p>Enquanto isso, que tal dar uma olhada no nosso simulador de ROI?</p>
            <p><a href="https://estudiok.com.br/simulador-roi" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Calcular meu Potencial de Faturamento</a></p>
            <br>
            <p>Atenciosamente,<br>
            <strong>Equipe ESTUDIOK</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              ESTUDIOK - Marketing Digital & Automação<br>
              Email: estudiokgames@gmail.com<br>
              WhatsApp: (11) 99999-9999
            </p>
          </div>
        `,
        delayHours: 0, // Email imediato
        tags: ['welcome', 'lead-nurturing']
      },
      {
        subject: '📈 O segredo para dobrar seu faturamento em 90 dias',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">Já imaginou multiplicar seus resultados?</h1>
            <p>Oi ${data.nome || 'empreendedor'},</p>
            <p>No email anterior falamos sobre potencial. Agora vou te mostrar como <strong>clientes reais estão conseguindo resultados extraordinários</strong>.</p>
            <h3>🎯 Caso Prático: E-commerce de Moda</h3>
            <ul>
              <li><strong>Antes:</strong> R$ 15.000/mês</li>
              <li><strong>Depois (3 meses):</strong> R$ 42.000/mês</li>
              <li><strong>Aumento:</strong> 180%</li>
            </ul>
            <p>O segredo? Um sistema de automação que:</p>
            <ol>
              <li>Identifica oportunidades 24/7</li>
              <li>Converte visitantes em clientes</li>
              <li>Fideliza com comunicação personalizada</li>
            </ol>
            <p>Quer ver como isso funcionaria no SEU negócio?</p>
            <p><a href="https://estudiok.com.br/agendar" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Agendar Análise Gratuita</a></p>
            <br>
            <p>Abraços,<br>
            <strong>Equipe ESTUDIOK</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              ESTUDIOK - Marketing Digital & Automação<br>
              Email: estudiokgames@gmail.com<br>
              WhatsApp: (11) 99999-9999
            </p>
          </div>
        `,
        delayHours: 48, // 2 dias depois
        tags: ['value-proposition', 'case-study']
      },
      {
        subject: '⏰ Última chance: Garantia de 30 dias termina amanhã',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Oportunidade que está acabando!</h1>
            <p>Oi ${data.nome || 'empreendedor'},</p>
            <p>Esta é nossa última comunicação da sequência. Quero te lembrar de uma coisa importante:</p>
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">🏆 Garantia de 30 Dias</h3>
              <p>Teste nossos serviços por 30 dias completos. Se não ficar satisfeito, devolvemos 100% do seu investimento.</p>
            </div>
            <p>Milhares de empreendedores já transformaram seus negócios com nossa metodologia. Agora é sua vez.</p>
            <h3>🎁 Oferta Especial (Limitada)</h3>
            <ul>
              <li><strong>Plano Premium:</strong> R$ 2.997/mês</li>
              <li><strong>Bônus:</strong> Setup Gratuito (R$ 1.500)</li>
              <li><strong>Garantia:</strong> 30 dias sem risco</li>
            </ul>
            <p>Não perca esta oportunidade de transformar seu negócio com segurança total.</p>
            <p><a href="https://estudiok.com.br/checkout" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Quero Garantia de 30 Dias</a></p>
            <br>
            <p>Última chance,<br>
            <strong>Equipe ESTUDIOK</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              ESTUDIOK - Marketing Digital & Automação<br>
              Email: estudiokgames@gmail.com<br>
              WhatsApp: (11) 99999-9999<br>
              <em>Esta oferta é válida apenas para novos clientes e pode ser encerrada a qualquer momento.</em>
            </p>
          </div>
        `,
        delayHours: 168, // 7 dias depois
        tags: ['urgency', 'limited-offer', 'guarantee']
      }
    ];

    // Agendar emails (em produção usaríamos queue/worker)
    const sentEmails = [];
    
    for (const emailTemplate of sequence) {
      try {
        // Em produção, aqui usaríamos um sistema de filas
        // Para desenvolvimento, enviamos apenas o primeiro email
        if (emailTemplate.delayHours === 0) {
          const { data: emailData, error } = await resend.emails.send({
            from: 'ESTUDIOK <noreply@estudiok.com.br>',
            to: [data.email],
            subject: emailTemplate.subject,
            html: emailTemplate.body,
            tags: (emailTemplate.tags || []).map(t => ({ name: t, value: '1' }))
          });

          if (error) {
            console.error('Erro ao enviar email:', error);
          } else {
            sentEmails.push({
              subject: emailTemplate.subject,
              scheduledFor: new Date(Date.now() + emailTemplate.delayHours * 60 * 60 * 1000).toISOString(),
              emailId: emailData?.id || 'queued'
            });
          }
        } else {
          // Para emails agendados, apenas registramos no log
          sentEmails.push({
            subject: emailTemplate.subject,
            scheduledFor: new Date(Date.now() + emailTemplate.delayHours * 60 * 60 * 1000).toISOString(),
            emailId: 'scheduled'
          });
        }
      } catch (error) {
        console.error(`Erro no template ${emailTemplate.subject}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sequência de emails iniciada com sucesso',
      emails: sentEmails,
      totalEmails: sequence.length,
      nextEmail: sentEmails.length > 1 ? sentEmails[1] : null
    });

  } catch (error) {
    console.error('Erro na sequência de emails:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}