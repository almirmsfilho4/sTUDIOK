const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  projectId: "studiok-saas",
  authDomain: "studiok-saas.firebaseapp.com",
  storageBucket: "studiok-saas.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Carregar .env manualmente
const envPath = __dirname + '/.env';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

async function setAdminRole() {
  const email = process.env.ADMIN_EMAIL || 'almir.msfilho@hotmail.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('❌ ERRO: Defina sua senha no arquivo .env');
    console.error('');
    console.error('📝 Edite o arquivo: scripts/.env');
    console.error('   ADMIN_EMAIL=almir.msfilho@hotmail.com');
    console.error('   ADMIN_PASSWORD=sua_senha_aqui');
    process.exit(1);
  }

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log(`🔐 Fazendo login como ${email}...`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(`✅ Logado! UID: ${user.uid}`);

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      name: 'Administrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('🎉 Role admin configurada com sucesso!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Faça logout do site');
    console.log('2. Faça login novamente');
    console.log('3. Acesse /admin');
    console.log('4. O erro de permissões deve estar resolvido!');
    
    process.exit(0);

  } catch (error) {
    console.error('');
    console.error('❌ ERRO:', error.code, '-', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error('💡 Solução: Crie uma conta no site primeiro com este email');
    } else if (error.code === 'auth/wrong-password') {
      console.error('💡 Solução: Use a senha correta da sua conta');
    }
    
    process.exit(1);
  }
}

setAdminRole();