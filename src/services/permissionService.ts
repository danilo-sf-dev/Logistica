// ========================================
// SERVIÇO DE PERMISSÕES E VALIDAÇÕES
// ========================================

import {
  UserRole,
  SystemFeature,
  CrudOperation,
  ROLE_HIERARCHY,
  ROLE_DISPLAY_NAMES,
  PermissionValidationResult,
  PermissionContext,
  RolePermissions,
} from "../types";

/**
 * Serviço responsável por validar permissões e controle de acesso
 * Implementa a hierarquia de perfis e regras de negócio
 */
export class PermissionService {
  /**
   * Verifica se um usuário pode alterar o perfil de outro usuário
   * Segue a hierarquia: Admin Senior > Admin > Gerente > Funcionário > Usuário
   */
  static canChangeRole(adminRole: UserRole, targetRole: UserRole): boolean {
    const allowedRoles = ROLE_HIERARCHY[adminRole];
    return allowedRoles?.includes(targetRole) || false;
  }

  /**
   * Verifica se um usuário pode deletar/inativar registros
   * Apenas Admin Senior, Admin e Gerente podem deletar
   */
  static canDeleteRecords(userRole: UserRole): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  /**
   * Verifica se um usuário pode exportar relatórios
   * Todos exceto usuários básicos podem exportar
   */
  static canExportReports(userRole: UserRole): boolean {
    return ["admin_senior", "admin", "gerente", "dispatcher"].includes(
      userRole,
    );
  }

  /**
   * Verifica se um usuário pode gerenciar outros usuários
   * Apenas Admin Senior, Admin e Gerente podem gerenciar usuários
   */
  static canManageUsers(userRole: UserRole): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  /**
   * Verifica se um usuário pode acessar configurações do sistema
   * Apenas perfis administrativos podem acessar
   */
  static canAccessSystemConfig(userRole: UserRole): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  /**
   * Verifica se um usuário pode acessar configurações de segurança
   * Apenas perfis administrativos podem acessar
   */
  static canAccessSecurityConfig(userRole: UserRole): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  /**
   * Obtém os perfis disponíveis para alteração baseado no perfil atual
   * Retorna array vazio se não puder alterar nenhum perfil
   */
  static getAvailableRolesForChange(adminRole: UserRole): UserRole[] {
    return ROLE_HIERARCHY[adminRole] || [];
  }

  /**
   * Obtém o nome amigável de um perfil
   */
  static getRoleDisplayName(role: UserRole): string {
    return ROLE_DISPLAY_NAMES[role] || role;
  }

  /**
   * Obtém todos os perfis disponíveis com nomes amigáveis
   * Para uso em dropdowns e seletores
   */
  static getRoleDisplayNames(): { value: UserRole; label: string }[] {
    return Object.entries(ROLE_HIERARCHY).map(([role, _]) => ({
      value: role as UserRole,
      label: this.getRoleDisplayName(role as UserRole),
    }));
  }

  /**
   * Verifica se um usuário tem acesso a uma funcionalidade específica
   */
  static canAccessFeature(userRole: UserRole, feature: SystemFeature): boolean {
    // Dashboard é acessível para todos
    if (feature === "dashboard") return true;

    // Configurações pessoais são acessíveis para todos
    if (feature === "configuracoes") return true;

    // Funcionalidades administrativas requerem perfil adequado
    if (["gestao_usuarios", "sistema", "seguranca"].includes(feature)) {
      return this.canAccessSystemConfig(userRole);
    }

    // Outras funcionalidades são acessíveis para todos os perfis logados
    return true;
  }

  /**
   * Verifica se um usuário pode executar uma operação CRUD específica
   */
  static canPerformOperation(
    userRole: UserRole,
    feature: SystemFeature,
    operation: CrudOperation,
  ): boolean {
    // Usuários básicos só podem ler
    if (userRole === "user") {
      return operation === "read";
    }

    // Funcionários não podem deletar
    if (userRole === "dispatcher" && operation === "delete") {
      return false;
    }

    // Admin Senior e Admin podem tudo
    if (["admin_senior", "admin"].includes(userRole)) {
      return true;
    }

    // Gerente pode tudo exceto alterar perfis superiores
    if (userRole === "gerente") {
      return true;
    }

    // Por padrão, permite a operação
    return true;
  }

