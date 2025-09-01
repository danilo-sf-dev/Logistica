import React, { useState } from "react";
import {
  Users,
  History,
  Shield,
  Edit,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Save,
} from "lucide-react";
import { useUserManagement } from "../state/useUserManagement";
import { PermissionService } from "../../../services/permissionService";
import LoadingButton from "../../common/LoadingButton";

export const UserManagementForm: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const {
    // Estados
    roleChanges,
    loading,
    selectedUser,
    formData,
    filters,
    pagination,

    // Permissões e roles
    canManageUsers,
    availableRoles,
    roleDisplayNames,

    // Ações
    setSelectedUser,
    handleFormChange,
    handleRoleChange,
    applyFilters,
    clearFilters,
    changePage,

    // Dados processados
    filteredUsers,
    paginatedUsers,
  } = useUserManagement();

  // Estado local para modais
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Verificar se o usuário pode gerenciar usuários
  if (!canManageUsers) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acesso Restrito
          </h3>
          <p className="text-gray-600">
            Você não tem permissão para acessar a gestão de usuários.
          </p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    return PermissionService.getRoleDisplayName(role as any);
  };

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

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowRoleChangeModal(true);
  };

  const handleCloseModal = () => {
    setShowRoleChangeModal(false);
    setSelectedUser(null);
    // Limpar formulário
    handleFormChange("newRole", "");
    handleFormChange("changeType", "permanent");
    handleFormChange("startDate", "");
    handleFormChange("endDate", "");
    handleFormChange("reason", "");
  };

  const handleSubmitRoleChange = async () => {
    await handleRoleChange();
    handleCloseModal();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da Seção */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
          Gestão de Usuários
        </h3>
        <p className="text-sm text-gray-600 mt-1 break-words">
          Gerencie perfis, permissões e acesso dos usuários existentes (usuários
          são criados via Google Auth)
        </p>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            className="btn-secondary flex items-center w-full sm:w-auto justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
            Filtros
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-center sm:justify-end">
          <span>Total: {filteredUsers.length} usuários</span>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome, email ou cargo..."
                value={filters.searchTerm}
                onChange={(e) => applyFilters({ searchTerm: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil
              </label>
              <select
                value={filters.roleFilter}
                onChange={(e) => applyFilters({ roleFilter: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Todos os perfis</option>
                {roleDisplayNames.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.statusFilter}
                onChange={(e) => applyFilters({ statusFilter: e.target.value })}
                className="input-field w-full"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="temporary">Temporários</option>
              </select>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {(filters.searchTerm ||
            filters.roleFilter !== "" ||
            filters.statusFilter !== "all") && (
            <div className="flex justify-end">
              <button onClick={clearFilters} className="btn-secondary text-sm">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <span className="ml-2">Carregando usuários...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          {user.photoURL ? (
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                              src={user.photoURL}
                              alt={user.displayName || "Usuário"}
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                {user.displayName?.charAt(0) ||
                                  user.email?.charAt(0) ||
                                  "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.displayName || "Sem nome"}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user.email}
                          </div>
                          {user.cargo && (
                            <div className="text-xs text-gray-400 truncate">
                              {user.cargo}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {user.temporaryRole?.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Temporário
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ativo
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("pt-BR")
                        : "Nunca"}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {filteredUsers.length > pagination.pageSize && (
          <div className="bg-white px-3 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage * pagination.pageSize >=
                  filteredUsers.length
                }
                className="ml-3 relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.pageSize + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      filteredUsers.length,
                    )}
                  </span>{" "}
                  de <span className="font-medium">{filteredUsers.length}</span>{" "}
                  resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage * pagination.pageSize >=
                      filteredUsers.length
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Alteração de Perfil */}
      {showRoleChangeModal && selectedUser && (
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
                  onClick={handleCloseModal}
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
                            ? new Date(
                                selectedUser.lastLogin,
                              ).toLocaleDateString("pt-BR")
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
                            {selectedUser.temporaryRole.reason ||
                              "Não informado"}
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
                    onChange={(e) =>
                      handleFormChange("newRole", e.target.value)
                    }
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
                          handleFormChange("changeType", e.target.value)
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
                          handleFormChange("changeType", e.target.value)
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
                            handleFormChange("startDate", e.target.value)
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
                          onChange={(e) =>
                            handleFormChange("endDate", e.target.value)
                          }
                          className="input-field w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 break-words">
                      ⚠️ O perfil será automaticamente revertido após a data de
                      fim
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
                    onChange={(e) => handleFormChange("reason", e.target.value)}
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
                        formData.reason.length > 0 &&
                        formData.reason.length < 10
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
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto btn-secondary py-3 sm:py-2"
                  >
                    Cancelar
                  </button>
                  <LoadingButton
                    onClick={handleSubmitRoleChange}
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
      )}

      {/* Histórico de Alterações */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <History className="w-5 h-5 mr-2 flex-shrink-0" />
            Histórico de Alterações
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  De → Para
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roleChanges.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-6 py-4 text-center text-gray-500"
                  >
                    Nenhuma alteração registrada
                  </td>
                </tr>
              ) : (
                roleChanges.slice(0, 10).map((change) => (
                  <tr key={change.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(change.changedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {change.userId}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoleDisplayName(change.oldRole)} →{" "}
                      {getRoleDisplayName(change.newRole)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          change.changeType === "permanent"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {change.changeType === "permanent"
                          ? "Permanente"
                          : "Temporário"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] sm:max-w-none">
                      <div className="truncate" title={change.reason}>
                        {change.reason}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
