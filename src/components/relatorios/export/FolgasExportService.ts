import { BaseExportService, type ExportConfig } from "./BaseExportService";

export class FolgasExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Folgas",
    campos: ["funcionarioNome", "dataInicio", "dataFim", "tipo", "status"],
    formatacao: {
      funcionarioNome: (valor) => {
        if (!valor) return "N/A";
        return valor;
      },
      dataInicio: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      dataFim: (valor) => {
        if (!valor) return "";
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
          ferias: "Férias",
          folga: "Folga",
          licenca: "Licença",
          banco_horas: "Banco de Horas",
          compensacao: "Compensação",
          atestado: "Atestado Médico",
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
    },
    ordenacao: ["funcionarioNome", "dataInicio", "status"],
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
      funcionarioNome: "Funcionário",
      dataInicio: "Início",
      dataFim: "Fim",
      tipo: "Folga",
      status: "Status",
    };

    return this.config.campos.map((campo) => headerMap[campo] || campo);
  }

  // Método para ajustar os cabeçalhos da tabela de resumo
  protected getResumoHeaders(): string[] {
    return ["Status", "Quantidade", "Percentual"];
  }
}
