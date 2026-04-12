// Script para verificar status da autenticação
const { execSync } = require('child_process');

console.log('🔍 Verificando status da autenticação...\n');

try {
  // Tentar listar usuários para ver se auth está habilitado
  console.log('👥 Tentando listar usuários...');
  const users = execSync('firebase auth:export --format=json', { encoding: 'utf8' });
  const usersData = JSON.parse(users);
  
  console.log('✅ Authentication está habilitado!');
  console.log(`📊 Total de usuários: ${usersData.users?.length || 0}`);
  
  if (usersData.users && usersData.users.length > 0) {
    console.log('\n👤 Usuários encontrados:');
    usersData.users.forEach(user => {
      console.log(`   - ${user.email} (${user.localId})`);
    });
  }
  
} catch (error) {
  if (error.message.includes('Auth service is not enabled')) {
    console.log('❌ Authentication não está habilitado no projeto');
    console.log('\n📋 Para habilitar:');
    console.log('1. Acesse https://console.firebase.google.com/project/studiok-saas/authentication');
    console.log('2. Clique em "Get started"');
    console.log('3. Selecione "Email/Password"');
    console.log('4. Habilite e salve');
  } else {
    console.error('❌ Erro ao verificar auth:', error.message);
  }
}