import { BaseImportService } from "./importService";
import { vendedoresService } from "../../vendedores/data/vendedoresService";
import { cidadesService } from "../../cidades/data/cidadesService";
import type {
  ImportConfig,
  ImportResult,
  ValidationResult,
} from "../types/importTypes";
import type { VendedorInput } from "../../vendedores/types";
import type { Cidade } from "../../cidades/types";

export class VendedoresImportService extends BaseImportService {
  private cidadesCache: Cidade[] = [];
  private cidadesLoaded = false;

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

  // Função para buscar cidade por nome
  private async buscarCidadePorNome(
    nomeCidade: string,
  ): Promise<string | null> {
    // Carregar cidades se ainda não foram carregadas
    if (!this.cidadesLoaded) {
      try {
        this.cidadesCache = await cidadesService.listar();
        this.cidadesLoaded = true;
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        return null;
      }
    }

    const nomeNormalizado = this.normalizeCityName(nomeCidade);

    // Buscar cidade exata
    let cidade = this.cidadesCache.find(
      (c) => this.normalizeCityName(c.nome) === nomeNormalizado,
    );

    if (cidade) {
      return cidade.id;
    }

    // Buscar cidade que contenha o nome (busca parcial)
    cidade = this.cidadesCache.find((c) =>
      this.normalizeCityName(c.nome).includes(nomeNormalizado),
    );

    if (cidade) {
      return cidade.id;
    }

    // Buscar cidade que seja contida no nome (busca reversa)
    cidade = this.cidadesCache.find((c) =>
      nomeNormalizado.includes(this.normalizeCityName(c.nome)),
    );

    return cidade ? cidade.id : null;
  }

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
          "20",
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
          "80",
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
        "6. Código Sistema: deve ser um número inteiro positivo (opcional)",
        "7. Unidade Negócio: frigorifico, ovos, ambos",
        "8. Tipo Contrato: clt, pj, autonomo, outro",
        "9. Cidades Atendidas: separadas por vírgula (opcional)",
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
              message: `CPF "${row[1].toString().trim()}" já cadastrado no sistema`,
            });
          }
        }

        // Validação de unicidade (Email)
        if (row[2] && emailsExistentes.has(row[2].toString().toLowerCase())) {
          errors.push({
            row: rowNumber,
            field: "email",
            message: `Email "${row[2].toString().trim()}" já cadastrado no sistema`,
          });
        }

        // Validação de unicidade (Código)
        if (row[5] && codigosExistentes.has(row[5].toString())) {
          errors.push({
            row: rowNumber,
            field: "codigoVendSistema",
            message: `Código "${row[5].toString().trim()}" já cadastrado no sistema`,
          });
        }

        // Validações específicas
        // Validar formato de CPF (10 ou 11 dígitos)
        if (row[1]) {
          const cpfLimpo = row[1].toString().replace(/\D/g, "");
          if (cpfLimpo.length === 10) {
            // Adicionar zero à esquerda se tiver 10 dígitos
            const cpfOriginal = row[1].toString().trim();
            row[1] = "0" + cpfLimpo;
            warnings.push({
              row: rowNumber,
              field: "cpf",
              message: `CPF "${cpfOriginal}" foi corrigido para "${row[1]}" (zero à esquerda adicionado automaticamente)`,
              value: row[1],
              severity: "warning",
            });
          } else if (cpfLimpo.length !== 11) {
            errors.push({
              row: rowNumber,
              field: "cpf",
              message: `CPF "${row[1].toString().trim()}" deve ter 11 dígitos. Se o Excel removeu zeros à esquerda, adicione manualmente.`,
              value: row[1],
              severity: "error",
            });
          }
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
    const transformedData = [];

    for (const row of data) {
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
          // Buscar IDs das cidades pelos nomes
          const cidadesIds: string[] = [];
          const cidadesNaoEncontradas: string[] = [];

          for (const nomeCidade of cidadesArray) {
            const cidadeId = await this.buscarCidadePorNome(nomeCidade);
            if (cidadeId) {
              cidadesIds.push(cidadeId);
            } else {
              cidadesNaoEncontradas.push(nomeCidade);
            }
          }

          // Adicionar apenas as cidades encontradas
          if (cidadesIds.length > 0) {
            transformed.cidadesAtendidas = cidadesIds;
          }

          // Log das cidades não encontradas para debug
          if (cidadesNaoEncontradas.length > 0) {
            console.warn(
              `Cidades não encontradas para o vendedor ${transformed.nome}:`,
              cidadesNaoEncontradas,
            );
          }
        }
      }

      transformedData.push(transformed);
    }

    return transformedData;
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
