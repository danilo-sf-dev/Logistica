import React from "react";
import { Save } from "lucide-react";
import { maskCelular } from "../../../utils/masks";
import type { PerfilFormProps } from "../types";

export const PerfilForm: React.FC<PerfilFormProps> = ({
  data,
  errors,
  loading,
  onSubmit,
  onChange,
  className = "",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Perfil do Usuário
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              value={data.displayName}
              onChange={(e) => onChange("displayName", e.target.value)}
              className="input-field"
              placeholder="Digite seu nome completo"
            />
            <p className="text-xs text-gray-500 mt-1">
              O nome será salvo em maiúsculas automaticamente
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
              placeholder="exemplo@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={data.telefone}
              onChange={(e) =>
                onChange("telefone", maskCelular(e.target.value))
              }
              className={`input-field ${errors.telefone ? "border-red-500" : ""}`}
              placeholder="(73) 99999-9999"
            />
            {errors.telefone && (
              <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <input
              type="text"
              value={data.cargo}
              onChange={(e) => onChange("cargo", e.target.value)}
              className="input-field"
              placeholder="Ex: Gerente, Analista..."
            />
            <p className="text-xs text-gray-500 mt-1">
              O cargo será salvo em maiúsculas automaticamente
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilForm;
