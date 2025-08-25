import { BaseImportService } from "./importService";
import { vendedoresService } from "../../vendedores/data/vendedoresService";
import type {
  ImportConfig,
  ImportResult,
  ValidationResult,
} from "../types/importTypes";
import type { VendedorInput } from "../../vendedores/types";

export class VendedoresImportService extends BaseImportService {
  protected config: ImportConfig = {
    entityType: "vendedores",
    requiredFields: [
      "nome",
      "cpf",
      "celular",
      "regiao",
      "unidadeNegocio",
      "tipoContrato",
    ],
    optionalFields: ["email", "codigoVendSistema", "cidadesAtendidas"],
    validationRules: [
      { field: "nome", rule: "required", message: "Nome é obrigatório" },
      { field: "cpf", rule: "required", message: "CPF é obrigatório" },
      { field: "cpf", rule: "cpf", message: "CPF inválido" },
      { field: "celular", rule: "required", message: "Celular é obrigatório" },
      { field: "celular", rule: "phone", message: "Celular inválido" },
      { field: "regiao", rule: "required", message: "Região é obrigatória" },
      {
        field: "unidadeNegocio",
        rule: "required",
        message: "Unidade de Negócio é obrigatória",
      },
      {
        field: "tipoContrato",
        rule: "required",
        message: "Tipo de Contrato é obrigatório",
      },
      { field: "email", rule: "email", message: "Email inválido" },
    ],
    transformations: [
      { field: "nome", transform: "uppercase" },
      { field: "cpf", transform: "cleanNumeric" },
      { field: "celular", transform: "cleanNumeric" },
      { field: "regiao", transform: "uppercase" },
      { field: "email", transform: "lowercase" },
      { field: "codigoVendSistema", transform: "uppercase" },
    ],
    templateConfig: {
      headers: [
        "Nome*",
        "CPF*",
        "Email",
        "Celular*",
        "Região*",
        "Código Sistema",
        "Unidade Negócio*",
        "Tipo Contrato*",
        "Cidades Atendidas",
      ],
      exampleData: [
        [
          "JOÃO SILVA",
          "12345678901",
          "joao@empresa.com",
          "11999999999",
          "SUDESTE",
          "VEND001",
          "frigorifico",
          "clt",
          "São Paulo,Rio de Janeiro",
        ],
        [
          "MARIA SANTOS",
          "98765432100",
          "maria@empresa.com",
          "11888888888",
          "NORDESTE",
          "VEND002",
          "ovos",
          "pj",
          "Salvador,Ilhéus",
        ],
      ],
      instructions: [
        "1. Preencha todos os campos marcados com *",
        "2. CPF deve ter 11 dígitos sem pontos ou traços e ser válido",
        "3. Celular deve ter 10 ou 11 dígitos",
        "4. Email deve ser válido (opcional)",
        "5. Região: SUDESTE, NORDESTE, SUL, NORTE, CENTRO-OESTE",
        "6. Unidade Negócio: frigorifico, ovos, ambos",
        "7. Tipo Contrato: clt, pj, autonomo, outro",
        "8. Cidades Atendidas: separadas por vírgula (opcional)",
      ],
      validations: [
        "CPF deve ser único no sistema e válido",
        "Email deve ser único (se fornecido)",
        "Código do Sistema deve ser único (se fornecido)",
        "Região deve ser uma das opções válidas",
        "Unidade de Negócio deve ser uma das opções válidas",
        "Tipo de Contrato deve ser uma das opções válidas",
      ],
    },
  };

