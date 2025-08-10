/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import type { CidadeInput, Cidade } from "../types";
import {
  REGIOES_BRASIL,
  ESTADOS_BRASIL,
  obterRegiaoPorEstado,
} from "utils/constants";

type Props = {
  aberto: boolean;
  editando?: Cidade | null;
  valores: CidadeInput;
  erros: Partial<Record<keyof CidadeInput, string>>;
  onChange: (valores: CidadeInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export const CidadeFormModal: React.FC<Props> = ({
  aberto,
  editando,
  valores,
  erros,
  onChange,
  onCancelar,
  onConfirmar,
}) => {
  // Debug temporário
  console.log("Modal valores:", valores);
  console.log("Modal editando:", editando);

  // Preencher automaticamente a região quando o estado for alterado
  useEffect(() => {
    if (valores.estado) {
      const regiaoAutomatica = obterRegiaoPorEstado(valores.estado);
      console.log(
        "Estado:",
        valores.estado,
        "Região automática:",
        regiaoAutomatica
      );
      if (regiaoAutomatica) {
        // Sempre atualizar a região quando o estado mudar
        onChange({ ...valores, regiao: regiaoAutomatica });
      }
    }
  }, [valores.estado, onChange]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editando ? "Editar Cidade" : "Nova Cidade"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Cidade *
              </label>
              <input
                type="text"
                value={valores.nome}
                onChange={(e) => onChange({ ...valores, nome: e.target.value })}
                className={`input-field ${erros.nome ? "border-red-500" : ""}`}
              />
              {erros.nome && (
                <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <select
                  value={valores.estado}
                  onChange={(e) => {
                    const estadoSelecionado = e.target.value;
                    const regiaoAutomatica =
                      obterRegiaoPorEstado(estadoSelecionado);
                    onChange({
                      ...valores,
                      estado: estadoSelecionado,
                      regiao: regiaoAutomatica || "",
                    });
                  }}
                  className={`input-field ${erros.estado ? "border-red-500" : ""}`}
                >
                  <option value="">Selecione um estado</option>
                  {ESTADOS_BRASIL.map((estado) => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla} - {estado.nome}
                    </option>
                  ))}
                </select>
                {erros.estado && (
                  <p className="text-red-500 text-xs mt-1">{erros.estado}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Região
                </label>
                <select
                  value={valores.regiao || ""}
                  onChange={(e) =>
                    onChange({ ...valores, regiao: e.target.value })
                  }
                  className="input-field bg-gray-100 cursor-not-allowed"
                  disabled={true}
                >
                  <option value="">Selecione uma região</option>
                  {REGIOES_BRASIL.map((regiao) => (
                    <option key={regiao.valor} value={regiao.valor}>
                      {regiao.nome}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Região definida automaticamente pelo estado
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Distância (km)
              </label>
              <input
                type="text"
                value={valores.distancia}
                onChange={(e) =>
                  onChange({ ...valores, distancia: e.target.value })
                }
                className={`input-field ${erros.distancia ? "border-red-500" : ""}`}
                placeholder="Ex: 150"
              />
              {erros.distancia && (
                <p className="text-red-500 text-xs mt-1">{erros.distancia}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observação
              </label>
              <textarea
                value={valores.observacao}
                onChange={(e) =>
                  onChange({ ...valores, observacao: e.target.value })
                }
                className="input-field"
                rows={3}
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancelar}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirmar}
                className="btn-primary"
              >
                {editando ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
