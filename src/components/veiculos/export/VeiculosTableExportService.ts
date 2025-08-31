import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";

export class VeiculosTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Veículos",
    campos: [
      "placa",
      "marca",
      "modelo",
      "ano",
      "capacidade",
      "tipoCarroceria",
      "tipoBau",
      "quantidadeEixos",
      "status",
      "unidadeNegocio",
      "ultimaManutencao",
      "proximaManutencao",
      "observacao",
      "dataCriacao",
    ],
    formatacao: {
      placa: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      marca: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      modelo: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      ano: (valor) => {
        if (!valor) return "N/A";
        return valor.toString();
      },
      capacidade: (valor) => {
        if (!valor) return "N/A";
        return `${valor} kg`;
      },
      tipoCarroceria: (valor) => {
        if (!valor) return "N/A";
        const tiposMap: Record<string, string> = {
          truck: "Truck",
          toco: "Toco",
          bitruck: "Bitruck",
          carreta: "Carreta",
          carreta_ls: "Carreta LS",
          carreta_3_eixos: "Carreta 3 Eixos",
          truck_3_eixos: "Truck 3 Eixos",
          truck_4_eixos: "Truck 4 Eixos",
        };
        return tiposMap[valor] || valor;
      },
      quantidadeEixos: (valor) => {
        if (!valor) return "N/A";
        return `${valor} eixos`;
      },
      tipoBau: (valor) => {
        if (!valor) return "N/A";
        const tiposMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          carga_seca: "Carga Seca",
          baucher: "Baucher",
          graneleiro: "Graneleiro",
          tanque: "Tanque",
          caçamba: "Caçamba",
          plataforma: "Plataforma",
        };
        return tiposMap[valor] || valor;
      },
      status: (valor) => {
        if (!valor) return "N/A";
        const statusMap: Record<string, string> = {
          disponivel: "Disponível",
          em_uso: "Em Uso",
          manutencao: "Manutenção",
          inativo: "Inativo",
          acidentado: "Acidentado",
        };
        return statusMap[valor] || valor;
      },
      unidadeNegocio: (valor) => {
        if (!valor) return "N/A";
        const unidadesMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          ovos: "Ovos",
          ambos: "Ambos",
        };
        return unidadesMap[valor] || valor;
      },
      ultimaManutencao: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      proximaManutencao: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
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
