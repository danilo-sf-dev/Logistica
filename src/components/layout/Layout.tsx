import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLayout } from "./state/useLayout";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";
import { MainContent } from "./ui/MainContent";
import { getNavigationByRole } from "./config/navigation";
import type { LayoutProps } from "./types";

const Layout: React.FC<LayoutProps> = ({ config, className = "" }) => {
  const { userProfile, loading } = useAuth();
  const { sidebarOpen, setSidebarOpen, handleLogout, toggleSidebar } =
    useLayout();

  // Se ainda estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Se não houver usuário autenticado, redirecionar para login
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Usar configuração personalizada ou padrão
  const navigation =
    config?.navigation || getNavigationByRole(userProfile?.role);

  return (
    <div className={`h-screen flex overflow-hidden bg-gray-100 ${className}`}>
      <Sidebar
        navigation={navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Conteúdo principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header onMenuClick={toggleSidebar} title={config?.title} />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default Layout;
