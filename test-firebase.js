const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  authDomain: "studiok-saas.firebaseapp.com",
  projectId: "studiok-saas",
  storageBucket: "studiok-saas.appspot.com",
  messagingSenderId: "134175965723",
  appId: "1:134175965723:web:c1bcf1de6cc7abb1416ebe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Testar autenticação
async function testAuth() {
  try {
    console.log('Testando configuração Firebase...');
    
    // Tentar criar usuário de teste (deve falhar se email já existir)
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      "test@example.com", 
      "password123"
    );
    
    console.log('✅ Login bem-sucedido:', userCredential.user.email);
  } catch (error) {
    console.log('❌ Erro de autenticação:');
    console.log('Código:', error.code);
    console.log('Mensagem:', error.message);
    console.log('Detalhes:', error.customData);
  }
}

testAuth();