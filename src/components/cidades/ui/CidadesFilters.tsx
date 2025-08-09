import React from "react";
import { Search } from "lucide-react";

type Props = {
  termo: string;
  onChangeTermo: (value: string) => void;
};

export const CidadesFilters: React.FC<Props> = ({ termo, onChangeTermo }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar por nome, estado ou região..."
        value={termo}
        onChange={(e) => onChangeTermo(e.target.value)}
        className="input-field pl-10"
      />
    </div>
  );
};
