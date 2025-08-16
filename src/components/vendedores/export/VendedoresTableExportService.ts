import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";
import { formatCPF, formatCelular } from "../../../utils/masks";
import { cidadesService } from "../../cidades/data/cidadesService";

export class VendedoresTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Vendedores",
    campos: [
      "nome",
      "cpf",
      "email",
      "celular",
      "regiao",
      "codigoVendSistema",
      "unidadeNegocio",
      "tipoContrato",
      "ativo",
      "cidadesAtendidas",
      "dataCriacao",
    ],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      cpf: (valor) => (valor ? formatCPF(valor) : "N/A"),
      email: (valor) => (valor ? valor.toLowerCase() : "N/A"),
      celular: (valor) => (valor ? formatCelular(valor) : "N/A"),
      regiao: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      codigoVendSistema: (valor) => (valor ? valor : "N/A"),
      unidadeNegocio: (valor) => {
        if (!valor) return "N/A";
        const unidadeMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          transportadora: "Transportadora",
          comercio: "Comércio",
          industria: "Indústria",
          servicos: "Serviços",
        };
        return unidadeMap[valor] || valor;
      },
      tipoContrato: (valor) => {
        if (!valor) return "N/A";
        const contratoMap: Record<string, string> = {
          clt: "CLT",
          pj: "PJ",
          comissionado: "Comissionado",
          terceirizado: "Terceirizado",
        };
        return contratoMap[valor] || valor;
      },
      ativo: (valor) => {
        if (valor === true) return "Sim";
        if (valor === false) return "Não";
        return "N/A";
      },
      cidadesAtendidas: async (valor) => {
        if (!valor || !Array.isArray(valor) || valor.length === 0) {
          return "Nenhuma cidade";
        }

        try {
          // Buscar todas as cidades para mapear IDs para nomes
          const todasCidades = await cidadesService.listar();
          const nomesCidades = valor.map((id) => {
            const cidade = todasCidades.find((c) => c.id === id);
            return cidade ? cidade.nome : id; // Se não encontrar, retorna o ID
          });

          return nomesCidades.join(", ");
        } catch (error) {
          console.error("Erro ao buscar nomes das cidades:", error);
          return valor.join(", "); // Fallback para IDs se der erro
        }
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
