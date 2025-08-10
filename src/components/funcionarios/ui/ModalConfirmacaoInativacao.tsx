import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Funcionario } from "../types";
import { maskCPF } from "utils/masks";

type Props = {
  aberto: boolean;
  funcionario: Funcionario | null;
  onConfirmar: () => void;
  onCancelar: () => void;
};

const ModalConfirmacaoInativacao: React.FC<Props> = ({
  aberto,
  funcionario,
  onConfirmar,
  onCancelar,
}) => {
  if (!aberto || !funcionario) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Confirmar Inativação
          </h3>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja inativar este funcionário?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="mb-3">
                <span className="font-medium text-gray-700">Nome:</span>
                <span className="ml-2 text-gray-900">{funcionario.nome}</span>
              </div>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Função:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {funcionario.funcao || "motorista"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">CPF:</span>
                <span className="ml-2 text-gray-900">
                  {maskCPF(funcionario.cpf || "")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onCancelar}
              className="btn-secondary px-6 py-3"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Confirmar Inativação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacaoInativacao;
