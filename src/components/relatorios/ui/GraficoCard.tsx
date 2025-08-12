import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ExportModal } from "./ExportModal";
import type { GraficoCardProps } from "../types";

export const GraficoCard: React.FC<GraficoCardProps> = ({
  config,
  onDownload,
  className = "",
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleDownloadClick = () => {
    setShowExportModal(true);
  };

  const handleExport = (formato: "pdf" | "csv") => {
    // Converter o título para um formato que o switch case reconheça
    const tipo = config.titulo.toLowerCase().replace(/ /g, "_");
    console.log("Título convertido:", config.titulo, "->", tipo);
    onDownload(tipo, formato);
  };
  const renderGrafico = () => {
    if (config.tipo === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={config.dados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {config.dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (config.tipo === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={config.dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={config.cor || "#3B82F6"} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{config.titulo}</h3>
        <button
          onClick={handleDownloadClick}
          className="text-primary-600 hover:text-primary-900"
          title="Exportar relatório"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
      <div style={{ height: config.altura || 256 }}>{renderGrafico()}</div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        titulo={config.titulo}
      />
    </div>
  );
};

export default GraficoCard;
