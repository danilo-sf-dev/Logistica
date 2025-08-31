import React from "react";
import { X } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
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
  loading?: boolean;
}

export function FolgaFormModal({
  mostrar,
  editando,
  valores,
  setValores,
  onConfirmar,
  onCancelar,
  erros = {},
  loading = false,
}: FolgaFormModalProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editando ? "Editar Solicitação" : "Nova Solicitação"}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2">
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
                {editando ? "Atualizar" : "Solicitar"}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
