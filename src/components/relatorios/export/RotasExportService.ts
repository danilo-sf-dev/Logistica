import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { formatDistancia } from "../../../utils/masks";

export class RotasExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Rotas",
    campos: [
      "nome",
      "origem",
      "destino",
      "distancia",
      "tempoEstimado",
      "status",
      "motorista",
      "veiculo",
      "dataInicio",
      "dataFim",
      "observacao",
    ],
    formatacao: {
      distancia: (valor) => {
        if (!valor) return "";
        return formatDistancia(valor);
      },
      tempoEstimado: (valor) => {
        if (!valor) return "";
        return `${valor} min`;
      },
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
      status: (valor) => {
        const statusMap: Record<string, string> = {
          planejada: "Planejada",
          em_andamento: "Em Andamento",
          concluida: "Concluída",
          cancelada: "Cancelada",
          atrasada: "Atrasada",
        };
        return statusMap[valor] || valor;
      },
    },
    ordenacao: ["nome", "status", "dataInicio"],
  };
}
