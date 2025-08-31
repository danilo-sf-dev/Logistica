import { BaseImportService } from "./importService";
import { VeiculosService } from "../../veiculos/data/veiculosService";
import type {
  ImportConfig,
  ValidationResult,
  ImportResult,
} from "../types/importTypes";
import type { VeiculoFormData } from "../../veiculos/types";
import { TipoCarroceria, StatusVeiculo, UnidadeNegocio } from "../../../types";

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
          "15/01/2024",
          "15/04/2024",
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
          "20/02/2024",
          "20/05/2024",
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
        "Última Manutenção: Data no formato DD/MM/AAAA (opcional)",
        "Próxima Manutenção: Data no formato DD/MM/AAAA (opcional)",
        "Observação: Observações sobre o veículo (opcional, será convertida para maiúsculas)",
      ],
      validations: [
        "Placa deve ser única no sistema",
        "Capacidade e Quantidade Eixos devem ser números válidos",
        "Tipo Carroceria deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Status deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Unidade Negócio deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Tipo Baú deve ser uma das opções válidas (exatamente como aparece no sistema)",
        "Datas devem estar no formato DD/MM/AAAA (se fornecidas)",
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
            message: `Data de última manutenção "${row[10]}" não está no formato DD/MM/AAAA`,
          });
        }

        if (row[11] && !this.isValidDate(row[11].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Próxima Manutenção",
            message: `Data de próxima manutenção "${row[11]}" não está no formato DD/MM/AAAA`,
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
    return data.map((row) => ({
      placa: row[0]?.toString().toUpperCase().trim() || "",
      modelo: row[1]?.toString().toUpperCase().trim() || "",
      marca: row[2]?.toString().toUpperCase().trim() || "",
      ano: row[3]?.toString().trim() || "",
      capacidade: row[4]?.toString().trim() || "",
      tipoCarroceria:
        VeiculosImportService.TIPO_CARROCERIA_MAP[row[5]?.toString()] ||
        "truck",
      tipoBau:
        VeiculosImportService.TIPO_BAU_MAP[row[6]?.toString()] || "frigorifico",
      quantidadeEixos: row[7]?.toString().trim() || "",
      status:
        VeiculosImportService.STATUS_MAP[row[8]?.toString()] || "disponivel",
      unidadeNegocio:
        VeiculosImportService.UNIDADE_NEGOCIO_MAP[row[9]?.toString()] ||
        "frigorifico",
      ultimaManutencao: this.convertDateToISO(row[10]?.toString().trim() || ""),
      proximaManutencao: this.convertDateToISO(
        row[11]?.toString().trim() || "",
      ),
      motorista: "",
      observacao: row[12]?.toString().toUpperCase().trim() || "",
    }));
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
        console.error("Erro ao salvar veículo:", error);
        errors.push(
          `Erro ao salvar veículo ${veiculoData.placa}: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        );
      }
    }

    return {
      success: errors.length === 0,
      totalRows: data.length,
      importedRows: savedCount,
      failedRows: data.length - savedCount,
      errors,
      warnings: [],
      duration: 0,
    };
  }

  private isValidDate(dateString: string): boolean {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);

    if (!match) return false;

    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return (
      date.getDate() === Number(day) &&
      date.getMonth() === Number(month) - 1 &&
      date.getFullYear() === Number(year)
    );
  }

  private convertDateToISO(dateString: string): string {
    if (!dateString || !this.isValidDate(dateString)) {
      return "";
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);

    if (!match) return "";

    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
}
