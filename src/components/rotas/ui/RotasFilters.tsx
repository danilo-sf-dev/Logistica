import React from "react";
import { Search, Filter } from "lucide-react";
import { RotaFilters } from "../types";
import { FilterClearButton } from "../../common/FilterClearButton";

interface RotasFiltersProps {
  filters: RotaFilters;
  onFiltersChange: (filters: Partial<RotaFilters>) => void;
}

const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export const RotasFilters: React.FC<RotasFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <select
            value={filters.diaSemana || ""}
            onChange={(e) =>
              onFiltersChange({
                diaSemana: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os dias da semana</option>
            {DIAS_SEMANA.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(filters.searchTerm || filters.diaSemana) && (
        <FilterClearButton
          onClear={() =>
            onFiltersChange({ searchTerm: "", diaSemana: undefined })
          }
        />
      )}
    </div>
  );
};
