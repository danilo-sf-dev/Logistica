import React from "react";
import { X } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import type { Vendedor, VendedorInput } from "../types";
import { maskCelular, maskCPF } from "../../../utils/masks";
import { REGIOES_BRASIL } from "../../../utils/constants";
import CidadesSelect from "./CidadesSelect";

interface VendedorFormModalProps {
  aberto: boolean;
  editando: Vendedor | null;
  valores: VendedorInput;
  erros?: Partial<Record<keyof VendedorInput, string>>;
  onChange: (valores: VendedorInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  somenteLeitura?: boolean;
  loading?: boolean;
}

const VendedorFormModal: React.FC<VendedorFormModalProps> = ({
  aberto,
  editando,
  valores,
  erros = {},
  onChange,
  onCancelar,
  onConfirmar,
  somenteLeitura = false,
  loading = false,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editando ? "Editar Vendedor" : "Novo Vendedor"}
            </h3>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={valores.nome}
                  onChange={(e) =>
                    onChange({ ...valores, nome: e.target.value })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.nome ? "border-red-500" : ""}`}
                />
                {erros.nome && (
                  <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={maskCPF(valores.cpf || "")}
                  onChange={(e) => {
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    onChange({ ...valores, cpf: valorLimpo });
                  }}
                  disabled={somenteLeitura || !!editando}
                  className={`input-field ${erros.cpf ? "border-red-500" : ""} ${
                    somenteLeitura || !!editando
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="000.000.000-00"
                />
                {erros.cpf && (
                  <p className="text-red-500 text-xs mt-1">{erros.cpf}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Vend.Sistema
                </label>
                <input
                  type="text"
                  value={valores.codigoVendSistema}
                  onChange={(e) =>
                    onChange({ ...valores, codigoVendSistema: e.target.value })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.codigoVendSistema ? "border-red-500" : ""}`}
                  placeholder="Ex: 12345"
                />
                {erros.codigoVendSistema && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.codigoVendSistema}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contrato *
                </label>
                <select
                  required
                  value={valores.tipoContrato}
                  onChange={(e) =>
                    onChange({
                      ...valores,
                      tipoContrato: e.target.value as any,
                    })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.tipoContrato ? "border-red-500" : ""}`}
                >
                  <option value="clt">CLT</option>
                  <option value="pj">PJ</option>
                  <option value="autonomo">Autônomo</option>
                  <option value="outro">Outro</option>
                </select>
                {erros.tipoContrato && (
                  <p className="mt-1 text-sm text-red-600">
                    {erros.tipoContrato}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={valores.email}
                  onChange={(e) =>
                    onChange({ ...valores, email: e.target.value })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.email ? "border-red-500" : ""}`}
                  placeholder="exemplo@email.com"
                />
                {erros.email && (
                  <p className="text-red-500 text-xs mt-1">{erros.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Celular *
                </label>
                <input
                  type="text"
                  required
                  value={valores.celular}
                  onChange={(e) =>
                    onChange({
                      ...valores,
                      celular: maskCelular(e.target.value),
                    })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.celular ? "border-red-500" : ""}`}
                  placeholder="(73) 99999-9999"
                />
                {erros.celular && (
                  <p className="text-red-500 text-xs mt-1">{erros.celular}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Região *
                </label>
                <select
                  required
                  value={valores.regiao}
                  onChange={(e) =>
                    onChange({ ...valores, regiao: e.target.value })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.regiao ? "border-red-500" : ""}`}
                >
                  <option value="">Selecione uma região</option>
                  {REGIOES_BRASIL.map((regiao) => (
                    <option key={regiao.valor} value={regiao.valor}>
                      {regiao.nome}
                    </option>
                  ))}
                </select>
                {erros.regiao && (
                  <p className="mt-1 text-sm text-red-600">{erros.regiao}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Negócio *
                </label>
                <select
                  required
                  value={valores.unidadeNegocio}
                  onChange={(e) =>
                    onChange({
                      ...valores,
                      unidadeNegocio: e.target.value as any,
                    })
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${erros.unidadeNegocio ? "border-red-500" : ""}`}
                >
                  <option value="frigorifico">Frigorífico</option>
                  <option value="ovos">Ovos</option>
                  <option value="ambos">Ambos</option>
                </select>
                {erros.unidadeNegocio && (
                  <p className="mt-1 text-sm text-red-600">
                    {erros.unidadeNegocio}
                  </p>
                )}
              </div>
            </div>

            <div>
              <CidadesSelect
                value={valores.cidadesAtendidas || []}
                onChange={(cidadesIds) =>
                  onChange({ ...valores, cidadesAtendidas: cidadesIds })
                }
                disabled={somenteLeitura}
                placeholder="Selecione as cidades que o vendedor atende"
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
              {!somenteLeitura && (
                <LoadingButton
                  onClick={onConfirmar}
                  loading={loading}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {editando ? "Atualizar" : "Cadastrar"}
                </LoadingButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorFormModal;
