import React from "react";
import {
  Edit,
  Trash2,
  Check,
  X,
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Folga } from "../types";
import type { TipoFolga } from "../../../types";
import type { OrdenacaoCampo } from "../state/useFolgas";
import type { DirecaoOrdenacao } from "../../../types";

interface FolgasTableProps {
  folgas: Folga[];
  loading: boolean;
  ordenarPor: OrdenacaoCampo;
  direcaoOrdenacao: DirecaoOrdenacao;
  alternarOrdenacao: (campo: OrdenacaoCampo) => void;
  editarFolga: (folga: Folga) => void;
  excluirFolga: (folga: Folga) => void;
  aprovarFolga: (id: string) => void;
  rejeitarFolga: (id: string) => void;
}

export function FolgasTable({
  folgas,
  loading,
  ordenarPor,
  direcaoOrdenacao,
  alternarOrdenacao,
  editarFolga,
  excluirFolga,
  aprovarFolga,
  rejeitarFolga,
}: FolgasTableProps) {
  const getStatusColor = (status: Folga["status"]) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "aprovada":
        return "bg-green-100 text-green-800";
      case "rejeitada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Folga["status"]) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "aprovada":
        return "Aprovada";
      case "rejeitada":
        return "Rejeitada";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  const getTipoText = (tipo: TipoFolga) => {
    switch (tipo) {
      case "folga":
        return "Folga";
      case "ferias":
        return "Férias";
      case "licenca":
        return "Licença Médica";
      case "atestado":
        return "Atestado";
      case "banco_horas":
        return "Banco de Horas";
      case "compensacao":
        return "Compensação";
      case "suspensao":
        return "Suspensão";
      case "afastamento":
        return "Afastamento";
      case "maternidade":
        return "Maternidade";
      case "paternidade":
        return "Paternidade";
      case "luto":
        return "Luto";
      case "casamento":
        return "Casamento";
      case "doacao_sangue":
        return "Doação de Sangue";
      case "servico_militar":
        return "Serviço Militar";
      case "capacitacao":
        return "Capacitação";
      case "outros":
        return "Outros";
      default:
        return "Desconhecido";
    }
  };

  const renderSortIcon = (campo: OrdenacaoCampo) => {
    if (ordenarPor !== campo) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return direcaoOrdenacao === "asc" ? (
      <ChevronUp className="h-4 w-4 text-gray-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-600" />
    );
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

  if (folgas.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma folga encontrada
            </h3>
            <p className="text-gray-500">
              Não há solicitações de folgas para exibir.
            </p>
          </div>
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
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => alternarOrdenacao("funcionarioNome")}
              >
                <div className="flex items-center space-x-1">
                  <span>Funcionário</span>
                  {renderSortIcon("funcionarioNome")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => alternarOrdenacao("tipo")}
              >
                <div className="flex items-center space-x-1">
                  <span>Tipo</span>
                  {renderSortIcon("tipo")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => alternarOrdenacao("dataInicio")}
              >
                <div className="flex items-center space-x-1">
                  <span>Período</span>
                  {renderSortIcon("dataInicio")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => alternarOrdenacao("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {folgas.map((folga) => (
              <tr key={folga.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {folga.funcionarioNome}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {getTipoText(folga.tipo)}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    <div>Início: {folga.dataInicio}</div>
                    <div>Fim: {folga.dataFim}</div>
                    {(folga.tipo === "banco_horas" ||
                      folga.tipo === "compensacao") &&
                      folga.horas && (
                        <div className="text-xs text-gray-500 mt-1">
                          {folga.horas}h
                        </div>
                      )}
                  </div>
                </td>
                <td className="table-cell">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      folga.status,
                    )}`}
                  >
                    {getStatusText(folga.status)}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editarFolga(folga)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {folga.status === "pendente" && (
                      <>
                        <button
                          onClick={() => aprovarFolga(folga.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Aprovar"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rejeitarFolga(folga.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Rejeitar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => excluirFolga(folga)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
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
}
