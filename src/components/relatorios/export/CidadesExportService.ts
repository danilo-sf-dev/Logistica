import { BaseExportService, type ExportConfig } from "./BaseExportService";

export class CidadesExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Cidades",
    campos: ["nome", "estado", "regiao", "populacao", "status", "observacao"],
    formatacao: {
      populacao: (valor) => {
        if (!valor) return "";
        return valor.toLocaleString("pt-BR");
      },
      status: (valor) => {
        const statusMap: Record<string, string> = {
          ativo: "Ativo",
          inativo: "Inativo",
        };
        return statusMap[valor] || valor;
      },
    },
    ordenacao: ["nome", "estado", "regiao"],
  };
}
