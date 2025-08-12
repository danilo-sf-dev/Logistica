import { useState, useCallback, useEffect } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { VeiculosService } from "../data/veiculosService";
import {
  Veiculo,
  VeiculoFormData,
  VeiculosFiltersType,
  VeiculosSortConfig,
} from "../types";

export const useVeiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VeiculosFiltersType>({
    searchTerm: "",
  });
  const [sortConfig, setSortConfig] = useState<VeiculosSortConfig>({
    field: "dataCriacao",
    direction: "desc",
  });

  const { showNotification } = useNotification();

  const fetchVeiculos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await VeiculosService.getVeiculos();
      setVeiculos(data);
    } catch (error) {
      showNotification("Erro ao carregar veículos", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchVeiculosByFilters = useCallback(
    async (filterParams: Partial<VeiculosFiltersType>) => {
      try {
        setLoading(true);
        const data = await VeiculosService.getVeiculosByFilters(filterParams);
        setVeiculos(data);
      } catch (error) {
        showNotification("Erro ao carregar veículos com filtros", "error");
      } finally {
        setLoading(false);
      }
    },
    [showNotification],
  );

  const createVeiculo = useCallback(
    async (veiculoData: VeiculoFormData) => {
      try {
        await VeiculosService.createVeiculo(veiculoData);
        showNotification("Veículo cadastrado com sucesso!", "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao cadastrar veículo", "error");
        return false;
      }
    },
    [fetchVeiculos, showNotification],
  );

  const updateVeiculo = useCallback(
    async (id: string, veiculoData: Partial<VeiculoFormData>) => {
      try {
        await VeiculosService.updateVeiculo(id, veiculoData);
        showNotification("Veículo atualizado com sucesso!", "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao atualizar veículo", "error");
        return false;
      }
    },
    [fetchVeiculos, showNotification],
  );

  const deleteVeiculo = useCallback(
    async (id: string) => {
      try {
        await VeiculosService.deleteVeiculo(id);
        showNotification("Veículo excluído com sucesso!", "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao excluir veículo", "error");
        return false;
      }
    },
    [fetchVeiculos, showNotification],
  );

  const toggleVeiculoStatus = useCallback(
    async (id: string, novoStatus: string) => {
      try {
        await VeiculosService.toggleVeiculoStatus(id, novoStatus);
        const statusText = novoStatus === "inativo" ? "inativado" : "ativado";
        showNotification(`Veículo ${statusText} com sucesso!`, "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao alterar status do veículo", "error");
        return false;
      }
    },
    [fetchVeiculos, showNotification],
  );

  const checkPlacaExists = useCallback(
    async (placa: string, excludeId?: string) => {
      try {
        return await VeiculosService.checkPlacaExists(placa, excludeId);
      } catch (error) {
        console.error("Erro ao verificar placa:", error);
        return false;
      }
    },
    [],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<VeiculosFiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const updateSortConfig = useCallback((field: keyof Veiculo) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const getFilteredAndSortedVeiculos = useCallback(() => {
    let filtered = veiculos.filter(
      (veiculo) =>
        veiculo.placa
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        veiculo.modelo
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        veiculo.marca?.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );

    // Aplicar filtros adicionais
    if (filters.status) {
      filtered = filtered.filter(
        (veiculo) => veiculo.status === filters.status,
      );
    }
    if (filters.tipoCarroceria) {
      filtered = filtered.filter(
        (veiculo) => veiculo.tipoCarroceria === filters.tipoCarroceria,
      );
    }
    if (filters.tipoBau) {
      filtered = filtered.filter(
        (veiculo) => veiculo.tipoBau === filters.tipoBau,
      );
    }
    if (filters.unidadeNegocio) {
      filtered = filtered.filter(
        (veiculo) => veiculo.unidadeNegocio === filters.unidadeNegocio,
      );
    }

    // Aplicar ordenação
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [veiculos, filters, sortConfig]);

  useEffect(() => {
    fetchVeiculos();
  }, [fetchVeiculos]);

  return {
    veiculos,
    loading,
    filters,
    sortConfig,
    fetchVeiculos,
    fetchVeiculosByFilters,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
    toggleVeiculoStatus,
    checkPlacaExists,
    updateFilters,
    updateSortConfig,
    getFilteredAndSortedVeiculos,
  };
};
