import { BaseImportService } from "./importService";
import { cidadesService } from "../../cidades/data/cidadesService";
import type {
  ImportConfig,
  ValidationResult,
  ImportResult,
  ImportError,
  ImportWarning,
} from "../types/importTypes";
import type { CidadeInput } from "../../cidades/types";

export class CidadesImportService extends BaseImportService {
  protected config: ImportConfig = {
    entityType: "cidades",
    requiredFields: ["nome", "estado"],
    optionalFields: ["regiao", "distancia", "pesoMinimo", "observacao"],
    validationRules: [
      {
        field: "nome",
        rule: "required",
        message: "Nome da cidade é obrigatório",
      },
      { field: "estado", rule: "required", message: "Estado é obrigatório" },
      { field: "nome", rule: "unique", message: "Cidade já cadastrada" },
      {
        field: "distancia",
        rule: "number",
        message: "Distância deve ser um número",
      },
      {
        field: "pesoMinimo",
        rule: "number",
        message: "Peso mínimo deve ser um número",
      },
    ],
    transformations: [
      { field: "nome", transform: "uppercase" },
      { field: "estado", transform: "uppercase" },
      { field: "regiao", transform: "lowercase" },
      { field: "distancia", transform: "cleanNumeric" },
      { field: "pesoMinimo", transform: "cleanNumeric" },
    ],
    templateConfig: {
      headers: [
        "Nome*",
        "Estado*",
        "Região",
        "Distância (km)",
        "Peso Mínimo (kg)",
        "Observação",
      ],
      exampleData: [
        ["SÃO PAULO", "SP", "sudeste", "0", "1000", "Capital do estado"],
        ["RIO DE JANEIRO", "RJ", "sudeste", "430", "500", "Cidade maravilhosa"],
        ["BELO HORIZONTE", "MG", "sudeste", "586", "800", "Capital de Minas"],
      ],
      instructions: [
        "Nome: Nome da cidade (será convertido para maiúsculas)",
        "Estado: Sigla do estado (será convertido para maiúsculas)",
        "Região: Região geográfica (opcional, será convertido para minúsculas)",
        "Distância: Distância em km da sede (opcional, apenas números)",
        "Peso Mínimo: Peso mínimo em kg para entrega (opcional, apenas números)",
        "Observação: Observações adicionais (opcional)",
      ],
      validations: [
        "Nome e Estado são obrigatórios",
        "Nome da cidade deve ser único no sistema",
        "Distância e Peso Mínimo devem ser números válidos",
        "Estado deve ser uma sigla válida (SP, RJ, MG, etc.)",
      ],
    },
  };

  protected async validateData(data: any[]): Promise<ValidationResult> {
    const errors: ImportError[] = [];
    const warnings: ImportWarning[] = [];

    // Buscar cidades existentes para validação de unicidade
    const cidadesExistentes = await cidadesService.listar();
    const nomesExistentes = new Set(
      cidadesExistentes.map(
        (c) => `${c.nome.toUpperCase()}-${c.estado.toUpperCase()}`
      )
    );

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 porque começamos do índice 0 e pulamos o cabeçalho

      // Validar campos obrigatórios
      if (!row[0] || !row[0].toString().trim()) {
        errors.push({
          row: rowNumber,
          field: "nome",
          message: "Nome da cidade é obrigatório",
          value: row[0],
          severity: "error",
        });
      }

      if (!row[1] || !row[1].toString().trim()) {
        errors.push({
          row: rowNumber,
          field: "estado",
          message: "Estado é obrigatório",
          value: row[1],
          severity: "error",
        });
      }

      // Validar unicidade (nome + estado)
      if (row[0] && row[1]) {
        const nomeEstado = `${row[0].toString().toUpperCase()}-${row[1].toString().toUpperCase()}`;
        if (nomesExistentes.has(nomeEstado)) {
          errors.push({
            row: rowNumber,
            field: "nome",
            message: `Cidade ${row[0]} (${row[1]}) já cadastrada`,
            value: row[0],
            severity: "error",
          });
        }
      }

      // Validar formato de números
      if (row[3] && isNaN(Number(row[3]))) {
        errors.push({
          row: rowNumber,
          field: "distancia",
          message: "Distância deve ser um número válido",
          value: row[3],
          severity: "error",
        });
      }

      if (row[4] && isNaN(Number(row[4]))) {
        errors.push({
          row: rowNumber,
          field: "pesoMinimo",
          message: "Peso mínimo deve ser um número válido",
          value: row[4],
          severity: "error",
        });
      }

      // Avisos para valores muito altos ou baixos
      if (row[3] && Number(row[3]) > 10000) {
        warnings.push({
          row: rowNumber,
          field: "distancia",
          message: "Distância muito alta, verifique se está em km",
          value: row[3],
        });
      }

      if (row[4] && Number(row[4]) > 50000) {
        warnings.push({
          row: rowNumber,
          field: "pesoMinimo",
          message: "Peso mínimo muito alto, verifique se está em kg",
          value: row[4],
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  protected async transformData(data: any[]): Promise<CidadeInput[]> {
    return data.map((row) => ({
      nome: row[0]?.toString().trim().toUpperCase() || "",
      estado: row[1]?.toString().trim().toUpperCase() || "",
      regiao: row[2]?.toString().trim().toLowerCase() || undefined,
      distancia: row[3] ? Number(row[3]) : null,
      pesoMinimo: row[4] ? Number(row[4]) : null,
      observacao: row[5]?.toString().trim() || undefined,
    }));
  }

  protected async saveToDatabase(data: CidadeInput[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      totalRows: data.length,
      importedRows: 0,
      failedRows: 0,
      errors: [],
      warnings: [],
      duration: 0,
    };

    for (let i = 0; i < data.length; i++) {
      try {
        const cidade = data[i];
        await cidadesService.criar(cidade);
        result.importedRows++;
      } catch (error) {
        result.failedRows++;
        result.errors.push({
          row: i + 2,
          field: "geral",
          message: `Erro ao salvar cidade: ${error.message}`,
          value: data[i],
          severity: "error",
        });
      }
    }

    result.success = result.failedRows === 0;
    return result;
  }
}
