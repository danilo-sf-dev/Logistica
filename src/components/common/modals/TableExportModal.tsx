import React from "react";
import { X, Download } from "lucide-react";

interface TableExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  titulo: string;
  nomeArquivo: string;
}

export const TableExportModal: React.FC<TableExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  titulo,
  nomeArquivo,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    onExport();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Exportar {titulo}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Exportar a lista de {titulo.toLowerCase()} para Excel com os filtros
            e ordenação aplicados.
          </p>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Nome do arquivo:</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {nomeArquivo}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
};
