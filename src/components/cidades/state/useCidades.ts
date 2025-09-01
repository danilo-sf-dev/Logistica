import { useCallback, useMemo, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { cidadesService } from "../data/cidadesService";
import { CidadesTableExportService } from "../export/CidadesTableExportService";
import { useRotasForCidades } from "./useRotasForCidades";
import { obterRegiaoPorEstado } from "utils/constants";
import type { Cidade, CidadeInput, CidadeFormData } from "../types";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";

export type OrdenacaoCampo =
  | "nome"
  | "estado"
  | "regiao"
  | "distancia"
  | "pesoMinimo"
  | "rotaId"
  | "dataCriacao"
  | "dataAtualizacao";
export type DirecaoOrdenacao = "asc" | "desc";

export function useCidades() {
  const { showNotification } = useNotification();
  const { rotas } = useRotasForCidades();

  const [lista, setLista] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExclusao, setLoadingExclusao] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Cidade | null>(null);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [cidadeParaExcluir, setCidadeParaExcluir] = useState<Cidade | null>(
    null,
  );
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroRegiao, setFiltroRegiao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoCampo>("dataCriacao");
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>("desc");
  const [valores, setValores] = useState<CidadeFormData>({
    nome: "",
    estado: "",
    regiao: "",
    distancia: "",
    pesoMinimo: "",
    rotaId: "",
    observacao: "",
  });
  const [erros, setErros] = useState<
    Partial<Record<keyof CidadeFormData, string>>
  >({});

  const itensPorPagina = 15;

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await cidadesService.listar();
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      // Mostrar mensagem específica do erro se disponível
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar cidades";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const validar = useCallback((input: CidadeFormData) => {
    const novosErros: Partial<Record<keyof CidadeFormData, string>> = {};
    if (!input.nome.trim()) novosErros.nome = "Nome da cidade é obrigatório";
    if (!input.estado) novosErros.estado = "Estado é obrigatório";
    if (input.distancia && parseFloat(input.distancia) < 0) {
      novosErros.distancia = "Distância deve ser um número positivo";
    }
    if (input.pesoMinimo && parseFloat(input.pesoMinimo) < 0) {
      novosErros.pesoMinimo = "Peso mínimo deve ser um número positivo";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

  const confirmar = useCallback(async () => {
    if (!validar(valores)) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload: CidadeInput = {
        ...valores,
        nome: valores.nome.toUpperCase(),
        regiao: valores.regiao?.toUpperCase() || undefined, // Deixar undefined para o serviço definir automaticamente
        distancia: valores.distancia ? parseFloat(valores.distancia) : null,
        pesoMinimo: valores.pesoMinimo ? parseFloat(valores.pesoMinimo) : null,
        rotaId: valores.rotaId || null,
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
        pesoMinimo: "",
        rotaId: "",
        observacao: "",
      });
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
      // Mostrar mensagem específica do erro se disponível
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao salvar cidade";
      showNotification(errorMessage, "error");
    } finally {
      setLoadingSubmit(false);
    }
  }, [carregar, editando, showNotification, validar, valores]);

  const abrirCriacao = useCallback(() => {
    setEditando(null);
    setValores({
      nome: "",
      estado: "",
      regiao: "",
      distancia: "",
      pesoMinimo: "",
      rotaId: "",
      observacao: "",
    });
    setMostrarModal(true);
  }, []);

  const editarCidade = useCallback((cidade: Cidade) => {
    setEditando(cidade);

    // Garantir que a região seja sempre preenchida baseada no estado
    const regiaoAutomatica = obterRegiaoPorEstado(cidade.estado);
    const regiao = cidade.regiao || regiaoAutomatica || "";

    const valoresIniciais = {
      nome: cidade.nome || "",
      estado: cidade.estado || "",
      regiao: regiao,
      distancia: cidade.distancia ? String(cidade.distancia) : "",
      pesoMinimo: cidade.pesoMinimo ? String(cidade.pesoMinimo) : "",
      rotaId: cidade.rotaId || "",
      observacao: cidade.observacao || "",
    };

    setValores(valoresIniciais);
    setMostrarModal(true);
  }, []);

  const excluirCidade = useCallback((cidade: Cidade) => {
    setCidadeParaExcluir(cidade);
    setMostrarModalExclusao(true);
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!cidadeParaExcluir) return;

    setLoadingExclusao(true);
    try {
      await cidadesService.excluir(cidadeParaExcluir.id);
      showNotification("Cidade excluída com sucesso!", "success");
      setMostrarModalExclusao(false);
      setCidadeParaExcluir(null);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir cidade:", error);
      // Mostrar mensagem específica do erro se disponível
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir cidade";
      showNotification(errorMessage, "error");
    } finally {
      setLoadingExclusao(false);
    }
  }, [cidadeParaExcluir, carregar, showNotification]);

  const cancelarExclusao = useCallback(() => {
    setMostrarModalExclusao(false);
    setCidadeParaExcluir(null);
  }, []);

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
    const regiao = filtroRegiao.toLowerCase();

    return lista.filter((c) => {
      const matchTermo =
        !termo ||
        c.nome?.toLowerCase().includes(termo) ||
        c.estado?.toLowerCase().includes(termo) ||
        c.regiao?.toLowerCase().includes(termo);

      const matchRegiao = !regiao || c.regiao?.toLowerCase() === regiao;

      return matchTermo && matchRegiao;
    });
  }, [lista, termoBusca, filtroRegiao]);

  const listaOrdenada = useMemo(() => {
    const copia = [...listaFiltrada];
    copia.sort((a, b) => {
      let aValue: any = (a as any)[ordenarPor];
      let bValue: any = (b as any)[ordenarPor];

      if (["nome", "estado", "regiao"].includes(ordenarPor)) {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      } else if (ordenarPor === "rotaId") {
        // Ordenar pelo nome da rota, não pelo ID
        const rotaA = rotas.find((r) => r.id === aValue);
        const rotaB = rotas.find((r) => r.id === bValue);
        aValue = rotaA?.nome?.toLowerCase() || "";
        bValue = rotaB?.nome?.toLowerCase() || "";
      }

      if (aValue < bValue) return direcaoOrdenacao === "asc" ? -1 : 1;
      if (aValue > bValue) return direcaoOrdenacao === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [direcaoOrdenacao, listaFiltrada, ordenarPor, rotas]);

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
    setLoadingExport(true);
    try {
      const exportService = new CidadesTableExportService();

      const filtros: TableExportFilters = {
        termoBusca,
        filtroRegiao,
        ordenarPor,
        direcaoOrdenacao,
      };

      await exportService.exportToExcel(listaOrdenada, filtros);
      showNotification("Exportação realizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      showNotification("Erro ao exportar dados", "error");
    } finally {
      setLoadingExport(false);
    }
  }, [
    listaOrdenada,
    termoBusca,
    filtroRegiao,
    ordenarPor,
    direcaoOrdenacao,
    showNotification,
  ]);

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
    loadingSubmit,
    loadingExport,
    loadingExclusao,
    cidadesPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    filtroRegiao,
    setFiltroRegiao,
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
    mostrarModalExclusao,
    cidadeParaExcluir,
    confirmarExclusao,
    cancelarExclusao,
    handleExportExcel,
  };
}
