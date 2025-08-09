import { useCallback, useMemo, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { cidadesService } from "../data/cidadesService";
import type { Cidade, CidadeInput } from "../types.ts";

export type OrdenacaoCampo =
  | "nome"
  | "estado"
  | "regiao"
  | "distancia"
  | "dataCriacao"
  | "dataAtualizacao";
export type DirecaoOrdenacao = "asc" | "desc";

export function useCidades() {
  const { showNotification } = useNotification();

  const [lista, setLista] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Cidade | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoCampo>("dataCriacao");
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>("desc");
  const [valores, setValores] = useState<CidadeInput>({
    nome: "",
    estado: "",
    regiao: "",
    distancia: "",
    observacao: "",
  });
  const [erros, setErros] = useState<
    Partial<Record<keyof CidadeInput, string>>
  >({});

  const itensPorPagina = 15;

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await cidadesService.listar();
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      showNotification("Erro ao carregar cidades", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const validar = useCallback((input: CidadeInput) => {
    const novosErros: Partial<Record<keyof CidadeInput, string>> = {};
    if (!input.nome.trim()) novosErros.nome = "Nome da cidade é obrigatório";
    if (!input.estado) novosErros.estado = "Estado é obrigatório";
    if (input.distancia && parseFloat(input.distancia) < 0) {
      novosErros.distancia = "Distância deve ser um número positivo";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

  const confirmar = useCallback(async () => {
    if (!validar(valores)) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    try {
      const payload: CidadeInput = {
        ...valores,
        nome: valores.nome.toUpperCase(),
        regiao: valores.regiao?.toUpperCase() ?? "",
      };

      if (editando) {
        await cidadesService.atualizar(editando.id, payload);
        showNotification("Cidade atualizada com sucesso!", "success");
      } else {
        await cidadesService.criar(payload);
        showNotification("Cidade cadastrada com sucesso!", "success");
      }

      setMostrarModal(false);
      setEditando(null);
      setValores({
        nome: "",
        estado: "",
        regiao: "",
        distancia: "",
        observacao: "",
      });
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
      showNotification("Erro ao salvar cidade", "error");
    }
  }, [carregar, editando, showNotification, validar, valores]);

  const abrirCriacao = useCallback(() => {
    setEditando(null);
    setValores({
      nome: "",
      estado: "",
      regiao: "",
      distancia: "",
      observacao: "",
    });
    setMostrarModal(true);
  }, []);

  const editarCidade = useCallback((cidade: Cidade) => {
    setEditando(cidade);
    setValores({
      nome: cidade.nome || "",
      estado: cidade.estado || "",
      regiao: cidade.regiao || "",
      distancia: cidade.distancia ? String(cidade.distancia) : "",
      observacao: cidade.observacao || "",
    });
    setMostrarModal(true);
  }, []);

  const excluirCidade = useCallback(
    async (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
        try {
          await cidadesService.excluir(id);
          showNotification("Cidade excluída com sucesso!", "success");
          await carregar();
        } catch (error) {
          console.error("Erro ao excluir cidade:", error);
          showNotification("Erro ao excluir cidade", "error");
        }
      }
    },
    [carregar, showNotification],
  );

  const alternarOrdenacao = useCallback(
    (campo: OrdenacaoCampo) => {
      if (ordenarPor === campo) {
        setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc");
      } else {
        setOrdenarPor(campo);
        setDirecaoOrdenacao("asc");
      }
    },
    [direcaoOrdenacao, ordenarPor],
  );

  const listaFiltrada = useMemo(() => {
    const termo = termoBusca.toLowerCase();
    return lista.filter(
      (c) =>
        c.nome?.toLowerCase().includes(termo) ||
        c.estado?.toLowerCase().includes(termo) ||
        c.regiao?.toLowerCase().includes(termo),
    );
  }, [lista, termoBusca]);

  const listaOrdenada = useMemo(() => {
    const copia = [...listaFiltrada];
    copia.sort((a, b) => {
      let aValue: any = (a as any)[ordenarPor];
      let bValue: any = (b as any)[ordenarPor];
      if (["nome", "estado", "regiao"].includes(ordenarPor)) {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }
      if (aValue < bValue) return direcaoOrdenacao === "asc" ? -1 : 1;
      if (aValue > bValue) return direcaoOrdenacao === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [direcaoOrdenacao, listaFiltrada, ordenarPor]);

  const cidadesPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return listaOrdenada.slice(inicio, fim);
  }, [itensPorPagina, listaOrdenada, paginaAtual]);

  const totalPaginado = useMemo(() => {
    const total = listaOrdenada.length;
    const totalPaginas = Math.ceil(total / itensPorPagina) || 1;
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = Math.min(inicio + itensPorPagina, total);
    return { total, totalPaginas, inicio, fim };
  }, [itensPorPagina, listaOrdenada, paginaAtual]);

  return {
    loading,
    cidadesPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    mostrarModal,
    editando,
    valores,
    erros,
    setValores,
    setMostrarModal,
    abrirCriacao,
    editarCidade,
    excluirCidade,
    confirmar,
    carregar,
  };
}
