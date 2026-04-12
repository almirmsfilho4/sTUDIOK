const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://studiok-saas.firebaseio.com'
});

const db = admin.firestore();

// UID do usuário que deve ser promovido a admin
const ADMIN_USER_UID = "rR8auYyDzeU257qHW4VS60q15Mg2";

async function promoteFirstAdmin() {
  try {
    const userRef = db.collection('users').doc(ADMIN_USER_UID);
    await userRef.set({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Usuário promovido a administrador com sucesso!');
    console.log('UID:', ADMIN_USER_UID);
    console.log('Email: almir.msfilho@hotmail.com');
    
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
  }
}

// Executar a promoção
promoteFirstAdmin();