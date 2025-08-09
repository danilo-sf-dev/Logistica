import React from "react";
import type { CidadeInput, Cidade } from "../types";

type Props = {
  aberto: boolean;
  editando?: Cidade | null;
  valores: CidadeInput;
  erros: Partial<Record<keyof CidadeInput, string>>;
  onChange: (valores: CidadeInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ESTADOS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export const CidadeFormModal: React.FC<Props> = ({
  aberto,
  editando,
  valores,
  erros,
  onChange,
  onCancelar,
  onConfirmar,
}) => {
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
                  onChange={(e) =>
                    onChange({ ...valores, estado: e.target.value })
                  }
                  className={`input-field ${erros.estado ? "border-red-500" : ""}`}
                >
                  <option value="">Selecione um estado</option>
                  {ESTADOS.map((estado) => (
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
                <input
                  type="text"
                  value={valores.regiao}
                  onChange={(e) =>
                    onChange({ ...valores, regiao: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Nordeste, Sudeste..."
                />
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
