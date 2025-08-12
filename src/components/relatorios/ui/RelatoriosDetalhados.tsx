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
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Relatórios Detalhados
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => handleDownloadClick("funcionarios_detalhado")}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Users className="h-6 w-6 text-primary-600 mr-2" />
          <span>Funcionários Detalhado</span>
        </button>

        <button
          onClick={() => handleDownloadClick("veiculos_detalhado")}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Truck className="h-6 w-6 text-primary-600 mr-2" />
          <span>Veículos Detalhado</span>
        </button>

        <button
          onClick={() => handleDownloadClick("rotas_detalhado")}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Map className="h-6 w-6 text-primary-600 mr-2" />
          <span>Rotas Detalhado</span>
        </button>

        <button
          onClick={() => handleDownloadClick("folgas_detalhado")}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Calendar className="h-6 w-6 text-primary-600 mr-2" />
          <span>Folgas Detalhado</span>
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
