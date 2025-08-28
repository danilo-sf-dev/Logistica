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
          "Rua das Flores",
          "São Paulo",
          "outro",
          "15/12/2025",
          "E",
          "15/01/2024",
          "15/04/2024",
          "01/01/2024",
          "3500.00",
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
          "Av. Paulista",
          "Chapecó",
          "ajudante",
          "20/10/2025",
          "B",
          "20/02/2024",
          "20/05/2024",
          "15/02/2024",
          "2800.00",
          "Ajudante experiente",
        ],
      ],
      instructions: [
        "1. Preencha todos os campos marcados com *",
        "2. CPF deve ter 11 dígitos (sistema adiciona zero à esquerda automaticamente se necessário)",
        "3. CNH deve ser única no sistema",
        "4. Celular deve ter 10 ou 11 dígitos",
        "5. Email deve ser válido (opcional)",
        "6. CEP deve ter 8 dígitos",
        "7. Função: motorista, ajudante, outro, outros",
        "8. Datas devem estar no formato DD/MM/AAAA",
        "9. Salário deve ser numérico usando ponto decimal (ex: 3500.00)",
      ],
      validations: [
        "CPF deve ser único no sistema e ter 11 dígitos (sistema adiciona zero à esquerda automaticamente)",
        "CNH deve ser único no sistema",
        "Email deve ser único (se fornecido)",
        "CEP deve ter 8 dígitos",
        "Data de admissão deve ser válida",
        "Salário deve ser numérico (aceita 3500.00 ou 3500,00)",
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

        // Complemento não é obrigatório - validação comentada
        // if (!row[7]?.toString().trim()) {
        //   errors.push({
        //     row: rowNumber,
        //     field: "Complemento",
        //     message: "Complemento é obrigatório",
        //   });
        // }

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
        // Validar formato de CPF (10 ou 11 dígitos)
        if (row[1]) {
          const cpfLimpo = row[1].toString().replace(/\D/g, "");
          if (cpfLimpo.length === 10) {
            // Adicionar zero à esquerda se tiver 10 dígitos
            const cpfOriginal = row[1].toString().trim();
            row[1] = "0" + cpfLimpo;
            warnings.push({
              row: rowNumber,
              field: "CPF",
              message: `CPF "${cpfOriginal}" foi corrigido para "${row[1]}" (zero à esquerda adicionado automaticamente)`,
            });
          } else if (cpfLimpo.length !== 11) {
            errors.push({
              row: rowNumber,
              field: "CPF",
              message: `CPF "${row[1].toString().trim()}" deve ter 11 dígitos. Se o Excel removeu zeros à esquerda, adicione manualmente.`,
            });
          }
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

        // Validar formato do salário (se fornecido)
        if (row[16]) {
          const salaryValue = row[16].toString().trim();
          const convertedSalary = this.convertSalaryFormat(salaryValue);
          if (
            convertedSalary === salaryValue &&
            isNaN(parseFloat(salaryValue))
          ) {
            errors.push({
              row: rowNumber,
              field: "Salário",
              message: `Salário "${salaryValue}" deve ser um número válido (ex: 3500.00 ou 3500,00)`,
            });
          }
        }

        // Validar função
        const funcoesValidas = ["motorista", "ajudante", "outro", "outros"];
        if (
          row[10] &&
          !funcoesValidas.includes(row[10].toString().toLowerCase())
        ) {
          errors.push({
            row: rowNumber,
            field: "Função",
            message: `Função "${row[10].toString().trim()}" inválida. Opções válidas: motorista, ajudante, outro, outros`,
          });
        }

        // Validar formato de data (se fornecida)
        if (row[11]) {
          const cnhVencimento = row[11].toString().trim();
          // Verificar se é um número (erro de mapeamento)
          if (
            !isNaN(parseFloat(cnhVencimento)) &&
            cnhVencimento.includes(".")
          ) {
            errors.push({
              row: rowNumber,
              field: "CNH Vencimento",
              message: `Campo CNH Vencimento contém valor numérico "${cnhVencimento}". Verifique se os dados estão na coluna correta.`,
            });
          } else if (!this.isValidDate(cnhVencimento)) {
            warnings.push({
              row: rowNumber,
              field: "CNH Vencimento",
              message: `Data de vencimento da CNH "${cnhVencimento}" não está no formato DD/MM/AAAA`,
            });
          }
        }

        if (row[13]) {
          const toxicoUltimo = row[13].toString().trim();
          if (!isNaN(parseFloat(toxicoUltimo)) && toxicoUltimo.includes(".")) {
            errors.push({
              row: rowNumber,
              field: "Tóxico Último Exame",
              message: `Campo Tóxico Último Exame contém valor numérico "${toxicoUltimo}". Verifique se os dados estão na coluna correta.`,
            });
          } else if (!this.isValidDate(toxicoUltimo)) {
            warnings.push({
              row: rowNumber,
              field: "Tóxico Último Exame",
              message: `Data do último exame toxicológico "${toxicoUltimo}" não está no formato DD/MM/AAAA`,
            });
          }
        }

        if (row[14]) {
          const toxicoVenc = row[14].toString().trim();
          if (!isNaN(parseFloat(toxicoVenc)) && toxicoVenc.includes(".")) {
            errors.push({
              row: rowNumber,
              field: "Tóxico Vencimento",
              message: `Campo Tóxico Vencimento contém valor numérico "${toxicoVenc}". Verifique se os dados estão na coluna correta.`,
            });
          } else if (!this.isValidDate(toxicoVenc)) {
            warnings.push({
              row: rowNumber,
              field: "Tóxico Vencimento",
              message: `Data de vencimento do exame toxicológico "${toxicoVenc}" não está no formato DD/MM/AAAA`,
            });
          }
        }

        if (row[15]) {
          const dataAdmissao = row[15].toString().trim();
          if (!isNaN(parseFloat(dataAdmissao)) && dataAdmissao.includes(".")) {
            errors.push({
              row: rowNumber,
              field: "Data Admissão",
              message: `Campo Data Admissão contém valor numérico "${dataAdmissao}". Verifique se os dados estão na coluna correta.`,
            });
          } else if (!this.isValidDate(dataAdmissao)) {
            warnings.push({
              row: rowNumber,
              field: "Data Admissão",
              message: `Data de admissão "${dataAdmissao}" não está no formato DD/MM/AAAA`,
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

        // Complemento não é obrigatório - validação comentada
        // if (!row[7]?.toString().trim()) {
        //   errors.push({
        //     row: rowNumber,
        //     field: "Complemento",
        //     message: "Complemento é obrigatório",
        //   });
        // }

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
        // Construir endereço completo combinando endereço e complemento
        const enderecoBase = row[8]?.toString().trim().toUpperCase() || "";
        const complemento = row[7]?.toString().trim().toUpperCase() || "";
        const numero = row[6]?.toString().trim() || "";

        let enderecoCompleto = enderecoBase;
        if (numero) {
          enderecoCompleto += `, ${numero}`;
        }
        if (complemento) {
          enderecoCompleto += ` - ${complemento}`;
        }

        // Garantir que CPF tenha 11 dígitos
        let cpfProcessado = row[1]?.toString().trim() || "";
        if (cpfProcessado) {
          const cpfLimpo = cpfProcessado.replace(/\D/g, "");
          if (cpfLimpo.length === 10) {
            cpfProcessado = "0" + cpfLimpo;
          } else {
            cpfProcessado = cpfLimpo;
          }
        }

        const funcionario: FuncionarioInput = {
          nome: row[0]?.toString().trim().toUpperCase() || "",
          cpf: cpfProcessado,
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
          salario: this.convertSalaryFormat(row[16]?.toString().trim() || ""),
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

  private convertDateToISO(dateString: any): string {
    if (!dateString) {
      return "";
    }

    // Se for um objeto Date, converter para string
    if (dateString instanceof Date) {
      const day = dateString.getDate().toString().padStart(2, "0");
      const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
      const year = dateString.getFullYear();
      return `${year}-${month}-${day}`;
    }

    const dateStr = dateString.toString();

    // Tentar converter string de data JavaScript para Date
    if (dateStr.includes("GMT") || dateStr.includes("UTC")) {
      try {
        // Extrair a data da string JavaScript (ex: "Tue Aug 26 2025 21:00:00 GMT-0300")
        // Usar regex para extrair dia, mês e ano
        const dateMatch = dateStr.match(
          /(\w{3})\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/,
        );
        if (dateMatch) {
          const [, , monthName, day, year] = dateMatch;
          const monthMap: { [key: string]: string } = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          const month = monthMap[monthName];
          if (month) {
            return `${year}-${month}-${day.padStart(2, "0")}`;
          }
        }

        // Fallback: tentar criar Date e usar métodos locais
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
          const day = dateObj.getDate().toString().padStart(2, "0");
          const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObj.getFullYear();
          return `${year}-${month}-${day}`;
        }
      } catch (error) {
        // Ignorar erro e tentar outros formatos
      }
    }

    // Se for string no formato DD/MM/AAAA, validar e converter
    if (this.isValidDate(dateStr)) {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateStr.match(dateRegex);

      if (match) {
        const [, day, month, year] = match;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    return "";
  }

  private convertSalaryFormat(salaryString: string): string {
    if (!salaryString || salaryString.trim() === "") return "";

    // Remover espaços
    let salary = salaryString.trim();

    // Se contém vírgula, converter para ponto decimal
    if (salary.includes(",")) {
      // Substituir vírgula por ponto
      salary = salary.replace(",", ".");
    }

    // Validar se é um número válido
    const numericValue = parseFloat(salary);
    if (isNaN(numericValue)) {
      return salary; // Retorna o valor original se não for numérico
    }

    // Retornar como string com ponto decimal
    return numericValue.toString();
  }
}
