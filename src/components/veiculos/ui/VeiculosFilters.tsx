import React from "react";
import { Search } from "lucide-react";
import { VeiculosFiltersType } from "../types";
import { FilterClearButton } from "../../common/FilterClearButton";

interface VeiculosFiltersProps {
  filters: VeiculosFiltersType;
  onFiltersChange: (filters: Partial<VeiculosFiltersType>) => void;
}

export const VeiculosFiltersComponent: React.FC<VeiculosFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo ou marca..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="input-field pl-10"
          />
        </div>

        {/* Status */}
        <div>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              onFiltersChange({ status: e.target.value || undefined })
            }
            className="input-field"
          >
            <option value="">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="em_uso">Em Uso</option>
            <option value="manutencao">Manutenção</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* Tipo de Carroceria */}
        <div>
          <select
            value={filters.tipoCarroceria || ""}
            onChange={(e) =>
              onFiltersChange({ tipoCarroceria: e.target.value || undefined })
            }
            className="input-field"
          >
            <option value="">Todas as Carrocerias</option>
            <option value="truck">Truck</option>
            <option value="toco">Toco</option>
            <option value="bitruck">Bitruck</option>
            <option value="carreta">Carreta</option>
            <option value="carreta_ls">Carreta LS</option>
            <option value="carreta_3_eixos">Carreta 3 Eixos</option>
            <option value="truck_3_eixos">Truck 3 Eixos</option>
            <option value="truck_4_eixos">Truck 4 Eixos</option>
          </select>
        </div>

        {/* Tipo de Baú */}
        <div>
          <select
            value={filters.tipoBau || ""}
            onChange={(e) =>
              onFiltersChange({ tipoBau: e.target.value || undefined })
            }
            className="input-field"
          >
            <option value="">Todos os Baús</option>
            <option value="frigorifico">Frigorífico</option>
            <option value="carga_seca">Carga Seca</option>
            <option value="baucher">Baucher</option>
            <option value="graneleiro">Graneleiro</option>
            <option value="tanque">Tanque</option>
            <option value="caçamba">Caçamba</option>
            <option value="plataforma">Plataforma</option>
          </select>
        </div>

        {/* Unidade de Negócio */}
        <div>
          <select
            value={filters.unidadeNegocio || ""}
            onChange={(e) =>
              onFiltersChange({ unidadeNegocio: e.target.value || undefined })
            }
            className="input-field"
          >
            <option value="">Todas as Unidades</option>
            <option value="frigorifico">Frigorífico</option>
            <option value="ovos">Ovos</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      {(filters.status ||
        filters.tipoCarroceria ||
        filters.tipoBau ||
        filters.unidadeNegocio) && (
        <FilterClearButton
          onClear={() =>
            onFiltersChange({
              status: undefined,
              tipoCarroceria: undefined,
              tipoBau: undefined,
              unidadeNegocio: undefined,
            })
          }
        />
      )}
    </div>
  );
};
