import React from "react";
import type { SistemaFormProps } from "../types";

export const SistemaForm: React.FC<SistemaFormProps> = ({
  config,
  onChange,
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

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Backup Automático
            </h4>
            <p className="text-sm text-gray-500">
              Fazer backup automático dos dados
            </p>
          </div>
          <button
            onClick={() => onChange("backup", !config.backup)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.backup ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.backup ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SistemaForm;
