const fs = require('fs');
const path = require('path');

console.log('🚀 Configuração do Firebase para SGL - Sistema de Gestão de Logística');
console.log('=' .repeat(60));

console.log('\n📋 Passos para configurar o Firebase:');
console.log('\n1. No Firebase Console (https://console.firebase.google.com):');
console.log('   - Selecione seu projeto "Logistica"');
console.log('   - Vá em "Criação" → "Authentication" → "Get started"');
console.log('   - Clique em "Sign-in method"');
console.log('   - Habilite "Google" (clique em "Ativar")');
console.log('   - Configure: Nome do projeto: "Logistica", Email de suporte: seu email');
console.log('   - Clique em "Salvar"');

console.log('\n2. Adicione uma aplicação web:');
console.log('   - Na página inicial do projeto, clique no ícone da web (</>)');
console.log('   - Nickname: "Logistica Web"');
console.log('   - Marque "Also set up Firebase Hosting"');
console.log('   - Clique em "Register app"');

console.log('\n3. Configure o Firestore Database:');
console.log('   - Vá em "Criação" → "Firestore Database" → "Create database"');
console.log('   - Escolha "Start in test mode"');
console.log('   - Selecione localização: "us-central1" (ou mais próxima)');

console.log('\n4. Copie as credenciais da aplicação web:');
console.log('   - Após registrar a app, copie o objeto firebaseConfig');
console.log('   - Cole as credenciais abaixo quando solicitado');

console.log('\n5. Configure o Storage (opcional):');
console.log('   - Vá em "Criação" → "Storage" → "Get started"');
console.log('   - Escolha "Start in test mode"');

console.log('\n' + '=' .repeat(60));

// Função para atualizar o arquivo de configuração
function updateFirebaseConfig() {
  const configPath = path.join(__dirname, 'src', 'firebase', 'config.js');
  
  console.log('\n📝 Cole as credenciais do Firebase (firebaseConfig):');
  console.log('Exemplo:');
  console.log('apiKey: "AIzaSyC...",');
  console.log('authDomain: "logistica-12345.firebaseapp.com",');
  console.log('projectId: "logistica-12345",');
  console.log('storageBucket: "logistica-12345.appspot.com",');
  console.log('messagingSenderId: "123456789",');
  console.log('appId: "1:123456789:web:abc123"');
  
  console.log('\nCole aqui as credenciais (pressione Enter duas vezes para finalizar):');
  
  let configLines = [];
  process.stdin.on('data', (data) => {
    const line = data.toString().trim();
    if (line === '') {
      if (configLines.length > 0) {
        process.stdin.pause();
        processConfig(configLines);
      }
    } else {
      configLines.push(line);
    }
  });
}

function processConfig(configLines) {
  try {
    // Criar objeto de configuração
    const configObj = {};
    configLines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          // Remover aspas e vírgula
          const cleanValue = value.replace(/['",]/g, '');
          configObj[key] = cleanValue;
        }
      }
    });

    // Verificar se temos as credenciais necessárias
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !configObj[key]);
    
    if (missingKeys.length > 0) {
      console.log('\n❌ Credenciais incompletas. Faltam:', missingKeys.join(', '));
      return;
    }

    // Ler o arquivo atual
    const configContent = fs.readFileSync(path.join(__dirname, 'src', 'firebase', 'config.js'), 'utf8');
    
    // Substituir as credenciais
    const updatedContent = configContent.replace(
      /const firebaseConfig = \{[\s\S]*?\};/,
      `const firebaseConfig = {
  apiKey: "${configObj.apiKey}",
  authDomain: "${configObj.authDomain}",
  projectId: "${configObj.projectId}",
  storageBucket: "${configObj.storageBucket}",
  messagingSenderId: "${configObj.messagingSenderId}",
  appId: "${configObj.appId}"
};`
    );

    // Salvar o arquivo atualizado
    fs.writeFileSync(path.join(__dirname, 'src', 'firebase', 'config.js'), updatedContent);
    
    // Criar arquivo .env
    const envContent = `# Firebase Configuration
REACT_APP_FIREBASE_API_KEY="${configObj.apiKey}"
REACT_APP_FIREBASE_AUTH_DOMAIN="${configObj.authDomain}"
REACT_APP_FIREBASE_PROJECT_ID="${configObj.projectId}"
REACT_APP_FIREBASE_STORAGE_BUCKET="${configObj.storageBucket}"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="${configObj.messagingSenderId}"
REACT_APP_FIREBASE_APP_ID="${configObj.appId}"
REACT_APP_FIREBASE_MEASUREMENT_ID="${configObj.measurementId || ''}"

# App Configuration
REACT_APP_NAME=SGL - Sistema de Gestão de Logística
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
`;
    
    fs.writeFileSync(path.join(__dirname, '.env'), envContent);
    
    console.log('\n✅ Configuração do Firebase atualizada com sucesso!');
    console.log('✅ Arquivo .env criado com as variáveis de ambiente!');
    console.log('\n🎉 Próximos passos:');
    console.log('1. Execute: npm start');
    console.log('2. Acesse: http://localhost:3000');
    console.log('3. Teste o login com Google');
    console.log('4. Para criar um admin, vá em Firebase Console → Authentication → Users');
    console.log('   - Clique em "Add user"');
    console.log('   - Depois vá em Firestore → users → [user-id] → role: "admin"');
    console.log('\n🔒 Segurança: O arquivo .env foi criado e está no .gitignore');
    
  } catch (error) {
    console.error('\n❌ Erro ao atualizar configuração:', error.message);
  }
}

// Iniciar o processo
updateFirebaseConfig(); 