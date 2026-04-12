// Script para setar role 'admin' no usuário através do Firestore
// Execute após fazer login no site
// node scripts/set-admin-role.js

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuração do Firebase (usa as mesmas variáveis do frontend)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDB4aY1tVb8JZPk4u3SdEoNtDfzZ8pI7D0",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studiok-saas",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studiok-saas.firebaseapp.com"
};

async function setAdminRole(email, password) {
  try {
    console.log('🔄 Inicializando Firebase...');
    
    // Inicializar app
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Fazer login
    console.log('🔐 Fazendo login...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Logado como: ${user.email}`);
    console.log(`🔑 UID: ${user.uid}`);
    
    // Atualizar documento do usuário no Firestore
    console.log('📝 Configurando role como admin...');
    
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      name: 'Administrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('🎉 Usuário configurado como admin com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Faça logout e login novamente');
    console.log('2. Acesse /admin');
    console.log('3. As permissões agora devem funcionar');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Solução:');
      console.log('1. Crie uma conta no site com este email');
      console.log('2. Execute este script novamente');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n💡 Solução:');
      console.log('Use a senha correta da sua conta');
    }
    
    process.exit(1);
  }
}

// Ler credenciais do terminal
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuração de Usuário Admin');
console.log('='.repeat(40));

readline.question('📧 Email (almir.msfilho@hotmail.com): ', (email) => {
  email = email || 'almir.msfilho@hotmail.com';
  
  readline.question('🔐 Senha: ', (password) => {
    readline.close();
    
    if (!password) {
      console.error('❌ Senha é obrigatória');
      process.exit(1);
    }
    
    setAdminRole(email, password);
  });
});