  /**
   * Valida permissões em um contexto específico
   * Retorna resultado detalhado da validação
   */
  static validatePermissions(
    context: PermissionContext,
  ): PermissionValidationResult {
    const { userRole, targetUserRole, feature, operation } = context;

    // Verificar se o usuário pode acessar a funcionalidade
    if (feature && !this.canAccessFeature(userRole, feature)) {
      return {
        allowed: false,
        reason: `Perfil '${this.getRoleDisplayName(userRole)}' não tem acesso a esta funcionalidade`,
        requiredRole: "gerente",
        currentRole: userRole,
      };
    }

    // Verificar se o usuário pode executar a operação
    if (
      feature &&
      operation &&
      !this.canPerformOperation(userRole, feature, operation)
    ) {
      return {
        allowed: false,
        reason: `Perfil '${this.getRoleDisplayName(userRole)}' não pode executar esta operação`,
        requiredRole: "dispatcher",
        currentRole: userRole,
      };
    }

    // Verificar se pode alterar perfil de outro usuário
    if (targetUserRole && !this.canChangeRole(userRole, targetUserRole)) {
      return {
        allowed: false,
        reason: `Perfil '${this.getRoleDisplayName(userRole)}' não pode alterar para '${this.getRoleDisplayName(targetUserRole)}'`,
        requiredRole: this.getMinimumRoleForTarget(targetUserRole),
        currentRole: userRole,
      };
    }

    return {
      allowed: true,
      currentRole: userRole,
    };
  }

  /**
   * Obtém o perfil mínimo necessário para alterar um perfil específico
   */
  private static getMinimumRoleForTarget(targetRole: UserRole): UserRole {
    switch (targetRole) {
      case "admin_senior":
        return "admin_senior";
      case "admin":
        return "admin_senior";
      case "gerente":
        return "admin";
      case "dispatcher":
        return "gerente";
      case "user":
        return "gerente";
      default:
        return "admin_senior";
    }
  }

  /**
   * Verifica se um perfil é temporário
   */
  static isTemporaryRole(role: UserRole, hasTemporaryRole: boolean): boolean {
    return hasTemporaryRole && role !== "user";
  }

  /**
   * Obtém as permissões completas para um perfil específico
   */
  static getRolePermissions(role: UserRole): RolePermissions {
    const basePermissions = {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: false,
      manage: false,
    };

    const permissions: Record<SystemFeature, typeof basePermissions> = {
      dashboard: {
        ...basePermissions,
        delete: false,
        export: false,
        manage: false,
      },
      funcionarios: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      veiculos: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      rotas: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      folgas: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      cidades: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      vendedores: {
        ...basePermissions,
        delete: this.canDeleteRecords(role),
        export: this.canExportReports(role),
        manage: false,
      },
      relatorios: {
        ...basePermissions,
        delete: false,
        export: this.canExportReports(role),
        manage: false,
      },
      gestao_usuarios: {
        ...basePermissions,
        delete: false,
        export: false,
        manage: this.canManageUsers(role),
      },
      configuracoes: {
        ...basePermissions,
        delete: false,
        export: false,
        manage: false,
      },
      sistema: {
        ...basePermissions,
        delete: false,
        export: false,
        manage: this.canAccessSystemConfig(role),
      },
      seguranca: {
        ...basePermissions,
        delete: false,
        export: false,
        manage: this.canAccessSecurityConfig(role),
      },
    };

    return {
      role,
      permissions,
      canManageUsers: this.canManageUsers(role),
      canAccessSystemConfig: this.canAccessSystemConfig(role),
      canAccessSecurityConfig: this.canAccessSecurityConfig(role),
      canDeleteRecords: this.canDeleteRecords(role),
      canExportReports: this.canExportReports(role),
    };
  }

  /**
   * Verifica se um usuário pode ver a aba "Gestão de Usuários"
   */
  static canViewUserManagement(userRole: UserRole): boolean {
    return this.canManageUsers(userRole);
  }

  /**
   * Verifica se um usuário pode ver configurações avançadas
   */
  static canViewAdvancedConfig(userRole: UserRole): boolean {
    return this.canAccessSystemConfig(userRole);
  }
}
