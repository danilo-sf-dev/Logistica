import { useState, useEffect } from "react";
import { rotasService } from "../../rotas/data/rotasService";
import { Rota } from "../../rotas/types";

export const useRotasForCidades = () => {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRotas = async () => {
      try {
        setLoading(true);
        const data = await rotasService.getAll();
        if (data && Array.isArray(data)) {
          setRotas(data);
        } else {
          setRotas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar rotas para cidades:", error);
        setRotas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRotas();
  }, []);

  return { rotas, loading };
};
