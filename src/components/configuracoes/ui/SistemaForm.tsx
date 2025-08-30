import React from "react";
import { Save } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import type { SistemaFormProps } from "../types";

export const SistemaForm: React.FC<SistemaFormProps> = ({
  config,
  onChange,
  onSubmit,
  loading = false,
  className = "",
}) => {
  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Configurações do Sistema
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Idioma
          </label>
          <select
            value={config.idioma}
            onChange={(e) => onChange("idioma", e.target.value)}
            className="input-field"
            disabled
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Idioma fixo do sistema</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fuso Horário
          </label>
          <select
            value={config.timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
            className="input-field"
          >
            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
            <option value="America/Manaus">Manaus (GMT-4)</option>
            <option value="America/Belem">Belém (GMT-3)</option>
          </select>
        </div>

        <div className="flex items-center justify-between opacity-50">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Backup Automático
            </h4>
            <p className="text-sm text-gray-500">
              Fazer backup automático dos dados
            </p>
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Em breve - Em desenvolvimento
            </p>
          </div>
          <button
            disabled
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed"
          >
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
          </button>
        </div>

        {/* Botão de Salvar */}
        {onSubmit && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <LoadingButton
              onClick={onSubmit}
              loading={loading}
              variant="primary"
              size="md"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SistemaForm;
