import React from "react";
import { Save } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import type { NotificacoesFormProps } from "../types";

export const NotificacoesForm: React.FC<NotificacoesFormProps> = ({
  config,
  onChange,
  onSubmit,
  loading = false,
  className = "",
}) => {
  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Configurações de Notificações
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between opacity-50">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Notificações por Email
            </h4>
            <p className="text-sm text-gray-500">
              Receber notificações importantes por email
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

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Notificações Push
            </h4>
            <p className="text-sm text-gray-500">
              Receber notificações no navegador
            </p>
          </div>
          <button
            onClick={() => onChange("push")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.push ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.push ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Novas Rotas</h4>
            <p className="text-sm text-gray-500">
              Notificar sobre novas rotas atribuídas
            </p>
          </div>
          <button
            onClick={() => onChange("rotas")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.rotas ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.rotas ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Folgas e Férias
            </h4>
            <p className="text-sm text-gray-500">
              Notificar sobre solicitações de folga
            </p>
          </div>
          <button
            onClick={() => onChange("folgas")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.folgas ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.folgas ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Manutenção de Veículos
            </h4>
            <p className="text-sm text-gray-500">
              Notificar sobre manutenções programadas
            </p>
          </div>
          <button
            onClick={() => onChange("manutencao")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.manutencao ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.manutencao ? "translate-x-6" : "translate-x-1"
              }`}
            />
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

export default NotificacoesForm;
