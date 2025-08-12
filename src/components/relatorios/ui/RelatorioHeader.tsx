import React from "react";
import { Loader2 } from "lucide-react";
import type { RelatorioHeaderProps } from "../types";

export const RelatorioHeader: React.FC<RelatorioHeaderProps> = ({
  periodo,
  onPeriodoChange,
  loading = false,
  className = "",
}) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Análise detalhada das operações de logística
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={periodo}
            onChange={(e) => onPeriodoChange(e.target.value)}
            className="input-field w-40 pr-10"
            disabled={loading}
          >
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano</option>
          </select>
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioHeader;
