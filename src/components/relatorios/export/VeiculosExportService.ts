import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { formatPeso } from "../../../utils/masks";

export class VeiculosExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Veículos",
    campos: [
      "placa",
      "marca",
      "modelo",
      "ano",
      "cor",
      "capacidade",
      "status",
      "tipoVeiculo",
      "ultimaManutencao",
      "proximaManutencao",
      "observacao",
    ],
    formatacao: {
      placa: (valor) => (valor ? valor.toUpperCase() : ""),
      capacidade: (valor) => {
        if (!valor) return "";
        return formatPeso(valor);
      },
      ultimaManutencao: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      proximaManutencao: (valor) => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      status: (valor) => {
        const statusMap: Record<string, string> = {
          ativo: "Ativo",
          inativo: "Inativo",
          manutencao: "Manutenção",
          acidente: "Acidente",
        };
        return statusMap[valor] || valor;
      },
      tipoVeiculo: (valor) => {
        const tipoMap: Record<string, string> = {
          caminhao: "Caminhão",
          van: "Van",
          carro: "Carro",
          moto: "Moto",
        };
        return tipoMap[valor] || valor;
      },
    },
    ordenacao: ["placa", "status", "marca"],
  };
}
