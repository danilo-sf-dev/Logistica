import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { formatCPF, formatCelular } from "../../../utils/masks";

export class VendedoresExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Vendedores",
    campos: [
      "nome",
      "cpf",
      "codigoVendedor",
      "email",
      "telefone",
      "estado",
      "regiao",
      "cidades",
      "status",
      "observacao",
    ],
    formatacao: {
      cpf: (valor) => (valor ? formatCPF(valor) : ""),
      telefone: (valor) => (valor ? formatCelular(valor) : ""),
      cidades: (valor) => {
        if (!valor) return "";
        if (Array.isArray(valor)) {
          return valor.join(", ");
        }
        return valor;
      },
      status: (valor) => {
        const statusMap: Record<string, string> = {
          ativo: "Ativo",
          inativo: "Inativo",
          ferias: "Férias",
          licenca: "Licença",
        };
        return statusMap[valor] || valor;
      },
    },
    ordenacao: ["nome", "estado", "regiao"],
  };
}
