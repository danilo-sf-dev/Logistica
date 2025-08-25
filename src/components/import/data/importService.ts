import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import type {
  ImportConfig,
  ImportResult,
  ValidationResult,
  ImportLog,
  LastImportInfo,
} from "../types/importTypes";

// Importar XLSX dinamicamente para evitar problemas de SSR
let XLSX: any = null;

const loadXLSX = async () => {
  if (!XLSX && typeof window !== "undefined") {
    try {
      const module = await import("xlsx");
      XLSX = module;
    } catch (error) {
      // Erro silencioso ao carregar XLSX
    }
  }
  return XLSX;
};

export abstract class BaseImportService {
  protected abstract config: ImportConfig;

  async importFromExcel(file: File): Promise<ImportResult> {
    const startTime = Date.now();

    try {
      // 1. Parse do arquivo
      const data = await this.parseExcelFile(file);

      // 2. Validação
      const validationResult = await this.validateData(data);

      // Verificar se há erros de validação
      if (!validationResult.isValid) {
        return {
          success: false,
          totalRows: data.length,
          importedRows: 0,
          failedRows: data.length,
          errors: validationResult.errors,
          warnings: validationResult.warnings,
          duration: Date.now() - startTime,
        };
      }

      // 3. Transformação
      const transformedData = await this.transformData(data);

      // 4. Importação
      const result = await this.saveToDatabase(transformedData);

      // 5. Salvar log de importação (apenas se houver dados processados)
      result.duration = Date.now() - startTime;
      if (result.totalRows > 0) {
        await this.saveImportLog(result, file.name, file.size);
      }

      return result;
    } catch (error) {
      // Se o erro já contém "Erro na importação", não duplicar
      if (error.message.includes("Erro na importação")) {
        throw error;
      }
      throw new Error(`Erro na importação: ${error.message}`);
    }
  }

