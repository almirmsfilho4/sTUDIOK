// Script para verificar status completo do Firebase
const { execSync } = require('child_process');

console.log('🔍 Verificando status do Firebase...\n');

try {
  // Verificar projetos
  console.log('📋 Projetos Firebase:');
  const projects = execSync('firebase projects:list', { encoding: 'utf8' });
  console.log(projects);

  // Verificar apps
  console.log('📱 Apps Configurados:');
  const apps = execSync('firebase apps:list', { encoding: 'utf8' });
  console.log(apps);

  // Verificar Firestore
  console.log('🗄️  Databases Firestore:');
  const databases = execSync('firebase firestore:databases:list', { encoding: 'utf8' });
  console.log(databases);

  console.log('✅ Status verificado com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Acessar https://console.firebase.google.com/project/studiok-saas/overview');
  console.log('2. Habilitar Authentication → Email/Password');
  console.log('3. Configurar Storage');
  console.log('4. Verificar Firestore Database');

} catch (error) {
  console.error('❌ Erro ao verificar status:', error.message);
}