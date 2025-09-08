import { BaseExportService, type ExportConfig } from "./BaseExportService";

export class RotasExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Rotas",
    campos: ["nome", "pesoMinimo", "diaSemana", "cidades", "dataCriacao"],
    formatacao: {
      pesoMinimo: (valor) => {
        if (!valor || valor === 0) return "Não definido";
        return `${valor} kg`;
      },
      diaSemana: (valor) => {
        if (!valor) return "N/A";
        if (Array.isArray(valor)) {
          // Se contém "Qualquer dia da semana", retorna apenas isso
          if (valor.includes("Qualquer dia da semana")) {
            return "Qualquer dia da semana";
          }
          return valor.join(", ");
        }
        return valor;
      },
      cidades: (valor) => {
        if (!valor || !Array.isArray(valor) || valor.length === 0) {
          return "0 cidades";
        }
        return `${valor.length} cidade${valor.length !== 1 ? "s" : ""}`;
      },
      dataCriacao: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
    },
    ordenacao: ["nome", "dataCriacao"],
  };

  protected getFilteredData(dados: any[]): any[] {
    return dados.map((item) => {
      const filteredItem: any = {};
      this.config.campos.forEach((campo) => {
        if (item.hasOwnProperty(campo)) {
          filteredItem[campo] = this.formatValue(campo, item[campo]);
        } else {
          filteredItem[campo] = "N/A";
        }
      });
      return filteredItem;
    });
  }

  protected getColumnHeaders(): string[] {
    const headerMap: Record<string, string> = {
      nome: "Nome da Rota",
      pesoMinimo: "Peso Mínimo",
      diaSemana: "Dias da Semana",
      cidades: "Cidades Vinculadas",
      dataCriacao: "Data de Criação",
    };

    return this.config.campos.map((campo) => headerMap[campo] || campo);
  }

  // Método para ajustar os cabeçalhos da tabela de resumo
  protected getResumoHeaders(): string[] {
    return ["Dia da Semana", "Quantidade", "Percentual"];
  }
}
