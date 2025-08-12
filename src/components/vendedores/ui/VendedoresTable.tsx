import React from "react";
import {
  Edit,
  User,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle,
} from "lucide-react";
import type { Vendedor } from "../types";
import type { OrdenacaoCampo, DirecaoOrdenacao } from "../state/useVendedores";
import { formatCelular, formatCPF } from "../../../utils/masks.js";
import { REGIOES_BRASIL } from "../../../utils/constants";

interface VendedoresTableProps {
  vendedores: Vendedor[];
  ordenarPor: OrdenacaoCampo;
  direcaoOrdenacao: DirecaoOrdenacao;
  onOrdenar: (campo: OrdenacaoCampo) => void;
  onEditar: (vendedor: Vendedor) => void;
  onInativar: (vendedor: Vendedor) => void;
  onAtivar: (vendedor: Vendedor) => void;
}

export const VendedoresTable: React.FC<VendedoresTableProps> = ({
  vendedores,
  ordenarPor,
  direcaoOrdenacao,
  onOrdenar,
  onEditar,
  onInativar,
  onAtivar,
}) => {
  const getSortIcon = (field: OrdenacaoCampo) => {
    if (ordenarPor !== field) return null;
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
                Vendedor
                {getSortIcon("nome")}
              </div>
            </th>
            <th className="table-header">CPF</th>
            <th className="table-header">Contato</th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("regiao")}
            >
              <div className="flex items-center">
                Região
                {getSortIcon("regiao")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("unidadeNegocio")}
            >
              <div className="flex items-center">
                Unidade
                {getSortIcon("unidadeNegocio")}
              </div>
            </th>
            <th className="table-header">Tipo Contrato</th>
            <th className="table-header">Ativo</th>
            <th className="table-header">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendedores.map((vendedor) => (
            <tr key={vendedor.id} className="hover:bg-gray-50">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {vendedor.nome}
                    </div>
                    {vendedor.codigoVendSistema && (
                      <div className="text-sm text-gray-500">
                        Código: {vendedor.codigoVendSistema}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">
                  {formatCPF(vendedor.cpf)}
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center text-sm text-gray-900">
                  <Phone className="h-4 w-4 mr-1" />
                  {formatCelular(vendedor.celular)}
                </div>
                {vendedor.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {vendedor.email}
                  </div>
                )}
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">
                  {REGIOES_BRASIL.find((r) => r.valor === vendedor.regiao)
                    ?.nome || vendedor.regiao}
                </div>
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900 capitalize">
                  {vendedor.unidadeNegocio === "ambos"
                    ? "Ambos"
                    : vendedor.unidadeNegocio}
                </span>
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900 capitalize">
                  {vendedor.tipoContrato === "clt"
                    ? "CLT"
                    : vendedor.tipoContrato === "pj"
                      ? "PJ"
                      : vendedor.tipoContrato === "autonomo"
                        ? "Autônomo"
                        : vendedor.tipoContrato}
                </span>
              </td>
              <td className="table-cell">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vendedor.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {vendedor.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditar(vendedor)}
                    className="text-primary-600 hover:text-primary-900"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {vendedor.ativo ? (
                    <button
                      onClick={() => onInativar(vendedor)}
                      className="text-red-600 hover:text-red-900"
                      title="Inativar vendedor"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onAtivar(vendedor)}
                      className="text-green-600 hover:text-green-900"
                      title="Ativar vendedor"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
