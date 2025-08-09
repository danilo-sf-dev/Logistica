import React from "react";
import {
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Funcionario } from "../types";
import type {
  OrdenacaoCampo,
  DirecaoOrdenacao,
} from "../state/useFuncionarios";
import { formatCPF, formatCelular } from "utils/masks";

type Props = {
  funcionarios: Funcionario[];
  ordenarPor: OrdenacaoCampo;
  direcaoOrdenacao: DirecaoOrdenacao;
  onOrdenar: (campo: OrdenacaoCampo) => void;
  onEditar: (f: Funcionario) => void;
  onExcluir: (id: string) => void;
};

export const FuncionariosTable: React.FC<Props> = ({
  funcionarios,
  ordenarPor,
  direcaoOrdenacao,
  onOrdenar,
  onEditar,
  onExcluir,
}) => {
  const seta = (campo: OrdenacaoCampo) => {
    if (ordenarPor !== campo) return null;
    return direcaoOrdenacao === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const statusText = (s: Funcionario["status"]) =>
    (
      ({
        trabalhando: "Trabalhando",
        disponivel: "Disponível",
        folga: "Folga",
        ferias: "Férias",
      }) as const
    )[s];

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
                Funcionário {seta("nome")}
              </div>
            </th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("cpf")}
            >
              <div className="flex items-center">CPF {seta("cpf")}</div>
            </th>
            <th className="table-header">Contato</th>
            <th className="table-header">Função</th>
            <th className="table-header">Cat. CNH</th>
            <th
              className="table-header cursor-pointer hover:bg-gray-100"
              onClick={() => onOrdenar("status")}
            >
              <div className="flex items-center">Status {seta("status")}</div>
            </th>
            <th className="table-header">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {funcionarios.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {f.nome}
                    </div>
                    <div className="text-sm text-gray-500">{f.cidade}</div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm text-gray-900">{formatCPF(f.cpf)}</div>
              </td>
              <td className="table-cell">
                <div className="flex items-center text-sm text-gray-900">
                  <Phone className="h-4 w-4 mr-1" />
                  {formatCelular(f.celular as any)}
                </div>
                {f.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {f.email}
                  </div>
                )}
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900 capitalize">
                  {f.funcao || "motorista"}
                </span>
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900">
                  {f.cnhCategoria || "-"}
                </span>
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900">
                  {statusText(f.status)}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditar(f)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onExcluir(f.id)}
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
