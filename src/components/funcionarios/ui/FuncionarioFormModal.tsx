import React, { useEffect } from "react";
import type { Funcionario, FuncionarioInput } from "../types";
import { maskCPF, maskCelular, maskMoeda, maskCEP } from "utils/masks";

type Props = {
  aberto: boolean;
  editando?: Funcionario | null;
  valores: FuncionarioInput;
  erros?: Partial<Record<keyof FuncionarioInput, string>>;
  onChange: (v: FuncionarioInput) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const FuncionarioFormModal: React.FC<Props> = ({
  aberto,
  editando,
  valores,
  erros = {},
  onChange,
  onCancelar,
  onConfirmar,
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editando ? "Editar Funcionário" : "Novo Funcionário"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                type="text"
                value={valores.nome}
                onChange={(e) => onChange({ ...valores, nome: e.target.value })}
                className={`input-field ${erros.nome ? "border-red-500" : ""}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPF *
                </label>
                <input
                  type="text"
                  value={maskCPF(valores.cpf)}
                  onChange={(e) =>
                    onChange({ ...valores, cpf: maskCPF(e.target.value) })
                  }
                  className={`input-field ${erros.cpf ? "border-red-500" : ""}`}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CNH *
                </label>
                <input
                  type="text"
                  value={valores.cnh}
                  onChange={(e) =>
                    onChange({ ...valores, cnh: e.target.value })
                  }
                  className={`input-field ${erros.cnh ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venc. CNH
                </label>
                <input
                  type="date"
                  value={valores.cnhVencimento || ""}
                  onChange={(e) =>
                    onChange({ ...valores, cnhVencimento: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoria CNH
                </label>
                <select
                  value={valores.cnhCategoria || ""}
                  onChange={(e) =>
                    onChange({ ...valores, cnhCategoria: e.target.value })
                  }
                  className="input-field"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Celular *
                </label>
                <input
                  type="text"
                  value={maskCelular(valores.celular)}
                  onChange={(e) =>
                    onChange({
                      ...valores,
                      celular: maskCelular(e.target.value),
                    })
                  }
                  className={`input-field ${erros.celular ? "border-red-500" : ""}`}
                  placeholder="(73) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={valores.email || ""}
                  onChange={(e) =>
                    onChange({ ...valores, email: e.target.value })
                  }
                  className={`input-field ${erros.email ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  type="text"
                  value={maskCEP(valores.cep || "")}
                  onChange={(e) =>
                    onChange({ ...valores, cep: maskCEP(e.target.value) })
                  }
                  className={`input-field ${erros.cep ? "border-red-500" : ""}`}
                  placeholder="00000-000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  value={valores.numero || ""}
                  onChange={(e) =>
                    onChange({ ...valores, numero: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  type="text"
                  value={valores.complemento || ""}
                  onChange={(e) =>
                    onChange({ ...valores, complemento: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Endereço *
              </label>
              <input
                type="text"
                value={valores.endereco}
                onChange={(e) =>
                  onChange({ ...valores, endereco: e.target.value })
                }
                className={`input-field ${erros.endereco ? "border-red-500" : ""}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={valores.cidade}
                  onChange={(e) =>
                    onChange({ ...valores, cidade: e.target.value })
                  }
                  className={`input-field ${erros.cidade ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Função
                </label>
                <select
                  value={valores.funcao || "motorista"}
                  onChange={(e) =>
                    onChange({ ...valores, funcao: e.target.value as any })
                  }
                  className="input-field"
                >
                  <option value="motorista">Motorista</option>
                  <option value="ajudante">Ajudante</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={valores.dataAdmissao || ""}
                  onChange={(e) =>
                    onChange({ ...valores, dataAdmissao: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salário
                </label>
                <input
                  type="text"
                  value={maskMoeda(valores.salario || "")}
                  onChange={(e) =>
                    onChange({ ...valores, salario: maskMoeda(e.target.value) })
                  }
                  className="input-field"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Último Exame Toxicológico
                </label>
                <input
                  type="date"
                  value={valores.toxicoUltimoExame || ""}
                  onChange={(e) =>
                    onChange({ ...valores, toxicoUltimoExame: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venc. Exame Toxicológico
                </label>
                <input
                  type="date"
                  value={valores.toxicoVencimento || ""}
                  onChange={(e) =>
                    onChange({ ...valores, toxicoVencimento: e.target.value })
                  }
                  className="input-field"
                />
              </div>
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

export default FuncionarioFormModal;
