import { VeiculosService } from "../../veiculos/data/veiculosService";
import { BaseImportService } from "./importService";
import type {
  ImportConfig,
  ImportResult,
  ValidationResult,
} from "../types/importTypes";
import type { VeiculoFormData } from "../../veiculos/types";
import { TipoCarroceria, StatusVeiculo, UnidadeNegocio } from "../../../types";
import { DateService } from "../../../services/DateService";

/**
 * Serviço de Importação de Veículos via Excel
 * Implementa correção +1 dia para objetos Date do Excel
 */
export class VeiculosImportService extends BaseImportService {
  protected config: ImportConfig = {
    entityType: "veiculos",
    requiredFields: [
      "placa",
      "marca",
      "capacidade",
      "tipoCarroceria",
      "quantidadeEixos",
      "tipoBau",
      "status",
      "unidadeNegocio",
    ],
    optionalFields: [
      "modelo",
      "ano",
      "ultimaManutencao",
      "proximaManutencao",
      "observacao",
    ],
    validationRules: [
      { field: "placa", rule: "required", message: "Placa é obrigatória" },
      { field: "marca", rule: "required", message: "Marca é obrigatória" },
      {
        field: "capacidade",
        rule: "required",
        message: "Capacidade é obrigatória",
      },
      {
        field: "tipoCarroceria",
        rule: "required",
        message: "Tipo de carroceria é obrigatório",
      },
      {
        field: "quantidadeEixos",
        rule: "required",
        message: "Quantidade de eixos é obrigatória",
      },
      {
        field: "tipoBau",
        rule: "required",
        message: "Tipo de baú é obrigatório",
      },
      { field: "status", rule: "required", message: "Status é obrigatório" },
      {
        field: "unidadeNegocio",
        rule: "required",
        message: "Unidade de negócio é obrigatória",
      },
      { field: "placa", rule: "unique", message: "Placa já cadastrada" },
      {
        field: "capacidade",
        rule: "number",
        message: "Capacidade deve ser um número",
      },
      {
        field: "quantidadeEixos",
        rule: "number",
        message: "Quantidade de eixos deve ser um número",
      },
    ],
    transformations: [
      { field: "placa", transform: "uppercase" },
      { field: "modelo", transform: "uppercase" },
      { field: "marca", transform: "uppercase" },
      { field: "observacao", transform: "uppercase" },
      { field: "capacidade", transform: "cleanNumeric" },
      { field: "quantidadeEixos", transform: "cleanNumeric" },
    ],
    templateConfig: {
      headers: [
        "Placa*",
        "Modelo",
        "Marca*",
        "Ano",
        "Capacidade*",
        "Tipo Carroceria*",
        "Tipo Baú*",
        "Quantidade Eixos*",
        "Status*",
        "Unidade Negócio*",
        "Última Manutenção",
        "Próxima Manutenção",
        "Observação",
      ],
      exampleData: [
        [
          "ABC1234",
          "FH 460",
          "VOLVO",
          "2020",
          "25000",
          "Truck",
          "Frigorífico",
          "3",
          "Disponível",
          "Frigorífico",
          "2024-01-15",
          "2024-04-15",
          "Veículo em excelente estado",
        ],
        [
          "XYZ5678",
          "Actros 2651",
          "MERCEDES-BENZ",
          "2021",
          "30000",
          "Carreta",
          "Frigorífico",
          "6",
          "Disponível",
          "Ovos",
          "2024-02-20",
          "2024-05-20",
          "Veículo para transporte de ovos",
        ],
      ],
      instructions: [
        "Placa: Placa do veículo (será convertida para maiúsculas)",
        "Modelo: Modelo do veículo (opcional, será convertido para maiúsculas)",
        "Marca: Marca do veículo (será convertida para maiúsculas)",
        "Ano: Ano de fabricação (opcional)",
        "Capacidade: Capacidade em kg (deve ser número)",
        "Tipo Carroceria: Truck, Toco, Bitruck, Carreta, Carreta LS, Carreta 3 Eixos, Truck 3 Eixos, Truck 4 Eixos",
        "Tipo Baú: Frigorífico, Carga Seca, Baucher, Graneleiro, Tanque, Caçamba, Plataforma",
        "Quantidade Eixos: 2, 3, 4, 5, 6, 7, 8, 9 (apenas o número)",
        "Status: Disponível, Em Uso, Manutenção, Inativo",
        "Unidade Negócio: Frigorífico, Ovos, Ambos",
        "Última Manutenção: Data nos formatos DD/MM/AAAA, DD/MM/AA ou YYYY-MM-DD (opcional)",
        "Próxima Manutenção: Data nos formatos DD/MM/AAAA, DD/MM/AA ou YYYY-MM-DD (opcional)",
        "Observação: Observações sobre o veículo (opcional, será convertida para maiúsculas)",
      ],
      validations: [
        "Placa deve ser única no sistema",
        "Capacidade e Quantidade Eixos devem ser números válidos",
        "Tipo Carroceria deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Status deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Unidade Negócio deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Tipo Baú deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Datas podem estar nos formatos DD/MM/AAAA, DD/MM/AA ou YYYY-MM-DD (se fornecidas)",
      ],
    },
  };

