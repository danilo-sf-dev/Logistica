import React from "react";
import { X } from "lucide-react";
import type { Vendedor, VendedorInput } from "../types";
import { maskCelular, maskCPF } from "../../../utils/masks.js";
import { REGIOES_BRASIL } from "../../../utils/constants";
import CidadesSelect from "./CidadesSelect";

interface VendedorFormModalProps {
  aberto: boolean;
  editando: Vendedor | null;
  valores: VendedorInput;
  onChange: (valores: VendedorInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  somenteLeitura?: boolean;
}

const VendedorFormModal: React.FC<VendedorFormModalProps> = ({
  aberto,
  editando,
  valores,
  onChange,
  onCancelar,
  onConfirmar,
  somenteLeitura = false,
}) => {
  if (!aberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!somenteLeitura) {
      onConfirmar();
    }
  };

  const updateField = (field: keyof VendedorInput, value: any) => {
    if (somenteLeitura) return;
    onChange({ ...valores, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editando ? "Editar Vendedor" : "Novo Vendedor"}
            </h3>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={valores.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={maskCPF(valores.cpf || "")}
                  onChange={(e) => {
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    updateField("cpf", valorLimpo);
                  }}
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código Vend.Sistema
                </label>
                <input
                  type="text"
                  value={valores.codigoVendSistema}
                  onChange={(e) =>
                    updateField("codigoVendSistema", e.target.value)
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                  placeholder="Ex: 12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Contrato
                </label>
                <select
                  value={valores.tipoContrato}
                  onChange={(e) => updateField("tipoContrato", e.target.value)}
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                >
                  <option value="clt">CLT</option>
                  <option value="pj">PJ</option>
                  <option value="autonomo">Autônomo</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={valores.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                  placeholder="exemplo@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Celular *
                </label>
                <input
                  type="text"
                  required
                  value={valores.celular}
                  onChange={(e) =>
                    updateField("celular", maskCelular(e.target.value))
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                  placeholder="(73) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Região *
                </label>
                <select
                  required
                  value={valores.regiao}
                  onChange={(e) => updateField("regiao", e.target.value)}
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                >
                  <option value="">Selecione uma região</option>
                  {REGIOES_BRASIL.map((regiao) => (
                    <option key={regiao.valor} value={regiao.valor}>
                      {regiao.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unidade de Negócio *
                </label>
                <select
                  required
                  value={valores.unidadeNegocio}
                  onChange={(e) =>
                    updateField("unidadeNegocio", e.target.value)
                  }
                  disabled={somenteLeitura}
                  className={`input-field ${somenteLeitura ? "bg-gray-100" : ""}`}
                >
                  <option value="frigorifico">Frigorífico</option>
                  <option value="ovos">Ovos</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>

            <div>
              <CidadesSelect
                value={valores.cidadesAtendidas || []}
                onChange={(cidadesIds) =>
                  updateField("cidadesAtendidas", cidadesIds)
                }
                disabled={somenteLeitura}
                placeholder="Selecione as cidades que o vendedor atende"
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
              {!somenteLeitura && (
                <button type="submit" className="btn-primary">
                  {editando ? "Atualizar" : "Cadastrar"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendedorFormModal;
