import { BaseImportService } from "./importService";
import { funcionariosService } from "../../funcionarios/data/funcionariosService";
import type { FuncionarioInput } from "../../funcionarios/types";
import type {
  ImportConfig,
  ValidationResult,
  ImportResult,
} from "../types/importTypes";

export class FuncionariosImportService extends BaseImportService {
  protected config: ImportConfig = {
    entityType: "funcionarios",
    requiredFields: [
      "nome",
      "cpf",
      "cnh",
      "celular",
      "cep",
      "endereco",
      "cidade",
    ],
    optionalFields: [
      "email",
      "numero",
      "complemento",
      "funcao",
      "cnhVencimento",
      "cnhCategoria",
      "toxicoUltimoExame",
      "toxicoVencimento",
      "dataAdmissao",
      "salario",
      "observacao",
      "status",
      "tipoContrato",
      "unidadeNegocio",
    ],
    validationRules: [
      { field: "cpf", rule: "cpf", message: "CPF inválido" },
      { field: "cnh", rule: "required", message: "CNH obrigatória" },
      { field: "celular", rule: "phone", message: "Celular inválido" },
      { field: "email", rule: "email", message: "Email inválido" },
      { field: "cpf", rule: "unique", message: "CPF já cadastrado" },
      { field: "cnh", rule: "unique", message: "CNH já cadastrada" },
    ],
    transformations: [
      { field: "cpf", transform: "cleanNumeric" },
      { field: "celular", transform: "cleanNumeric" },
      { field: "cep", transform: "cleanNumeric" },
      { field: "nome", transform: "uppercase" },
      { field: "email", transform: "lowercase" },
    ],
    templateConfig: {
      headers: [
        "Nome*",
        "CPF*",
        "CNH*",
        "Celular*",
        "Email",
        "CEP*",
        "Número",
        "Complemento",
        "Endereço*",
        "Cidade*",
        "Função",
        "CNH Vencimento",
        "CNH Categoria",
        "Tóxico Último Exame",
        "Tóxico Vencimento",
        "Data Admissão",
        "Salário",
        "Observação",
      ],
      exampleData: [
        [
          "JOÃO SILVA",
          "11144477735",
          "11144477735",
          "11999999999",
          "joao@email.com",
          "01234567",
          "123",
          "Apto 45",
          "Rua das Flores, 123",
          "São Paulo",
          "motorista",
          "15/12/2025",
          "E",
          "15/01/2024",
          "15/04/2024",
          "01/01/2024",
          "3500,00",
          "Funcionário dedicado e pontual",
        ],
        [
          "MARIA SANTOS",
          "52998224725",
          "52998224725",
          "11888888888",
          "maria@email.com",
          "01310100",
          "1000",
          "Sala 200",
          "Av. Paulista, 1000",
          "São Paulo",
          "ajudante",
          "20/10/2025",
          "B",
          "20/02/2024",
          "20/05/2024",
          "15/02/2024",
          "2800,00",
          "Ajudante experiente",
        ],
      ],
      instructions: [
        "1. Preencha todos os campos marcados com *",
        "2. CPF deve ter 11 dígitos sem pontos ou traços e ser válido",
        "3. CNH deve ser única no sistema",
        "4. Celular deve ter 10 ou 11 dígitos",
        "5. Email deve ser válido (opcional)",
        "6. CEP deve ter 8 dígitos",
        "7. Função: motorista, ajudante, outro",
        "8. Datas devem estar no formato DD/MM/AAAA",
        "9. Salário deve ser numérico (ex: 3500,00)",
      ],
      validations: [
        "CPF deve ser único no sistema",
        "CNH deve ser único no sistema",
        "Email deve ser único (se fornecido)",
        "CEP deve ter 8 dígitos",
        "Data de admissão deve ser válida",
        "Salário deve ser numérico",
        "CNH Vencimento deve ser uma data futura",
        "Tóxico Vencimento deve ser uma data futura",
      ],
    },
  };

