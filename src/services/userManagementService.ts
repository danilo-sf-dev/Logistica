// ========================================
// SERVIÇO DE GESTÃO DE USUÁRIOS (REFATORADO)
// ========================================

import {
  UserRoleService,
  UserProfileService,
  TemporaryRoleService,
  UserAuditService,
  UserNotificationService,
  UserValidationService,
} from "./userManagement";
import type {
  UserProfile,
  RoleChange,
  RoleChangeType,
  UserRole,
} from "../types";

/**
 * Serviço principal de gestão de usuários
 * Agora atua como uma fachada para os serviços especializados
 */
export class UserManagementService {
  /**
   * Altera o perfil de um usuário (permanente ou temporário)
   */
  static async changeUserRole(
    userId: string,
    newRole: UserRole,
    changeType: RoleChangeType,
    reason: string,
    changedBy: string,
    temporaryPeriod?: { startDate: Date; endDate: Date },
  ): Promise<void> {
    try {
      // Validar período temporário se aplicável
      if (changeType === "temporary" && temporaryPeriod) {
        UserValidationService.validateTemporaryPeriod(
          temporaryPeriod.startDate,
          temporaryPeriod.endDate,
        );
      }

      // Executar mudança de role
      await UserRoleService.changeUserRole(
        userId,
        newRole,
        changeType,
        reason,
        changedBy,
        temporaryPeriod,
      );

      // Enviar notificação
      try {
        await UserNotificationService.notifyUserRoleChange(
          userId,
          newRole,
          changeType,
          reason,
        );
      } catch (notificationError) {
        console.warn(
          "Aviso: Não foi possível enviar notificação:",
          notificationError,
        );
      }

      // Registrar log de auditoria
      await UserAuditService.createAuditLog({
        userId: changedBy,
        userRole: "admin_senior", // Fallback
        action: "role_change",
        level: "info",
        description: `Perfil alterado para '${newRole}'`,
        details: { targetUserId: userId, changeType, reason },
        ipAddress: "captured-from-session",
        userAgent: "captured-from-session",
        success: true,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Erro ao alterar role do usuário:", error);

      // Registrar log de auditoria de erro
      await UserAuditService.createAuditLog({
        userId: changedBy,
        userRole: "admin_senior", // Fallback
        action: "role_change",
        level: "error",
        description: `Falha ao alterar perfil do usuário ${userId}`,
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        ipAddress: "captured-from-session",
        userAgent: "captured-from-session",
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      });

      throw error;
    }
  }

  /**
   * Obtém o histórico de mudanças de perfil
   */
  static async getRoleChangeHistory(userId?: string): Promise<RoleChange[]> {
    return UserAuditService.getRoleChangeHistory(userId);
  }

  /**
   * Obtém usuários por perfil específico
   */
  static async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    return UserProfileService.getUsersByRole(role);
  }

  /**
   * Obtém todos os usuários do sistema (paginação básica)
   */
  static async getAllUsers(
    pageSize: number = 50,
    lastDoc?: any,
  ): Promise<{ users: UserProfile[]; lastDoc?: any }> {
    return UserProfileService.getAllUsers(pageSize, lastDoc);
  }

  /**
   * Busca usuários por termo de busca
   */
  static async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    return UserProfileService.searchUsers(searchTerm);
  }

  /**
   * Atualiza informações básicas do usuário
   */
  static async updateUserInfo(
    userId: string,
    updates: Partial<UserProfile>,
    updatedBy: string,
  ): Promise<void> {
    await UserProfileService.updateUserInfo(userId, updates);

    // Registrar log de auditoria
    await UserAuditService.createAuditLog({
      userId: updatedBy,
      userRole: "admin_senior", // Fallback
      action: "data_modification",
      level: "info",
      description: `Informações do usuário ${userId} atualizadas`,
      details: { updates },
      ipAddress: "captured-from-session",
      userAgent: "captured-from-session",
      success: true,
      timestamp: new Date(),
    });
  }

