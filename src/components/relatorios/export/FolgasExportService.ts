import { BaseExportService, type ExportConfig } from "./BaseExportService";

export class FolgasExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Folgas",
    campos: [
      "funcionario",
      "dataInicio",
      "dataFim",
      "tipoFolga",
      "status",
      "motivo",
      "observacao",
    ],
    formatacao: {
      dataInicio: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      dataFim: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      tipoFolga: (valor) => {
        const tipoMap: Record<string, string> = {
          ferias: "Férias",
          folga: "Folga",
          licenca: "Licença",
          banco_horas: "Banco de Horas",
          compensacao: "Compensação",
        };
        return tipoMap[valor] || valor;
      },
      status: (valor) => {
        const statusMap: Record<string, string> = {
          pendente: "Pendente",
          aprovada: "Aprovada",
          rejeitada: "Rejeitada",
          cancelada: "Cancelada",
        };
        return statusMap[valor] || valor;
      },
    },
    ordenacao: ["funcionario", "dataInicio", "status"],
  };
}
