import React from "react";
import { X, Clock, Save } from "lucide-react";
import { PermissionService } from "../../../services/permissionService";
import LoadingButton from "../../common/LoadingButton";
import type { UserRole, RoleChangeType } from "../../../types/permissions";

interface UserRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  formData: {
    newRole: string;
    changeType: RoleChangeType;
    startDate: string;
    endDate: string;
    reason: string;
  };
  availableRoles: UserRole[];
  loading: boolean;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

export const UserRoleChangeModal: React.FC<UserRoleChangeModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  formData,
  availableRoles,
  loading,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen || !selectedUser) return null;

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin_senior: "bg-red-100 text-red-800",
      admin: "bg-purple-100 text-purple-800",
      gerente: "bg-blue-100 text-blue-800",
      dispatcher: "bg-green-100 text-green-800",
      user: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          {/* Header do Modal */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                Alterar Perfil do Usuário
              </h3>
              <p className="text-sm text-gray-600 mt-1 break-words">
                {selectedUser.displayName || selectedUser.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2 p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Informações do Usuário Atual */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm font-medium mr-2">
                    Perfil Atual:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role || "user")}`}
                  >
                    {PermissionService.getRoleDisplayName(
                      selectedUser.role || "user",
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm font-medium mr-2">
                    Último login:
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedUser.lastLogin &&
                    selectedUser.lastLogin instanceof Date
                      ? selectedUser.lastLogin.toLocaleDateString("pt-BR")
                      : selectedUser.lastLogin &&
                          typeof selectedUser.lastLogin === "string"
                        ? new Date(selectedUser.lastLogin).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Nunca"}
                  </span>
                </div>
              </div>

              {/* Informações sobre perfil temporário se existir */}
              {selectedUser.temporaryRole?.isActive && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-yellow-800">
                      Perfil Temporário Ativo
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700 space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-yellow-800 mr-2">
                        Perfil Base:
                      </span>
                      <span className="break-words">
                        {PermissionService.getRoleDisplayName(
                          selectedUser.baseRole || "user",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-yellow-800 mr-2">
                        Expira em:
                      </span>
                      <span className="break-words">
                        {selectedUser.temporaryRole.endDate instanceof Date
                          ? selectedUser.temporaryRole.endDate.toLocaleDateString(
                              "pt-BR",
                            )
                          : "Data não disponível"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-yellow-800 mr-2">
                        Motivo:
                      </span>
                      <span className="break-words">
                        {selectedUser.temporaryRole.reason || "Não informado"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Novo Perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novo Perfil <span className="text-gray-900">*</span>
              </label>
              <select
                value={formData.newRole}
                onChange={(e) => onFormChange("newRole", e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Selecione um novo perfil</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {PermissionService.getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Alteração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Alteração <span className="text-gray-900">*</span>
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="permanent"
                    checked={formData.changeType === "permanent"}
                    onChange={(e) =>
                      onFormChange(
                        "changeType",
                        e.target.value as RoleChangeType,
                      )
                    }
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <span className="text-sm text-gray-700">Permanente</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="temporary"
                    checked={formData.changeType === "temporary"}
                    onChange={(e) =>
                      onFormChange(
                        "changeType",
                        e.target.value as RoleChangeType,
                      )
                    }
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <span className="text-sm text-gray-700">Temporário</span>
                </label>
              </div>
            </div>

            {/* Período Temporário */}
            {formData.changeType === "temporary" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  Configuração do Período Temporário
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Data Início <span className="text-blue-900">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        onFormChange("startDate", e.target.value)
                      }
                      className="input-field w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Data Fim <span className="text-blue-900">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => onFormChange("endDate", e.target.value)}
                      className="input-field w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 break-words">
                  ⚠️ O perfil será automaticamente revertido após a data de fim
                </p>
              </div>
            )}

            {/* Motivo da Alteração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da Alteração <span className="text-gray-900">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => onFormChange("reason", e.target.value)}
                className={`input-field w-full ${
                  formData.reason && formData.reason.trim().length < 10
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                rows={4}
                placeholder="Descreva detalhadamente o motivo da alteração de perfil..."
                maxLength={100}
                required
              />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 space-y-1 sm:space-y-0">
                <p className="text-xs text-gray-500 break-words">
                  Este motivo será registrado no histórico de auditoria
                </p>
                <span
                  className={`text-xs ${
                    formData.reason.length > 0 && formData.reason.length < 10
                      ? "text-red-500"
                      : formData.reason.length > 90
                        ? "text-orange-500"
                        : "text-gray-400"
                  }`}
                >
                  {formData.reason.length}/100 máx. (mín. 10)
                </span>
              </div>
              {formData.reason && formData.reason.trim().length < 10 && (
                <p className="text-xs text-red-500 mt-1">
                  O motivo deve ter pelo menos 10 caracteres
                </p>
              )}
              {formData.reason && formData.reason.length > 90 && (
                <p className="text-xs text-orange-500 mt-1">
                  O motivo está próximo do limite máximo de 100 caracteres
                </p>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2 border-t">
              <button
                onClick={onClose}
                className="w-full sm:w-auto btn-secondary py-3 sm:py-2"
              >
                Cancelar
              </button>
              <LoadingButton
                onClick={onSubmit}
                loading={loading}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                disabled={
                  !formData.newRole ||
                  !formData.reason ||
                  formData.reason.trim().length < 10 ||
                  formData.newRole === selectedUser.role ||
                  (formData.changeType === "temporary" &&
                    (!formData.startDate || !formData.endDate))
                }
              >
                <Save className="w-4 h-4 mr-2" />
                Confirmar Alteração
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
