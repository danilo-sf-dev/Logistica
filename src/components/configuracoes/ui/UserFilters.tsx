import React from "react";
import { Filter } from "lucide-react";
import type { UserRole } from "../../../types/permissions";

interface UserFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: {
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
  };
  roleDisplayNames: Array<{ value: UserRole; label: string }>;
  applyFilters: (
    filters: Partial<{
      searchTerm: string;
      roleFilter: string;
      statusFilter: string;
    }>,
  ) => void;
  clearFilters: () => void;
  filteredUsersCount: number;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  showFilters,
  setShowFilters,
  filters,
  roleDisplayNames,
  applyFilters,
  clearFilters,
  filteredUsersCount,
}) => {
  const hasActiveFilters =
    filters.searchTerm ||
    filters.roleFilter !== "" ||
    filters.statusFilter !== "all";

  return (
    <>
      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            className="btn-secondary flex items-center w-full sm:w-auto justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
            Filtros
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-center sm:justify-end">
          <span>Total: {filteredUsersCount} usuários</span>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome, email ou cargo..."
                value={filters.searchTerm}
                onChange={(e) => applyFilters({ searchTerm: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil
              </label>
              <select
                value={filters.roleFilter}
                onChange={(e) => applyFilters({ roleFilter: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Todos os perfis</option>
                {roleDisplayNames.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.statusFilter}
                onChange={(e) => applyFilters({ statusFilter: e.target.value })}
                className="input-field w-full"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="temporary">Temporários</option>
              </select>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button onClick={clearFilters} className="btn-secondary text-sm">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
