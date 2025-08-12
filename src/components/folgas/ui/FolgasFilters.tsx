import React from "react";
import { Search } from "lucide-react";
import type { StatusFolga, TipoFolga } from "../../../types";

interface FolgasFiltersProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  filtroStatus: "todos" | StatusFolga;
  setFiltroStatus: (status: "todos" | StatusFolga) => void;
  filtroTipo: "todos" | TipoFolga;
  setFiltroTipo: (tipo: "todos" | TipoFolga) => void;
}

export function FolgasFilters({
  termoBusca,
  setTermoBusca,
  filtroStatus,
  setFiltroStatus,
  filtroTipo,
  setFiltroTipo,
}: FolgasFiltersProps) {
  return (
    <div className="card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por motorista..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filtro de Status */}
        <div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
            className="input-field"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Filtro de Tipo */}
        <div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="input-field"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="folga">Folga</option>
            <option value="ferias">Férias</option>
            <option value="licenca">Licença Médica</option>
            <option value="atestado">Atestado</option>
            <option value="banco_horas">Banco de Horas</option>
            <option value="compensacao">Compensação</option>
            <option value="suspensao">Suspensão</option>
            <option value="afastamento">Afastamento</option>
            <option value="maternidade">Maternidade</option>
            <option value="paternidade">Paternidade</option>
            <option value="luto">Luto</option>
            <option value="casamento">Casamento</option>
            <option value="doacao_sangue">Doação de Sangue</option>
            <option value="servico_militar">Serviço Militar</option>
            <option value="capacitacao">Capacitação</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>
    </div>
  );
}
