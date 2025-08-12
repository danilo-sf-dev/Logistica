import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import type { LayoutState } from "../types";

export const useLayout = (): LayoutState & {
  handleLogout: () => Promise<void>;
  toggleSidebar: () => void;
} => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      showNotification("Logout realizado com sucesso!", "success");
      navigate("/login");
    } catch (error) {
      showNotification("Erro ao fazer logout", "error");
    }
  }, [logout, showNotification, navigate]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
    toggleSidebar,
  };
};

export default useLayout;
