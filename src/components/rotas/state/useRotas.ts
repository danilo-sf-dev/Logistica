import { useState, useEffect, useCallback } from "react";
import { rotasService } from "../data/rotasService";
import { Rota, RotaFormData, RotaFilters } from "../types";
import { useNotification } from "../../../contexts/NotificationContext";

export const useRotas = () => {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RotaFilters>({
    searchTerm: "",
    diaSemana: "",
  });

  console.log("useRotas inicializado, estado atual:", {
    rotas,
    loading,
    filters,
  });

  const { showNotification } = useNotification();

  const fetchRotas = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Buscando rotas...");
      const data = await rotasService.getAll();
      console.log("Rotas carregadas:", data);
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
    console.log("Filtrando rotas:", rotas);
    if (!rotas || !Array.isArray(rotas)) {
      console.log("Rotas não é um array válido, retornando array vazio");
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

    console.log("Rotas filtradas:", filtered);
    return filtered;
  }, [rotas, filters]);

  useEffect(() => {
    console.log("useEffect executando fetchRotas");
    fetchRotas();
  }, [fetchRotas]);

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
  };

  console.log("useRotas retornando:", result);
  return result;
};
