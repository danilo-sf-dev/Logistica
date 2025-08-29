import React from "react";
import { useDashboard } from "../state/useDashboard";
import { StatsCards } from "../ui/StatsCards";
import { DashboardCharts } from "../ui/DashboardCharts";
import { RecentActivities } from "../ui/RecentActivities";

export const DashboardPage: React.FC = () => {
  const { data, error, loading, refreshData } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral das operações de logística
          </p>
        </div>

        <div className="card">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              Erro ao carregar dados do dashboard
            </p>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral das operações de logística
        </p>
      </div>

      {/* Cards de estatísticas */}
      <StatsCards stats={data.stats} />

      {/* Gráficos */}
      <DashboardCharts
        motoristasStatus={data.motoristasStatus}
        veiculosStatus={data.veiculosStatus}
      />

      {/* Atividades Recentes */}
      <RecentActivities atividades={data.atividadesRecentes} />
    </div>
  );
};
