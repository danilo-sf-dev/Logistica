import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import { Funcionario, FuncionarioInput } from "../types";
import { maskCPF, maskCelular, maskCEP } from "../../../utils/masks";
import { DateInput } from "../../common/DateInput";
import { MoneyInput } from "../../common/MoneyInput";
import { MoneyService } from "../../../services/MoneyService";

type Props = {
  aberto: boolean;
  editando?: Funcionario | null;
  valores: FuncionarioInput;
  erros?: Partial<Record<keyof FuncionarioInput, string>>;
  onChange: (v: FuncionarioInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  somenteLeitura?: boolean;
  loading?: boolean;
};

const FuncionarioFormModal: React.FC<Props> = ({
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
  // ViaCEP auto-fill
  useEffect(() => {
    const cepLimpo = (valores.cep || "").replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (!data || data.erro) return;
          const logradouro = [data.logradouro, data.bairro]
            .filter(Boolean)
            .join(" - ");
          const cidade = data.localidade || "";
          onChange({ ...valores, endereco: logradouro, cidade });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valores.cep]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editando ? "Editar Funcionário" : "Novo Funcionário"}
              {somenteLeitura && editando && (
                <span className="ml-3 text-sm text-gray-500 font-normal">
                  (Somente leitura - funcionário inativo)
                </span>
              )}
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
                Nome *
              </label>
              <input
                type="text"
                value={valores.nome}
                onChange={(e) => onChange({ ...valores, nome: e.target.value })}
                className={`input-field h-11 ${erros.nome ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              />
              {erros.nome && (
                <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={maskCPF(valores.cpf || "")}
                  onChange={(e) => {
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    onChange({ ...valores, cpf: valorLimpo });
                  }}
                  className={`input-field h-11 ${erros.cpf ? "border-red-500" : ""} ${
                    somenteLeitura || !!editando
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="000.000.000-00"
                  disabled={somenteLeitura || !!editando}
                />
                {erros.cpf && (
                  <p className="text-red-500 text-xs mt-1">{erros.cpf}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNH *
                </label>
                <input
                  type="text"
                  value={valores.cnh}
                  onChange={(e) =>
                    onChange({ ...valores, cnh: e.target.value })
                  }
                  className={`input-field h-11 ${erros.cnh ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
                {erros.cnh && (
                  <p className="text-red-500 text-xs mt-1">{erros.cnh}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <DateInput
                  label="Venc. CNH"
                  value={valores.cnhVencimento || ""}
                  onChange={(date) =>
                    onChange({ ...valores, cnhVencimento: date })
                  }
                  disabled={somenteLeitura}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria CNH
                </label>
                <select
                  value={valores.cnhCategoria || ""}
                  onChange={(e) =>
                    onChange({ ...valores, cnhCategoria: e.target.value })
                  }
                  className={`input-field h-11 ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                >
                  <option value="">Selecione</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Celular *
                </label>
                <input
                  type="text"
                  value={maskCelular(valores.celular || "")}
                  onChange={(e) => {
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    onChange({ ...valores, celular: valorLimpo });
                  }}
                  className={`input-field h-11 ${erros.celular ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
                {erros.celular && (
                  <p className="text-red-500 text-xs mt-1">{erros.celular}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={valores.email || ""}
                  onChange={(e) =>
                    onChange({ ...valores, email: e.target.value })
                  }
                  className={`input-field h-11 ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={maskCEP(valores.cep || "")}
                  onChange={(e) => {
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    onChange({ ...valores, cep: valorLimpo });
                  }}
                  className={`input-field h-11 ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="00000-000"
                  disabled={somenteLeitura}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  value={valores.endereco}
                  onChange={(e) =>
                    onChange({ ...valores, endereco: e.target.value })
                  }
                  className={`input-field h-11 ${erros.endereco ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
                {erros.endereco && (
                  <p className="text-red-500 text-xs mt-1">{erros.endereco}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={valores.cidade}
                  onChange={(e) =>
                    onChange({ ...valores, cidade: e.target.value })
                  }
                  className={`input-field h-11 ${erros.cidade ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
                {erros.cidade && (
                  <p className="text-red-500 text-xs mt-1">{erros.cidade}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  value={valores.funcao || "motorista"}
                  onChange={(e) =>
                    onChange({ ...valores, funcao: e.target.value as any })
                  }
                  className={`input-field h-11 ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                >
                  <option value="motorista">Motorista</option>
                  <option value="ajudante">Ajudante</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <DateInput
                  label="Data de Admissão"
                  value={valores.dataAdmissao || ""}
                  onChange={(date) =>
                    onChange({ ...valores, dataAdmissao: date })
                  }
                  disabled={somenteLeitura}
                />
              </div>
              <div>
                <MoneyInput
                  label="Salário"
                  value={valores.salario || ""}
                  onChange={(value) => onChange({ ...valores, salario: value })}
                  disabled={somenteLeitura}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <DateInput
                  label="Último Exame Toxicológico"
                  value={valores.toxicoUltimoExame || ""}
                  onChange={(date) =>
                    onChange({ ...valores, toxicoUltimoExame: date })
                  }
                  disabled={somenteLeitura}
                />
              </div>
              <div>
                <DateInput
                  label="Venc. Exame Toxicológico"
                  value={valores.toxicoVencimento || ""}
                  onChange={(date) =>
                    onChange({ ...valores, toxicoVencimento: date })
                  }
                  disabled={somenteLeitura}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2 border-t">
              <button
                type="button"
                onClick={onCancelar}
                className="w-full sm:w-auto btn-secondary py-3 sm:py-2"
              >
                {somenteLeitura ? "Fechar" : "Cancelar"}
              </button>
              {!somenteLeitura && (
                <LoadingButton
                  onClick={onConfirmar}
                  loading={loading}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto py-3 sm:py-2"
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

export default FuncionarioFormModal;
