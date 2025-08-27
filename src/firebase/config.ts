import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

// Configuração do Firebase - Usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configuração do Firebase Cloud Messaging
export const messaging: Messaging = getMessaging(app);

const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY;

// Solicitar permissão para notificações
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    if (typeof window === "undefined" || !("Notification" in window))
      return null;
    if (!VAPID_PUBLIC_KEY) return null; // evita erro de atob quando chave inválida/placeholder

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY });
      return token;
    }
    return null;
  } catch (error) {
    console.error("Erro ao solicitar permissão de notificação:", error);
    return null;
  }
};

// Listener para mensagens em primeiro plano
export const onMessageListener = (): Promise<any> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
