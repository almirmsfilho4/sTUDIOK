const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  authDomain: "studiok-saas.firebaseapp.com",
  projectId: "studiok-saas",
  storageBucket: "studiok-saas.firebasestorage.app",
  messagingSenderId: "134175965723",
  appId: "1:134175965723:web:c1bcf1de6cc7abb1416ebe"
};

// UID do usuário admin
const ADMIN_USER_ID = "rR8auYyDzeU257qHW4VS60q15Mg2";

async function setupAdminUser() {
  try {
    console.log('🔧 Iniciando configuração do usuário admin...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado');
    
    // Criar documento do usuário admin
    const userRef = doc(db, 'users', ADMIN_USER_ID);
    
    await setDoc(userRef, {
      uid: ADMIN_USER_ID,
      email: 'almir.msfilho@hotmail.com',
      name: 'Almir Filho',
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Documento do admin criado com sucesso!');
    console.log('📋 Detalhes:');
    console.log('   ID:', ADMIN_USER_ID);
    console.log('   Email: almir.msfilho@hotmail.com');
    console.log('   Nome: Almir Filho');
    console.log('   Role: admin');
    console.log('');
    console.log('🎉 Agora você pode acessar o painel admin em: /admin');
    
  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      console.log('');
      console.log('🔒 As regras de segurança estão bloqueando a criação.');
      console.log('📋 Você precisa criar manualmente no Firebase Console:');
      console.log('');
      console.log('1. Acesse: https://console.firebase.google.com/');
      console.log('2. Selecione o projeto: studiok-saas');
      console.log('3. Vá em Firestore Database');
      console.log('4. Crie collection "users" (se não existir)');
      console.log('5. Crie documento com ID:', ADMIN_USER_ID);
      console.log('6. Adicione os campos:');
      console.log('   - uid:', ADMIN_USER_ID);
      console.log('   - email: almir.msfilho@hotmail.com');
      console.log('   - name: Almir Filho');
      console.log('   - role: admin');
      console.log('   - createdAt: [timestamp atual]');
      console.log('   - updatedAt: [timestamp atual]');
    }
  }
}

// Executar a configuração
setupAdminUser();