import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import type {
  ImportConfig,
  ImportResult,
  ValidationResult,
  ImportLog,
  LastImportInfo,
} from "../types/importTypes";

// Carregar ExcelJS dinamicamente
const loadExcelJS = async () => {
  let ExcelJS;
  if (!ExcelJS && typeof window !== "undefined") {
    try {
      const module = await import("exceljs");
      ExcelJS = module;
    } catch (error) {
      console.error("Erro ao carregar ExcelJS:", error);
      throw new Error("ExcelJS não está disponível");
    }
  }
  return ExcelJS;
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
    const ExcelJS = await loadExcelJS();
    if (!ExcelJS) {
      throw new Error("ExcelJS não está disponível");
    }

    const workbook = new ExcelJS.Workbook();

    // Planilha 1: Instruções
    const instructionsSheet = workbook.addWorksheet("Instruções");
    const instructions = this.createInstructionsSheet();
    instructions.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellObj = instructionsSheet.getCell(rowIndex + 1, colIndex + 1);
        cellObj.value = cell;
        if (rowIndex === 0) {
          cellObj.font = { bold: true, size: 12 };
        }
      });
    });

    // Planilha 2: Template
    const templateSheet = workbook.addWorksheet("Template");
    const templateConfig = this.config.templateConfig;
    templateConfig.headers.forEach((header, colIndex) => {
      const cell = templateSheet.getCell(1, colIndex + 1);
      cell.value = header;
      cell.font = { bold: true, size: 11 };
    });

    // Planilha 3: Exemplo
    const exampleSheet = workbook.addWorksheet("Exemplo");
    // Cabeçalhos
    templateConfig.headers.forEach((header, colIndex) => {
      const cell = exampleSheet.getCell(1, colIndex + 1);
      cell.value = header;
      cell.font = { bold: true, size: 11 };
    });
    // Dados de exemplo
    templateConfig.exampleData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellObj = exampleSheet.getCell(rowIndex + 2, colIndex + 1);
        cellObj.value = cell;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  protected async parseExcelFile(file: File): Promise<any[]> {
    const ExcelJS = await loadExcelJS();
    if (!ExcelJS) {
      throw new Error("ExcelJS não está disponível");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(data);

          // Detectar qual planilha contém os dados
          let worksheet = workbook.getWorksheet(1); // Primeira planilha por padrão

          // Detectar qual planilha contém os dados
          if (workbook.worksheets.length > 1) {
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

            const templateWorksheet = workbook.worksheets.find((ws) =>
              dataSheetKeywords.some((keyword) =>
                ws.name.toLowerCase().includes(keyword),
              ),
            );

            if (templateWorksheet) {
              worksheet = templateWorksheet;
            } else {
              // Se não encontrar planilha com palavras-chave, usar a segunda planilha
              // (assumindo que a primeira é instruções)
              worksheet = workbook.getWorksheet(2);
            }
          }

          if (!worksheet) {
            throw new Error(
              "Nenhuma planilha com dados encontrada. Certifique-se de preencher a planilha 'Template' ou uma planilha com dados.",
            );
          }

          // Converter para array de arrays
          const jsonData: any[][] = [];

          worksheet.eachRow((row, rowNumber) => {
            const rowData: any[] = [];
            // Ler todas as colunas, mesmo as vazias
            for (
              let colNumber = 1;
              colNumber <= worksheet.columnCount;
              colNumber++
            ) {
              const cell = row.getCell(colNumber);
              rowData.push(cell.value);
            }
            jsonData.push(rowData);
          });

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
            .slice(1)
            .filter((row) =>
              row.some((cell) => cell && cell.toString().trim() !== ""),
            );

          resolve(cleanData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  protected createInstructionsSheet(): string[][] {
    const entityName = this.getEntityDisplayName();
    const instructions = [
      [`IMPORTAÇÃO DE ${entityName.toUpperCase()} - INSTRUÇÕES`],
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
      ...this.config.templateConfig.instructions.map((instruction) => [
        instruction,
      ]),
      [""],
      ["🔍 VALIDAÇÕES:"],
      ...this.config.templateConfig.validations.map((validation) => [
        validation,
      ]),
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

    return instructions;
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
      const user = auth.currentUser;
      if (!user) {
        console.warn("Usuário não autenticado, não foi possível salvar log");
        return;
      }

      const importLog: Omit<ImportLog, "id"> = {
        userId: user.uid,
        userName: user.displayName || user.email || "Usuário",
        entityType: this.config.entityType,
        fileName,
        fileSize,
        totalRows: result.totalRows,
        importedRows: result.importedRows,
        failedRows: result.failedRows,
        errors: result.errors,
        warnings: result.warnings,
        startTime: new Date(),
        endTime: new Date(),
        duration: result.duration,
        status: result.success
          ? "success"
          : result.importedRows > 0
            ? "partial"
            : "failed",
        ipAddress: "N/A", // Pode ser implementado se necessário
        userAgent: navigator.userAgent,
      };

      await addDoc(collection(db, "import_logs"), importLog);
    } catch (error) {
      console.error("Erro ao salvar log de importação:", error);
    }
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

  protected detectEntityTypeFromHeaders(headers: any[]): string {
    const headerText = headers.join(" ").toLowerCase();

    if (headerText.includes("nome") && headerText.includes("cpf")) {
      return "Funcionários";
    } else if (headerText.includes("placa") && headerText.includes("marca")) {
      return "Veículos";
    } else if (headerText.includes("cidade") && headerText.includes("estado")) {
      return "Cidades";
    } else if (
      headerText.includes("vendedor") ||
      headerText.includes("região")
    ) {
      return "Vendedores";
    } else if (headerText.includes("rota") || headerText.includes("origem")) {
      return "Rotas";
    } else if (headerText.includes("folga") || headerText.includes("data")) {
      return "Folgas";
    }

    return "Desconhecido";
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
export async function getImportService(
  entityType: string,
): Promise<BaseImportService> {
  switch (entityType) {
    case "cidades":
      const { CidadesImportService } = await import("./cidadesImportService");
      return new CidadesImportService();
    case "vendedores":
      const { VendedoresImportService } = await import(
        "./vendedoresImportService"
      );
      return new VendedoresImportService();
    case "veiculos":
      const { VeiculosImportService } = await import("./veiculosImportService");
      return new VeiculosImportService();
    case "funcionarios":
      const { FuncionariosImportService } = await import(
        "./funcionariosImportService"
      );
      return new FuncionariosImportService();
    // Adicionar outros serviços conforme implementados
    default:
      throw new Error(
        `Serviço de importação não encontrado para: ${entityType}`,
      );
  }
}
