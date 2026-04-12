import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Bem-vindo à ESTUDIOK! 🎉',
    html: (data: { name: string; email: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .content { padding: 40px; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo, ${data.name}!</h1>
    </div>
    <div class="content">
      <p>Olá! Muito obrigado por se cadastrar na ESTUDIOK.</p>
      <p>Somos especializados em criar sites, apps e sistemas que vendem mais!</p>
      <p>O que você pode fazer agora:</p>
      <ul>
        <li>📊 Ver nossos serviços</li>
        <li>💰 Fazer um orçamento</li>
        <li>📞 Falar com nossa equipe</li>
      </ul>
      <a href="https://estudiok.com.br/servicos" class="button">Ver Serviços</a>
      <br><br>
      <p style="color: #888; font-size: 14px;">
        Em breve enviaremos mais detalhes sobre nossos serviços.
      </p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
      <p>estudiokgames@gmail.com</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  },
  
  orcamento_recebido: {
    subject: 'Seu orçamento foi recebido! 📋',
    html: (data: { name: string; projectType: string; price: number; days: number }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .content { padding: 40px; }
    .price { font-size: 32px; font-weight: bold; color: #00D4FF; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Orçamento Recebido!</h1>
    </div>
    <div class="content">
      <p>Olá, ${data.name}!</p>
      <p>Recebemos seu orçamento com sucesso. Nossa equipe está analisando e em breve entrará em contato.</p>
      
      <div class="price">R$ ${data.price.toLocaleString('pt-BR')}</div>
      <p style="color: #888;">Valor estimado para ${data.projectType}</p>
      <p style="color: #888;">Prazo: ${data.days} dias</p>
      
      <hr style="border-color: #333; margin: 20px 0;">
      <p style="font-size: 14px; color: #888;">
        Tempo médio de resposta: <strong>2 horas</strong> em horário comercial.
      </p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  },
  
  pagamento_confirmado: {
    subject: 'Pagamento confirmado! ✅',
    html: (data: { name: string; amount: number; projectName: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #22C55E, #16A34A); padding: 40px; text-align: center; }
    .content { padding: 40px; }
    .amount { font-size: 32px; font-weight: bold; color: #22C55E; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pagamento Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá, ${data.name}!</p>
      <p>Seu pagamento foi aprovado e seu projeto está oficialmente em desenvolvimento!</p>
      
      <div class="amount">R$ ${data.amount.toLocaleString('pt-BR')}</div>
      <p style="color: #888;">Projeto: ${data.projectName}</p>
      
      <hr style="border-color: #333; margin: 20px 0;">
      <p style="font-size: 14px;">
        <strong>Próximos passos:</strong><br>
        1. Nossa equipeirá iniciar o briefing<br>
        2. Você receberá acesso ao dashboard<br>
        3. Comenzaremos o desenvolvimento
      </p>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  },
  
  projeto_entregue: {
    subject: 'Projeto entregue! 🎉',
    html: (data: { name: string; projectName: string; warrantyDays: number }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .content { padding: 40px; }
    .warranty { background: #00D4FF22; border: 1px solid #00D4FF; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Projeto Entregue!</h1>
    </div>
    <div class="content">
      <p>Olá, ${data.name}!</p>
      <p>Seu projeto <strong>${data.projectName}</strong> foi entregue com sucesso!</p>
      
      <div class="warranty">
        <h3>🛡️ Garantia de ${data.warrantyDays} Dias</h3>
        <p style="font-size: 14px; color: #888;">
          Durante a garantia, correções de bugs são gratuitas. 
          Após este período, oferecemos planos de manutenção.
        </p>
      </div>
      
      <p>Agora é hora de testar e nos informar qualquer ajuste necessário!</p>
      <a href="https://estudiok.com.br/dashboard" class="button">Acessar Dashboard</a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  },
  
  followup_7_dias: {
    subject: 'Como está sendo sua experiência? 👋',
    html: (data: { name: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .content { padding: 40px; }
    .button { display: inline-block; background: #00D4FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Olá, ${data.name}!</p>
      <p>Passamos para saber como está sendo sua experiência com a ESTUDIOK.</p>
      <p>Temos algumas perguntas:</p>
      <ul>
        <li>📝 O que você mais gostou?</li>
        <li>🤔 O que podemos melhorar?</li>
        <li>💡 Tem alguma sugestão?</li>
      </ul>
      <a href="https://estudiok.com.br/contato" class="button">Falar Conosco</a>
    </div>
    <div class="footer">
      <p>ESTUDIOK - Sua Agência Digital</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  }
};

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();
    
    const template = EMAIL_TEMPLATES[type as keyof typeof EMAIL_TEMPLATES];
    
    if (!template) {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }
    
    const html = template.html(data as any);
    
    const result = await resend.emails.send({
      from: 'ESTUDIOK <noreply@estudiok.com.br>',
      to: data.email,
      subject: template.subject,
      html,
    });
    
    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Email automation error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    availableTypes: Object.keys(EMAIL_TEMPLATES),
    example: {
      type: 'welcome',
      data: { name: 'João', email: 'joao@exemplo.com' }
    }
  });
}