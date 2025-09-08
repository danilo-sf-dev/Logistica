import {
  BaseTableExportService,
  type TableExportConfig,
} from "../../relatorios/export/BaseTableExportService";
import { cidadesService } from "../../cidades/data/cidadesService";
import { REGIOES_BRASIL } from "../../../utils/constants";
import { DateService } from "../../../services/DateService";

export class RotasTableExportService extends BaseTableExportService {
  protected config: TableExportConfig = {
    titulo: "Rotas",
    campos: ["nome", "pesoMinimo", "diaSemana", "cidades", "dataCriacao"],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      pesoMinimo: (valor) => {
        if (!valor) return "N/A";
        return `${valor} kg`;
      },
      diaSemana: (valor) => {
        if (!valor || !Array.isArray(valor) || valor.length === 0) {
          return "Nenhum dia definido";
        }

        // Se contém "Qualquer dia da semana", retorna apenas isso
        if (valor.includes("Qualquer dia da semana")) {
          return "Qualquer dia da semana";
        }

        const diasMap: Record<string, string> = {
          domingo: "Domingo",
          segunda: "Segunda-feira",
          terca: "Terça-feira",
          quarta: "Quarta-feira",
          quinta: "Quinta-feira",
          sexta: "Sexta-feira",
          sabado: "Sábado",
        };

        const diasTraduzidos = valor.map((dia) => diasMap[dia] || dia);
        return diasTraduzidos.join(", ");
      },
      cidades: async (valor) => {
        if (!valor || !Array.isArray(valor) || valor.length === 0) {
          return "Nenhuma cidade vinculada";
        }

        try {
          // Buscar todas as cidades para mapear IDs para nomes
          const todasCidades = await cidadesService.listar();
          const nomesCidades = valor.map((id) => {
            const cidade = todasCidades.find((c) => c.id === id);
            if (!cidade) return id; // Se não encontrar, retorna o ID

            const regiaoNome = cidade.regiao
              ? REGIOES_BRASIL.find((r) => r.valor === cidade.regiao)?.nome
              : null;

            return regiaoNome
              ? `${cidade.nome} - ${cidade.estado} (${regiaoNome})`
              : `${cidade.nome} - ${cidade.estado}`;
          });

          return nomesCidades.join(", ");
        } catch (error) {
          console.error("Erro ao buscar nomes das cidades:", error);
          return valor.join(", "); // Fallback para IDs se der erro
        }
      },
      dataCriacao: (valor) => {
        if (!valor) return "N/A";
        // ✅ FORMATAÇÃO COMPONENTIZADA DE DATA
        return DateService.formatForDisplay(valor);
      },
    },
  };
}
