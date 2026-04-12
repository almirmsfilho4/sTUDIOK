// Script para definir role admin via API REST do Firebase
const https = require('https');

const PROJECT_ID = 'studiok-saas';
const DATABASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function restRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `https://firestore.googleapis.com`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function setAdminRole() {
  console.log('⚠️ SOLUÇÃO ALTERNATIVA');
  console.log('='.repeat(50));
  console.log('Como não temos acesso às credenciais de admin,');
  console.log('você pode configurar manualmente pelo Firebase Console:');
  console.log('');
  console.log('📋 PASSOS:');
  console.log('1. Acesse: https://console.firebase.google.com/project/studiok-saas/firestore');
  console.log('2. Clique em "Iniciar coleção"');
  console.log('3. Nome da coleção: users');
  console.log('4. ID do documento: seu-uid-aqui');
  console.log('5. Adicione estes campos:');
  console.log('   - email: string = "almir.msfilho@hotmail.com"');
  console.log('   - role: string = "admin"');
  console.log('   - name: string = "Administrador"');
  console.log('');
  console.log('💡 PARA OBTER SEU UID:');
  console.log('1. Faça login no site');
  console.log('2. Abra DevTools (F12) > Console');
  console.log('3. Digite: firebase.auth().currentUser.uid');
  console.log('4. Copie o UID mostrado');
  console.log('');
  console.log('OU use o script que já tentei configurar.');
}

setAdminRole();