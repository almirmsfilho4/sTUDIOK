const { EmailService } = require('./lib/email-service');

async function testEmail() {
  console.log('📧 Testando configuração do email...');
  
  const emailService = EmailService.getInstance();
  
  try {
    const result = await emailService.sendEmail({
      to: 'almir.msfilho@hotmail.com',
      subject: 'Teste de Email - ESTUDIOK',
      html: '<h1>✅ Email de teste funcionando!</h1><p>Se você recebeu este email, o sistema de email da ESTUDIOK está configurado corretamente.</p>'
    });
    
    if (result) {
      console.log('✅ Email enviado com sucesso!');
      console.log('📧 Verifique sua caixa de entrada');
    } else {
      console.log('❌ Falha ao enviar email');
      console.log('📋 Verifique a configuração do Resend:');
      console.log('1. Acesse: https://resend.com');
      console.log('2. Verifique se a API Key está correta');
      console.log('3. Confirme o domínio de email');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de email:', error.message);
    console.log('🔧 Possíveis soluções:');
    console.log('- Verificar se RESEND_API_KEY está configurada');
    console.log('- Confirmar permissões da API Key no Resend');
    console.log('- Verificar limite de emails da conta');
  }
}

testEmail();