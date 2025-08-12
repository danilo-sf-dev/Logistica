import React, { useState } from "react";
import { Users, Truck, Map, Calendar } from "lucide-react";
import { ExportModal } from "./ExportModal";
import type { RelatoriosDetalhadosProps } from "../types";

export const RelatoriosDetalhados: React.FC<RelatoriosDetalhadosProps> = ({
  onDownload,
  className = "",
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState("");

  const handleDownloadClick = (tipo: string) => {
    setSelectedTipo(tipo);
    setShowExportModal(true);
  };

  const handleExport = (formato: "pdf" | "csv") => {
    onDownload(selectedTipo, formato);
  };
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Relatórios Detalhados
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Exporte listas completas com todos os dados de cada entidade
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => handleDownloadClick("funcionarios_detalhado")}
          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Users className="h-8 w-8 text-primary-600 mb-2" />
          <span className="font-medium text-gray-900">Funcionários</span>
          <span className="text-xs text-gray-500">Lista completa</span>
        </button>

        <button
          onClick={() => handleDownloadClick("veiculos_detalhado")}
          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Truck className="h-8 w-8 text-primary-600 mb-2" />
          <span className="font-medium text-gray-900">Veículos</span>
          <span className="text-xs text-gray-500">Lista completa</span>
        </button>

        <button
          onClick={() => handleDownloadClick("rotas_detalhado")}
          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Map className="h-8 w-8 text-primary-600 mb-2" />
          <span className="font-medium text-gray-900">Rotas</span>
          <span className="text-xs text-gray-500">Lista completa</span>
        </button>

        <button
          onClick={() => handleDownloadClick("folgas_detalhado")}
          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-8 w-8 text-primary-600 mb-2" />
          <span className="font-medium text-gray-900">Folgas</span>
          <span className="text-xs text-gray-500">Lista completa</span>
        </button>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        titulo={selectedTipo
          .replace("_detalhado", "")
          .replace(/([A-Z])/g, " $1")
          .trim()}
      />
    </div>
  );
};

export default RelatoriosDetalhados;