  async generateTemplate(): Promise<Blob> {
    const XLSX = await loadXLSX();
    if (!XLSX) {
      throw new Error("XLSX não está disponível");
    }

    const workbook = XLSX.utils.book_new();

    // Planilha 1: Instruções
    const instructionsSheet = this.createInstructionsSheet();
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instruções");

    // Planilha 2: Template
    const templateSheet = this.createTemplateSheet();
    XLSX.utils.book_append_sheet(workbook, templateSheet, "Template");

    // Planilha 3: Exemplo
    const exampleSheet = this.createExampleSheet();
    XLSX.utils.book_append_sheet(workbook, exampleSheet, "Exemplo");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  protected async parseExcelFile(file: File): Promise<any[]> {
    const XLSX = await loadXLSX();
    if (!XLSX) {
      throw new Error("XLSX não está disponível");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Detectar qual planilha contém os dados
          let sheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[sheetName];

          // Detectar qual planilha contém os dados
          if (workbook.SheetNames.length > 1) {
            // Priorizar planilhas que contenham palavras-chave relacionadas a dados
            const dataSheetKeywords = [
              "template",
              "dados",
              "data",
              "cidades",
              "funcionarios",
              "veiculos",
              "vendedores",
              "rotas",
              "folgas",
              "importacao",
            ];

            const templateSheetIndex = workbook.SheetNames.findIndex((name) =>
              dataSheetKeywords.some((keyword) =>
                name.toLowerCase().includes(keyword),
              ),
            );

            if (templateSheetIndex !== -1) {
              sheetName = workbook.SheetNames[templateSheetIndex];
              worksheet = workbook.Sheets[sheetName];
            } else {
              // Se não encontrar planilha com palavras-chave, usar a segunda planilha
              // (assumindo que a primeira é instruções)
              sheetName = workbook.SheetNames[1];
              worksheet = workbook.Sheets[sheetName];
            }
          } else {
            // Se há apenas uma planilha, verificar se não é apenas instruções
            const firstSheetData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });
            const hasData =
              firstSheetData.length > 1 &&
              firstSheetData.some(
                (row) =>
                  Array.isArray(row) &&
                  row.length > 0 &&
                  row.some((cell) => cell && cell.toString().trim() !== ""),
              );

            if (!hasData) {
              throw new Error(
                "Nenhuma planilha com dados encontrada. Certifique-se de preencher a planilha 'Template' ou uma planilha com dados.",
              );
            }
          }

          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // VALIDAÇÃO CRÍTICA: Verificar se o template é correto para a entidade
          if (jsonData.length > 0) {
            const headers = jsonData[0];
            const expectedHeaders = this.config.templateConfig.headers;

            // Verificar se pelo menos 70% dos cabeçalhos esperados estão presentes
            const matchingHeaders = expectedHeaders.filter((expectedHeader) =>
              headers.some(
                (header) =>
                  header &&
                  header
                    .toString()
                    .toLowerCase()
                    .includes(
                      expectedHeader.toLowerCase().replace("*", "").trim(),
                    ),
              ),
            );

            const matchPercentage =
              (matchingHeaders.length / expectedHeaders.length) * 100;

            if (matchPercentage < 70) {
              throw new Error(
                `Este arquivo parece ser um template de ${this.detectEntityTypeFromHeaders(headers)}, mas você está tentando importar para ${this.getEntityDisplayName()}. Por favor, use o template correto.`,
              );
            }
          }

          // Remover cabeçalhos e linhas vazias
          const cleanData = jsonData
            .slice(1) // Remove cabeçalho
            .filter((row: any) =>
              row.some(
                (cell: any) =>
                  cell !== null && cell !== undefined && cell !== "",
              ),
            );

          resolve(cleanData);
        } catch (error) {
          // Se o erro já contém nossa mensagem personalizada, não adicionar prefixo
          if (
            error.message.includes("Este arquivo parece ser um template de")
          ) {
            reject(error);
          } else {
            reject(
              new Error(`Erro ao processar arquivo Excel: ${error.message}`),
            );
          }
        }
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsArrayBuffer(file);
    });
  }

  // Método para detectar o tipo de entidade baseado nos cabeçalhos
  private detectEntityTypeFromHeaders(headers: any[]): string {
    const headerText = headers.join(" ").toLowerCase();

    if (
      headerText.includes("placa") ||
      headerText.includes("marca") ||
      headerText.includes("carroceria")
    ) {
      return "Veículos";
    }
    if (headerText.includes("cpf") && headerText.includes("cnh")) {
      return "Funcionários";
    }
    if (headerText.includes("cpf") && headerText.includes("região")) {
      return "Vendedores";
    }
    if (headerText.includes("nome") && headerText.includes("estado")) {
      return "Cidades";
    }
    if (
      headerText.includes("funcionário") ||
      headerText.includes("data início")
    ) {
      return "Folgas";
    }
    if (
      headerText.includes("peso mínimo") ||
      headerText.includes("dia semana")
    ) {
      return "Rotas";
    }

    return "Entidade Desconhecida";
  }

  protected createInstructionsSheet() {
    const templateConfig = this.config.templateConfig;
    const instructions = [
      [
        `IMPORTAÇÃO DE ${this.getEntityDisplayName().toUpperCase()} - INSTRUÇÕES`,
      ],
      [""],
      ["📋 COMO USAR ESTE TEMPLATE:"],
      [""],
      ["✅ OPÇÃO 1 - USO SIMPLES (RECOMENDADO):"],
      ["   1. Vá para a planilha 'Template'"],
      ["   2. Preencha seus dados na planilha 'Template'"],
      ["   3. Salve o arquivo"],
      ["   4. Faça upload no sistema"],
      ["   5. Pronto! Os dados serão importados automaticamente"],
      [""],
      ["✅ OPÇÃO 2 - PERSONALIZAÇÃO:"],
      ["   - Você pode excluir as planilhas 'Instruções' e 'Exemplo'"],
      ["   - Você pode renomear a planilha 'Template' para qualquer nome"],
      ["   - O sistema detectará automaticamente a planilha com dados"],
      [""],
      ["📝 REGRAS DE PREENCHIMENTO:"],
      ["   - Todos os campos marcados com * são obrigatórios"],
      ["   - Não deixe linhas em branco entre os dados"],
      [
        "   - Preencha apenas na planilha 'Template' (ou sua planilha renomeada)",
      ],
      [""],
      ["📊 FORMATO DOS DADOS:"],
      ...templateConfig.instructions.map((instruction) => [
        `   - ${instruction}`,
      ]),
      [""],
      ["🔍 VALIDAÇÕES:"],
      ...templateConfig.validations.map((validation) => [`   - ${validation}`]),
      [""],
      ["💡 DICA:"],
      ["   - Veja a planilha 'Exemplo' para referência de preenchimento"],
      [
        "   - O sistema aceita o arquivo mesmo se você excluir outras planilhas",
      ],
      [
        "   - O sistema aceita o arquivo mesmo se você renomear a planilha 'Template'",
      ],
    ];

    return XLSX.utils.aoa_to_sheet(instructions);
  }

  protected createTemplateSheet() {
    const templateConfig = this.config.templateConfig;
    return XLSX.utils.aoa_to_sheet([templateConfig.headers]);
  }

  protected createExampleSheet() {
    const templateConfig = this.config.templateConfig;
    return XLSX.utils.aoa_to_sheet([
      templateConfig.headers,
      ...templateConfig.exampleData,
    ]);
  }

  protected getEntityDisplayName(): string {
    const entityNames: Record<string, string> = {
      funcionarios: "Funcionários",
      veiculos: "Veículos",
      cidades: "Cidades",
      vendedores: "Vendedores",
      rotas: "Rotas",
      folgas: "Folgas",
    };
    return entityNames[this.config.entityType] || this.config.entityType;
  }

  protected abstract validateData(data: any[]): Promise<ValidationResult>;
  protected abstract transformData(data: any[]): Promise<any[]>;
  protected abstract saveToDatabase(data: any[]): Promise<ImportResult>;

  // Método para salvar log de importação
  protected async saveImportLog(
    result: ImportResult,
    fileName: string,
    fileSize: number,
  ): Promise<void> {
    try {
      // Obter usuário atual
      const currentUser = auth.currentUser;
      const userName =
        currentUser?.displayName || currentUser?.email || "Usuário";
      const userId = currentUser?.uid || "unknown";

      const importLog: Omit<ImportLog, "id"> = {
        userId,
        userName,
        entityType: this.config.entityType,
        fileName,
        fileSize,
        totalRows: result.totalRows,
        importedRows: result.importedRows,
        failedRows: result.failedRows,
        errors: result.errors || [],
        warnings: result.warnings || [],
        startTime: new Date(),
        endTime: new Date(),
        duration: result.duration,
        status:
          result.failedRows === 0
            ? "success"
            : result.importedRows > 0
              ? "partial"
              : "failed",
        ipAddress: "client-ip", // Implementar captura de IP
        userAgent: navigator.userAgent,
      };

      // Verificar se todos os campos obrigatórios estão definidos
      const sanitizedLog = Object.fromEntries(
        Object.entries(importLog).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );

      await addDoc(collection(db, "import_logs"), sanitizedLog);
    } catch (error) {
      // Não falhar a importação se o log falhar
    }
  }
}

