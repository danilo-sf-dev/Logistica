#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Configuração do Sistema de Gestão de Logística (SGL)");
console.log("=====================================================\n");

const questions = [
  {
    name: "apiKey",
    question: "Digite sua Firebase API Key: ",
    required: true,
  },
  {
    name: "authDomain",
    question: "Digite seu Firebase Auth Domain: ",
    required: true,
  },
  {
    name: "projectId",
    question: "Digite seu Firebase Project ID: ",
    required: true,
  },
  {
    name: "storageBucket",
    question: "Digite seu Firebase Storage Bucket: ",
    required: true,
  },
  {
    name: "messagingSenderId",
    question: "Digite seu Firebase Messaging Sender ID: ",
    required: true,
  },
  {
    name: "appId",
    question: "Digite seu Firebase App ID: ",
    required: true,
  },
];

const config = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const question = questions[index];

  rl.question(question.question, (answer) => {
    if (question.required && !answer.trim()) {
      console.log("❌ Este campo é obrigatório!\n");
      askQuestion(index);
      return;
    }

    config[question.name] = answer.trim();
    askQuestion(index + 1);
  });
}

function generateConfig() {
  const configContent = `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuração do Firebase - Configurado automaticamente
const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configuração do Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Solicitar permissão para notificações
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'seu-vapid-key' // Configure se necessário
      });
      return token;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
  }
};

// Listener para mensagens em primeiro plano
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
`;

  const configPath = path.join(__dirname, "src", "firebase", "config.js");

  try {
    fs.writeFileSync(configPath, configContent);
    console.log("✅ Arquivo de configuração criado com sucesso!");
    console.log("📁 Localização:", configPath);
    console.log("\n🎉 Configuração concluída!");
    console.log("\n📋 Próximos passos:");
    console.log("1. Execute: npm install");
    console.log("2. Execute: npm start");
    console.log("3. Acesse: http://localhost:3000");
    console.log("\n⚠️  Lembre-se de:");
    console.log("- Configurar as regras do Firestore no Firebase Console");
    console.log("- Criar o primeiro usuário administrador");
    console.log("- Configurar as permissões de autenticação");
  } catch (error) {
    console.error("❌ Erro ao criar arquivo de configuração:", error.message);
  }

  rl.close();
}

console.log("📝 Vamos configurar o Firebase para o seu projeto.\n");
console.log("ℹ️  Para obter essas informações:");
console.log("1. Acesse: https://console.firebase.google.com/");
console.log("2. Selecione seu projeto");
console.log("3. Vá em Configurações do Projeto > Geral");
console.log('4. Role até "Seus aplicativos" e clique em "Adicionar app"');
console.log("5. Escolha Web e copie as credenciais\n");

askQuestion(0);
