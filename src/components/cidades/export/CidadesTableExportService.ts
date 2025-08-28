import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";
import { REGIOES_BRASIL } from "../../../utils/constants";

export class CidadesTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Cidades",
    campos: [
      "nome",
      "estado",
      "regiao",
      "distancia",
      "pesoMinimo",
      "observacao",
      "dataCriacao",
    ],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      estado: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      regiao: (valor) => {
        if (!valor) return "N/A";
        const regiaoNome = REGIOES_BRASIL.find((r) => r.valor === valor)?.nome;
        return regiaoNome || valor.toUpperCase();
      },
      distancia: (valor) => {
        if (!valor) return "N/A";
        return `${valor} km`;
      },
      pesoMinimo: (valor) => {
        if (!valor) return "N/A";
        return `${valor} kg`;
      },
      observacao: (valor) => (valor ? valor : "N/A"),
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
