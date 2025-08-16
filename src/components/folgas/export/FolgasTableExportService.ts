import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";

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
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      dataFim: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      tipo: (valor) => {
        if (!valor) return "N/A";
        const tipoMap: Record<string, string> = {
          folga: "Folga",
          ferias: "Férias",
          banco_horas: "Banco de Horas",
          compensacao: "Compensação",
          atestado: "Atestado",
          licenca: "Licença",
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
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
    },
  };
}
