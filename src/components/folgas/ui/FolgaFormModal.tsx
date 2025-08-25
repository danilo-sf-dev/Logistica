import React from "react";
import { X } from "lucide-react";
import type { FolgaInput } from "../types";
import type { TipoFolga, StatusFolga } from "../../../types";
import { FuncionarioSelect } from "./FuncionarioSelect";

interface FolgaFormModalProps {
  mostrar: boolean;
  editando: boolean;
  valores: FolgaInput;
  setValores: (valores: FolgaInput) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  erros?: Partial<Record<keyof FolgaInput, string>>;
}

export function FolgaFormModal({
  mostrar,
  editando,
  valores,
  setValores,
  onConfirmar,
  onCancelar,
  erros = {},
}: FolgaFormModalProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white m-4">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editando ? "Editar Solicitação" : "Nova Solicitação"}
            </h3>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Funcionário *
              </label>
              <FuncionarioSelect
                value={valores.funcionarioId}
                onChange={(funcionarioId, funcionarioNome) =>
                  setValores({ ...valores, funcionarioId, funcionarioNome })
                }
                placeholder="Selecione um funcionário"
                error={erros.funcionarioId}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={valores.tipo}
                  onChange={(e) =>
                    setValores({
                      ...valores,
                      tipo: e.target.value as TipoFolga,
                    })
                  }
                  className="input-field"
                >
                  <option value="folga">Folga</option>
                  <option value="ferias">Férias</option>
                  <option value="licenca">Licença Médica</option>
                  <option value="atestado">Atestado</option>
                  <option value="banco_horas">Banco de Horas</option>
                  <option value="compensacao">Compensação</option>
                  <option value="suspensao">Suspensão</option>
                  <option value="afastamento">Afastamento</option>
                  <option value="maternidade">Maternidade</option>
                  <option value="paternidade">Paternidade</option>
                  <option value="luto">Luto</option>
                  <option value="casamento">Casamento</option>
                  <option value="doacao_sangue">Doação de Sangue</option>
                  <option value="servico_militar">Serviço Militar</option>
                  <option value="capacitacao">Capacitação</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={valores.status}
                  onChange={(e) =>
                    setValores({
                      ...valores,
                      status: e.target.value as StatusFolga,
                    })
                  }
                  className="input-field"
                >
                  <option value="pendente">Pendente</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="rejeitada">Rejeitada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Documento
                </label>
                <input
                  type="text"
                  value={valores.documento || ""}
                  onChange={(e) =>
                    setValores({ ...valores, documento: e.target.value })
                  }
                  className="input-field"
                  placeholder="Número do documento"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Início *
                </label>
                <input
                  type="date"
                  required
                  value={valores.dataInicio}
                  onChange={(e) =>
                    setValores({ ...valores, dataInicio: e.target.value })
                  }
                  className={`input-field ${erros.dataInicio ? "border-red-500" : ""}`}
                />
                {erros.dataInicio && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.dataInicio}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Fim *
                </label>
                <input
                  type="date"
                  required
                  value={valores.dataFim}
                  onChange={(e) =>
                    setValores({ ...valores, dataFim: e.target.value })
                  }
                  className={`input-field ${erros.dataFim ? "border-red-500" : ""}`}
                />
                {erros.dataFim && (
                  <p className="text-red-500 text-xs mt-1">{erros.dataFim}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motivo
              </label>
              <input
                type="text"
                value={valores.motivo || ""}
                onChange={(e) =>
                  setValores({ ...valores, motivo: e.target.value })
                }
                className="input-field"
                placeholder="Motivo da solicitação"
              />
            </div>

            {(valores.tipo === "banco_horas" ||
              valores.tipo === "compensacao") && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade de Horas
                </label>
                <input
                  type="text"
                  value={valores.horas ? String(valores.horas) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir apenas números, vírgula e ponto
                    if (value === "" || /^\d*[.,]?\d*$/.test(value)) {
                      const numValue = value.replace(",", ".");
                      const hours = parseFloat(numValue);
                      setValores({
                        ...valores,
                        horas:
                          value === "" ? null : isNaN(hours) ? null : hours,
                      });
                    }
                  }}
                  className={`input-field ${erros.horas ? "border-red-500" : ""}`}
                  placeholder="Ex: 8.5 ou 8,5"
                />
                {erros.horas && (
                  <p className="text-red-500 text-xs mt-1">{erros.horas}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Digite a quantidade de horas (use ponto ou vírgula para
                  decimais)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                value={valores.observacoes || ""}
                onChange={(e) =>
                  setValores({ ...valores, observacoes: e.target.value })
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
                {editando ? "Atualizar" : "Solicitar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
