import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Cidade } from "../types";

type Props = {
  aberto: boolean;
  cidade: Cidade | null;
  onConfirmar: () => void;
  onCancelar: () => void;
};

const ModalConfirmacaoExclusao: React.FC<Props> = ({
  aberto,
  cidade,
  onConfirmar,
  onCancelar,
}) => {
  if (!aberto || !cidade) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Confirmar Exclusão
          </h3>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir esta cidade?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="mb-3">
                <span className="font-medium text-gray-700">Cidade:</span>
                <span className="ml-2 text-gray-900">{cidade.nome}</span>
              </div>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Estado:</span>
                <span className="ml-2 text-gray-900">{cidade.estado}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Região:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {cidade.regiao}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Esta ação não pode ser revertida. Todos os 
                vínculos serão perdidos e será necessário criar uma cidade novamente 
                para ter vínculos novamente.
              </p>
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
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacaoExclusao;
