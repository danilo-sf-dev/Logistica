import React, { useEffect, useState } from "react";
import {
  Edit,
  User,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle,
  MapPin,
} from "lucide-react";
import type { Vendedor } from "../types";
import type { OrdenacaoCampo, DirecaoOrdenacao } from "../state/useVendedores";
import { formatCelular, formatCPF } from "../../../utils/masks";
import { REGIOES_BRASIL } from "../../../utils/constants";
import { cidadesService } from "../../cidades/data/cidadesService";
import type { Cidade } from "../../cidades/types";

interface VendedoresTableProps {
  vendedores: Vendedor[];
  ordenarPor: OrdenacaoCampo;
  direcaoOrdenacao: DirecaoOrdenacao;
  onOrdenar: (campo: OrdenacaoCampo) => void;
  onEditar: (vendedor: Vendedor) => void;
  onInativar: (vendedor: Vendedor) => void;
  onAtivar: (vendedor: Vendedor) => void;
}

// Componente para exibir as cidades atendidas
const CidadesAtendidas: React.FC<{ cidadesIds: string[] }> = ({
  cidadesIds,
}) => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarCidades = async () => {
      if (cidadesIds.length === 0) return;

      try {
        setLoading(true);
        const todasCidades = await cidadesService.listar();
        const cidadesFiltradas = todasCidades.filter((cidade) =>
          cidadesIds.includes(cidade.id),
        );
        setCidades(cidadesFiltradas);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarCidades();
  }, [cidadesIds]);

  if (loading) {
    return <div className="text-sm text-gray-500">Carregando...</div>;
  }

  if (cidadesIds.length === 0) {
    return <div className="text-sm text-gray-400">Nenhuma cidade</div>;
  }

  if (cidades.length === 0) {
    return <div className="text-sm text-gray-400">Cidades não encontradas</div>;
  }

  return (
    <div className="space-y-1">
      {cidades.slice(0, 2).map((cidade) => (
        <div
          key={cidade.id}
          className="flex items-center text-sm text-gray-600"
        >
          <MapPin className="h-3 w-3 mr-1" />
          {cidade.nome} - {cidade.estado}
        </div>
      ))}
      {cidades.length > 2 && (
        <div className="text-xs text-gray-500">
          +{cidades.length - 2} mais cidade{cidades.length - 2 !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

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
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("cpf")}
            >
              <div className="flex items-center">
                CPF
                {getSortIcon("cpf")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("celular")}
            >
              <div className="flex items-center">
                Contato
                {getSortIcon("celular")}
              </div>
            </th>
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
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("tipoContrato")}
            >
              <div className="flex items-center">
                Tipo Contrato
                {getSortIcon("tipoContrato")}
              </div>
            </th>
            <th className="table-header">Cidades Atendidas</th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("ativo")}
            >
              <div className="flex items-center">
                Ativo
                {getSortIcon("ativo")}
              </div>
            </th>
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
                <CidadesAtendidas
                  cidadesIds={vendedor.cidadesAtendidas || []}
                />
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