  // Mapeamento dos valores visíveis para os valores internos
  private static readonly TIPO_CARROCERIA_MAP: Record<string, TipoCarroceria> =
    {
      Truck: "truck",
      Toco: "toco",
      Bitruck: "bitruck",
      Carreta: "carreta",
      "Carreta LS": "carreta_ls",
      "Carreta 3 Eixos": "carreta_3_eixos",
      "Truck 3 Eixos": "truck_3_eixos",
      "Truck 4 Eixos": "truck_4_eixos",
    };

  private static readonly STATUS_MAP: Record<string, StatusVeiculo> = {
    Disponível: "disponivel",
    "Em Uso": "em_uso",
    Manutenção: "manutencao",
    Inativo: "inativo",
  };

  private static readonly UNIDADE_NEGOCIO_MAP: Record<string, UnidadeNegocio> =
    {
      Frigorífico: "frigorifico",
      Ovos: "ovos",
      Ambos: "ambos",
    };

  private static readonly TIPO_BAU_MAP: Record<string, string> = {
    Frigorífico: "frigorifico",
    "Carga Seca": "carga_seca",
    Baucher: "baucher",
    Graneleiro: "graneleiro",
    Tanque: "tanque",
    Caçamba: "caçamba",
    Plataforma: "plataforma",
  };

  private static readonly VALID_TIPOS_CARROCERIA_VISIVEIS = Object.keys(
    VeiculosImportService.TIPO_CARROCERIA_MAP,
  );
  private static readonly VALID_STATUS_VISIVEIS = Object.keys(
    VeiculosImportService.STATUS_MAP,
  );
  private static readonly VALID_UNIDADES_NEGOCIO_VISIVEIS = Object.keys(
    VeiculosImportService.UNIDADE_NEGOCIO_MAP,
  );
  private static readonly VALID_TIPOS_BAU_VISIVEIS = Object.keys(
    VeiculosImportService.TIPO_BAU_MAP,
  );

