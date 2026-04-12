const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  authDomain: "studiok-saas.firebaseapp.com",
  projectId: "studiok-saas",
  messagingSenderId: "134175965723",
  appId: "1:134175965723:web:c1bcf1de6cc7abb1416ebe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testAdminAccess() {
  try {
    console.log('🔍 Testando acesso ao Firestore...');
    
    // Tentar acessar o documento do usuário admin
    const adminDocRef = doc(db, 'users', 'rR8auYyDzeU257qHW4VS60q15Mg2');
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      console.log('✅ Documento do admin encontrado!');
      console.log('Dados:', adminDoc.data());
      
      if (adminDoc.data().role === 'admin') {
        console.log('🎉 Usuário já é admin!');
      } else {
        console.log('⚠️  Usuário existe mas não é admin. Role:', adminDoc.data().role);
      }
    } else {
      console.log('❌ Documento do admin NÃO encontrado.');
      console.log('\n📋 Para configurar manualmente:');
      console.log('1. Acesse: https://console.firebase.google.com/');
      console.log('2. Selecione o projeto: studiok-saas');
      console.log('3. Vá em Firestore Database');
      console.log('4. Crie collection "users"');
      console.log('5. Crie documento com ID: rR8auYyDzeU257qHW4VS60q15Mg2');
      console.log('6. Adicione os campos:');
      console.log('   - uid: rR8auYyDzeU257qHW4VS60q15Mg2');
      console.log('   - email: almir.msfilho@hotmail.com');
      console.log('   - name: Almir Filho');
      console.log('   - role: admin');
      console.log('   - createdAt: [timestamp atual]');
      console.log('   - updatedAt: [timestamp atual]');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar acesso:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 Acesso negado - regras de segurança estão funcionando!');
      console.log('📋 É necessário criar o documento do admin manualmente no Console do Firebase');
    }
  }
}

testAdminAccess();