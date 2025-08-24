import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
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
      console.error("Erro ao carregar XLSX:", error);
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
      await this.validateData(data);

      // 3. Transformação
      const transformedData = await this.transformData(data);

      // 4. Importação
      const result = await this.saveToDatabase(transformedData);

      // 5. Salvar log de importação
      result.duration = Date.now() - startTime;
      await this.saveImportLog(result, file.name, file.size);

      return result;
    } catch (error) {
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
                name.toLowerCase().includes(keyword)
              )
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
                  row.some((cell) => cell && cell.toString().trim() !== "")
              );

            if (!hasData) {
              throw new Error(
                "Nenhuma planilha com dados encontrada. Certifique-se de preencher a planilha 'Template' ou uma planilha com dados."
              );
            }
          }

          // Log para debug - informar qual planilha está sendo lida
          console.log(
            `📊 Importação: Lendo planilha "${sheetName}" do arquivo ${file.name}`
          );
          console.log(
            `📋 Planilhas disponíveis: ${workbook.SheetNames.join(", ")}`
          );

          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Remover cabeçalhos e linhas vazias
          const cleanData = jsonData
            .slice(1) // Remove cabeçalho
            .filter((row: any) =>
              row.some(
                (cell: any) =>
                  cell !== null && cell !== undefined && cell !== ""
              )
            );

          resolve(cleanData);
        } catch (error) {
          reject(
            new Error(`Erro ao processar arquivo Excel: ${error.message}`)
          );
        }
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsArrayBuffer(file);
    });
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
    fileSize: number
  ): Promise<void> {
    try {
      // Obter usuário atual (simplificado - em produção usar contexto)
      const importLog: Omit<ImportLog, "id"> = {
        userId: "current-user", // Implementar captura do usuário atual
        userName: "Usuário", // Implementar captura do nome do usuário
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
        status:
          result.failedRows === 0
            ? "success"
            : result.importedRows > 0
              ? "partial"
              : "failed",
        ipAddress: "client-ip", // Implementar captura de IP
        userAgent: navigator.userAgent,
      };

      await addDoc(collection(db, "import_logs"), importLog);
    } catch (error) {
      console.error("Erro ao salvar log de importação:", error);
    }
  }
}

// Serviço para buscar informações da última importação
export async function getLastImportInfo(
  entityType: string
): Promise<LastImportInfo | null> {
  try {
    const importLogsRef = collection(db, "import_logs");
    const q = query(
      importLogsRef,
      where("entityType", "==", entityType),
      orderBy("startTime", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      entityType: data.entityType,
      fileName: data.fileName,
      date: data.startTime.toDate(),
      importedRows: data.importedRows,
      totalRows: data.totalRows,
      status: data.status,
      userId: data.userId,
      userName: data.userName || "Usuário",
    };
  } catch (error) {
    console.error("Erro ao buscar última importação:", error);
    return null;
  }
}

// Função para obter o serviço de importação específico
export function getImportService(entityType: string): BaseImportService {
  switch (entityType) {
    case "cidades":
      const { CidadesImportService } = require("./cidadesImportService");
      return new CidadesImportService();
    // Adicionar outros serviços conforme implementados
    default:
      throw new Error(
        `Serviço de importação não encontrado para: ${entityType}`
      );
  }
}
