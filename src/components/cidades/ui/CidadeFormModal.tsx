/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { X } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import type { CidadeFormData, Cidade } from "../types";
import {
  REGIOES_BRASIL,
  ESTADOS_BRASIL,
  obterRegiaoPorEstado,
} from "utils/constants";
import { useRotasForCidades } from "../state/useRotasForCidades";

type Props = {
  aberto: boolean;
  editando?: Cidade | null;
  valores: CidadeFormData;
  erros: Partial<Record<keyof CidadeFormData, string>>;
  onChange: (valores: CidadeFormData) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  loading?: boolean;
};

export const CidadeFormModal: React.FC<Props> = ({
  aberto,
  editando,
  valores,
  erros,
  onChange,
  onCancelar,
  onConfirmar,
  loading = false,
}) => {
  const { rotas, loading: loadingRotas } = useRotasForCidades();

  // Preencher automaticamente a região quando o estado for alterado
  useEffect(() => {
    if (valores.estado) {
      const regiaoAutomatica = obterRegiaoPorEstado(valores.estado);
      if (regiaoAutomatica && valores.regiao !== regiaoAutomatica) {
        // Atualizar a região apenas se for diferente da atual
        onChange({ ...valores, regiao: regiaoAutomatica });
      }
    }
  }, [valores.estado]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editando ? "Editar Cidade" : "Nova Cidade"}
            </h3>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso Mínimo (kg)
              </label>
              <input
                type="text"
                value={valores.pesoMinimo}
                onChange={(e) =>
                  onChange({ ...valores, pesoMinimo: e.target.value })
                }
                className={`input-field ${erros.pesoMinimo ? "border-red-500" : ""}`}
                placeholder="Ex: 100"
              />
              {erros.pesoMinimo && (
                <p className="text-red-500 text-xs mt-1">{erros.pesoMinimo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rota
              </label>
              <select
                value={valores.rotaId || ""}
                onChange={(e) =>
                  onChange({ ...valores, rotaId: e.target.value })
                }
                className={`input-field ${erros.rotaId ? "border-red-500" : ""}`}
                disabled={loadingRotas}
              >
                <option value="">
                  {loadingRotas ? "Carregando rotas..." : "Selecione uma rota"}
                </option>
                {rotas.map((rota) => (
                  <option key={rota.id} value={rota.id}>
                    {rota.nome} -{" "}
                    {new Date(rota.dataRota).toLocaleDateString("pt-BR")}
                  </option>
                ))}
              </select>
              {erros.rotaId && (
                <p className="text-red-500 text-xs mt-1">{erros.rotaId}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Selecione uma rota para vincular esta cidade
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2 border-t">
              <button
                type="button"
                onClick={onCancelar}
                className="w-full sm:w-auto btn-secondary py-3 sm:py-2"
              >
                Cancelar
              </button>
              <LoadingButton
                onClick={onConfirmar}
                loading={loading}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                {editando ? "Atualizar" : "Cadastrar"}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
