import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";
import { DateService } from "../../../services/DateService";

export class FolgasTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Folgas",
    campos: [
      "funcionarioNome",
      "dataInicio",
      "dataFim",
      "tipo",
      "status",
      "observacoes",
      "motivo",
      "documento",
      "horas",
      "dataCriacao",
    ],
    formatacao: {
      funcionarioNome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      dataInicio: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      dataFim: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
      tipo: (valor) => {
        if (!valor) return "N/A";
        const tipoMap: Record<string, string> = {
          folga: "Folga",
          ferias: "Férias",
          licenca: "Licença Médica",
          atestado: "Atestado Médico",
          banco_horas: "Banco de Horas",
          compensacao: "Compensação de Horas",
          suspensao: "Suspensão Disciplinar",
          afastamento: "Afastamento por Acidente",
          maternidade: "Licença Maternidade",
          paternidade: "Licença Paternidade",
          luto: "Licença por Luto",
          casamento: "Licença para Casamento",
          doacao_sangue: "Licença para Doação de Sangue",
          servico_militar: "Licença para Serviço Militar",
          capacitacao: "Licença para Capacitação",
          outros: "Outros",
        };
        return tipoMap[valor] || valor;
      },
      status: (valor) => {
        if (!valor) return "N/A";
        const statusMap: Record<string, string> = {
          pendente: "Pendente",
          aprovada: "Aprovada",
          rejeitada: "Rejeitada",
          cancelada: "Cancelada",
        };
        return statusMap[valor] || valor;
      },
      observacoes: (valor) => (valor ? valor : "N/A"),
      motivo: (valor) => (valor ? valor : "N/A"),
      documento: (valor) => (valor ? valor : "N/A"),
      horas: (valor) => {
        if (valor === null || valor === undefined) return "N/A";
        return `${valor}h`;
      },
      dataCriacao: (valor) => {
        if (!valor) return "N/A";
        return DateService.formatForDisplay(valor);
      },
    },
  };
}
