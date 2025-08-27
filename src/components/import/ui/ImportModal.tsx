import React, { useState, useEffect } from "react";
import { X, Upload, Download, Info } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { LastImportInfo } from "./LastImportInfo";
import { getImportService, getLastImportInfo } from "../data/importService";
import type {
  ImportResult,
  LastImportInfo as LastImportInfoType,
} from "../types/importTypes";
import { saveAs } from "file-saver";

interface ImportModalProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: ImportResult) => void;
}

// Modal simples para importação
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const ImportModal: React.FC<ImportModalProps> = ({
  entityType,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<
    "template" | "upload" | "validation" | "progress" | "result"
  >("template");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [lastImport, setLastImport] = useState<LastImportInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Carregar informações da última importação
  useEffect(() => {
    if (isOpen) {
      loadLastImportInfo(entityType);
    }
  }, [isOpen, entityType]);

  const loadLastImportInfo = async (entityType: string) => {
    try {
      const lastImportInfo = await getLastImportInfo(entityType);
      setLastImport(lastImportInfo);
    } catch (error) {
      // Silenciar erro de última importação para não poluir o console
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true);
      const service = await getImportService(entityType);
      const template = await service.generateTemplate();
      saveAs(template, `template_${entityType}.xlsx`);
    } catch (error) {
      console.error("Erro ao gerar template:", error);
      alert(`Erro ao gerar template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStep("validation");
  };

  const handleValidation = async () => {
    if (!file) return;

    setStep("progress");
    const service = await getImportService(entityType);

    try {
      setProgress({ status: "importing", message: "Importando dados..." });
      const result = await service.importFromExcel(file);
      setResult(result);
      setStep("result");

      // Só chamar onSuccess se a importação foi bem-sucedida
      if (result.success) {
        onSuccess(result);
        // Atualizar informações da última importação apenas se foi bem-sucedida
        await loadLastImportInfo(entityType);
      }
    } catch (error) {
      setProgress({
        status: "error",
        message: error.message,
      });
    }
  };

  const getEntityName = (entityType: string): string => {
    const entityNames: Record<string, string> = {
      funcionarios: "Funcionários",
      veiculos: "Veículos",
      cidades: "Cidades",
      vendedores: "Vendedores",
      rotas: "Rotas",
      folgas: "Folgas",
    };
    return entityNames[entityType] || entityType;
  };

  const handleClose = () => {
    setStep("template");
    setFile(null);
    setProgress(null);
    setResult(null);
    setShowAllErrors(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-6 p-6 min-h-0">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Importar {getEntityName(entityType)}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Informações da Última Importação */}
        <LastImportInfo lastImport={lastImport} />

        {/* Etapa 1: Template */}
        {step === "template" && (
          <div className="space-y-4">
            <div className="text-center">
              <Download className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-lg font-medium text-gray-900">
                Baixar Template
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Baixe o template Excel com as instruções e exemplos para
                preenchimento correto dos dados.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 mb-2">
                O que o template contém:
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Planilha com instruções detalhadas</li>
                <li>• Template vazio para preenchimento</li>
                <li>• Exemplos de dados corretos</li>
                <li>• Validações e regras de negócio</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownloadTemplate}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Baixar Template Excel
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep("upload")}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Já tenho o arquivo preenchido →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 2: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-lg font-medium text-gray-900">
                Fazer Upload
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Selecione o arquivo Excel preenchido para importar os dados.
              </p>
            </div>

            <FileUpload
              onFileSelect={handleFileUpload}
              acceptedTypes={[".xlsx", ".xls"]}
              maxSize={10 * 1024 * 1024} // 10MB
            />

            <div className="flex justify-between">
              <button
                onClick={() => setStep("template")}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                ← Voltar para Template
              </button>
            </div>
          </div>
        )}

        {/* Etapa 3: Validação */}
        {step === "validation" && file && (
          <div className="space-y-4">
            <div className="text-center">
              <Info className="mx-auto h-12 w-12 text-blue-400" />
              <h4 className="mt-2 text-lg font-medium text-gray-900">
                Validar Arquivo
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Arquivo selecionado:{" "}
                <span className="font-medium">{file.name}</span>
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                O arquivo será validado antes da importação. Clique em
                "Importar" para continuar.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("upload")}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                ← Selecionar outro arquivo
              </button>
              <button onClick={handleValidation} className="btn-primary">
                Importar Dados
              </button>
            </div>
          </div>
        )}

        {/* Etapa 4: Progresso */}
        {step === "progress" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <h4 className="mt-2 text-lg font-medium text-gray-900">
                Importando...
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {progress?.status === "error"
                  ? "Erro detectado"
                  : "Processando arquivo..."}
              </p>
            </div>

            {progress?.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{progress.message}</p>
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => setStep("upload")}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Etapa 5: Resultado */}
        {step === "result" && result && (
          <div className="space-y-4">
            <div
              className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${
                result.success
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {result.success ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
            </div>
            <h4 className="mt-2 text-lg font-medium text-gray-900">
              {result.success ? "Importação Concluída" : "Importação Falhou"}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              {result.importedRows} de {result.totalRows} registros importados
              {result.failedRows > 0 && (
                <span className="text-red-600 font-medium">
                  {" "}
                  ({result.failedRows} falharam)
                </span>
              )}
            </p>
            {result.errors.length > 10 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-orange-800">
                    ⚠️ Muitos erros encontrados ({result.errors.length})
                  </p>
                  <button
                    onClick={() => setShowAllErrors(!showAllErrors)}
                    className="text-xs bg-orange-200 hover:bg-orange-300 px-2 py-1 rounded"
                  >
                    {showAllErrors ? "Recolher" : "Ver Todos"}
                  </button>
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-red-900 mb-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Erros encontrados ({result.errors.length}):
                </h5>
                <div
                  className={`overflow-y-auto space-y-2 pr-2 ${
                    result.errors.length > 10 && !showAllErrors
                      ? "max-h-40"
                      : "max-h-60"
                  }`}
                >
                  {(result.errors.length > 10 && !showAllErrors
                    ? result.errors.slice(0, 5)
                    : result.errors
                  ).map((error, index) => (
                    <div
                      key={index}
                      className="bg-red-100 border border-red-300 rounded p-2"
                    >
                      <p className="text-sm font-medium text-red-800">
                        Linha {error.row}: {error.field}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {error.message}
                      </p>
                    </div>
                  ))}
                  {result.errors.length > 10 && !showAllErrors && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        ... e mais {result.errors.length - 5} erros
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-yellow-900 mb-2">
                  Avisos ({result.warnings.length}):
                </h5>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                  {result.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="bg-yellow-100 border border-yellow-300 rounded p-2"
                    >
                      <p className="text-sm font-medium text-yellow-800">
                        Linha {warning.row}: {warning.field}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        {warning.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              {!result.success && (
                <button
                  onClick={() => setStep("template")}
                  className="btn-secondary"
                >
                  Tentar Novamente
                </button>
              )}
              <button onClick={handleClose} className="btn-primary">
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
