import React from "react";
import { Search } from "lucide-react";
import { FilterClearButton } from "../../common/FilterClearButton";
import type { StatusFuncionario, TipoFuncao } from "../../../types";

interface FuncionariosFiltersProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  filtroStatus: StatusFuncionario | "todos";
  setFiltroStatus: (status: StatusFuncionario | "todos") => void;
  filtroFuncao: TipoFuncao | "todos";
  setFiltroFuncao: (funcao: TipoFuncao | "todos") => void;
  filtroAtivo: string;
  setFiltroAtivo: (ativo: string) => void;
}

export const FuncionariosFilters: React.FC<FuncionariosFiltersProps> = ({
  termoBusca,
  setTermoBusca,
  filtroStatus,
  setFiltroStatus,
  filtroFuncao,
  setFiltroFuncao,
  filtroAtivo,
  setFiltroAtivo,
}) => {
  const hasActiveFilters =
    termoBusca ||
    filtroStatus !== "todos" ||
    filtroFuncao !== "todos" ||
    filtroAtivo !== "todos";

  return (
    <div className="card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Filtro de Status */}
        <div>
          <select
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(e.target.value as StatusFuncionario | "todos")
            }
            className="input-field"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="folga">Folga</option>
            <option value="ferias">Férias</option>
          </select>
        </div>

        {/* Filtro de Função */}
        <div>
          <select
            value={filtroFuncao}
            onChange={(e) =>
              setFiltroFuncao(e.target.value as TipoFuncao | "todos")
            }
            className="input-field"
          >
            <option value="todos">Todas as Funções</option>
            <option value="motorista">Motorista</option>
            <option value="ajudante">Ajudante</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Filtro de Ativo/Inativo */}
        <div>
          <select
            value={filtroAtivo}
            onChange={(e) => setFiltroAtivo(e.target.value)}
            className="input-field"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      {hasActiveFilters && (
        <FilterClearButton
          onClear={() => {
            setTermoBusca("");
            setFiltroStatus("todos");
            setFiltroFuncao("todos");
            setFiltroAtivo("todos");
          }}
        />
      )}
    </div>
  );
};