  protected async validateData(data: any[]): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    try {
      // Buscar dados existentes para validação de unicidade
      const vendedoresExistentes = await vendedoresService.listar();
      const cpfsExistentes = new Set(vendedoresExistentes.map((v) => v.cpf));
      const emailsExistentes = new Set(
        vendedoresExistentes.filter((v) => v.email).map((v) => v.email!),
      );
      const codigosExistentes = new Set(
        vendedoresExistentes
          .filter((v) => v.codigoVendSistema)
          .map((v) => v.codigoVendSistema!),
      );

      // Validar cada linha
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque a primeira linha é cabeçalho

        // Validação de campos obrigatórios
        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "nome",
            message: "Nome é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "cpf",
            message: "CPF é obrigatório",
          });
        }

        if (!row[3]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "celular",
            message: "Celular é obrigatório",
          });
        }

        if (!row[4]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "regiao",
            message: "Região é obrigatória",
          });
        }

        if (!row[6]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "unidadeNegocio",
            message: "Unidade de negócio é obrigatória",
          });
        }

        if (!row[7]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "tipoContrato",
            message: "Tipo de contrato é obrigatório",
          });
        }

        // Validação de unicidade (CPF)
        if (row[1]) {
          const cpf = row[1].toString().replace(/\D/g, "");
          if (cpfsExistentes.has(cpf)) {
            errors.push({
              row: rowNumber,
              field: "cpf",
              message: "CPF já cadastrado no sistema",
            });
          }
        }

        // Validação de unicidade (Email)
        if (row[2] && emailsExistentes.has(row[2].toString().toLowerCase())) {
          errors.push({
            row: rowNumber,
            field: "email",
            message: "Email já cadastrado no sistema",
          });
        }

        // Validação de unicidade (Código)
        if (row[5] && codigosExistentes.has(row[5].toString())) {
          errors.push({
            row: rowNumber,
            field: "codigoVendSistema",
            message: "Código já cadastrado no sistema",
          });
        }

        // Validações específicas
        // Validar formato de CPF (11 dígitos)
        if (row[1] && row[1].toString().replace(/\D/g, "").length !== 11) {
          errors.push({
            row: rowNumber,
            field: "cpf",
            message: "CPF deve ter exatamente 11 dígitos",
            value: row[1],
            severity: "error",
          });
        }

        // Validar formato de celular (10 ou 11 dígitos)
        if (row[3]) {
          const celularLength = row[3].toString().replace(/\D/g, "").length;
          if (celularLength !== 10 && celularLength !== 11) {
            errors.push({
              row: rowNumber,
              field: "celular",
              message: "Celular deve ter 10 ou 11 dígitos",
              value: row[3],
              severity: "error",
            });
          }
        }

        // Validar email (se fornecido)
        if (row[2] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[2].toString())) {
          errors.push({
            row: rowNumber,
            field: "email",
            message: "Email inválido",
            value: row[2],
            severity: "error",
          });
        }

        // Validar região
        const regioesValidas = [
          "SUDESTE",
          "NORDESTE",
          "SUL",
          "NORTE",
          "CENTRO-OESTE",
        ];
        if (
          row[4] &&
          !regioesValidas.includes(row[4].toString().toUpperCase())
        ) {
          errors.push({
            row: rowNumber,
            field: "regiao",
            message: `Região inválida. Opções válidas: ${regioesValidas.join(", ")}`,
            value: row[4],
            severity: "error",
          });
        }

        // Validar unidade de negócio
        const unidadesValidas = ["frigorifico", "ovos", "ambos"];
        if (
          row[6] &&
          !unidadesValidas.includes(row[6].toString().toLowerCase())
        ) {
          errors.push({
            row: rowNumber,
            field: "unidadeNegocio",
            message: `Unidade de negócio inválida. Opções válidas: ${unidadesValidas.join(", ")}`,
            value: row[6],
            severity: "error",
          });
        }

        // Validar tipo de contrato
        const tiposValidos = ["clt", "pj", "autonomo", "outro"];
        if (row[7] && !tiposValidos.includes(row[7].toString().toLowerCase())) {
          errors.push({
            row: rowNumber,
            field: "tipoContrato",
            message: `Tipo de contrato inválido. Opções válidas: ${tiposValidos.join(", ")}`,
            value: row[7],
            severity: "error",
          });
        }

        // Validar código do sistema (se fornecido)
        if (row[5]) {
          const codigo = parseInt(row[5].toString());
          if (isNaN(codigo) || codigo < 0) {
            errors.push({
              row: rowNumber,
              field: "codigoVendSistema",
              message: "Código deve ser um número inteiro positivo",
              value: row[5],
              severity: "error",
            });
          }
        }

        // Validar duplicatas de código no sistema (se fornecido)
        if (row[5] && codigosExistentes.has(row[5].toString().toUpperCase())) {
          errors.push({
            row: rowNumber,
            field: "codigoVendSistema",
            message: "Código do Sistema já cadastrado",
            value: row[5],
            severity: "error",
          });
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      // Se houver erro ao buscar dados existentes, retornar apenas validação básica
      data.forEach((row, index) => {
        const rowNumber = index + 2;

        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "nome",
            message: "Nome é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "cpf",
            message: "CPF é obrigatório",
          });
        }

        if (!row[3]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "celular",
            message: "Celular é obrigatório",
          });
        }

        if (!row[4]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "regiao",
            message: "Região é obrigatória",
          });
        }

        if (!row[6]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "unidadeNegocio",
            message: "Unidade de negócio é obrigatória",
          });
        }

        if (!row[7]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "tipoContrato",
            message: "Tipo de contrato é obrigatório",
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

  protected async transformData(data: any[]): Promise<any[]> {
    return data.map((row) => {
      const transformed: VendedorInput = {
        nome: row[0]?.toString().toUpperCase() || "",
        cpf: row[1]?.toString().replace(/\D/g, "") || "",
        celular: row[3]?.toString().replace(/\D/g, "") || "",
        regiao: row[4]?.toString().toUpperCase() || "",
        unidadeNegocio:
          (row[6]?.toString().toLowerCase() as any) || "frigorifico",
        tipoContrato: (row[7]?.toString().toLowerCase() as any) || "clt",
        ativo: true,
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (row[2]) {
        transformed.email = row[2].toString().toLowerCase();
      }

      if (row[5]) {
        transformed.codigoVendSistema = row[5].toString().toUpperCase();
      }

      if (row[8]) {
        // Converter string de cidades separadas por vírgula em array
        const cidadesArray = row[8]
          .toString()
          .split(",")
          .map((cidade: string) => cidade.trim())
          .filter((cidade: string) => cidade.length > 0);

        if (cidadesArray.length > 0) {
          transformed.cidadesAtendidas = cidadesArray;
        }
      }

      return transformed;
    });
  }

  protected async saveToDatabase(data: any[]): Promise<ImportResult> {
    const startTime = Date.now();
    let importedRows = 0;
    let failedRows = 0;
    const errors: any[] = [];

    for (const item of data) {
      try {
        await vendedoresService.criar(item);
        importedRows++;
      } catch (error) {
        failedRows++;
        errors.push({
          row: importedRows + failedRows + 1,
          field: "geral",
          message: `Erro ao salvar vendedor: ${error.message}`,
          value: item.nome,
          severity: "error",
        });
      }
    }

    return {
      success: failedRows === 0,
      totalRows: data.length,
      importedRows,
      failedRows,
      errors,
      warnings: [],
      duration: Date.now() - startTime,
    };
  }
}
