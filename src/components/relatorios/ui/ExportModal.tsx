import React, { useState, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (formato: "pdf" | "csv") => void;
  titulo: string;
  disablePDF?: boolean; // Nova prop para desabilitar PDF
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  titulo,
  disablePDF = false,
}) => {
  const [formato, setFormato] = useState<"pdf" | "csv">("pdf");

  // Se PDF estiver desabilitado, forçar Excel como padrão
  useEffect(() => {
    if (disablePDF) {
      setFormato("csv");
    } else {
      setFormato("pdf");
    }
  }, [disablePDF]);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(formato);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Exportar Relatório
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Selecione o formato para exportar o relatório detalhado de{" "}
            <strong>{titulo}</strong>:
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Este relatório incluirá todos os dados e campos de{" "}
            {titulo.toLowerCase()}.
          </p>

          <div className="space-y-3">
            <label
              className={`flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                disablePDF ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="radio"
                name="formato"
                value="pdf"
                checked={formato === "pdf"}
                onChange={(e) => setFormato(e.target.value as "pdf" | "csv")}
                disabled={disablePDF}
                className="mr-3"
              />
              <FileText className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <div className="font-medium">PDF</div>
                <div className="text-sm text-gray-500">
                  Documento formatado para impressão
                  {disablePDF && (
                    <span className="text-red-500 ml-1">
                      (Não disponível para este relatório)
                    </span>
                  )}
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="formato"
                value="csv"
                checked={formato === "csv"}
                onChange={(e) => setFormato(e.target.value as "pdf" | "csv")}
                className="mr-3"
              />
              <FileSpreadsheet className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="font-medium">Excel (XLSX)</div>
                <div className="text-sm text-gray-500">
                  Planilha para análise de dados
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
