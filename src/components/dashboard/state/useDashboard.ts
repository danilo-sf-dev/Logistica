import { useState, useEffect, useCallback } from "react";
import { DashboardService } from "../data/dashboardService";
import { DashboardData } from "../types";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      funcionarios: 0,
      motoristas: 0,
      vendedores: 0,
      cidades: 0,
      veiculos: 0,
      rotas: 0,
      folgas: 0,
    },
    motoristasStatus: [],
    veiculosStatus: [],
    atividadesRecentes: [],
    loading: true,
  });

  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      setData((prev) => ({ ...prev, loading: true }));

      const dashboardData = await DashboardService.getAllDashboardData();

      setData({
        ...dashboardData,
        loading: false,
      });
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    error,
    refreshData,
    loading: data.loading,
  };
};
