const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

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

async function createAdminUser() {
  try {
    // First create the user document with basic info
    const userRef = doc(db, 'users', ADMIN_USER_UID);
    await setDoc(userRef, {
      uid: ADMIN_USER_UID,
      email: 'almir.msfilho@hotmail.com',
      name: 'Almir Filho',
      role: 'client', // Start as client
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('Agora promovendo a admin...');
    
    // Now update to admin
    await setDoc(userRef, {
      role: 'admin',
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Usuário promovido a administrador com sucesso!');
    console.log('UID:', ADMIN_USER_UID);
    console.log('Email: almir.msfilho@hotmail.com');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar a criação
createAdminUser();