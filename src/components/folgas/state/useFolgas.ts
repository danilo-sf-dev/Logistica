import { useCallback, useMemo, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { folgasService } from "../data/folgasService";
import { FolgasTableExportService } from "../export/FolgasTableExportService";
import type { Folga, FolgaInput } from "../types";
import type { StatusFolga, TipoFolga, DirecaoOrdenacao } from "../../../types";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";

export type OrdenacaoCampo =
  | "funcionarioNome"
  | "dataInicio"
  | "dataFim"
  | "tipo"
  | "status"
  | "dataCriacao"
  | "dataAtualizacao";

export function useFolgas() {
  const { showNotification } = useNotification();

  const [lista, setLista] = useState<Folga[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Folga | null>(null);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [folgaParaExcluir, setFolgaParaExcluir] = useState<Folga | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | StatusFolga>(
    "todos",
  );
  const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoFolga>("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] =
    useState<OrdenacaoCampo>("funcionarioNome");
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>("desc");
  const [valores, setValores] = useState<FolgaInput>({
    funcionarioId: "",
    funcionarioNome: "",
    dataInicio: "",
    dataFim: "",
    tipo: "folga",
    status: "pendente",
    observacoes: "",
    motivo: "",
    documento: "",
    horas: null,
  });
  const [erros, setErros] = useState<Partial<Record<keyof FolgaInput, string>>>(
    {},
  );

  const itensPorPagina = 15;

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await folgasService.listar();
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar folgas:", error);
      showNotification("Erro ao carregar folgas", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const validar = useCallback((input: FolgaInput) => {
    const novosErros: Partial<Record<keyof FolgaInput, string>> = {};
    if (!input.funcionarioId)
      novosErros.funcionarioId = "Funcionário é obrigatório";
    if (!input.dataInicio)
      novosErros.dataInicio = "Data de início é obrigatória";
    if (!input.dataFim) novosErros.dataFim = "Data de fim é obrigatória";

    if (input.dataInicio && input.dataFim) {
      const inicio = new Date(input.dataInicio);
      const fim = new Date(input.dataFim);
      if (inicio > fim) {
        novosErros.dataFim = "Data de fim deve ser posterior à data de início";
      }
    }

    // Validação específica para horas em banco de horas e compensação
    if (
      (input.tipo === "banco_horas" || input.tipo === "compensacao") &&
      input.horas !== null
    ) {
      if (input.horas < 0) {
        novosErros.horas = "Quantidade de horas deve ser positiva";
      } else if (input.horas > 24) {
        novosErros.horas = "Quantidade de horas não pode ser maior que 24";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

  const confirmar = useCallback(async () => {
    if (!validar(valores)) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }
    setErros({});
    try {
      const payload: FolgaInput = {
        ...valores,
        // Tratar o campo horas corretamente
        horas: valores.horas || null,
      };
      if (editando) {
        await folgasService.atualizar(editando.id, payload);
        showNotification("Folga atualizada com sucesso!", "success");
        // Atualizar status do funcionário automaticamente após edição
        if (payload.funcionarioId) {
          await folgasService.sincronizarStatusFuncionarioEspecifico(
            payload.funcionarioId,
          );
        }
      } else {
        await folgasService.criar(payload);
        showNotification("Folga solicitada com sucesso!", "success");
      }
      setMostrarModal(false);
      setEditando(null);
      setValores({
        funcionarioId: "",
        funcionarioNome: "",
        dataInicio: "",
        dataFim: "",
        tipo: "folga",
        status: "pendente",
        observacoes: "",
        motivo: "",
        documento: "",
        horas: null,
      });
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar folga:", error);
      showNotification("Erro ao salvar folga", "error");
    }
  }, [carregar, editando, showNotification, validar, valores]);

  const abrirCriacao = useCallback(() => {
    setEditando(null);
    setValores({
      funcionarioId: "",
      funcionarioNome: "",
      dataInicio: "",
      dataFim: "",
      tipo: "folga",
      status: "pendente",
      observacoes: "",
      motivo: "",
      documento: "",
      horas: null,
    });
    setErros({});
    setMostrarModal(true);
  }, []);

  const editarFolga = useCallback((f: Folga) => {
    setEditando(f);
    setValores({
      funcionarioId: f.funcionarioId || "",
      funcionarioNome: f.funcionarioNome || "",
      dataInicio: f.dataInicio || "",
      dataFim: f.dataFim || "",
      tipo: f.tipo || "folga",
      status: f.status || "pendente",
      observacoes: f.observacoes || "",
      motivo: f.motivo || "",
      documento: f.documento || "",
      horas: f.horas,
    });
    setErros({});
    setMostrarModal(true);
  }, []);

  const excluirFolga = useCallback(async (folga: Folga) => {
    setFolgaParaExcluir(folga);
    setMostrarModalExclusao(true);
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!folgaParaExcluir) return;

    try {
      await folgasService.excluir(folgaParaExcluir.id);
      showNotification("Folga excluída com sucesso!", "success");
      setMostrarModalExclusao(false);
      setFolgaParaExcluir(null);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir folga:", error);
      showNotification("Erro ao excluir folga", "error");
    }
  }, [folgaParaExcluir, showNotification, carregar]);

  const cancelarExclusao = useCallback(() => {
    setMostrarModalExclusao(false);
    setFolgaParaExcluir(null);
  }, []);

  const aprovarFolga = useCallback(
    async (id: string) => {
      try {
        await folgasService.aprovar(id);
        showNotification("Folga aprovada com sucesso!", "success");
        await carregar();
      } catch (error) {
        console.error("Erro ao aprovar folga:", error);
        showNotification("Erro ao aprovar folga", "error");
      }
    },
    [carregar, showNotification],
  );

  const rejeitarFolga = useCallback(
    async (id: string) => {
      try {
        await folgasService.rejeitar(id);
        showNotification("Folga rejeitada com sucesso!", "success");
        await carregar();
      } catch (error) {
        console.error("Erro ao rejeitar folga:", error);
        showNotification("Erro ao rejeitar folga", "error");
      }
    },
    [carregar, showNotification],
  );

  const sincronizarStatusEspecifico = useCallback(
    async (funcionarioId: string) => {
      try {
        await folgasService.sincronizarStatusFuncionarioEspecifico(
          funcionarioId,
        );
        showNotification(
          "Status do funcionário sincronizado com sucesso!",
          "success",
        );
      } catch (error) {
        console.error("Erro ao sincronizar status específico:", error);
        showNotification("Erro ao sincronizar status do funcionário", "error");
      }
    },
    [showNotification],
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
    return lista.filter((f) => {
      const matchesSearch = f.funcionarioNome?.toLowerCase().includes(termo);
      const matchesStatus =
        filtroStatus === "todos" || f.status === filtroStatus;
      const matchesTipo = filtroTipo === "todos" || f.tipo === filtroTipo;
      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [filtroStatus, filtroTipo, lista, termoBusca]);

  const listaOrdenada = useMemo(() => {
    const copia = [...listaFiltrada];
    copia.sort((a, b) => {
      let aValue: any = (a as any)[ordenarPor];
      let bValue: any = (b as any)[ordenarPor];
      if (ordenarPor === "funcionarioNome") {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }
      if (aValue < bValue) return direcaoOrdenacao === "asc" ? -1 : 1;
      if (aValue > bValue) return direcaoOrdenacao === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [direcaoOrdenacao, listaFiltrada, ordenarPor]);

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
    try {
      const exportService = new FolgasTableExportService();

      const filtros: TableExportFilters = {
        termoBusca,
        filtroStatus,
        filtroTipo,
        ordenarPor,
        direcaoOrdenacao,
      };

      await exportService.exportToExcel(listaOrdenada, filtros);
      showNotification("Exportação realizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      showNotification("Erro ao exportar dados", "error");
    }
  }, [
    listaOrdenada,
    termoBusca,
    filtroStatus,
    filtroTipo,
    ordenarPor,
    direcaoOrdenacao,
    showNotification,
  ]);

  const folgasPaginadas = useMemo(() => {
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
    folgasPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    filtroStatus,
    setFiltroStatus,
    filtroTipo,
    setFiltroTipo,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    mostrarModal,
    editando,
    valores,
    setValores,
    setMostrarModal,
    mostrarModalExclusao,
    folgaParaExcluir,
    abrirCriacao,
    editarFolga,
    excluirFolga,
    confirmarExclusao,
    cancelarExclusao,
    aprovarFolga,
    rejeitarFolga,
    sincronizarStatusEspecifico,
    confirmar,
    carregar,
    erros,
    handleExportExcel,
  };
}
