// Script para criar ou atualizar usuário admin no Firebase
// Execute: node scripts/make-admin.js seu-email@exemplo.com

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function makeAdmin(email) {
  try {
    // Buscar usuário pelo email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Definir claim de admin
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin'
    });
    
    // Atualizar documento do usuário no Firestore
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      role: 'admin',
      name: userRecord.displayName || 'Administrador',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log(`✅ Usuário ${email} configurado como admin com sucesso!`);
    console.log(`UID: ${userRecord.uid}`);
    
  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error);
    
    // Se usuário não existe, criar
    if (error.code === 'auth/user-not-found') {
      console.log('Criando novo usuário...');
      
      const userRecord = await admin.auth().createUser({
        email: email,
        emailVerified: true,
        password: 'Admin@123', // Senha temporária - o usuário deve alterar
        displayName: 'Administrador',
      });
      
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: 'admin'
      });
      
      const db = admin.firestore();
      await db.collection('users').doc(userRecord.uid).set({
        email: email,
        role: 'admin',
        name: 'Administrador',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Usuário ${email} criado como admin com sucesso!`);
      console.log(`UID: ${userRecord.uid}`);
      console.log(`Senha inicial: Admin@123`);
      console.log('⚠️ ATENÇÃO: O usuário deve alterar a senha no primeiro login!');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Por favor, forneça um email:');
    console.error('   node scripts/make-admin.js seu-email@exemplo.com');
    process.exit(1);
  }
  
  makeAdmin(email);
}

module.exports = { makeAdmin };