  protected async validateData(data: any[]): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    try {
      // Buscar veículos existentes para validação de unicidade
      const veiculosExistentes = await VeiculosService.getVeiculos();
      const placasExistentes = new Set(
        veiculosExistentes.map((veiculo) => veiculo.placa.toUpperCase()),
      );

      // Validar cada linha
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque a primeira linha é cabeçalho

        // Validação de campos obrigatórios
        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Placa",
            message: "Placa é obrigatória",
          });
        }

        if (!row[2]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Marca",
            message: "Marca é obrigatória",
          });
        }

        if (!row[4]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Capacidade",
            message: "Capacidade é obrigatória",
          });
        }

        if (!row[5]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Tipo Carroceria",
            message: "Tipo de carroceria é obrigatório",
          });
        }

        if (!row[6]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Tipo Baú",
            message: "Tipo de baú é obrigatório",
          });
        }

        if (!row[7]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Quantidade Eixos",
            message: "Quantidade de eixos é obrigatória",
          });
        }

        if (!row[8]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Status",
            message: "Status é obrigatório",
          });
        }

        if (!row[9]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Unidade Negócio",
            message: "Unidade de negócio é obrigatória",
          });
        }

        // Validação de unicidade da placa
        if (row[0]) {
          const placa = row[0].toString().toUpperCase().trim();
          if (placasExistentes.has(placa)) {
            errors.push({
              row: rowNumber,
              field: "Placa",
              message: `Placa "${placa}" já existe no sistema`,
            });
          }
          placasExistentes.add(placa);
        }

        // Validação de campos numéricos
        if (row[4] && (isNaN(Number(row[4])) || Number(row[4]) <= 0)) {
          errors.push({
            row: rowNumber,
            field: "Capacidade",
            message: "Capacidade deve ser um número válido maior que zero",
          });
        }

        if (row[7] && (isNaN(Number(row[7])) || Number(row[7]) <= 0)) {
          errors.push({
            row: rowNumber,
            field: "Quantidade Eixos",
            message:
              "Quantidade de eixos deve ser um número válido maior que zero",
          });
        }

        // Validação de tipo de carroceria
        if (
          row[5] &&
          !VeiculosImportService.VALID_TIPOS_CARROCERIA_VISIVEIS.includes(
            row[5].toString(),
          )
        ) {
          errors.push({
            row: rowNumber,
            field: "Tipo Carroceria",
            message: `Tipo de carroceria "${row[5]}" inválido. Opções válidas: ${VeiculosImportService.VALID_TIPOS_CARROCERIA_VISIVEIS.join(", ")}`,
          });
        }

        // Validação de tipo de baú
        if (
          row[6] &&
          !VeiculosImportService.VALID_TIPOS_BAU_VISIVEIS.includes(
            row[6].toString(),
          )
        ) {
          errors.push({
            row: rowNumber,
            field: "Tipo Baú",
            message: `Tipo de baú "${row[6]}" inválido. Opções válidas: ${VeiculosImportService.VALID_TIPOS_BAU_VISIVEIS.join(", ")}`,
          });
        }

        // Validação de status
        if (
          row[8] &&
          !VeiculosImportService.VALID_STATUS_VISIVEIS.includes(
            row[8].toString(),
          )
        ) {
          errors.push({
            row: rowNumber,
            field: "Status",
            message: `Status "${row[8]}" inválido. Opções válidas: ${VeiculosImportService.VALID_STATUS_VISIVEIS.join(", ")}`,
          });
        }

        // Validação de unidade de negócio
        if (
          row[9] &&
          !VeiculosImportService.VALID_UNIDADES_NEGOCIO_VISIVEIS.includes(
            row[9].toString(),
          )
        ) {
          errors.push({
            row: rowNumber,
            field: "Unidade Negócio",
            message: `Unidade de negócio "${row[9]}" inválida. Opções válidas: ${VeiculosImportService.VALID_UNIDADES_NEGOCIO_VISIVEIS.join(", ")}`,
          });
        }

        // Validação de formato de data (se fornecida)
        if (row[10] && !this.isValidDate(row[10].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Última Manutenção",
            message: `Data de última manutenção "${row[10]}" não está em formato válido (DD/MM/AAAA, DD/MM/AA ou YYYY-MM-DD)`,
          });
        }

        if (row[11] && !this.isValidDate(row[11].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Próxima Manutenção",
            message: `Data de próxima manutenção "${row[11]}" não está em formato válido (DD/MM/AAAA, DD/MM/AA ou YYYY-MM-DD)`,
          });
        }
      });
    } catch (error) {
      console.error("Erro ao validar dados de veículos:", error);
      errors.push({
        row: 0,
        field: "Sistema",
        message:
          "Erro ao validar dados: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  protected async transformData(data: any[]): Promise<VeiculoFormData[]> {
    return data.map((row, index) => {
      const veiculo = {
        placa: row[0]?.toString().toUpperCase().trim() || "",
        modelo: row[1]?.toString().toUpperCase().trim() || "",
        marca: row[2]?.toString().toUpperCase().trim() || "",
        ano: row[3]?.toString().trim() || "",
        capacidade: row[4]?.toString().trim() || "",
        tipoCarroceria:
          VeiculosImportService.TIPO_CARROCERIA_MAP[row[5]?.toString()] ||
          "truck",
        tipoBau:
          VeiculosImportService.TIPO_BAU_MAP[row[6]?.toString()] ||
          "frigorifico",
        quantidadeEixos: row[7]?.toString().trim() || "",
        status:
          VeiculosImportService.STATUS_MAP[row[8]?.toString()] || "disponivel",
        unidadeNegocio:
          VeiculosImportService.UNIDADE_NEGOCIO_MAP[row[9]?.toString()] ||
          "frigorifico",
        ultimaManutencao: this.convertDateForFirebase(row[10]),
        proximaManutencao: this.convertDateForFirebase(row[11]),
        motorista: "",
        observacao: row[12]?.toString().toUpperCase().trim() || "",
      };

      return veiculo;
    });
  }

  protected async saveToDatabase(
    data: VeiculoFormData[],
  ): Promise<ImportResult> {
    const errors: any[] = [];
    let savedCount = 0;

    for (const veiculoData of data) {
      try {
        await VeiculosService.createVeiculo(veiculoData);
        savedCount++;
      } catch (error) {
        console.error("Erro ao salvar veículo:", veiculoData.placa, error);
        errors.push(
          `Erro ao salvar veículo ${veiculoData.placa}: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        );
      }
    }

    const result = {
      success: errors.length === 0,
      totalRows: data.length,
      importedRows: savedCount,
      failedRows: data.length - savedCount,
      errors,
      warnings: [],
      duration: 0,
    };

    return result;
  }

  private isValidDate(dateString: string): boolean {
    const dateStr = dateString.toString().trim();

    // Formato YYYY-MM-DD
    const isoRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const isoMatch = dateStr.match(isoRegex);

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return (
        date.getDate() === Number(day) &&
        date.getMonth() === Number(month) - 1 &&
        date.getFullYear() === Number(year)
      );
    }

    // Formato DD/MM/AAAA
    const fullYearRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const fullYearMatch = dateStr.match(fullYearRegex);

    if (fullYearMatch) {
      const [, day, month, year] = fullYearMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return (
        date.getDate() === Number(day) &&
        date.getMonth() === Number(month) - 1 &&
        date.getFullYear() === Number(year)
      );
    }

    // Formato DD/MM/AA
    const shortYearRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/;
    const shortYearMatch = dateStr.match(shortYearRegex);

    if (shortYearMatch) {
      const [, day, month, shortYear] = shortYearMatch;

      let fullYear: number;
      const yearNum = Number(shortYear);

      if (yearNum >= 0 && yearNum <= 29) {
        fullYear = 2000 + yearNum;
      } else if (yearNum >= 30 && yearNum <= 99) {
        fullYear = 1900 + yearNum;
      } else {
        return false;
      }

      const date = new Date(fullYear, Number(month) - 1, Number(day));
      return (
        date.getDate() === Number(day) &&
        date.getMonth() === Number(month) - 1 &&
        date.getFullYear() === fullYear
      );
    }

    return false;
  }

  /**
   * Correção +1 dia para objetos Date do Excel
   */
  private convertDateForFirebase(dateValue: any): string {
    if (!dateValue) {
      return "";
    }

    if (dateValue instanceof Date) {
      // CRÍTICO: Excel interpreta datas com -1 dia, correção necessária
      const correctedDate = new Date(dateValue);
      correctedDate.setDate(correctedDate.getDate() + 1);

      const normalizedDate = DateService.normalizeForFirebase(correctedDate);
      const result = DateService.toLocalISOString(normalizedDate).split("T")[0];
      return result;
    }

    const dateStr = dateValue.toString().trim();

    if (
      dateStr.includes("GMT") ||
      dateStr.includes("UTC") ||
      dateStr.match(/\w{3}\s+\w{3}\s+\d{1,2}\s+\d{4}/)
    ) {
      try {
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
          const correctedDate = new Date(dateObj);
          correctedDate.setDate(correctedDate.getDate() + 1);

          const normalizedDate =
            DateService.normalizeForFirebase(correctedDate);
          const result =
            DateService.toLocalISOString(normalizedDate).split("T")[0];
          return result;
        }
      } catch (error) {
        console.error("Erro ao converter string JavaScript:", error);
      }
    }

    // Formato YYYY-MM-DD
    const isoRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const isoMatch = dateStr.match(isoRegex);

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        12,
        0,
        0,
        0,
      );
      const result = DateService.toLocalISOString(date).split("T")[0];
      return result;
    }

    // Formato DD/MM/AAAA
    const fullYearRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const fullYearMatch = dateStr.match(fullYearRegex);

    if (fullYearMatch) {
      const [, day, month, year] = fullYearMatch;
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        12,
        0,
        0,
        0,
      );
      const result = DateService.toLocalISOString(date).split("T")[0];
      return result;
    }

    // Formato DD/MM/AA - Excel converte automaticamente 01/09/2025 → 01/09/25
    const shortYearRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/;
    const shortYearMatch = dateStr.match(shortYearRegex);

    if (shortYearMatch) {
      const [, day, month, shortYear] = shortYearMatch;

      let fullYear: number;
      const yearNum = Number(shortYear);

      if (yearNum >= 0 && yearNum <= 29) {
        fullYear = 2000 + yearNum;
      } else if (yearNum >= 30 && yearNum <= 99) {
        fullYear = 1900 + yearNum;
      } else {
        return "";
      }

      const date = new Date(
        fullYear,
        Number(month) - 1,
        Number(day),
        12,
        0,
        0,
        0,
      );
      const result = DateService.toLocalISOString(date).split("T")[0];
      return result;
    }

    return "";
  }
}
