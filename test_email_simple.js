// Teste simples do serviço de email
const { createEmailProvider } = require('./lib/email-service');

async function testEmail() {
  console.log('🧪 Testando serviço de email...');
  
  const provider = createEmailProvider();
  
  console.log('📧 Provider criado:', provider.constructor.name);
  
  try {
    const result = await provider.sendEmail({
      to: 'almir.msfilho@hotmail.com',
      subject: 'Teste de Email - ESTUDIOK',
      html: '<h1>Teste de Email</h1><p>Este é um teste do sistema de email da ESTUDIOK.</p>',
      from: 'ESTUDIOK <test@estudiok.com.br>'
    });
    
    console.log('✅ Email enviado com sucesso:', result);
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
  }
}

testEmail();