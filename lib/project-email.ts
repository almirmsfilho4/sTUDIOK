import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

interface ProjectEmailData {
  clientName: string;
  clientEmail: string;
  projectName: string;
  projectId: string;
  warrantyEndDate?: string;
  features?: string[];
}

export async function sendProjectStartedEmail(data: ProjectEmailData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px; }
    .feature { padding: 10px 0; border-bottom: 1px solid #242424; }
    .feature:before { content: "✓"; color: #00D4FF; margin-right: 10px; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Projeto Iniciado!</h1>
      <p>Olá, ${data.clientName}!</p>
    </div>
    <div class="content">
      <p>Seu projeto <strong>${data.projectName}</strong> está oficialmente em desenvolvimento!</p>
      
      <h3>O que está incluído:</h3>
      ${data.features?.map(f => `<div class="feature">${f}</div>`).join('') || ''}
      
      <p>Em breve você receberá atualizações sobre o progresso do seu projeto.</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/dashboard" class="button">
        Acompanhar Projeto
      </a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
      <p>estudiokgames@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: 'ESTUDIOK <noreply@estudiok.com.br>',
      to: data.clientEmail,
      subject: `🚀 Projeto "${data.projectName}" foi iniciado! - ESTUDIOK`,
      html,
    });
  } catch (error) {
    console.error('Error sending project started email:', error);
  }
}

export async function sendProjectDeliveredEmail(data: ProjectEmailData & { remainingAmount?: number; totalAmount?: number }): Promise<void> {
  const remaining = data.remainingAmount || 0;
  const total = data.totalAmount || 0;
  const hasRemaining = remaining > 0 && remaining < total;
  
  const paymentSection = hasRemaining ? `
      <div style="background: #F59E0B22; border: 1px solid #F59E0B; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #F59E0B; margin-top: 0;">💰 Pagamento Pendente</h3>
        <p>Faltam <strong>R$ ${remaining.toLocaleString('pt-BR')}</strong> para quitar o projeto.</p>
        <p>Total do projeto: <strong>R$ ${total.toLocaleString('pt-BR')}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/dashboard/pagamento/${data.projectId}" style="display: inline-block; background: #F59E0B; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
          Pagar Agora
        </a>
      </div>
  ` : `
      <div style="background: #22C55E22; border: 1px solid #22C55E; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #22C55E; margin-top: 0;">✅ Projeto Quitado</h3>
        <p>Obrigado! Todos os pagamentos foram realizados.</p>
      </div>
  `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px; }
    .warranty { background: #00D4FF22; border: 1px solid #00D4FF; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .warranty h3 { color: #00D4FF; margin-top: 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Projeto Entregue!</h1>
      <p>Olá, ${data.clientName}!</p>
    </div>
    <div class="content">
      <p>Parabéns! Seu projeto <strong>${data.projectName}</strong> foi entregue com sucesso!</p>
      
      ${paymentSection}
      
      <div class="warranty">
        <h3>🛡️ Garantia de 30 Dias</h3>
        <p>Sua garantia começou em <strong>${new Date().toLocaleDateString('pt-BR')}</strong></p>
        <p>Termina em: <strong>${data.warrantyEndDate}</strong></p>
        <p style="font-size: 14px; color: #888;">Durante a garantia, correções de bugs são gratuitas!</p>
      </div>
      
      <p>Agora é hora de testar o projeto e nos informar qualquer ajuste necessário.</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/dashboard/projetos/${data.projectId}" class="button">
        Ver Projeto
      </a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
      <p>estudiokgames@gmail.com</p>
    </div>
      
      <div class="warranty">
        <h3>🛡️ Garantia de 30 Dias</h3>
        <p>Sua garantia começou em <strong>${new Date().toLocaleDateString('pt-BR')}</strong></p>
        <p>Termina em: <strong>${data.warrantyEndDate}</strong></p>
        <p style="font-size: 14px; color: #888;">Durante a garantia, correções de bugs são gratuitas!</p>
      </div>
      
      <p>Agora é hora de testar o projeto e nos informar qualquer ajuste necessário.</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/dashboard" class="button">
        Ver Projeto
      </a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
      <p>estudiokgames@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: 'ESTUDIOK <noreply@estudiok.com.br>',
      to: data.clientEmail,
      subject: `✅ Projeto "${data.projectName}" entregue! - ESTUDIOK`,
      html,
    });
  } catch (error) {
    console.error('Error sending project delivered email:', error);
  }
}

export async function sendWarrantyExpiringEmail(data: ProjectEmailData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #FF6B35, #FF8C5A); padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px; }
    .warning { background: #FF6B3522; border: 1px solid #FF6B35; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .cta { display: inline-block; background: #FF6B35; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Garantia expires em breve!</h1>
      <p>Olá, ${data.clientName}!</p>
    </div>
    <div class="content">
      <div class="warning">
        <h3>Sua garantia termina em ${data.warrantyEndDate}!</h3>
        <p>Após esta data, correções e ajustes terão custo adicional.</p>
      </div>
      
      <p>Se ainda houver ajustes necessários, nos avise antes do prazo!</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/dashboard" class="cta">
        Solicitar Ajustes
      </a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
      <p>estudiokgames@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: 'ESTUDIOK <noreply@estudiok.com.br>',
      subject: `⚠️ Sua garantia expira em breve - ${data.projectName}`,
      to: data.clientEmail,
      html,
    });
  } catch (error) {
    console.error('Error sending warranty expiring email:', error);
  }
}

export async function sendProjectApprovedEmail(data: ProjectEmailData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #06D6A0, #0ACC8C); padding: 40px; text-align: center; }
    .content { padding: 40px; text-align: center; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Projeto Aprovado!</h1>
    </div>
    <div class="content">
      <p>Olá, ${data.clientName}!</p>
      <p>O projeto <strong>${data.projectName}</strong> foi aprovado pelo cliente!</p>
      <p>Obrigado pela confiança em nosso trabalho.</p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: 'ESTUDIOK <noreply@estudiok.com.br>',
      to: data.clientEmail,
      subject: `🎉 Projeto "${data.projectName}" aprovado!`,
      html,
    });
  } catch (error) {
    console.error('Error sending project approved email:', error);
  }
}