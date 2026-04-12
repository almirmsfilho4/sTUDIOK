const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Auto-promover primeiro usuário como admin
exports.autoPromoteFirstUser = functions.auth.user().onCreate(async (user) => {
  try {
    const db = admin.firestore();
    
    // Contar quantos usuários existem
    const usersSnapshot = await db.collection('users').get();
    
    // Se for o primeiro usuário, promover para admin
    if (usersSnapshot.size === 0) {
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Administrador',
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Primeiro usuário ${user.email} promovido a admin automaticamente!`);
      
      // Enviar email de notificação
      await sendAdminNotification(user.email);
    } else {
      // Criar documento normal para usuários subsequentes
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Cliente',
        role: 'client',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na função autoPromote:', error);
  }
});

// Função para enviar notificação de novo admin
async function sendAdminNotification(email) {
  try {
    const mailgun = require('mailgun-js');
    
    // Configurar Mailgun ou outro serviço de email
    const mg = mailgun({
      apiKey: functions.config().mailgun.api_key,
      domain: functions.config().mailgun.domain
    });
    
    const data = {
      from: 'ESTUDIOK <noreply@estudiok.com>',
      to: 'almir.msfilho@hotmail.com',
      subject: '🎉 Novo Admin Configurado Automaticamente',
      html: `<p>O usuário ${email} foi promovido automaticamente a administrador.</p>
             <p>É o primeiro usuário do sistema ESTUDIOK.</p>`
    };
    
    await mg.messages().send(data);
    
  } catch (error) {
    console.log('⚠️  Email de notificação não enviado (configurar Mailgun):', error);
  }
}

// Health check endpoint
exports.healthCheck = functions.https.onRequest(async (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: ['auth', 'firestore', 'functions']
  });
});