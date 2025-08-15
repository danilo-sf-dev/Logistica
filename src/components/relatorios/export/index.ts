import { BaseExportService } from "./BaseExportService";
import { FuncionariosExportService } from "./FuncionariosExportService";
import { VeiculosExportService } from "./VeiculosExportService";
import { RotasExportService } from "./RotasExportService";
import { FolgasExportService } from "./FolgasExportService";
import { CidadesExportService } from "./CidadesExportService";
import { VendedoresExportService } from "./VendedoresExportService";

export {
  BaseExportService,
  type ExportConfig,
  type ExportData,
} from "./BaseExportService";
export { FuncionariosExportService } from "./FuncionariosExportService";
export { VeiculosExportService } from "./VeiculosExportService";
export { RotasExportService } from "./RotasExportService";
export { FolgasExportService } from "./FolgasExportService";
export { CidadesExportService } from "./CidadesExportService";
export { VendedoresExportService } from "./VendedoresExportService";

// Factory para criar o serviço correto baseado no tipo
export class ExportServiceFactory {
  static createService(tipo: string): BaseExportService {
    switch (tipo.toLowerCase()) {
      case "funcionarios":
      case "funcionarios_detalhado":
      case "motoristas":
      case "motoristas_detalhado":
      case "status_dos_funcionários":
      case "status_dos_funcionarios":
      case "status_dos_motoristas":
        return new FuncionariosExportService();

      case "veiculos":
      case "veiculos_detalhado":
      case "status_dos_veículos":
      case "status_dos_veiculos":
        return new VeiculosExportService();

      case "rotas":
      case "rotas_detalhado":
      case "status_das_rotas":
        return new RotasExportService();

      case "folgas":
      case "folgas_detalhado":
      case "status_das_folgas":
        return new FolgasExportService();

      case "cidades":
      case "cidades_detalhado":
        return new CidadesExportService();

      case "vendedores":
      case "vendedores_detalhado":
        return new VendedoresExportService();

      default:
        throw new Error(`Tipo de relatório não suportado: ${tipo}`);
    }
  }
}
