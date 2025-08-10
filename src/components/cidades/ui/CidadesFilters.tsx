import React from "react";
import { Search } from "lucide-react";
import { REGIOES_BRASIL } from "utils/constants";

type Props = {
  termo: string;
  onChangeTermo: (value: string) => void;
  filtroRegiao: string;
  onChangeFiltroRegiao: (value: string) => void;
};

export const CidadesFilters: React.FC<Props> = ({ 
  termo, 
  onChangeTermo, 
  filtroRegiao, 
  onChangeFiltroRegiao 
}) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, estado ou região..."
          value={termo}
          onChange={(e) => onChangeTermo(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      
      <div className="w-48">
        <select
          value={filtroRegiao}
          onChange={(e) => onChangeFiltroRegiao(e.target.value)}
          className="input-field"
        >
          <option value="">Todas as regiões</option>
          {REGIOES_BRASIL.map((regiao) => (
            <option key={regiao.valor} value={regiao.valor}>
              {regiao.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
