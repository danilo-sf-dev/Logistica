import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";
import { formatCPF, formatCelular } from "../../../utils/masks";
import { DateService } from "../../../services/DateService";
import { MoneyService } from "../../../services/MoneyService";

export class FuncionariosTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Funcionários",
    campos: [
      "nome",
      "cpf",
      "cnh",
      "cnhVencimento",
      "cnhCategoria",
      "celular",
      "email",
      "endereco",
      "cep",
      "cidade",
      "funcao",
      "status",
      "tipoContrato",
      "unidadeNegocio",
      "dataAdmissao",
      "salario",
      "toxicoUltimoExame",
      "toxicoVencimento",
      "observacao",
      "ativo",
      "dataCriacao",
    ],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      cpf: (valor) => (valor ? formatCPF(valor) : "N/A"),
      cnh: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      cnhVencimento: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      cnhCategoria: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      celular: (valor) => (valor ? formatCelular(valor) : "N/A"),
      email: (valor) => (valor ? valor.toLowerCase() : "N/A"),
      endereco: (valor) => (valor ? valor : "N/A"),
      cep: (valor) => (valor ? valor : "N/A"),
      cidade: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      funcao: (valor) => {
        if (!valor) return "N/A";
        const funcaoMap: Record<string, string> = {
          motorista: "Motorista",
          ajudante: "Ajudante",
          outro: "Outro",
        };
        return funcaoMap[valor] || valor;
      },
      status: (valor) => {
        if (!valor) return "N/A";
        const statusMap: Record<string, string> = {
          trabalhando: "Trabalhando",
          disponivel: "Disponível",
          folga: "Folga",
          ferias: "Férias",
        };
        return statusMap[valor] || valor;
      },
      tipoContrato: (valor) => {
        if (!valor) return "N/A";
        const contratoMap: Record<string, string> = {
          integral: "Integral",
          temporario: "Temporário",
          folguista: "Folguista",
          inativo: "Inativo",
        };
        return contratoMap[valor] || valor;
      },
      unidadeNegocio: (valor) => {
        if (!valor) return "N/A";
        const unidadeMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          ovos: "Ovos",
          ambos: "Ambos",
        };
        return unidadeMap[valor] || valor;
      },
      dataAdmissao: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      salario: (valor) => {
        if (!valor) return "N/A";
        return MoneyService.formatForExport(valor);
      },
      toxicoUltimoExame: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      toxicoVencimento: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      observacao: (valor) => (valor ? valor : "N/A"),
      ativo: (valor) => {
        if (valor === true) return "Sim";
        if (valor === false) return "Não";
        return "N/A";
      },
      dataCriacao: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
    },
  };
}
