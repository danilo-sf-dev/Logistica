import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import NotificationService, {
  NotificationData,
} from "../../services/notificationService";
import { toast } from "react-hot-toast";

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = "",
}) => {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar notificações do usuário
  const loadNotifications = useCallback(async () => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      const userNotifications = await NotificationService.getUserNotifications(
        userProfile.uid,
      );
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.uid]);

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);

      // Atualizar estado local
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      toast.success("Notificação marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar notificação:", error);
      toast.error("Erro ao marcar notificação");
    }
  };

  // Carregar notificações quando o componente montar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Atualizar notificações a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  if (!userProfile) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Botão do sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Notificações"
      >
        <Bell size={20} />

        {/* Badge de notificações não lidas */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <h3 className="text-xs font-medium text-gray-900">Notificações</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          </div>

          {/* Lista de notificações */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">Carregando...</div>
            ) : notifications.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString(
                          "pt-BR",
                        )}
                      </p>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-1 p-0.5 text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
                        title="Marcar como lida"
                      >
                        <Check size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-1.5 border-t border-gray-200">
              <button
                onClick={() => {
                  // Marcar todas como lidas
                  notifications.forEach((n) => {
                    if (!n.read) markAsRead(n.id);
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default NotificationBell;