  /**
   * Desativa um usuário (soft delete)
   */
  static async deactivateUser(
    userId: string,
    deactivatedBy: string,
    reason: string,
  ): Promise<void> {
    await UserProfileService.deactivateUser(userId);

    // Registrar log de auditoria
    await UserAuditService.createAuditLog({
      userId: deactivatedBy,
      userRole: "admin_senior", // Fallback
      action: "data_modification",
      level: "warning",
      description: `Usuário ${userId} desativado`,
      details: { reason: reason.toUpperCase() },
      ipAddress: "captured-from-session",
      userAgent: "captured-from-session",
      success: true,
      timestamp: new Date(),
    });
  }

  /**
   * Estende um role temporário
   */
  static async extendTemporaryRole(
    userId: string,
    newEndDate: Date,
    reason: string,
    extendedBy: string,
  ): Promise<void> {
    await TemporaryRoleService.extendTemporaryRole(
      userId,
      newEndDate,
      reason,
      extendedBy,
    );
  }

  /**
   * Obtém usuários com roles temporários próximos da expiração
   */
  static async getUsersWithExpiringTemporaryRoles(
    daysThreshold: number = 3,
  ): Promise<
    {
      userId: string;
      displayName: string;
      email: string;
      temporaryRole: string;
      expiresAt: Date;
      daysUntilExpiration: number;
    }[]
  > {
    return TemporaryRoleService.getUsersWithExpiringTemporaryRoles(
      daysThreshold,
    );
  }

  /**
   * Verifica se há perfis temporários expirados
   */
  static async checkExpiredTemporaryRoles(): Promise<UserProfile[]> {
    return TemporaryRoleService.checkExpiredTemporaryRoles();
  }

  /**
   * Reverte perfil temporário expirado para o perfil base
   */
  static async revertExpiredTemporaryRole(userId: string): Promise<void> {
    await TemporaryRoleService.revertExpiredTemporaryRole(userId);
  }

  /**
   * Verifica e processa períodos temporários expirados
   */
  static async processExpiredTemporaryRoles(): Promise<{
    processed: number;
    errors: string[];
  }> {
    return TemporaryRoleService.processExpiredTemporaryRoles();
  }

  /**
   * Obtém estatísticas de usuários por role
   */
  static async getUserRoleStatistics(): Promise<{
    total: number;
    byRole: Record<string, number>;
    temporary: number;
    active: number;
  }> {
    return UserProfileService.getUserRoleStatistics();
  }

  /**
   * Obtém histórico de mudanças com filtros avançados
   */
  static async getAdvancedRoleChangeHistory(filters: {
    userId?: string;
    changeType?: RoleChangeType;
    startDate?: Date;
    endDate?: Date;
    changedBy?: string;
    limit?: number;
  }): Promise<RoleChange[]> {
    return UserAuditService.getAdvancedRoleChangeHistory(filters);
  }

  /**
   * Cria um relatório de auditoria para um período específico
   */
  static async generateAuditReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    period: { start: Date; end: Date };
    totalChanges: number;
    changesByType: Record<string, number>;
    changesByRole: Record<string, number>;
    topUsers: Array<{ userId: string; changes: number }>;
    securityAlerts: string[];
  }> {
    return UserAuditService.generateAuditReport(startDate, endDate);
  }

  /**
   * Valida se uma mudança de role é segura
   */
  static async validateRoleChange(
    userId: string,
    newRole: UserRole,
    changeType: RoleChangeType,
    changedBy: string,
  ): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    return UserValidationService.validateRoleChange(
      userId,
      newRole,
      changeType,
      changedBy,
    );
  }

  /**
   * Resolve inconsistência específica: remove temporaryRole de usuário já convertido para permanente
   */
  static async fixPermanentUserWithTemporaryRole(
    userId: string,
  ): Promise<void> {
    await TemporaryRoleService.fixPermanentUserWithTemporaryRole(userId);
  }
}
