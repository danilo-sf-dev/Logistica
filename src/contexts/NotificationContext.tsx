import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  onMessageListener,
  requestNotificationPermission,
} from "../firebase/config";
import toast from "react-hot-toast";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
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

  const showNotification = (
    message: string,
    type: NotificationType = "success",
  ): void => {
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

  const value: NotificationContextType = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
