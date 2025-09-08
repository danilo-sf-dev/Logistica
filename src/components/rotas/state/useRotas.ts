import { useState, useEffect, useCallback } from "react";
import { rotasService } from "../data/rotasService";
import { RotasTableExportService } from "../export/RotasTableExportService";
import {
  Rota,
  RotaFormData,
  RotaFilters,
  RotaSortConfig,
  RotaOrdenacaoCampo,
} from "../types";
import { useNotification } from "../../../contexts/NotificationContext";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";

export const useRotas = () => {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExclusao, setLoadingExclusao] = useState(false);
  const [filters, setFilters] = useState<RotaFilters>({
    searchTerm: "",
    diaSemana: "",
  });

  const [sortConfig, setSortConfig] = useState<RotaSortConfig>({
    field: null,
    direction: "asc",
  });

  const [erros, setErros] = useState<
    Partial<Record<keyof RotaFormData, string>>
  >({});

  const { showNotification } = useNotification();

  const validar = useCallback((input: RotaFormData) => {
    const novosErros: Partial<Record<keyof RotaFormData, string>> = {};

    if (!input.nome?.trim()) {
      novosErros.nome = "Nome da rota é obrigatório";
    }

    if (!input.diaSemana || input.diaSemana.length === 0) {
      novosErros.diaSemana = "Pelo menos um dia da semana deve ser selecionado";
    }

    if (input.pesoMinimo !== undefined && input.pesoMinimo < 0) {
      novosErros.pesoMinimo = "Peso mínimo deve ser um valor positivo";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

  const fetchRotas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await rotasService.getAll();
      if (data && Array.isArray(data)) {
        setRotas(data);
      } else {
        console.warn("Dados recebidos não são um array válido:", data);
        setRotas([]);
      }
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      showNotification("Erro ao carregar rotas", "error");
      setRotas([]);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const createRota = useCallback(
    async (rotaData: RotaFormData) => {
      // Validar formulário
      if (!validar(rotaData)) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return false;
      }

      setLoadingSubmit(true);
      try {
        await rotasService.create(rotaData);
        showNotification("Rota criada com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao criar rota", "error");
        console.error("Erro ao criar rota:", error);
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    },
    [fetchRotas, showNotification, validar],
  );

  const updateRota = useCallback(
    async (id: string, rotaData: Partial<RotaFormData>) => {
      // Validar formulário
      if (!validar(rotaData as RotaFormData)) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return false;
      }

      setLoadingSubmit(true);
      try {
        await rotasService.update(id, rotaData);
        showNotification("Rota atualizada com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao atualizar rota", "error");
        console.error("Erro ao atualizar rota:", error);
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    },
    [fetchRotas, showNotification, validar],
  );

  const deleteRota = useCallback(
    async (id: string) => {
      setLoadingExclusao(true);
      try {
        await rotasService.delete(id);
        showNotification("Rota excluída com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao excluir rota", "error");
        console.error("Erro ao excluir rota:", error);
        return false;
      } finally {
        setLoadingExclusao(false);
      }
    },
    [fetchRotas, showNotification],
  );

  const updateFilters = useCallback((newFilters: Partial<RotaFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSort = useCallback((field: RotaOrdenacaoCampo) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const filteredRotas = useCallback(() => {
    if (!rotas || !Array.isArray(rotas)) {
      return [];
    }

    let filtered = [...rotas];

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (rota) =>
          rota.nome?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (rota.cidades &&
            Array.isArray(rota.cidades) &&
            rota.cidades.some((cidade) =>
              cidade?.toLowerCase().includes(filters.searchTerm.toLowerCase()),
            )),
      );
    }

    if (filters.diaSemana) {
      filtered = filtered.filter((rota) => {
        if (!rota.diaSemana || !Array.isArray(rota.diaSemana)) {
          return false;
        }

        // Se o filtro é "Qualquer dia da semana", busca rotas que tenham essa opção
        if (filters.diaSemana === "Qualquer dia da semana") {
          return rota.diaSemana.includes("Qualquer dia da semana");
        }

        // Para dias específicos, busca normalmente
        return rota.diaSemana.includes(filters.diaSemana);
      });
    }

    // Aplicar ordenação
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.field!];
        let bValue: any = b[sortConfig.field!];

        // Tratar valores específicos por campo
        if (sortConfig.field === "cidades") {
          // Para cidades, ordenar pela quantidade de cidades
          aValue = Array.isArray(aValue) ? aValue.length : 0;
          bValue = Array.isArray(bValue) ? bValue.length : 0;
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [rotas, filters, sortConfig]);

  useEffect(() => {
    fetchRotas();
  }, [fetchRotas]);

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
    setLoadingExport(true);
    try {
      const exportService = new RotasTableExportService();
      const dadosFiltrados = filteredRotas();

      // Mapear dia da semana para o formato esperado
      const mapearDiaSemana = (dia: string | undefined) => {
        if (!dia) return undefined;
        const mapa: Record<string, string> = {
          "Segunda-feira": "segunda",
          "Terça-feira": "terca",
          "Quarta-feira": "quarta",
          "Quinta-feira": "quinta",
          "Sexta-feira": "sexta",
          Sábado: "sabado",
          Domingo: "domingo",
        };
        return mapa[dia] || dia;
      };

      const filtros: TableExportFilters = {
        termoBusca: filters.searchTerm,
        filtroDiaSemana: mapearDiaSemana(filters.diaSemana),
        ordenarPor: "nome",
        direcaoOrdenacao: "asc",
      };

      await exportService.exportToExcel(dadosFiltrados, filtros);
      showNotification("Exportação realizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      showNotification("Erro ao exportar dados", "error");
    } finally {
      setLoadingExport(false);
    }
  }, [filteredRotas, filters, showNotification]);

  const result = {
    rotas: rotas || [],
    loading,
    loadingSubmit,
    loadingExport,
    loadingExclusao,
    filters,
    sortConfig,
    filteredRotas: filteredRotas(),
    createRota,
    updateRota,
    deleteRota,
    updateFilters,
    handleSort,
    refreshRotas: fetchRotas,
    handleExportExcel,
    erros,
  };

  return result;
};
