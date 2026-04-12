export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Bem-vindo à ESTUDIOK! 🎉',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; }
    .header { background: linear-gradient(135deg, #00D4FF, #0088CC); padding: 40px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; color: #000; }
    .content { padding: 40px; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ESTUDIOK</div>
    </div>
    <div class="content">
      <h1>Olá ${name}! 👋</h1>
      <p>Bem-vindo à ESTUDIOK! Estamos muito felizes em ter você conosco.</p>
      <p>Nossa equipe já está pronta para criar o melhor projeto digital para você.</p>
      <a href="https://estudiak.com/dashboard" class="button">Acessar meu painel</a>
      <p>Qualquer dúvida, é só responder este email!</p>
      <p>Abraços,<br>Equipe ESTUDIOK</p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Seu site pronto em 48 horas</p>
      <p>Este email foi enviado automaticamente, não responda.</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),

  projectStarted: (name: string, projectName: string) => ({
    subject: `Projeto "${projectName}" iniciado! 🚀`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; }
    .header { background: linear-gradient(135deg, #00D4FF, #0088CC); padding: 30px; text-align: center; }
    .content { padding: 40px; }
    .steps { margin: 20px 0; }
    .step { padding: 15px; background: #0A0A0A; margin: 10px 0; border-left: 3px solid #00D4FF; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Projeto Iniciando!</h1>
    </div>
    <div class="content">
      <p>Olá ${name}!</p>
      <p>Seu projeto <strong>"${projectName}"</strong> acabou de iniciar!</p>
      
      <div class="steps">
        <div class="step"><strong>Semana 1:</strong> Estrutura e Design</div>
        <div class="step"><strong>Semana 2:</strong> Desenvolvimento</div>
        <div class="step"><strong>Semana 3:</strong> Testes e Ajustes</div>
        <div class="step"><strong>Semana 4:</strong> Entrega!</div>
      </div>

      <p>Acompanhe o progresso pelo painel do cliente.</p>
      <p>Abraços,<br>Equipe ESTUDIOK</p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Seu site pronto em 48 horas</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),

  projectDelivered: (name: string, projectName: string) => ({
    subject: `Projeto "${projectName}" Entregue! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; }
    .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; }
    .content { padding: 40px; }
    .button { display: inline-block; background: #10B981; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .warranty { background: #0A0A0A; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Projeto Entregue!</h1>
    </div>
    <div class="content">
      <p>Olá ${name}!</p>
      <p>É com muita alegria que entregamos seu projeto <strong>"${projectName}"</strong>!</p>
      
      <div class="warranty">
        <h3>🛡️ Garantia de 30 dias</h3>
        <p>Você tem 30 dias de suporte gratuito. Qualquer problema, é só abrir um ticket!</p>
      </div>

      <a href="https://estudiak.com/dashboard" class="button">Ver Projeto</a>
      
      <p>Não se esqueça de responder nossa pesquisa de satisfação! 📝</p>
      <p>Abraços,<br>Equipe ESTUDIOK</p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Seu site pronto em 48 horas</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),

  invoice: (name: string, invoiceNumber: string, amount: number, dueDate: string) => ({
    subject: `Fatura #${invoiceNumber} - ESTUDIOK`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; }
    .header { background: #1A1A1A; border-bottom: 2px solid #00D4FF; padding: 30px; }
    .invoice-box { margin: 20px; padding: 20px; background: #0A0A0A; border-radius: 8px; }
    .total { font-size: 24px; color: #00D4FF; font-weight: bold; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💳 Fatura</h1>
      <p>Fatura #${invoiceNumber}</p>
    </div>
    <div class="invoice-box">
      <p><strong>Cliente:</strong> ${name}</p>
      <p><strong>Data de vencimento:</strong> ${dueDate}</p>
      <hr style="border-color: #242424; margin: 20px 0;" />
      <p class="total">Total: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    </div>
    <div style="text-align: center;">
      <a href="https://estudiak.com/dashboard" class="button">Pagar agora</a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Seu site pronto em 48 horas</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),
};