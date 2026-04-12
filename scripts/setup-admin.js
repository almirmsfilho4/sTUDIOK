// Script para definir admin usando Firebase Admin SDK
const admin = require('firebase-admin');
const fs = require('fs');

// Carregar service account
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function setAdminRole(email) {
  try {
    // Buscar usuário no Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Encontrou usuário: ${userRecord.email}`);
    console.log(`   UID: ${userRecord.uid}`);

    // Atualizar/custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin'
    });
    console.log('✅ Custom claims atualizadas');

    // Criar/atualizar documento no Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'admin',
      name: userRecord.displayName || 'Administrador',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Documento no Firestore atualizado');
    console.log('');
    console.log('🎉 CONFIGURAÇÃO COMPLETA!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Faça logout do site');
    console.log('2. Faça login novamente (para atualizar tokens)');
    console.log('3. Acesse /admin');
    console.log('4. O erro de permissões deve estar resolvido!');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'almir.msfilho@hotmail.com';
setAdminRole(email);