import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Configuração do Firebase - Substitua com suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyCPDN1WXv_M7N1AX0kphleDCxug7eJ3TcQ",
  authDomain: "logistica-c7afc.firebaseapp.com",
  projectId: "logistica-c7afc",
  storageBucket: "logistica-c7afc.firebasestorage.app",
  messagingSenderId: "744598379245",
  appId: "1:744598379245:web:7432cd7d659f8ee7774ae4",
  measurementId: "G-98ZBQM67V5",
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
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "seu-vapid-key",
      });
      return token;
    }
  } catch (error) {
    console.error("Erro ao solicitar permissão de notificação:", error);
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
