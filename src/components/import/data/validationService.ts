import type {
  ValidationResult,
  ImportError,
  ImportWarning,
} from "../types/importTypes";

export class ValidationService {
  /**
   * Validação base de duplicidade que pode ser usada por todas as entidades
   */
  static validateUniqueness<T>(
    data: any[],
    existingItems: T[],
    getUniqueKey: (item: T) => string,
    getDataKey: (row: any[], index: number) => string,
    entityName: string,
    fieldName: string
  ): ValidationResult {
    const errors: ImportError[] = [];
    const warnings: ImportWarning[] = [];

    // Criar Set com chaves únicas dos itens existentes
    const existingKeys = new Set(existingItems.map(getUniqueKey));

    // Set para verificar duplicatas dentro do arquivo
    const keysInFile = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 porque começamos do índice 0 e pulamos o cabeçalho
      const dataKey = getDataKey(row, i);

      if (dataKey) {
        // Verificar se já existe no sistema
        if (existingKeys.has(dataKey)) {
          errors.push({
            row: rowNumber,
            field: fieldName,
            message: `❌ ${entityName} já existe no sistema. Remova esta linha ou altere os dados.`,
            value: row[0],
            severity: "error",
          });
        }
        // Verificar se já existe no arquivo (duplicata dentro do arquivo)
        else if (keysInFile.has(dataKey)) {
          errors.push({
            row: rowNumber,
            field: fieldName,
            message: `❌ ${entityName} duplicado no arquivo. Remova uma das linhas duplicadas.`,
            value: row[0],
            severity: "error",
          });
        } else {
          keysInFile.add(dataKey);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validação de campos obrigatórios
   */
  static validateRequiredFields(
    data: any[],
    requiredFields: { index: number; name: string }[]
  ): ValidationResult {
    const errors: ImportError[] = [];
    const warnings: ImportWarning[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      for (const field of requiredFields) {
        if (!row[field.index] || !row[field.index].toString().trim()) {
          errors.push({
            row: rowNumber,
            field: field.name,
            message: `${field.name} é obrigatório`,
            value: row[field.index],
            severity: "error",
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validação de formato numérico
   */
  static validateNumericFields(
    data: any[],
    numericFields: { index: number; name: string }[]
  ): ValidationResult {
    const errors: ImportError[] = [];
    const warnings: ImportWarning[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      for (const field of numericFields) {
        if (row[field.index] && isNaN(Number(row[field.index]))) {
          errors.push({
            row: rowNumber,
            field: field.name,
            message: `${field.name} deve ser um número válido`,
            value: row[field.index],
            severity: "error",
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Combina múltiplos resultados de validação
   */
  static combineValidationResults(
    results: ValidationResult[]
  ): ValidationResult {
    const allErrors: ImportError[] = [];
    const allWarnings: ImportWarning[] = [];

    for (const result of results) {
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}