  protected async validateData(data: any[]): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    try {
      // Buscar dados existentes para validação de unicidade
      const funcionariosExistentes = await funcionariosService.listar();
      const cpfsExistentes = new Set(funcionariosExistentes.map((f) => f.cpf));
      const cnhsExistentes = new Set(funcionariosExistentes.map((f) => f.cnh));

      // Validar cada linha
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque a primeira linha é cabeçalho

        // Validação de campos obrigatórios
        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Nome",
            message: "Nome é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CPF",
            message: "CPF é obrigatório",
          });
        }

        if (!row[2]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CNH",
            message: "CNH é obrigatória",
          });
        }

        if (!row[3]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Celular",
            message: "Celular é obrigatório",
          });
        }

        if (!row[5]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CEP",
            message: "CEP é obrigatório",
          });
        }

        if (!row[8]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Endereço",
            message: "Endereço é obrigatório",
          });
        }

        if (!row[9]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Cidade",
            message: "Cidade é obrigatória",
          });
        }

        // Validação de unicidade (CPF)
        if (row[1]) {
          const cpf = row[1].toString().replace(/\D/g, "");
          if (cpfsExistentes.has(cpf)) {
            errors.push({
              row: rowNumber,
              field: "CPF",
              message: `CPF "${row[1].toString().trim()}" já cadastrado no sistema`,
            });
          }
        }

        // Validação de unicidade (CNH)
        if (row[2]) {
          const cnh = row[2].toString().replace(/\D/g, "");
          if (cnhsExistentes.has(cnh)) {
            errors.push({
              row: rowNumber,
              field: "CNH",
              message: `CNH "${row[2].toString().trim()}" já cadastrada no sistema`,
            });
          }
        }

        // Validações específicas
        // Validar formato de CPF (11 dígitos)
        if (row[1] && row[1].toString().replace(/\D/g, "").length !== 11) {
          errors.push({
            row: rowNumber,
            field: "CPF",
            message: `CPF "${row[1].toString().trim()}" deve ter exatamente 11 dígitos`,
          });
        }

        // Validar formato de celular (10 ou 11 dígitos)
        if (row[3]) {
          const celularLength = row[3].toString().replace(/\D/g, "").length;
          if (celularLength !== 10 && celularLength !== 11) {
            errors.push({
              row: rowNumber,
              field: "Celular",
              message: `Celular "${row[3].toString().trim()}" deve ter 10 ou 11 dígitos`,
            });
          }
        }

        // Validar email (se fornecido)
        if (row[4] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[4].toString())) {
          errors.push({
            row: rowNumber,
            field: "Email",
            message: `Email "${row[4].toString().trim()}" inválido`,
          });
        }

        // Validar CEP (se fornecido)
        if (row[5] && row[5].toString().replace(/\D/g, "").length !== 8) {
          errors.push({
            row: rowNumber,
            field: "CEP",
            message: `CEP "${row[5].toString().trim()}" deve ter 8 dígitos`,
          });
        }

        // Validar função
        const funcoesValidas = ["motorista", "ajudante", "outro"];
        if (
          row[10] &&
          !funcoesValidas.includes(row[10].toString().toLowerCase())
        ) {
          errors.push({
            row: rowNumber,
            field: "Função",
            message: `Função "${row[10].toString().trim()}" inválida. Opções válidas: ${funcoesValidas.join(", ")}`,
          });
        }

        // Validar formato de data (se fornecida)
        if (row[11] && !this.isValidDate(row[11].toString())) {
          warnings.push({
            row: rowNumber,
            field: "CNH Vencimento",
            message: `Data de vencimento da CNH "${row[11]}" não está no formato DD/MM/AAAA`,
          });
        }

        if (row[13] && !this.isValidDate(row[13].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Tóxico Último Exame",
            message: `Data do último exame toxicológico "${row[13]}" não está no formato DD/MM/AAAA`,
          });
        }

        if (row[14] && !this.isValidDate(row[14].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Tóxico Vencimento",
            message: `Data de vencimento do exame toxicológico "${row[14]}" não está no formato DD/MM/AAAA`,
          });
        }

        if (row[15] && !this.isValidDate(row[15].toString())) {
          warnings.push({
            row: rowNumber,
            field: "Data Admissão",
            message: `Data de admissão "${row[15]}" não está no formato DD/MM/AAAA`,
          });
        }

        // Validar salário (se fornecido)
        if (row[16]) {
          const salario = parseFloat(
            row[16]
              .toString()
              .replace(/[^\d,]/g, "")
              .replace(",", "."),
          );
          if (isNaN(salario) || salario < 0) {
            errors.push({
              row: rowNumber,
              field: "Salário",
              message: `Salário "${row[16].toString().trim()}" deve ser um número válido`,
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
      // Se houver erro ao buscar dados existentes, retornar apenas validação básica
      data.forEach((row, index) => {
        const rowNumber = index + 2;

        if (!row[0]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Nome",
            message: "Nome é obrigatório",
          });
        }

        if (!row[1]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CPF",
            message: "CPF é obrigatório",
          });
        }

        if (!row[2]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CNH",
            message: "CNH é obrigatória",
          });
        }

        if (!row[3]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Celular",
            message: "Celular é obrigatório",
          });
        }

        if (!row[5]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "CEP",
            message: "CEP é obrigatório",
          });
        }

        if (!row[8]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Endereço",
            message: "Endereço é obrigatório",
          });
        }

        if (!row[9]?.toString().trim()) {
          errors.push({
            row: rowNumber,
            field: "Cidade",
            message: "Cidade é obrigatória",
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

  protected async transformData(data: any[]): Promise<FuncionarioInput[]> {
    return data.map((row, index) => {
      try {
        // Construir endereço completo combinando os campos
        const enderecoBase = row[8]?.toString().trim().toUpperCase() || "";
        const numero = row[6]?.toString().trim() || "";
        const complemento = row[7]?.toString().trim().toUpperCase() || "";

        let enderecoCompleto = enderecoBase;
        if (numero) {
          enderecoCompleto += `, ${numero}`;
        }
        if (complemento) {
          enderecoCompleto += ` - ${complemento}`;
        }

        const funcionario: FuncionarioInput = {
          nome: row[0]?.toString().trim().toUpperCase() || "",
          cpf: row[1]?.toString().trim() || "",
          cnh: row[2]?.toString().trim() || "",
          celular: row[3]?.toString().trim() || "",
          email: row[4]?.toString().trim().toLowerCase() || "",
          cep: row[5]?.toString().trim() || "",
          numero: row[6]?.toString().trim() || "",
          complemento: row[7]?.toString().trim().toUpperCase() || "",
          endereco: enderecoCompleto,
          cidade: row[9]?.toString().trim().toUpperCase() || "",
          funcao: (row[10]?.toString().toLowerCase() as any) || "motorista",
          cnhVencimento: this.convertDateToISO(
            row[11]?.toString().trim() || "",
          ),
          cnhCategoria: row[12]?.toString().trim().toUpperCase() || "",
          toxicoUltimoExame: this.convertDateToISO(
            row[13]?.toString().trim() || "",
          ),
          toxicoVencimento: this.convertDateToISO(
            row[14]?.toString().trim() || "",
          ),
          dataAdmissao: this.convertDateToISO(row[15]?.toString().trim() || ""),
          salario: row[16]?.toString().trim() || "",
          observacao: row[17]?.toString().trim().toUpperCase() || "",
          status: "disponivel",
          tipoContrato: "integral",
          unidadeNegocio: "frigorifico",
          ativo: true,
        };

        // Remover campos undefined para evitar erro no Firebase
        Object.keys(funcionario).forEach((key) => {
          const fieldKey = key as keyof FuncionarioInput;
          if (funcionario[fieldKey] === undefined) {
            (funcionario as any)[fieldKey] = "";
          }
        });

        return funcionario;
      } catch (error) {
        throw new Error(
          `Erro ao processar linha ${index + 1}: ${error.message}`,
        );
      }
    });
  }

  protected async saveToDatabase(data: any[]): Promise<ImportResult> {
    const errors: any[] = [];
    let importedRows = 0;
    let failedRows = 0;

    for (const item of data) {
      try {
        await funcionariosService.criar(item);
        importedRows++;
      } catch (error) {
        failedRows++;
        errors.push({
          row: importedRows + failedRows + 1,
          field: "geral",
          message: `Erro ao salvar funcionário: ${error.message}`,
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
      duration: 0,
    };
  }

  private isValidDate(dateString: string): boolean {
    if (!dateString || dateString.trim() === "") return false;

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dateString)) return false;

    const [, day, month, year] = dateString.match(dateRegex)!;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year)
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
