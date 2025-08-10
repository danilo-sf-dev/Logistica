import React from "react";
import { Edit, Trash2, Map, Calendar } from "lucide-react";
import { Rota } from "../types";

interface RotasTableProps {
  rotas: Rota[];
  onEdit: (rota: Rota) => void;
  onDelete: (rota: Rota) => void;
  loading: boolean;
}

export const RotasTable: React.FC<RotasTableProps> = ({
  rotas,
  onEdit,
  onDelete,
  loading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getDiaSemanaColor = (diaSemana: string | string[]) => {
    const colors: { [key: string]: string } = {
      "Segunda-feira": "bg-blue-100 text-blue-800",
      "Terça-feira": "bg-green-100 text-green-800",
      "Quarta-feira": "bg-yellow-100 text-yellow-800",
      "Quinta-feira": "bg-purple-100 text-purple-800",
      "Sexta-feira": "bg-orange-100 text-orange-800",
      Sábado: "bg-red-100 text-red-800",
      Domingo: "bg-gray-100 text-gray-800",
    };

    // Se for um array, retorna a cor do primeiro dia (para compatibilidade)
    if (Array.isArray(diaSemana)) {
      return colors[diaSemana[0]] || "bg-gray-100 text-gray-800";
    }

    return colors[diaSemana] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!rotas || rotas.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Map className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma rota encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando uma nova rota para começar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Rota</th>
              <th className="table-header">Data</th>
              <th className="table-header">Dia da Semana</th>
              <th className="table-header">Peso Mínimo</th>
              <th className="table-header">Cidades</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(rotas || []).map((rota) => (
              <tr key={rota.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Map className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {rota.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        Criada em{" "}
                        {rota.dataCriacao
                          ? formatDate(rota.dataCriacao.toISOString())
                          : "Data não disponível"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="table-cell">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(rota.dataRota)}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="space-y-1 min-h-[2.5rem] flex flex-col justify-center">
                    {Array.isArray(rota.diaSemana) &&
                    rota.diaSemana.length > 0 ? (
                      rota.diaSemana.map((dia, index) => (
                        <div
                          key={index}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getDiaSemanaColor(dia)} w-fit`}
                        >
                          {dia}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Nenhum dia definido
                      </span>
                    )}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {rota.pesoMinimo > 0
                      ? `${rota.pesoMinimo} kg`
                      : "Não definido"}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {rota.cidades && rota.cidades.length > 0 ? (
                      <span className="font-medium">
                        {rota.cidades.length} cidade
                        {rota.cidades.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-400">0 cidades</span>
                    )}
                  </div>
                </td>

                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(rota)}
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                      title="Editar rota"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(rota)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Excluir rota"
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
    </div>
  );
};
