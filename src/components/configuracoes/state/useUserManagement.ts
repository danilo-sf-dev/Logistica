// ========================================
// HOOK DE GESTÃO DE USUÁRIOS
// ========================================
// Gerencia estado e operações de gestão de usuários

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { UserManagementService } from "../../../services/userManagementService";
import { PermissionService } from "../../../services/permissionService";
import type {
  UserProfile,
  RoleChange,
  RoleChangeType,
  UserRole,
} from "../../../types";

export const useUserManagement = () => {
  const { userProfile } = useAuth();
  const { showNotification } = useNotification();

  // Estados principais
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roleChanges, setRoleChanges] = useState<RoleChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    newRole: "",
    changeType: "permanent" as RoleChangeType,
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Estados de filtros e paginação
  const [filters, setFilters] = useState({
    searchTerm: "",
    roleFilter: "",
    statusFilter: "all",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  // Verificar se o usuário atual pode gerenciar usuários
  const canManageUsers = PermissionService.canManageUsers(
    userProfile?.role || "user",
  );

  // Obter roles disponíveis para alteração
  const availableRoles = PermissionService.getAvailableRolesForChange(
    userProfile?.role || "user",
  );

  // Obter nomes de exibição dos roles
  const roleDisplayNames = PermissionService.getRoleDisplayNames();

  /**
   * Carregar usuários do sistema
   */
  const loadUsers = useCallback(async () => {
    if (!canManageUsers) return;

    try {
      setLoading(true);
      const result = await UserManagementService.getAllUsers(
        pagination.pageSize,
      );
      setUsers(result.users);
      setPagination((prev) => ({ ...prev, total: result.users.length }));
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      showNotification("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  }, [canManageUsers, pagination.pageSize, showNotification]);

  /**
   * Carregar histórico de mudanças de perfil
   */
  const loadRoleChangeHistory = useCallback(async () => {
    if (!canManageUsers) return;

    try {
      const history = await UserManagementService.getRoleChangeHistory();
      setRoleChanges(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      showNotification("Erro ao carregar histórico", "error");
    }
  }, [canManageUsers, showNotification]);

  /**
   * Alterar perfil de um usuário
   */
  const handleRoleChange = useCallback(async () => {
    // Validações obrigatórias
    if (!selectedUser) {
      showNotification("Nenhum usuário selecionado", "error");
      return;
    }

    if (!formData.newRole) {
      showNotification("Selecione um novo perfil", "error");
      return;
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      showNotification(
        "O motivo da alteração é obrigatório (mínimo 10 caracteres)",
        "error",
      );
      return;
    }

    // Validações para período temporário
    if (formData.changeType === "temporary") {
      if (!formData.startDate) {
        showNotification(
          "Data de início é obrigatória para alterações temporárias",
          "error",
        );
        return;
      }

      if (!formData.endDate) {
        showNotification(
          "Data de fim é obrigatória para alterações temporárias",
          "error",
        );
        return;
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const now = new Date();

      if (startDate < now) {
        showNotification("A data de início não pode ser no passado", "error");
        return;
      }

      if (endDate <= startDate) {
        showNotification(
          "A data de fim deve ser posterior à data de início",
          "error",
        );
        return;
      }

      const diffDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays > 365) {
        showNotification(
          "O período temporário não pode exceder 1 ano",
          "error",
        );
        return;
      }
    }

    // Verificar se o novo role é diferente do atual
    if (formData.newRole === selectedUser.role) {
      showNotification("O novo perfil deve ser diferente do atual", "warning");
      return;
    }

    try {
      setLoading(true);

      const temporaryPeriod =
        formData.changeType === "temporary"
          ? {
              startDate: new Date(formData.startDate),
              endDate: new Date(formData.endDate),
            }
          : undefined;

      await UserManagementService.changeUserRole(
        selectedUser.uid,
        formData.newRole as UserRole,
        formData.changeType,
        formData.reason,
        userProfile?.uid || "system",
        temporaryPeriod,
      );

      showNotification("Perfil alterado com sucesso!", "success");

      // Recarregar dados
      await loadUsers();
      await loadRoleChangeHistory();

      // Limpar formulário
      setFormData({
        newRole: "",
        changeType: "permanent",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Erro ao alterar perfil:", error);
      showNotification(error.message || "Erro ao alterar perfil", "error");
    } finally {
      setLoading(false);
    }
  }, [
    selectedUser,
    formData,
    userProfile?.uid,
    showNotification,
    loadUsers,
    loadRoleChangeHistory,
  ]);

  /**
   * Desativar usuário
   */
  const handleDeactivateUser = useCallback(
    async (userId: string, reason: string) => {
      try {
        setLoading(true);
        await UserManagementService.deactivateUser(
          userId,
          userProfile?.uid || "system",
          reason,
        );
        showNotification("Usuário desativado com sucesso!", "success");
        await loadUsers();
      } catch (error: any) {
        console.error("Erro ao desativar usuário:", error);
        showNotification(error.message || "Erro ao desativar usuário", "error");
      } finally {
        setLoading(false);
      }
    },
    [userProfile?.uid, showNotification, loadUsers],
  );

  /**
   * Alterar campo do formulário
   */
  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Aplicar filtros
   */
  const applyFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      roleFilter: "",
      statusFilter: "all",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Filtrar usuários baseado nos filtros ativos
   */
  const filteredUsers = useCallback(() => {
    let filtered = [...users];

    // Filtro por termo de busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.cargo?.toLowerCase().includes(searchLower),
      );
    }

    // Filtro por role
    if (filters.roleFilter && filters.roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === filters.roleFilter);
    }

    // Filtro por status
    if (filters.statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (filters.statusFilter === "active")
          return !user.temporaryRole?.isActive;
        if (filters.statusFilter === "temporary")
          return user.temporaryRole?.isActive;
        return true;
      });
    }

    return filtered;
  }, [users, filters]);

  /**
   * Obter usuários paginados
   */
  const paginatedUsers = useCallback(() => {
    const filtered = filteredUsers();
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [filteredUsers, pagination]);

  /**
   * Mudar página
   */
  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
      loadRoleChangeHistory();
    }
  }, [canManageUsers, loadUsers, loadRoleChangeHistory]);

  return {
    // Estados
    users,
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
    handleDeactivateUser,
    applyFilters,
    clearFilters,
    changePage,

    // Dados processados
    filteredUsers: filteredUsers(),
    paginatedUsers: paginatedUsers(),

    // Recarregar dados
    loadUsers,
    loadRoleChangeHistory,
  };
};