// Serviço para buscar informações da última importação
export async function getLastImportInfo(
  entityType: string,
): Promise<LastImportInfo | null> {
  try {
    const importLogsRef = collection(db, "import_logs");

    // Primeiro, buscar apenas por entityType (sem orderBy para evitar necessidade de índice)
    const q = query(importLogsRef, where("entityType", "==", entityType));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // Ordenar os resultados no cliente
    const docs = snapshot.docs.sort((a, b) => {
      const aTime = a.data().startTime?.toDate?.() || new Date(0);
      const bTime = b.data().startTime?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime(); // Ordem decrescente
    });

    const doc = docs[0];
    const data = doc.data();

    const lastImport = {
      fileName: data.fileName,
      date: data.startTime?.toDate?.() || new Date(),
      status: data.status,
      userName: data.userName || "Usuário",
    };

    return lastImport;
  } catch (error) {
    return null;
  }
}

// Função para obter o serviço de importação específico
export function getImportService(entityType: string): BaseImportService {
  switch (entityType) {
    case "cidades":
      const { CidadesImportService } = require("./cidadesImportService");
      return new CidadesImportService();
    case "vendedores":
      const { VendedoresImportService } = require("./vendedoresImportService");
      return new VendedoresImportService();
    case "veiculos":
      const { VeiculosImportService } = require("./veiculosImportService");
      return new VeiculosImportService();
    case "funcionarios":
      const {
        FuncionariosImportService,
      } = require("./funcionariosImportService");
      return new FuncionariosImportService();
    // Adicionar outros serviços conforme implementados
    default:
      throw new Error(
        `Serviço de importação não encontrado para: ${entityType}`,
      );
  }
}
