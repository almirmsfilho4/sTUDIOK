const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  authDomain: "studiok-saas.firebaseapp.com",
  projectId: "studiok-saas",
  messagingSenderId: "134175965723",
  appId: "1:134175965723:web:c1bcf1de6cc7abb1416ebe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UID do usuário que deve ser promovido a admin
const ADMIN_USER_UID = "rR8auYyDzeU257qHW4VS60q15Mg2";

async function promoteFirstAdmin() {
  try {
    const userRef = doc(db, 'users', ADMIN_USER_UID);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    });
    
    console.log('✅ Usuário promovido a administrador com sucesso!');
    console.log('UID:', ADMIN_USER_UID);
    console.log('Email: almir.msfilho@hotmail.com');
    
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
  }
}

// Executar a promoção
promoteFirstAdmin();