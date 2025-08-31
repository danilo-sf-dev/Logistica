import React from "react";
import { useRelatorios } from "../state/useRelatorios";
import { RelatorioHeader } from "../ui/RelatorioHeader";
import { ResumoCards } from "../ui/ResumoCards";
import { GraficoCard } from "../ui/GraficoCard";
import { RelatoriosDetalhados } from "../ui/RelatoriosDetalhados";

import type { RelatoriosProps } from "../types";

export const RelatoriosPage: React.FC<RelatoriosProps> = ({
  className = "",
}) => {
  const {
    loading,
    loadingDownload,
    periodo,
    dadosMotoristas,
    dadosFuncionarios,
    dadosVeiculos,
    dadosRotas,
    dadosFolgas,
    handleDownload,
    handlePeriodoChange,
  } = useRelatorios();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <RelatorioHeader
        periodo={periodo}
        onPeriodoChange={handlePeriodoChange}
        loading={loading}
      />

      {/* Cards de Resumo */}
      <ResumoCards
        dadosMotoristas={dadosMotoristas}
        dadosFuncionarios={dadosFuncionarios}
        dadosVeiculos={dadosVeiculos}
        dadosRotas={dadosRotas}
        dadosFolgas={dadosFolgas}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Status dos Motoristas */}
        <GraficoCard
          config={{
            titulo: "Status dos Motoristas",
            tipo: "pie",
            dados: dadosMotoristas,
            altura: 256,
          }}
        />

        {/* Status dos Veículos */}
        <GraficoCard
          config={{
            titulo: "Status dos Veículos",
            tipo: "pie",
            dados: dadosVeiculos,
            altura: 256,
          }}
        />

        {/* Status das Rotas - Gráfico de Barras Horizontais */}
        <GraficoCard
          config={{
            titulo: "Status das Rotas",
            tipo: "horizontal-bar",
            dados: dadosRotas,
            altura: 256,
            cor: "#3B82F6",
          }}
        />

        {/* Status das Folgas - Gráfico de Barras Horizontais */}
        <GraficoCard
          config={{
            titulo: "Status das Folgas",
            tipo: "horizontal-bar",
            dados: dadosFolgas,
            altura: 256,
            cor: "#F59E0B",
          }}
        />
      </div>

      {/* Relatórios Detalhados */}
      <RelatoriosDetalhados
        onDownload={handleDownload}
        loading={loadingDownload}
      />
    </div>
  );
};

export default RelatoriosPage;
