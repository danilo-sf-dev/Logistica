import { BaseImportService } from "./importService";
import { ValidationService } from "./validationService";
import { cidadesService } from "../../cidades/data/cidadesService";
import type {
  ImportConfig,
  ValidationResult,
  ImportResult,
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
    try {
      // Buscar cidades existentes para validação de unicidade
      const cidadesExistentes = await cidadesService.listar();

      // Validações usando o serviço padronizado
      const validations = [
        // Validação de campos obrigatórios
        ValidationService.validateRequiredFields(data, [
          { index: 0, name: "Nome" },
          { index: 1, name: "Estado" },
        ]),

        // Validação de unicidade
        ValidationService.validateUniqueness(
          data,
          cidadesExistentes,
          (cidade) =>
            `${cidade.nome.toUpperCase()}-${cidade.estado.toUpperCase()}`,
          (row) =>
            row[0] && row[1]
              ? `${row[0].toString().toUpperCase()}-${row[1].toString().toUpperCase()}`
              : "",
          "Cidade",
          "nome"
        ),

        // Validação de campos numéricos
        ValidationService.validateNumericFields(data, [
          { index: 3, name: "Distância" },
          { index: 4, name: "Peso Mínimo" },
        ]),
      ];

      // Combinar todos os resultados
      const result = ValidationService.combineValidationResults(validations);

      console.log(
        `📊 Resumo da validação: ${result.errors.length} erros, ${result.warnings.length} avisos`
      );

      return result;
    } catch (error) {
      console.warn(
        "⚠️ Erro ao buscar cidades existentes para validação:",
        error
      );
      // Retornar apenas validação de campos obrigatórios se houver erro
      return ValidationService.validateRequiredFields(data, [
        { index: 0, name: "Nome" },
        { index: 1, name: "Estado" },
      ]);
    }
  }

  protected async transformData(data: any[]): Promise<CidadeInput[]> {
    return data.map((row, index) => {
      try {
        const cidade: CidadeInput = {
          nome: row[0]?.toString().trim().toUpperCase() || "",
          estado: row[1]?.toString().trim().toUpperCase() || "",
        };

        // Adicionar campos opcionais apenas se tiverem valor
        if (row[2]?.toString().trim()) {
          cidade.regiao = row[2].toString().trim().toUpperCase();
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
        console.error(`❌ Erro ao transformar linha ${index + 1}:`, error, row);
        throw new Error(
          `Erro ao processar linha ${index + 1}: ${error.message}`
        );
      }
    });
  }

  protected async saveToDatabase(data: CidadeInput[]): Promise<ImportResult> {
    console.log("📊 Dados para importar:", data);

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
        console.log(`🔄 Importando cidade ${i + 1}:`, cidade);

        // Log detalhado dos dados antes de enviar
        console.log(
          `🔍 Dados sanitizados para cidade ${i + 1}:`,
          Object.fromEntries(
            Object.entries(cidade).filter(
              ([_, value]) => value !== undefined && value !== null
            )
          )
        );

        await cidadesService.criar(cidade);
        result.importedRows++;
        console.log(`✅ Cidade ${i + 1} importada com sucesso`);
      } catch (error) {
        console.error(`❌ Erro ao importar cidade ${i + 1}:`, error);
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
    console.log("📈 Resultado final:", result);
    return result;
  }
}
