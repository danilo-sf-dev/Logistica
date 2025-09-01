import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useConfiguracoes } from "../state/useConfiguracoes";
import { ConfiguracoesTabs } from "../ui/ConfiguracoesTabs";
import { PerfilForm } from "../ui/PerfilForm";
import { NotificacoesForm } from "../ui/NotificacoesForm";
import { SistemaForm } from "../ui/SistemaForm";
import { SegurancaForm } from "../ui/SegurancaForm";
import { configTabs } from "../config/tabs";
import type { ConfiguracoesProps } from "../types";

export const ConfiguracoesPage: React.FC<ConfiguracoesProps> = ({
  className = "",
}) => {
  const { userProfile } = useAuth();
  const {
    activeTab,
    setActiveTab,
    loading,
    profileLoading,
    errors,
    perfilData,
    notificacoes,
    sistema,
    handlePerfilSubmit,
    handlePerfilChange,
    handleNotificacoesChange,
    handleSistemaChange,
    handleNotificacoesSubmit,
    handleSistemaSubmit,
  } = useConfiguracoes();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      {/* Tabs */}
      <ConfiguracoesTabs
        tabs={configTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Conteúdo das Tabs */}
      <div className="mt-6">
        {activeTab === "perfil" && (
          <PerfilForm
            data={perfilData}
            errors={errors}
            loading={loading}
            profileLoading={profileLoading}
            onSubmit={handlePerfilSubmit}
            onChange={handlePerfilChange}
          />
        )}

        {activeTab === "notificacoes" && (
          <NotificacoesForm
            config={notificacoes}
            onChange={handleNotificacoesChange}
            onSubmit={handleNotificacoesSubmit}
            loading={loading}
          />
        )}

        {activeTab === "sistema" && (
          <SistemaForm
            config={sistema}
            onChange={handleSistemaChange}
            onSubmit={handleSistemaSubmit}
            loading={loading}
          />
        )}

        {activeTab === "seguranca" && (
          <SegurancaForm userProfile={userProfile} />
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
