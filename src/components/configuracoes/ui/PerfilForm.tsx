import React from "react";
import { Save } from "lucide-react";
import { maskCelular } from "../../../utils/masks";
import LoadingButton from "../../common/LoadingButton";
import type { PerfilFormProps } from "../types";

export const PerfilForm: React.FC<PerfilFormProps> = ({
  data,
  errors,
  loading,
  profileLoading = false,
  onSubmit,
  onChange,
  className = "",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  // Mostrar loading quando os dados do perfil estiverem sendo carregados
  if (profileLoading) {
    return (
      <div className={`card ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Perfil do Usuário
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">
            Carregando dados do perfil...
          </span>
        </div>
      </div>
    );
  }

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
              className={`input-field bg-gray-100 cursor-not-allowed ${errors.email ? "border-red-500" : ""}`}
              placeholder="exemplo@email.com"
              disabled={true}
            />
            <p className="text-xs text-gray-500 mt-1">
              O email não pode ser alterado pois está vinculado ao seu login
            </p>
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
          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default PerfilForm;
