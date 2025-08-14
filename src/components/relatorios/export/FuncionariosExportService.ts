import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { formatCPF, formatCelular } from "../../../utils/masks";

export class FuncionariosExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Funcionários",
    campos: [
      "nome",
      "cpf",
      "cnh",
      "cnhVencimento",
      "cnhCategoria",
      "celular",
      "email",
      "cidade",
      "status",
      "tipoContrato",
      "unidadeNegocio",
      "dataAdmissao",
      "funcao",
      "toxicoUltimoExame",
      "toxicoVencimento",
      "observacao",
    ],
    formatacao: {
      cpf: (valor) => (valor ? formatCPF(valor) : ""),
      cnh: (valor) => (valor ? valor.toUpperCase() : ""),
      celular: (valor) => (valor ? formatCelular(valor) : ""),
      cnhVencimento: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      toxicoUltimoExame: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      toxicoVencimento: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      dataAdmissao: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      status: (valor) => {
        const statusMap: Record<string, string> = {
          trabalhando: "Trabalhando",
          disponivel: "Disponível",
          folga: "Folga",
          ferias: "Férias",
          licenca: "Licença",
          inativo: "Inativo",
        };
        return statusMap[valor] || valor;
      },
      tipoContrato: (valor) => {
        const contratoMap: Record<string, string> = {
          clt: "CLT",
          pj: "PJ",
          temporario: "Temporário",
          estagiario: "Estagiário",
        };
        return contratoMap[valor] || valor;
      },
      unidadeNegocio: (valor) => {
        const unidadeMap: Record<string, string> = {
          logistica: "Logística",
          vendas: "Vendas",
          administrativo: "Administrativo",
          ti: "TI",
        };
        return unidadeMap[valor] || valor;
      },
      funcao: (valor) => {
        const funcaoMap: Record<string, string> = {
          motorista: "Motorista",
          auxiliar: "Auxiliar",
          supervisor: "Supervisor",
          gerente: "Gerente",
          vendedor: "Vendedor",
        };
        return funcaoMap[valor] || valor;
      },
    },
    ordenacao: ["nome", "status", "cidade"],
  };
}
