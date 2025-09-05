import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { PermissionService } from "../../../services/permissionService";
import type { ConfigTab } from "../types";

interface ConfiguracoesTabsProps {
  tabs: ConfigTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const ConfiguracoesTabs: React.FC<ConfiguracoesTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const { userProfile } = useAuth();

  // Filtrar abas baseado nas permissões do usuário
  const visibleTabs = tabs.filter((tab) => {
    switch (tab.id) {
      case "perfil":
      case "notificacoes":
        // Todas as abas são visíveis para todos os usuários
        return true;

      case "sistema":
        // Apenas gerente, admin e admin_senior podem acessar
        return PermissionService.canAccessSystemConfig(
          userProfile?.role || "user",
        );

      case "seguranca":
        // Apenas gerente, admin e admin_senior podem acessar
        return PermissionService.canAccessSecurityConfig(
          userProfile?.role || "user",
        );

      case "gestao-usuarios":
        // Apenas gerente, admin e admin_senior podem acessar
        return PermissionService.canManageUsers(userProfile?.role || "user");

      default:
        return true;
    }
  });

  // Se a aba ativa não estiver visível, mudar para a primeira aba visível
  React.useEffect(() => {
    if (!visibleTabs.find((tab) => tab.id === activeTab)) {
      const firstVisibleTab = visibleTabs[0];
      if (firstVisibleTab) {
        onTabChange(firstVisibleTab.id);
      }
    }
  }, [visibleTabs, activeTab, onTabChange]);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex flex-wrap gap-2 sm:gap-8">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-4 w-4 inline mr-1 sm:mr-2" />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ConfiguracoesTabs;
