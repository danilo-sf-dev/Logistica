import { useCallback, useMemo, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { vendedoresService } from "../data/vendedoresService";
import { VendedoresTableExportService } from "../export/VendedoresTableExportService";
import type { Vendedor, VendedorInput } from "../types";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";
import {
  formatCelular,
  validateCPF,
  validateEmail,
  validateCelular,
} from "../../../utils/masks";

export type OrdenacaoCampo =
  | "nome"
  | "cpf"
  | "email"
  | "celular"
  | "regiao"
  | "unidadeNegocio"
  | "tipoContrato"
  | "dataCriacao"
  | "ativo";
export type DirecaoOrdenacao = "asc" | "desc";

export function useVendedores() {
  const { showNotification } = useNotification();

  const [lista, setLista] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingInativacao, setLoadingInativacao] = useState(false);
  const [loadingAtivacao, setLoadingAtivacao] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Vendedor | null>(null);
  const [mostrarModalInativacao, setMostrarModalInativacao] = useState(false);
  const [vendedorParaInativar, setVendedorParaInativar] =
    useState<Vendedor | null>(null);
  const [mostrarModalAtivacao, setMostrarModalAtivacao] = useState(false);
  const [vendedorParaAtivar, setVendedorParaAtivar] = useState<Vendedor | null>(
    null,
  );
  const [termoBusca, setTermoBusca] = useState("");

  const [filtroUnidadeNegocio, setFiltroUnidadeNegocio] = useState<
    "todos" | Vendedor["unidadeNegocio"]
  >("todos");
  const [filtroAtivo, setFiltroAtivo] = useState<"todos" | boolean>("todos");
  const [filtroCidade, setFiltroCidade] = useState<string>("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoCampo>("dataCriacao");
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>("desc");
  const [valores, setValores] = useState<VendedorInput>({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    regiao: "",
    codigoVendSistema: "",
    unidadeNegocio: "frigorifico",
    tipoContrato: "clt",
    ativo: true,
    cidadesAtendidas: [],
  });
  const [erros, setErros] = useState<
    Partial<Record<keyof VendedorInput, string>>
  >({});

  const itensPorPagina = 15;

  // Função de validação por campo
  const validar = useCallback((input: VendedorInput) => {
    const novosErros: Partial<Record<keyof VendedorInput, string>> = {};

    // Se o vendedor estiver inativo, não validar nada (não pode ser editado)
    if (!input.ativo) {
      setErros({});
      return true;
    }

    // Validação apenas para vendedores ativos
    if (!input.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    }

    if (!input.cpf?.trim()) {
      novosErros.cpf = "CPF é obrigatório";
    } else if (!validateCPF(input.cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    if (!input.celular?.trim()) {
      novosErros.celular = "Celular é obrigatório";
    } else if (!validateCelular(input.celular)) {
      novosErros.celular = "Celular inválido";
    }

    if (!input.regiao?.trim()) {
      novosErros.regiao = "Região é obrigatória";
    }

    if (!input.unidadeNegocio) {
      novosErros.unidadeNegocio = "Unidade de negócio é obrigatória";
    }

    if (!input.tipoContrato) {
      novosErros.tipoContrato = "Tipo de contrato é obrigatório";
    }

    if (input.email && !validateEmail(input.email)) {
      novosErros.email = "Email inválido";
    }

    if (input.codigoVendSistema) {
      const codigo = parseInt(input.codigoVendSistema);
      if (isNaN(codigo) || codigo < 0) {
        novosErros.codigoVendSistema =
          "Código deve ser um número inteiro positivo";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }, []);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await vendedoresService.listar();
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
      showNotification("Erro ao carregar vendedores", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const confirmar = useCallback(async () => {
    // Prevent updating inactive vendors
    if (editando && !editando.ativo) {
      showNotification("Não é possível editar vendedores inativos", "error");
      return;
    }

    // Validar formulário
    if (!validar(valores)) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload: VendedorInput = {
        ...valores,
        nome: valores.nome.toUpperCase(),
        cpf: valores.cpf?.replace(/\D/g, "") || "",
        regiao: valores.regiao.toUpperCase(),
        celular: valores.celular?.replace(/\D/g, "") || "",
      };

      if (editando) {
        await vendedoresService.atualizar(editando.id, payload);
        showNotification("Vendedor atualizado com sucesso!", "success");
      } else {
        await vendedoresService.criar(payload);
        showNotification("Vendedor cadastrado com sucesso!", "success");
      }

      setMostrarModal(false);
      setEditando(null);
      setValores({
        nome: "",
        cpf: "",
        email: "",
        celular: "",
        regiao: "",
        codigoVendSistema: "",
        unidadeNegocio: "frigorifico",
        tipoContrato: "clt",
        ativo: true,
        cidadesAtendidas: [],
      });
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar vendedor:", error);
      if (
        error instanceof Error &&
        error.message === "CPF já cadastrado no sistema"
      ) {
        showNotification("CPF já cadastrado no sistema", "error");
      } else {
        showNotification("Erro ao salvar vendedor", "error");
      }
    } finally {
      setLoadingSubmit(false);
    }
  }, [carregar, editando, showNotification, validar, valores]);

  const abrirCriacao = useCallback(() => {
    setEditando(null);
    setValores({
      nome: "",
      cpf: "",
      email: "",
      celular: "",
      regiao: "",
      codigoVendSistema: "",
      unidadeNegocio: "frigorifico",
      tipoContrato: "clt",
      ativo: true,
      cidadesAtendidas: [],
    });
    setMostrarModal(true);
  }, []);

  const editarVendedor = useCallback((v: Vendedor) => {
    setEditando(v);
    setValores({
      nome: v.nome || "",
      cpf: v.cpf || "",
      email: v.email || "",
      celular: formatCelular(v.celular || ""),
      regiao: v.regiao?.toUpperCase() || "",
      codigoVendSistema: v.codigoVendSistema || "",
      unidadeNegocio: (v.unidadeNegocio?.toLowerCase() as any) || "frigorifico",
      tipoContrato: v.tipoContrato || "clt",
      ativo: v.ativo !== undefined ? v.ativo : true,
      cidadesAtendidas: v.cidadesAtendidas || [],
    });
    setMostrarModal(true);
  }, []);

  const inativarVendedor = useCallback(async (vendedor: Vendedor) => {
    setVendedorParaInativar(vendedor);
    setMostrarModalInativacao(true);
  }, []);

  const confirmarInativacao = useCallback(async () => {
    if (!vendedorParaInativar) return;

    setLoadingInativacao(true);
    try {
      await vendedoresService.inativar(vendedorParaInativar.id);
      showNotification("Vendedor inativado com sucesso!", "success");
      setMostrarModalInativacao(false);
      setVendedorParaInativar(null);
      await carregar();
    } catch (error) {
      console.error("Erro ao inativar vendedor:", error);
      showNotification("Erro ao inativar vendedor", "error");
    } finally {
      setLoadingInativacao(false);
    }
  }, [vendedorParaInativar, showNotification, carregar]);

  const cancelarInativacao = useCallback(() => {
    setMostrarModalInativacao(false);
    setVendedorParaInativar(null);
  }, []);

  const ativarVendedor = useCallback(async (vendedor: Vendedor) => {
    setVendedorParaAtivar(vendedor);
    setMostrarModalAtivacao(true);
  }, []);

  const confirmarAtivacao = useCallback(async () => {
    if (!vendedorParaAtivar) return;

    setLoadingAtivacao(true);
    try {
      await vendedoresService.ativar(vendedorParaAtivar.id);
      showNotification("Vendedor ativado com sucesso!", "success");
      setMostrarModalAtivacao(false);
      setVendedorParaAtivar(null);
      await carregar();
    } catch (error) {
      console.error("Erro ao ativar vendedor:", error);
      showNotification("Erro ao ativar vendedor", "error");
    } finally {
      setLoadingAtivacao(false);
    }
  }, [vendedorParaAtivar, showNotification, carregar]);

  const cancelarAtivacao = useCallback(() => {
    setMostrarModalAtivacao(false);
    setVendedorParaAtivar(null);
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
    const cidadeTermo = filtroCidade.toLowerCase();
    return lista.filter((v) => {
      const matchesSearch =
        v.nome?.toLowerCase().includes(termo) ||
        v.cpf?.includes(termo) ||
        v.email?.toLowerCase().includes(termo) ||
        v.regiao?.toLowerCase().includes(termo);
      const matchesUnidadeNegocio =
        filtroUnidadeNegocio === "todos" ||
        v.unidadeNegocio === filtroUnidadeNegocio;
      const matchesAtivo = filtroAtivo === "todos" || v.ativo === filtroAtivo;

      // Filtro por cidade - verificar se o vendedor atende a cidade selecionada
      const matchesCidade =
        !cidadeTermo ||
        (v.cidadesAtendidas && v.cidadesAtendidas.includes(cidadeTermo));

      return (
        matchesSearch && matchesUnidadeNegocio && matchesAtivo && matchesCidade
      );
    });
  }, [filtroUnidadeNegocio, filtroAtivo, filtroCidade, lista, termoBusca]);

  const listaOrdenada = useMemo(() => {
    const copia = [...listaFiltrada];
    copia.sort((a, b) => {
      let aValue: any = (a as any)[ordenarPor];
      let bValue: any = (b as any)[ordenarPor];

      if (
        ordenarPor === "nome" ||
        ordenarPor === "email" ||
        ordenarPor === "regiao" ||
        ordenarPor === "tipoContrato"
      ) {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      } else if (ordenarPor === "ativo") {
        // Boolean para ordenação (ativos primeiro)
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      if (aValue < bValue) return direcaoOrdenacao === "asc" ? -1 : 1;
      if (aValue > bValue) return direcaoOrdenacao === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [direcaoOrdenacao, listaFiltrada, ordenarPor]);

  // Funcionalidade de exportação
  const handleExportExcel = useCallback(async () => {
    setLoadingExport(true);
    try {
      const exportService = new VendedoresTableExportService();

      const filtros: TableExportFilters = {
        termoBusca,
        filtroUnidadeNegocio,
        filtroAtivo:
          filtroAtivo === "todos" ? undefined : filtroAtivo.toString(),
        filtroCidade,
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
    filtroUnidadeNegocio,
    filtroAtivo,
    filtroCidade,
    ordenarPor,
    direcaoOrdenacao,
    showNotification,
  ]);

  const vendedoresPaginados = useMemo(() => {
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
    loadingInativacao,
    loadingAtivacao,
    vendedoresPaginados,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    filtroUnidadeNegocio,
    setFiltroUnidadeNegocio,
    filtroAtivo,
    setFiltroAtivo,
    filtroCidade,
    setFiltroCidade,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    mostrarModal,
    editando,
    valores,
    setValores,
    erros,
    setMostrarModal,
    mostrarModalInativacao,
    vendedorParaInativar,
    mostrarModalAtivacao,
    vendedorParaAtivar,
    abrirCriacao,
    editarVendedor,
    inativarVendedor,
    confirmarInativacao,
    cancelarInativacao,
    ativarVendedor,
    confirmarAtivacao,
    cancelarAtivacao,
    confirmar,
    carregar,
    handleExportExcel,
  };
}
