import { useCallback, useMemo, useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { funcionariosService } from "../data/funcionariosService";
import type { Funcionario, FuncionarioInput } from "../types";
import { validateCPF, validateCelular, validateEmail } from "utils/masks";

export type OrdenacaoCampo =
  | "nome"
  | "cpf"
  | "cnh"
  | "status"
  | "tipoContrato"
  | "dataCriacao"
  | "dataAtualizacao";
export type DirecaoOrdenacao = "asc" | "desc";

export function useFuncionarios() {
  const { showNotification } = useNotification();

  const [lista, setLista] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | Funcionario["status"]
  >("todos");
  const [filtroContrato, setFiltroContrato] = useState<
    "todos" | Funcionario["tipoContrato"]
  >("todos");
  const [filtroFuncao, setFiltroFuncao] = useState<
    "todos" | NonNullable<Funcionario["funcao"]>
  >("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoCampo>("dataCriacao");
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>("desc");
  const [valores, setValores] = useState<FuncionarioInput>({
    nome: "",
    cpf: "",
    cnh: "",
    cnhVencimento: "",
    cnhCategoria: "",
    celular: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    funcao: "motorista",
    toxicoUltimoExame: "",
    toxicoVencimento: "",
    status: "disponivel",
    tipoContrato: "integral",
    unidadeNegocio: "frigorifico",
    dataAdmissao: "",
    salario: "",
    observacao: "",
  });

  const itensPorPagina = 15;

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await funcionariosService.listar();
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      showNotification("Erro ao carregar funcionários", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const validar = useCallback((input: FuncionarioInput) => {
    const novosErros: Partial<Record<keyof FuncionarioInput, string>> = {};
    if (!input.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!input.cpf.trim()) novosErros.cpf = "CPF é obrigatório";
    if (!input.cnh.trim()) novosErros.cnh = "CNH é obrigatório";
    if (!input.celular.trim()) novosErros.celular = "Celular é obrigatório";
    if (!input.endereco.trim()) novosErros.endereco = "Endereço é obrigatório";
    if (input.cep && input.cep.replace(/\D/g, "").length !== 8)
      novosErros.cep = "CEP inválido";
    if (!input.cidade.trim()) novosErros.cidade = "Cidade é obrigatório";
    if (input.cpf && !validateCPF(input.cpf)) novosErros.cpf = "CPF inválido";
    if (input.email && !validateEmail(input.email))
      novosErros.email = "Email inválido";
    if (input.celular && !validateCelular(input.celular))
      novosErros.celular = "Celular deve ter DDD e começar com 9";
    return Object.keys(novosErros).length === 0;
  }, []);

  const confirmar = useCallback(async () => {
    if (!validar(valores)) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }
    try {
      const payload: FuncionarioInput = {
        ...valores,
        nome: valores.nome.toUpperCase(),
        cpf: valores.cpf.replace(/\D/g, ""),
        celular: valores.celular.replace(/\D/g, ""),
        cep: valores.cep?.replace(/\D/g, ""),
      };
      if (editando) {
        await funcionariosService.atualizar(editando.id, payload);
        showNotification("Funcionário atualizado com sucesso!", "success");
      } else {
        await funcionariosService.criar(payload);
        showNotification("Funcionário cadastrado com sucesso!", "success");
      }
      setMostrarModal(false);
      setEditando(null);
      setValores({
        nome: "",
        cpf: "",
        cnh: "",
        cnhVencimento: "",
        cnhCategoria: "",
        celular: "",
        email: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        cidade: "",
        funcao: "motorista",
        toxicoUltimoExame: "",
        toxicoVencimento: "",
        status: "disponivel",
        tipoContrato: "integral",
        unidadeNegocio: "frigorifico",
        dataAdmissao: "",
        salario: "",
        observacao: "",
      });
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      showNotification("Erro ao salvar funcionário", "error");
    }
  }, [carregar, editando, showNotification, validar, valores]);

  const abrirCriacao = useCallback(() => {
    setEditando(null);
    setValores({
      nome: "",
      cpf: "",
      cnh: "",
      cnhVencimento: "",
      cnhCategoria: "",
      celular: "",
      email: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      funcao: "motorista",
      toxicoUltimoExame: "",
      toxicoVencimento: "",
      status: "disponivel",
      tipoContrato: "integral",
      unidadeNegocio: "frigorifico",
      dataAdmissao: "",
      salario: "",
      observacao: "",
    });
    setMostrarModal(true);
  }, []);

  const editarFuncionario = useCallback((f: Funcionario) => {
    setEditando(f);
    setValores({
      nome: f.nome || "",
      cpf: f.cpf || "",
      cnh: f.cnh || "",
      cnhVencimento: (f as any).cnhVencimento || "",
      cnhCategoria: (f as any).cnhCategoria || "",
      celular: f.celular || (f as any).telefone || "",
      email: f.email || "",
      cep: (f as any).cep || "",
      endereco: f.endereco || "",
      numero: (f as any).numero || "",
      complemento: (f as any).complemento || "",
      cidade: f.cidade || "",
      funcao: (f as any).funcao || "motorista",
      toxicoUltimoExame: (f as any).toxicoUltimoExame || "",
      toxicoVencimento: (f as any).toxicoVencimento || "",
      status: (f.status as any) || "disponivel",
      tipoContrato: (f.tipoContrato as any) || "integral",
      unidadeNegocio: (f.unidadeNegocio as any) || "frigorifico",
      dataAdmissao: f.dataAdmissao || "",
      salario: f.salario ? String(f.salario) : "",
      observacao: f.observacao || "",
    });
    setMostrarModal(true);
  }, []);

  const excluirFuncionario = useCallback(
    async (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
        try {
          await funcionariosService.excluir(id);
          showNotification("Funcionário excluído com sucesso!", "success");
          await carregar();
        } catch (error) {
          console.error("Erro ao excluir funcionário:", error);
          showNotification("Erro ao excluir funcionário", "error");
        }
      }
    },
    [carregar, showNotification]
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
    [direcaoOrdenacao, ordenarPor]
  );

  const listaFiltrada = useMemo(() => {
    const termo = termoBusca.toLowerCase();
    return lista.filter((f) => {
      const matchesSearch =
        f.nome?.toLowerCase().includes(termo) ||
        f.cpf?.includes(termo) ||
        f.cnh?.includes(termo) ||
        f.cidade?.toLowerCase().includes(termo);
      const matchesStatus =
        filtroStatus === "todos" || f.status === filtroStatus;
      const matchesContrato =
        filtroContrato === "todos" || f.tipoContrato === filtroContrato;
      const matchesFuncao =
        filtroFuncao === "todos" || (f.funcao || "motorista") === filtroFuncao;
      return matchesSearch && matchesStatus && matchesContrato && matchesFuncao;
    });
  }, [filtroContrato, filtroFuncao, filtroStatus, lista, termoBusca]);

  const listaOrdenada = useMemo(() => {
    const copia = [...listaFiltrada];
    copia.sort((a, b) => {
      let aValue: any = (a as any)[ordenarPor];
      let bValue: any = (b as any)[ordenarPor];
      if (ordenarPor === "nome") {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }
      if (aValue < bValue) return direcaoOrdenacao === "asc" ? -1 : 1;
      if (aValue > bValue) return direcaoOrdenacao === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [direcaoOrdenacao, listaFiltrada, ordenarPor]);

  const funcionariosPaginados = useMemo(() => {
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
    funcionariosPaginados,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    filtroStatus,
    setFiltroStatus,
    filtroContrato,
    setFiltroContrato,
    filtroFuncao,
    setFiltroFuncao,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    mostrarModal,
    editando,
    valores,
    setValores,
    setMostrarModal,
    abrirCriacao,
    editarFuncionario,
    excluirFuncionario,
    confirmar,
    carregar,
  };
}
