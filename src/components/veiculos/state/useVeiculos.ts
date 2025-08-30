import { useState, useCallback, useEffect } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { VeiculosService } from "../data/veiculosService";
import { VeiculosTableExportService } from "../export/VeiculosTableExportService";
import {
  Veiculo,
  VeiculoFormData,
  VeiculosFiltersType,
  VeiculosSortConfig,
} from "../types";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";

export const useVeiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  const [filters, setFilters] = useState<VeiculosFiltersType>({
    searchTerm: "",
  });
  const [sortConfig, setSortConfig] = useState<VeiculosSortConfig>({
    field: "dataCriacao",
    direction: "desc",
  });

  const [erros, setErros] = useState<
    Partial<Record<keyof VeiculoFormData, string>>
  >({});

  const { showNotification } = useNotification();

  const validar = useCallback((input: VeiculoFormData) => {
    const novosErros: Partial<Record<keyof VeiculoFormData, string>> = {};

    // Se o veículo estiver inativo, não validar nada (não pode ser editado)
    if (input.status === "inativo") {
      setErros({});
      return true;
    }

    // Validação apenas para veículos ativos
    if (!input.placa?.trim()) {
      novosErros.placa = "Placa é obrigatória";
    }

    if (!input.modelo?.trim()) {
      novosErros.modelo = "Modelo é obrigatório";
    }

    if (!input.marca?.trim()) {
      novosErros.marca = "Marca é obrigatória";
    }

    if (!input.ano?.trim()) {
      novosErros.ano = "Ano é obrigatório";
    } else {
      const ano = parseInt(input.ano);
      if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear() + 1) {
        novosErros.ano = "Ano deve ser entre 1900 e o próximo ano";
      }
    }

    if (!input.capacidade?.trim()) {
      novosErros.capacidade = "Capacidade é obrigatória";
    } else {
      const capacidade = parseFloat(input.capacidade);
      if (isNaN(capacidade) || capacidade <= 0) {
        novosErros.capacidade = "Capacidade deve ser um número positivo";
      }
    }

    if (!input.quantidadeEixos?.trim()) {
      novosErros.quantidadeEixos = "Quantidade de eixos é obrigatória";
    } else {
      const eixos = parseInt(input.quantidadeEixos);
      if (isNaN(eixos) || eixos < 2 || eixos > 10) {
        novosErros.quantidadeEixos =
          "Quantidade de eixos deve ser entre 2 e 10";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

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
      // Validar formulário
      if (!validar(veiculoData)) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return false;
      }

      setLoadingSubmit(true);
      try {
        await VeiculosService.createVeiculo(veiculoData);
        showNotification("Veículo cadastrado com sucesso!", "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao cadastrar veículo", "error");
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    },
    [fetchVeiculos, showNotification, validar],
  );

  const updateVeiculo = useCallback(
    async (id: string, veiculoData: Partial<VeiculoFormData>) => {
      // Validar formulário
      if (!validar(veiculoData as VeiculoFormData)) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return false;
      }

      setLoadingSubmit(true);
      try {
        await VeiculosService.updateVeiculo(id, veiculoData);
        showNotification("Veículo atualizado com sucesso!", "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao atualizar veículo", "error");
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    },
    [fetchVeiculos, showNotification, validar],
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
      setLoadingToggleStatus(true);
      try {
        await VeiculosService.toggleVeiculoStatus(id, novoStatus);
        const statusText = novoStatus === "inativo" ? "inativado" : "ativado";
        showNotification(`Veículo ${statusText} com sucesso!`, "success");
        await fetchVeiculos();
        return true;
      } catch (error) {
        showNotification("Erro ao alterar status do veículo", "error");
        return false;
      } finally {
        setLoadingToggleStatus(false);
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

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
    setLoadingExport(true);
    try {
      const exportService = new VeiculosTableExportService();
      const dadosFiltrados = getFilteredAndSortedVeiculos();

      const filtros: TableExportFilters = {
        termoBusca: filters.searchTerm,
        filtroStatus: filters.status,
        filtroTipoCarroceria: filters.tipoCarroceria,
        filtroTipoBau: filters.tipoBau,
        filtroUnidadeNegocio: filters.unidadeNegocio,
        ordenarPor: sortConfig.field,
        direcaoOrdenacao: sortConfig.direction,
      };

      await exportService.exportToExcel(dadosFiltrados, filtros);
      showNotification("Exportação realizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      showNotification("Erro ao exportar dados", "error");
    } finally {
      setLoadingExport(false);
    }
  }, [getFilteredAndSortedVeiculos, filters, sortConfig, showNotification]);

  return {
    veiculos,
    loading,
    loadingSubmit,
    loadingExport,
    loadingToggleStatus,
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
    handleExportExcel,
    erros,
  };
};
