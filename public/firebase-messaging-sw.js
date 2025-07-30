// Firebase Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCPDNlWXv_M7NlAX0kphleDCxug7eJ3TcQ",
  authDomain: "logistica-c7afc.firebaseapp.com",
  projectId: "logistica-c7afc",
  storageBucket: "logistica-c7afc.firebasestorage.app",
  messagingSenderId: "744598379245",
  appId: "1:744598379245:web:7432cd7d659f8ee7774ae4",
  measurementId: "G-98ZBQM67V5",
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle =
    payload.notification.title || "SGL - Nova Notificação";
  const notificationOptions = {
    body: payload.notification.body || "Você tem uma nova notificação",
    icon: "/logo192.png",
    badge: "/logo192.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
