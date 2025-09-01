import React, { useState } from "react";
import { Users, Shield, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserManagement } from "../state/useUserManagement";
import { PermissionService } from "../../../services/permissionService";
import { UserFilters } from "./UserFilters";
import { UserHistoryTable } from "./UserHistoryTable";
import { UserRoleChangeModal } from "./UserRoleChangeModal";

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
    userMap,

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

      {/* Filtros */}
      <UserFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        roleDisplayNames={roleDisplayNames}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filteredUsersCount={filteredUsers.length}
      />

      {/* Lista de Usuários */}
      <div className="card">
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
      <UserRoleChangeModal
        isOpen={showRoleChangeModal}
        onClose={handleCloseModal}
        selectedUser={selectedUser}
        formData={formData}
        availableRoles={availableRoles}
        loading={loading}
        onFormChange={handleFormChange}
        onSubmit={handleSubmitRoleChange}
      />

      {/* Histórico de Alterações */}
      <UserHistoryTable roleChanges={roleChanges} userMap={userMap} />
    </div>
  );
};
