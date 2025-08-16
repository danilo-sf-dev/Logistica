import { useState, useEffect, useCallback } from "react";
import { rotasService } from "../data/rotasService";
import { RotasTableExportService } from "../export/RotasTableExportService";
import { Rota, RotaFormData, RotaFilters } from "../types";
import { useNotification } from "../../../contexts/NotificationContext";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";

export const useRotas = () => {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RotaFilters>({
    searchTerm: "",
    diaSemana: "",
  });

  const { showNotification } = useNotification();

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
      try {
        await rotasService.create(rotaData);
        showNotification("Rota criada com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao criar rota", "error");
        console.error("Erro ao criar rota:", error);
        return false;
      }
    },
    [fetchRotas, showNotification],
  );

  const updateRota = useCallback(
    async (id: string, rotaData: Partial<RotaFormData>) => {
      try {
        await rotasService.update(id, rotaData);
        showNotification("Rota atualizada com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao atualizar rota", "error");
        console.error("Erro ao atualizar rota:", error);
        return false;
      }
    },
    [fetchRotas, showNotification],
  );

  const deleteRota = useCallback(
    async (id: string) => {
      try {
        await rotasService.delete(id);
        showNotification("Rota excluída com sucesso!", "success");
        await fetchRotas();
        return true;
      } catch (error) {
        showNotification("Erro ao excluir rota", "error");
        console.error("Erro ao excluir rota:", error);
        return false;
      }
    },
    [fetchRotas, showNotification],
  );

  const updateFilters = useCallback((newFilters: Partial<RotaFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filteredRotas = useCallback(() => {
    if (!rotas || !Array.isArray(rotas)) {
      return [];
    }

    let filtered = rotas;

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
      filtered = filtered.filter(
        (rota) =>
          rota.diaSemana &&
          Array.isArray(rota.diaSemana) &&
          rota.diaSemana.includes(filters.diaSemana),
      );
    }

    return filtered;
  }, [rotas, filters]);

  useEffect(() => {
    fetchRotas();
  }, [fetchRotas]);

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
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
    }
  }, [filteredRotas, filters, showNotification]);

  const result = {
    rotas: rotas || [],
    loading,
    filters,
    filteredRotas: filteredRotas(),
    createRota,
    updateRota,
    deleteRota,
    updateFilters,
    refreshRotas: fetchRotas,
    handleExportExcel,
  };

  return result;
};
