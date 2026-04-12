const admin = require('firebase-admin');

// Inicializar Admin SDK
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://studiok-saas.firebaseio.com"
});

// UID do seu usuário (almir.msfilho@hotmail.com)
const userId = 'rR8auYyDzeU257qHW4VS60q15Mg2';

async function addAdminClaim() {
  try {
    console.log('Adicionando claim de admin para:', userId);
    
    await admin.auth().setCustomUserClaims(userId, { admin: true });
    
    console.log('✅ Claim de admin adicionada com sucesso!');
    console.log('Reinicie a sessão para as permissões fazerem efeito');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar claim:', error);
  }
}

addAdminClaim();