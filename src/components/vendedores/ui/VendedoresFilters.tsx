import React from "react";
import { Search } from "lucide-react";
import { FilterClearButton } from "../../common/FilterClearButton";
import CidadesFilter from "./CidadesFilter";

interface VendedoresFiltersProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  filtroCidade: string;
  setFiltroCidade: (cidade: string) => void;
  filtroStatus: string;
  setFiltroStatus: (status: string) => void;
}

export const VendedoresFilters: React.FC<VendedoresFiltersProps> = ({
  termoBusca,
  setTermoBusca,
  filtroCidade,
  setFiltroCidade,
  filtroStatus,
  setFiltroStatus,
}) => {
  const hasActiveFilters =
    termoBusca || filtroCidade || filtroStatus !== "todos";

  return (
    <div className="card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filtro de Cidade */}
        <div>
          <CidadesFilter
            value={filtroCidade}
            onChange={setFiltroCidade}
            placeholder="Filtrar por cidade"
          />
        </div>

        {/* Filtro de Status */}
        <div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input-field"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      {hasActiveFilters && (
        <FilterClearButton
          onClear={() => {
            setTermoBusca("");
            setFiltroCidade("");
            setFiltroStatus("todos");
          }}
        />
      )}
    </div>
  );
};
