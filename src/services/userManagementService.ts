// ========================================
// SERVIÇO DE GESTÃO DE USUÁRIOS
// ========================================

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { PermissionService } from "./permissionService";
import type {
  UserProfile,
  RoleChange,
  RoleChangeType,
  UserRole,
  AuditLog,
  SecurityNotification,
} from "../types";

/**
 * Serviço responsável pela gestão de usuários e alterações de perfil
 * Implementa validações de segurança e auditoria completa
 */
export class UserManagementService {
  /**
   * Altera o perfil de um usuário (permanente ou temporário)
   * Valida permissões antes de executar a alteração
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
      // Verificar se o usuário que está fazendo a mudança tem permissão
      const adminUser = await getDoc(doc(db, "users", changedBy));
      if (!adminUser.exists()) {
        throw new Error("Usuário administrador não encontrado");
      }

      const adminRole = adminUser.data().role as UserRole;
      if (!PermissionService.canChangeRole(adminRole, newRole)) {
        throw new Error("Você não tem permissão para alterar este perfil");
      }

      // Buscar usuário atual
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const currentUser = userDoc.data() as UserProfile;
      const oldRole = currentUser.role;

      // Preparar dados para atualização
      const updateData: Partial<UserProfile> = {
        role: newRole,
        lastLogin: new Date(),
      };

      if (changeType === "temporary") {
        if (!temporaryPeriod) {
          throw new Error("Período temporário é obrigatório");
        }

        updateData.temporaryRole = {
          role: newRole,
          startDate: temporaryPeriod.startDate,
          endDate: temporaryPeriod.endDate,
          reason,
          grantedBy: changedBy,
          grantedAt: new Date(),
          isActive: true,
        };
      } else {
        // Mudança permanente - atualizar role base
        updateData.baseRole = newRole;
        updateData.temporaryRole = undefined;
      }

      // Atualizar usuário
      await setDoc(doc(db, "users", userId), updateData, { merge: true });

      // Registrar mudança no histórico
      const roleChange: Omit<RoleChange, "id"> = {
        userId,
        oldRole,
        newRole,
        changeType,
        reason,
        changedBy,
        changedAt: new Date(),
        temporaryPeriod,
        metadata: {
          ip: "captured-from-session",
          userAgent: "captured-from-session",
          device: "captured-from-session",
        },
      };

      await addDoc(collection(db, "role_changes"), roleChange);

      // Enviar notificação para o usuário
      await this.notifyUserRoleChange(userId, newRole, changeType, reason);

      // Registrar log de auditoria
      await this.createAuditLog({
        userId: changedBy,
        userRole: adminRole,
        action: "role_change",
        level: "info",
        description: `Perfil alterado de '${PermissionService.getRoleDisplayName(oldRole)}' para '${PermissionService.getRoleDisplayName(newRole)}'`,
        details: { targetUserId: userId, changeType, reason },
        ipAddress: "captured-from-session",
        userAgent: "captured-from-session",
        success: true,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Erro ao alterar role do usuário:", error);

      // Registrar log de auditoria de erro
      await this.createAuditLog({
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
   * Filtra por usuário específico se fornecido
   */
  static async getRoleChangeHistory(userId?: string): Promise<RoleChange[]> {
    try {
      let q = collection(db, "role_changes");

      if (userId) {
        q = query(q, where("userId", "==", userId));
      }

      q = query(q, orderBy("changedAt", "desc"), limit(100));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        changedAt: doc.data().changedAt?.toDate() || new Date(),
        temporaryPeriod: doc.data().temporaryPeriod
          ? {
              ...doc.data().temporaryPeriod,
              startDate:
                doc.data().temporaryPeriod.startDate?.toDate() || new Date(),
              endDate:
                doc.data().temporaryPeriod.endDate?.toDate() || new Date(),
            }
          : undefined,
      })) as RoleChange[];
    } catch (error) {
      console.error("Erro ao buscar histórico de mudanças:", error);
      throw error;
    }
  }

  /**
   * Obtém usuários por perfil específico
   */
  static async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || new Date(),
        lastActivity: doc.data().lastActivity?.toDate(),
        temporaryRole: doc.data().temporaryRole
          ? {
              ...doc.data().temporaryRole,
              startDate:
                doc.data().temporaryRole.startDate?.toDate() || new Date(),
              endDate: doc.data().temporaryRole.endDate?.toDate() || new Date(),
              grantedAt:
                doc.data().temporaryRole.grantedAt?.toDate() || new Date(),
            }
          : undefined,
      })) as UserProfile[];
    } catch (error) {
      console.error("Erro ao buscar usuários por role:", error);
      throw error;
    }
  }

  /**
   * Obtém todos os usuários do sistema (paginação básica)
   */
  static async getAllUsers(
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot,
  ): Promise<{ users: UserProfile[]; lastDoc?: QueryDocumentSnapshot }> {
    try {
      let q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(pageSize),
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || new Date(),
        lastActivity: doc.data().lastActivity?.toDate(),
        temporaryRole: doc.data().temporaryRole
          ? {
              ...doc.data().temporaryRole,
              startDate:
                doc.data().temporaryRole.startDate?.toDate() || new Date(),
              endDate: doc.data().temporaryRole.endDate?.toDate() || new Date(),
              grantedAt:
                doc.data().temporaryRole.grantedAt?.toDate() || new Date(),
            }
          : undefined,
      })) as UserProfile[];

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        users,
        lastDoc: lastVisible,
      };
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  /**
   * Busca usuários por termo de busca
   */
  static async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    try {
      // Busca por nome ou email (Firestore não suporta busca por texto completo)
      // Implementação básica - pode ser melhorada com índices compostos
      const usersQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(usersQuery);

      return querySnapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || new Date(),
          lastActivity: doc.data().lastActivity?.toDate(),
          temporaryRole: doc.data().temporaryRole
            ? {
                ...doc.data().temporaryRole,
                startDate:
                  doc.data().temporaryRole.startDate?.toDate() || new Date(),
                endDate:
                  doc.data().temporaryRole.endDate?.toDate() || new Date(),
                grantedAt:
                  doc.data().temporaryRole.grantedAt?.toDate() || new Date(),
              }
            : undefined,
        }))
        .filter((user) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            user.displayName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.cargo?.toLowerCase().includes(searchLower)
          );
        }) as UserProfile[];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  /**
   * Atualiza informações básicas do usuário
   */
  static async updateUserInfo(
    userId: string,
    updates: Partial<UserProfile>,
    updatedBy: string,
  ): Promise<void> {
    try {
      // Verificar se o usuário existe
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      // Atualizar usuário
      await updateDoc(doc(db, "users", userId), {
        ...updates,
        lastLogin: new Date(),
      });

      // Registrar log de auditoria
      await this.createAuditLog({
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
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  /**
   * Desativa um usuário (soft delete)
   */
  static async deactivateUser(
    userId: string,
    deactivatedBy: string,
    reason: string,
  ): Promise<void> {
    try {
      // Verificar se o usuário existe
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      // Desativar usuário
      await updateDoc(doc(db, "users", userId), {
        status: "inativo",
        lastLogin: new Date(),
      });

      // Registrar log de auditoria
      await this.createAuditLog({
        userId: deactivatedBy,
        userRole: "admin_senior", // Fallback
        action: "data_modification",
        level: "warning",
        description: `Usuário ${userId} desativado`,
        details: { reason },
        ipAddress: "captured-from-session",
        userAgent: "captured-from-session",
        success: true,
      });
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
      throw error;
    }
  }

  /**
   * Envia notificação para o usuário sobre mudança de perfil
   */
  private static async notifyUserRoleChange(
    userId: string,
    newRole: UserRole,
    changeType: RoleChangeType,
    reason: string,
  ): Promise<void> {
    try {
      const notification: Omit<SecurityNotification, "id"> = {
        type: "role_change",
        title: "Seu perfil foi alterado",
        message: `Seu perfil foi alterado para ${PermissionService.getRoleDisplayName(newRole)}. ${changeType === "temporary" ? "Esta é uma alteração temporária." : ""}`,
        severity: "medium",
        userId,
        userRole: newRole,
        timestamp: new Date(),
        read: false,
        actionRequired: false,
        metadata: { newRole, changeType, reason },
      };

      await addDoc(collection(db, "security_notifications"), notification);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      // Não falha a operação principal se a notificação falhar
    }
  }

  /**
   * Cria log de auditoria
   */
  private static async createAuditLog(
    logData: Omit<AuditLog, "id">,
  ): Promise<void> {
    try {
      await addDoc(collection(db, "audit_logs"), {
        ...logData,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao criar log de auditoria:", error);
      // Não falha a operação principal se o log falhar
    }
  }

  /**
   * Verifica se há perfis temporários expirados
   * Para uso em jobs agendados
   */
  static async checkExpiredTemporaryRoles(): Promise<UserProfile[]> {
    try {
      const now = new Date();
      const q = query(
        collection(db, "users"),
        where("temporaryRole.isActive", "==", true),
        where("temporaryRole.endDate", "<=", now),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || new Date(),
        lastActivity: doc.data().lastActivity?.toDate(),
        temporaryRole: doc.data().temporaryRole
          ? {
              ...doc.data().temporaryRole,
              startDate:
                doc.data().temporaryRole.startDate?.toDate() || new Date(),
              endDate: doc.data().temporaryRole.endDate?.toDate() || new Date(),
              grantedAt:
                doc.data().temporaryRole.grantedAt?.toDate() || new Date(),
            }
          : undefined,
      })) as UserProfile[];
    } catch (error) {
      console.error("Erro ao verificar perfis temporários expirados:", error);
      throw error;
    }
  }

  /**
   * Reverte perfil temporário expirado para o perfil base
   */
  static async revertExpiredTemporaryRole(userId: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = userDoc.data() as UserProfile;
      if (!userData.temporaryRole || !userData.baseRole) {
        throw new Error("Usuário não possui perfil temporário ou base");
      }

      // Reverter para perfil base
      await updateDoc(doc(db, "users", userId), {
        role: userData.baseRole,
        temporaryRole: {
          ...userData.temporaryRole,
          isActive: false,
        },
        lastLogin: new Date(),
      });

      // Registrar mudança no histórico
      const roleChange: Omit<RoleChange, "id"> = {
        userId,
        oldRole: userData.temporaryRole.role,
        newRole: userData.baseRole,
        changeType: "revert",
        reason: "Perfil temporário expirado - reversão automática",
        changedBy: "system",
        changedAt: new Date(),
        metadata: {
          ip: "system",
          userAgent: "system",
          device: "system",
        },
      };

      await addDoc(collection(db, "role_changes"), roleChange);

      // Enviar notificação
      await this.notifyUserRoleChange(
        userId,
        userData.baseRole,
        "revert",
        "Seu perfil temporário expirou e foi revertido automaticamente",
      );
    } catch (error) {
      console.error("Erro ao reverter perfil temporário:", error);
      throw error;
    }
  }
}
