import { BaseImportService } from "./importService";
import { cidadesService } from "../../cidades/data/cidadesService";
import { obterRegiaoPorEstado } from "utils/constants";
import type {
  ImportConfig,
  ValidationResult,
  ImportResult,
} from "../types/importTypes";
import type { CidadeInput } from "../../cidades/types";

export class CidadesImportService extends BaseImportService {
  // Função para normalizar nomes de cidades (remover acentos e caracteres especiais)
  private normalizeCityName(name: string): string {
    return name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^\w\s]/g, "") // Remover pontuação e caracteres especiais
      .replace(/\s+/g, " ") // Normalizar espaços
      .trim()
      .toUpperCase();
  }
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
        ["SÃO PAULO", "SP", "", "0", "1000", "Capital do estado"],
        ["RIO DE JANEIRO", "RJ", "", "430", "500", "Cidade maravilhosa"],
        ["BELO HORIZONTE", "MG", "", "586", "800", "Capital de Minas"],
      ],
      instructions: [
        "Nome: Nome da cidade (será convertido para maiúsculas)",
        "Estado: Sigla do estado (será convertido para maiúsculas)",
        "Região: Região geográfica (opcional, será preenchida automaticamente baseada no estado)",
        "Distância: Distância em km da sede (opcional, apenas números)",
        "Peso Mínimo: Peso mínimo em kg para entrega (opcional, apenas números)",
        "Observação: Observações adicionais (opcional)",
      ],
      validations: [
        "Nome e Estado são obrigatórios",
        "Nome da cidade deve ser único no sistema",
        "Região será preenchida automaticamente baseada no estado",
        "Distância e Peso Mínimo devem ser números válidos",
        "Estado deve ser uma sigla válida (SP, RJ, MG, etc.)",
      ],
    },
  };

  protected async validateData(data: any[]): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    try {
      // Buscar cidades existentes para validação de unicidade
      const cidadesExistentes = await cidadesService.listar();
      const nomesExistentes = new Set(
        cidadesExistentes.map(
          (cidade) =>
            `${this.normalizeCityName(cidade.nome)}-${cidade.estado.toUpperCase()}`
        )
      );

      // Validar cada linha
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque a primeira linha é cabeçalho

        // Validação de campos obrigatórios
        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Nome",
            message: "Nome da cidade é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Estado",
            message: "Estado é obrigatório",
          });
        }

        // Validação de unicidade
        if (row[0] && row[1]) {
          const nomeNormalizado = this.normalizeCityName(row[0].toString());
          const nomeEstado = `${nomeNormalizado}-${row[1].toString().toUpperCase()}`;
          if (nomesExistentes.has(nomeEstado)) {
            errors.push({
              row: rowNumber,
              field: "Nome",
              message: `Cidade "${row[0].toString().trim()}" já cadastrada no sistema`,
            });
          }
        }

        // Validação de campos numéricos
        if (row[3] !== undefined && row[3] !== null && row[3] !== "") {
          const distancia = Number(row[3]);
          if (isNaN(distancia) || distancia < 0) {
            errors.push({
              row: rowNumber,
              field: "Distância",
              message: "Distância deve ser um número válido",
            });
          }
        }

        if (row[4] !== undefined && row[4] !== null && row[4] !== "") {
          const pesoMinimo = Number(row[4]);
          if (isNaN(pesoMinimo) || pesoMinimo < 0) {
            errors.push({
              row: rowNumber,
              field: "Peso Mínimo",
              message: "Peso mínimo deve ser um número válido",
            });
          }
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      // Se houver erro ao buscar cidades existentes, retornar apenas validação básica
      data.forEach((row, index) => {
        const rowNumber = index + 2;

        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Nome",
            message: "Nome da cidade é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Estado",
            message: "Estado é obrigatório",
          });
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    }
  }

  protected async transformData(data: any[]): Promise<CidadeInput[]> {
    return data.map((row, index) => {
      try {
        const cidade: CidadeInput = {
          nome: row[0]?.toString().trim().toUpperCase() || "",
          estado: row[1]?.toString().trim().toUpperCase() || "",
        };

        // Definir região automaticamente baseada no estado se não for fornecida
        if (row[2]?.toString().trim()) {
          cidade.regiao = row[2].toString().trim().toUpperCase();
        } else {
          // Se região não foi fornecida, obter automaticamente do estado
          const regiaoAutomatica = obterRegiaoPorEstado(cidade.estado);
          if (regiaoAutomatica) {
            cidade.regiao = regiaoAutomatica;
          }
        }

        if (row[3] !== undefined && row[3] !== null && row[3] !== "") {
          cidade.distancia = Number(row[3]);
        }

        if (row[4] !== undefined && row[4] !== null && row[4] !== "") {
          cidade.pesoMinimo = Number(row[4]);
        }

        if (row[5]?.toString().trim()) {
          cidade.observacao = row[5].toString().trim().toUpperCase();
        }

        return cidade;
      } catch (error) {
        throw new Error(
          `Erro ao processar linha ${index + 1}: ${error.message}`
        );
      }
    });
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
