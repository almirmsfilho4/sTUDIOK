import { Resend } from 'resend';

// Inicializar Resend apenas no servidor
let resend: Resend | null = null;

if (typeof window === 'undefined') {
  // Estamos no servidor
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    resend = new Resend(resendApiKey);
  }
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  bcc?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  category?: string;
}

export class EmailService {
  private static instance: EmailService;

  constructor() {
    // Construtor vazio agora - usamos a variável global resend
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // No cliente, apenas simular o envio
      if (typeof window !== 'undefined') {
        console.log('📧 Email simulado (cliente):', options.subject);
        console.log('Para:', options.to);
        return true;
      }

      // No servidor, tentar enviar realmente
      if (!resend) {
        console.log('📧 Resend não configurado - email simulado:', options.subject);
        return true;
      }

      const { data, error } = await resend.emails.send({
        from: options.from || 'ESTUDIOK <estudiokgames@gmail.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        bcc: options.bcc,
        replyTo: options.replyTo,
        tags: options.tags
      });

      if (error) {
        console.error('Resend API error:', error);
        return false;
      }

      console.log('✅ Email sent successfully:', data?.id);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendTemplate(templateId: string, options: Omit<EmailOptions, 'subject' | 'html'> & { variables?: Record<string, string> }): Promise<boolean> {
    const template = this.getTemplate(templateId);
    
    if (!template) {
      console.error(`Template ${templateId} not found`);
      return false;
    }

    let html = template.html;
    let subject = template.subject;

    // Replace variables
    if (options.variables) {
      Object.entries(options.variables).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }

    return this.sendEmail({
      to: options.to,
      subject,
      html,
      from: options.from,
      bcc: options.bcc,
      replyTo: options.replyTo
    });
  }

  private getTemplate(templateId: string): EmailTemplate | null {
    const templates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Email de Boas-Vindas',
        subject: '🎉 Bem-vindo à ESTUDIOK, {{name}}!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Bem-vindo à ESTUDIOK</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00D4FF 0%, #7B2CBF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
              .button { display: inline-block; background: linear-gradient(135deg, #00D4FF 0%, #7B2CBF 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ESTUDIOK</h1>
              <p>Soluções Digitais Sob Medida</p>
            </div>
            <div class="content">
              <h2>Olá {{name}}!</h2>
              <p>É um prazer ter você conosco! Na ESTUDIOK, transformamos suas ideias em soluções digitais incríveis.</p>
              
              <h3>✨ O que podemos fazer por você:</h3>
              <ul>
                <li>Sites modernos e responsivos</li>
                <li>Apps mobile nativos</li>
                <li>Sistemas web personalizados</li>
                <li>E-commerces de alta conversão</li>
              </ul>

              <h3>💡 Próximos passos:</h3>
              <ol>
                <li>Faça seu orçamento em /orcamento</li>
                <li>Converse com nosso chatbot para tirar dúvidas</li>
                <li>Acompanhe tudo pelo seu painel em /dashboard</li>
              </ol>

              <a href="{{site_url}}/orcamento" class="button">Fazer Orçamento</a>
            </div>
            <div class="footer">
              <p>© 2024 ESTUDIOK. Todos os direitos reservados.</p>
              <p>estudiokgames@gmail.com • (11) 99999-9999</p>
            </div>
          </body>
          </html>
        `,
        text: `Olá {{name}}! Bem-vindo à ESTUDIOK. Transformamos suas ideias em soluções digitais incríveis. Próximos passos: 1) Faça seu orçamento em {{site_url}}/orcamento 2) Converse com nosso chatbot 3) Acompanhe pelo painel.`,
        category: 'onboarding'
      },
      {
        id: 'quote_created',
        name: 'Orçamento Criado',
        subject: '💰 Seu orçamento está pronto, {{name}}!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Orçamento Pronto</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00D4FF 0%, #7B2CBF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
              .button { display: inline-block; background: linear-gradient(135deg, #00D4FF 0%, #7B2CBF 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
              .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎯 Orçamento Pronto!</h1>
              <p>Seu projeto personalizado</p>
            </div>
            <div class="content">
              <h2>Olá {{name}}!</h2>
              <p>Seu orçamento foi gerado com sucesso!</p>
              
              <div class="quote-details">
                <h3>📋 Detalhes do projeto:</h3>
                <p><strong>Tipo:</strong> {{project_type}}</p>
                <p><strong>Complexidade:</strong> {{complexity}}</p>
                <p><strong>Prazo estimado:</strong> {{days}} dias</p>
                <p><strong>Valor:</strong> R$ {{price}}</p>
              </div>

              <h3>🎯 Próximos passos:</h3>
              <ol>
                <li>Revise os detalhes do seu orçamento</li>
                <li>Clique em "Aceitar Orçamento" para continuar</li>
                <li>Efetue o pagamento da entrada (30% ou 50%)</li>
                <li>Começamos imediatamente!</li>
              </ol>

              <a href="{{quote_url}}" class="button">Ver Orçamento</a>
            </div>
            <div class="footer">
              <p>© 2024 ESTUDIOK. Todos os direitos reservados.</p>
            </div>
          </body>
          </html>
        `,
        text: `Olá {{name}}! Seu orçamento está pronto. Detalhes: Tipo: {{project_type}}, Complexidade: {{complexity}}, Prazo: {{days}} dias, Valor: R$ {{price}}. Acesse: {{quote_url}}`,
        category: 'quotes'
      }
    ];

    return templates.find(t => t.id === templateId) || null;
  }

  async sendBulk(emails: EmailOptions[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(email);
      result ? success++ : failed++;
    }

    return { success, failed };
  }

  async getStats(): Promise<any> {
    try {
      // Implementar busca de estatísticas da Resend API quando disponível
      return { sent: 0, delivered: 0, opened: 0 };
    } catch (error) {
      console.error('Error getting email stats:', error);
      return null;
    }
  }

  // Notificação para admin sobre novo usuário
  async sendAdminNotification(type: 'new_user' | 'new_project' | 'new_payment', data: any): Promise<boolean> {
    // No cliente, apenas simular
    if (typeof window !== 'undefined') {
      console.log('📧 Notificação simulada:', type, data);
      return true;
    }
    
    // No servidor, usar email real
    const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'almir.msfilho@hotmail.com';
    
    const templates = {
      new_user: {
        subject: '🎉 Novo usuário cadastrado',
        html: `
          <h2>Novo usuário na plataforma!</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Nome:</strong> ${data.name || 'Não informado'}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          <br>
          <p>Acesse o painel admin para gerenciar: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Painel Admin</a></p>
        `
      },
      new_project: {
        subject: '🚀 Novo projeto criado',
        html: `
          <h2>Novo projeto solicitado!</h2>
          <p><strong>Projeto:</strong> ${data.projectName}</p>
          <p><strong>Cliente:</strong> ${data.userEmail}</p>
          <p><strong>Valor:</strong> R$ ${data.price}</p>
          <p><strong>Prazo:</strong> ${data.days} dias</p>
          <br>
          <p>Acesse o painel admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Painel Admin</a></p>
        `
      },
      new_payment: {
        subject: '💳 Novo pagamento recebido',
        html: `
          <h2>Pagamento confirmado!</h2>
          <p><strong>Projeto:</strong> ${data.projectName}</p>
          <p><strong>Cliente:</strong> ${data.userEmail}</p>
          <p><strong>Valor:</strong> R$ ${data.amount}</p>
          <p><strong>Método:</strong> ${data.paymentMethod}</p>
          <br>
          <p>Acesse o painel admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Painel Admin</a></p>
        `
      }
    };

    const template = templates[type];
    if (!template) return false;

    return this.sendEmail({
      to: adminEmail,
      subject: template.subject,
      html: template.html,
      from: 'ESTUDIOK Notificações <notificacoes@estudiok.com>'
    });
  }
}

export const emailService = EmailService.getInstance();