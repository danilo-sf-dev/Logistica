import React, { createContext, useContext, useEffect } from "react";
import {
  onMessageListener,
  requestNotificationPermission,
} from "../firebase/config";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  useEffect(() => {
    // Solicitar permissão para notificações
    requestNotificationPermission();

    // Listener para mensagens em primeiro plano
    onMessageListener()
      .then((payload) => {
        if (payload) {
          const { title, body } = payload.notification;

          // Mostrar toast
          toast.success(`${title}: ${body}`, {
            duration: 5000,
            position: "top-right",
          });

          // Mostrar notificação do navegador se permitido
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/logo192.png",
            });
          }
        }
      })
      .catch((err) => {
        console.error("Erro ao receber mensagem:", err);
      });
  }, []);

  const showNotification = (message, type = "success") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast(message, {
          icon: "⚠️",
        });
        break;
      case "info":
        toast(message, {
          icon: "ℹ️",
        });
        break;
      default:
        toast(message);
    }
  };

  const value = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
