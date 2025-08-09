import React from "react";
import { MapPin, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { Cidade } from "components/cidades/types";
import type { OrdenacaoCampo, DirecaoOrdenacao } from "../state/useCidades";

type Props = {
  cidades: Cidade[];
  ordenarPor: OrdenacaoCampo;
  direcaoOrdenacao: DirecaoOrdenacao;
  onOrdenar: (campo: OrdenacaoCampo) => void;
  onEditar: (cidade: Cidade) => void;
  onExcluir: (id: string) => void;
};

export const CidadesTable: React.FC<Props> = ({
  cidades,
  ordenarPor,
  direcaoOrdenacao,
  onOrdenar,
  onEditar,
  onExcluir,
}) => {
  const renderSeta = (campo: OrdenacaoCampo) => {
    if (ordenarPor !== campo) return null;
    return direcaoOrdenacao === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("nome")}
            >
              <div className="flex items-center">
                Cidade {renderSeta("nome")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("estado")}
            >
              <div className="flex items-center">
                Estado {renderSeta("estado")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("regiao")}
            >
              <div className="flex items-center">
                Região {renderSeta("regiao")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("distancia")}
            >
              <div className="flex items-center">
                Distância {renderSeta("distancia")}
              </div>
            </th>
            <th className="table-header">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cidades.map((cidade) => (
            <tr key={cidade.id} className="hover:bg-gray-50">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {cidade.nome}
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{cidade.estado}</div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{cidade.regiao}</div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">
                  {cidade.distancia ? `${cidade.distancia} km` : "-"}
                </div>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditar(cidade)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onExcluir(cidade.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
