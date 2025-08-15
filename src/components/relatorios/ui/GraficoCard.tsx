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
  LineChart,
  Line,
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
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={config.altura || 256}>
            <PieChart>
              <Pie
                data={config.dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {config.dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} (${((value / config.dados.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda separada */}
          <div className="mt-6 w-full">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {config.dados.map((entry, index) => (
                <div
                  key={`legend-${index}`}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700 block truncate">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
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

    if (config.tipo === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={config.dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.cor || "#3B82F6"}
              strokeWidth={2}
              dot={{ fill: config.cor || "#3B82F6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (config.tipo === "horizontal-bar") {
      console.log("=== DEBUG GRÁFICO HORIZONTAL ===");
      console.log("Config recebida:", config);
      console.log("Dados originais:", config.dados);

      // Verificar se os dados têm a estrutura correta
      const dadosValidos = config.dados.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "name" in item &&
          "value" in item &&
          typeof item.value === "number" &&
          item.value > 0,
      );

      const total = dadosValidos.reduce((sum, item) => sum + item.value, 0);
      const dadosOrdenados = [...dadosValidos].sort(
        (a, b) => b.value - a.value,
      );

      console.log("Dados processados:", {
        dadosValidos,
        dadosOrdenados,
        total,
        altura: config.altura,
      });

      // Se não há dados válidos, mostrar mensagem
      if (dadosOrdenados.length === 0) {
        console.log("Nenhum dado válido encontrado");
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">
                Nenhum dado disponível
              </p>
              <p className="text-gray-400 text-sm">
                Não há{" "}
                {config.titulo.toLowerCase().includes("rotas")
                  ? "rotas"
                  : "folgas"}{" "}
                para exibir
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Dados recebidos: {JSON.stringify(config.dados)}
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col h-full">
          <div style={{ height: config.altura || 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosOrdenados}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any, name: any) => {
                    const tipo = config.titulo.toLowerCase().includes("rotas")
                      ? "rotas"
                      : "folgas";
                    const percent =
                      total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                    return [`${value} ${tipo} (${percent}%)`, name];
                  }}
                  labelStyle={{ fontWeight: 600, color: "#374151" }}
                />
                <Bar
                  dataKey="value"
                  fill={config.cor || "#3B82F6"}
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legenda personalizada */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {dadosOrdenados.map((entry, index) => {
              const percent =
                total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
              return (
                <div
                  key={`legend-${index}`}
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {entry.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded">
                    {entry.value}
                  </span>
                  <span className="text-xs text-gray-500">({percent}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{config.titulo}</h3>
          {config.tipo === "horizontal-bar" && (
            <p className="text-sm text-gray-500 mt-1">
              Total: {config.dados.reduce((sum, item) => sum + item.value, 0)}{" "}
              {config.titulo.toLowerCase().includes("rotas")
                ? "rotas"
                : "folgas"}
            </p>
          )}
        </div>
        <button
          onClick={handleDownloadClick}
          className="text-primary-600 hover:text-primary-900"
          title="Exportar relatório"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
      <div>{renderGrafico()}</div>

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
