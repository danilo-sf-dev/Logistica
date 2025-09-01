import React from "react";
import {
  Edit,
  Truck,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle,
} from "lucide-react";
import { Veiculo, VeiculosSortConfig } from "../types";

interface VeiculosTableProps {
  veiculos: Veiculo[];
  loading: boolean;
  sortConfig: VeiculosSortConfig;
  onSort: (field: keyof Veiculo) => void;
  onEdit: (veiculo: Veiculo) => void;
  onToggleStatus: (veiculo: Veiculo) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const VeiculosTable: React.FC<VeiculosTableProps> = ({
  veiculos,
  loading,
  sortConfig,
  onSort,
  onEdit,
  onToggleStatus,
  currentPage,
  itemsPerPage,
}) => {
  const getSortIcon = (field: keyof Veiculo) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-green-100 text-green-800";
      case "em_uso":
        return "bg-blue-100 text-blue-800";
      case "manutencao":
        return "bg-yellow-100 text-yellow-800";
      case "inativo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "em_uso":
        return "Em Uso";
      case "manutencao":
        return "Manutenção";
      case "inativo":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  const getTipoCarroceriaText = (tipo: string) => {
    switch (tipo) {
      case "truck":
        return "Truck";
      case "toco":
        return "Toco";
      case "bitruck":
        return "Bitruck";
      case "carreta":
        return "Carreta";
      case "carreta_ls":
        return "Carreta LS";
      case "carreta_3_eixos":
        return "Carreta 3 Eixos";
      case "truck_3_eixos":
        return "Truck 3 Eixos";
      case "truck_4_eixos":
        return "Truck 4 Eixos";
      default:
        return "Truck";
    }
  };

  const getTipoBauText = (tipo: string) => {
    switch (tipo) {
      case "frigorifico":
        return "Frigorífico";
      case "carga_seca":
        return "Carga Seca";
      case "baucher":
        return "Baucher";
      case "graneleiro":
        return "Graneleiro";
      case "tanque":
        return "Tanque";
      case "caçamba":
        return "Caçamba";
      case "plataforma":
        return "Plataforma";
      default:
        return "Frigorífico";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVeiculos = veiculos.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("marca")}
              >
                <div className="flex items-center">
                  Marca
                  {getSortIcon("marca")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("modelo")}
              >
                <div className="flex items-center">
                  Modelo
                  {getSortIcon("modelo")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("ano")}
              >
                <div className="flex items-center">
                  Ano
                  {getSortIcon("ano")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("placa")}
              >
                <div className="flex items-center">
                  Placa
                  {getSortIcon("placa")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("capacidade")}
              >
                <div className="flex items-center">
                  Capacidade
                  {getSortIcon("capacidade")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("tipoCarroceria")}
              >
                <div className="flex items-center">
                  Carroceria
                  {getSortIcon("tipoCarroceria")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("tipoBau")}
              >
                <div className="flex items-center">
                  Baú
                  {getSortIcon("tipoBau")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th
                className="table-header cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("unidadeNegocio")}
              >
                <div className="flex items-center">
                  Unidade
                  {getSortIcon("unidadeNegocio")}
                </div>
              </th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedVeiculos.map((veiculo) => (
              <tr key={veiculo.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {veiculo.marca}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm font-medium text-gray-900">
                    {veiculo.modelo || "N/A"}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm font-medium text-gray-900">
                    {veiculo.ano}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm font-medium text-gray-900">
                    {veiculo.placa}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {veiculo.capacidade} kg
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {getTipoCarroceriaText(veiculo.tipoCarroceria || "truck")}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {getTipoBauText(veiculo.tipoBau || "frigorifico")}
                  </div>
                </td>
                <td className="table-cell">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(veiculo.status)}`}
                  >
                    {getStatusText(veiculo.status)}
                  </span>
                </td>
                <td className="table-cell">
                  <span className="text-sm text-gray-900 capitalize">
                    {veiculo.unidadeNegocio}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(veiculo)}
                      className="text-primary-600 hover:text-primary-900"
                      title={
                        veiculo.status === "inativo"
                          ? "Editar veículo (somente leitura)"
                          : "Editar"
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(veiculo)}
                      className={`${
                        veiculo.status === "inativo"
                          ? "text-green-600 hover:text-green-900"
                          : "text-red-600 hover:text-red-900"
                      }`}
                      title={
                        veiculo.status === "inativo" ? "Ativar" : "Inativar"
                      }
                    >
                      {veiculo.status === "inativo" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {veiculos.length === 0 && (
        <div className="text-center py-8">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum veículo encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando um novo veículo.
          </p>
        </div>
      )}
    </div>
  );
};
