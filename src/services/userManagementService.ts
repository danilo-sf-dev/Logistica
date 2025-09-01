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
          reason: reason.toUpperCase(),
          grantedBy: changedBy,
          grantedAt: new Date(),
          isActive: true,
        };
      } else {
        // Mudança permanente - atualizar role base
        updateData.baseRole = newRole;
        // Remover campo temporaryRole se existir (não definir como undefined)
        if (currentUser.temporaryRole) {
          // Usar delete para remover o campo do documento
          delete updateData.temporaryRole;
        }
      }

      // Atualizar usuário
      await setDoc(doc(db, "users", userId), updateData, { merge: true });

      // Registrar mudança no histórico
      const roleChange: Omit<RoleChange, "id"> = {
        userId,
        oldRole,
        newRole,
        changeType,
        reason: reason.toUpperCase(),
        changedBy,
        changedAt: new Date(),
        // Só incluir temporaryPeriod se existir
        ...(temporaryPeriod && { temporaryPeriod }),
        metadata: {
          ip: "captured-from-session",
          userAgent: "captured-from-session",
          device: "captured-from-session",
        },
      };

      await addDoc(collection(db, "role_changes"), roleChange);

      // Enviar notificação para o usuário (opcional - não falha a operação)
      try {
        await this.notifyUserRoleChange(userId, newRole, changeType, reason);
      } catch (notificationError) {
        console.warn(
          "Aviso: Não foi possível enviar notificação:",
          notificationError,
        );
        // Não falha a operação principal se a notificação falhar
      }

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
      let finalQuery: any = collection(db, "role_changes");

      if (userId) {
        finalQuery = query(finalQuery, where("userId", "==", userId));
      }

      finalQuery = query(finalQuery, orderBy("changedAt", "desc"), limit(100));

      const querySnapshot = await getDocs(finalQuery);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          changedAt: data.changedAt?.toDate() || new Date(),
          temporaryPeriod: data.temporaryPeriod
            ? {
                ...data.temporaryPeriod,
                startDate:
                  data.temporaryPeriod.startDate?.toDate() || new Date(),
                endDate: data.temporaryPeriod.endDate?.toDate() || new Date(),
              }
            : undefined,
        } as RoleChange;
      });
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
        // Garantir que campos obrigatórios existam
        displayName: doc.data().displayName || null,
        email: doc.data().email || null,
        photoURL: doc.data().photoURL || null,
        role: doc.data().role || "user",
        baseRole: doc.data().baseRole || doc.data().role || "user",
        provider: doc.data().provider || "google.com",
        status: doc.data().status || "ativo",
        cargo: doc.data().cargo || undefined,
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
          // Garantir que campos obrigatórios existam
          displayName: doc.data().displayName || null,
          email: doc.data().email || null,
          photoURL: doc.data().photoURL || null,
          role: doc.data().role || "user",
          baseRole: doc.data().baseRole || doc.data().role || "user",
          provider: doc.data().provider || "google.com",
          status: doc.data().status || "ativo",
          cargo: doc.data().cargo || undefined,
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
        details: { reason: reason.toUpperCase() },
        ipAddress: "captured-from-session",
        userAgent: "captured-from-session",
        success: true,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
      throw error;
    }
  }

  /**
   * Envia notificação avançada para mudança de role
   */
  private static async notifyUserRoleChange(
    userId: string,
    newRole: UserRole,
    changeType: RoleChangeType,
    reason: string,
  ): Promise<void> {
    try {
      const notification = {
        userId,
        type: "role_change",
        title: "Seu perfil foi alterado",
        message: `Seu perfil foi alterado para ${PermissionService.getRoleDisplayName(newRole)}. ${changeType === "temporary" ? "Esta é uma alteração temporária." : ""}`,
        data: { newRole, changeType, reason },
        read: false,
        createdAt: Timestamp.now(),
        priority: changeType === "temporary" ? "medium" : "high",
        category: "security",
      };

      await addDoc(collection(db, "notifications"), notification);

      // Se for uma mudança temporária, criar notificação de lembrete (opcional)
      if (changeType === "temporary") {
        try {
          await this.scheduleExpirationReminder(userId, newRole);
        } catch (reminderError) {
          console.warn(
            "Aviso: Não foi possível agendar lembrete:",
            reminderError,
          );
          // Não falha a operação principal se o agendamento falhar
        }
      }
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }

  /**
   * Agenda lembrete de expiração para roles temporários
   */
  private static async scheduleExpirationReminder(
    userId: string,
    temporaryRole: UserRole,
  ): Promise<void> {
    try {
      // Buscar usuário para obter data de expiração
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return;

      const userData = userDoc.data() as UserProfile;
      const tempRole = userData.temporaryRole;

      if (!tempRole?.endDate) return;

      // Calcular quando enviar o lembrete (1 dia antes da expiração)
      const reminderDate = new Date(tempRole.endDate);
      reminderDate.setDate(reminderDate.getDate() - 1);

      // Criar notificação agendada
      const reminderNotification = {
        userId,
        type: "role_expiration_reminder",
        title: "Seu perfil temporário expira em breve",
        message: `Seu perfil temporário de ${PermissionService.getRoleDisplayName(temporaryRole)} expira em 24 horas.`,
        data: {
          temporaryRole,
          expiresAt: tempRole.endDate,
          willRevertTo: userData.baseRole || "user",
        },
        read: false,
        createdAt: Timestamp.now(),
        scheduledFor: reminderDate,
        priority: "high",
        category: "security",
      };

      await addDoc(
        collection(db, "scheduled_notifications"),
        reminderNotification,
      );
    } catch (error) {
      console.error("Erro ao agendar lembrete:", error);
    }
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
    try {
      const now = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const q = query(
        collection(db, "users"),
        where("temporaryRole.isActive", "==", true),
        where("temporaryRole.endDate", "<=", thresholdDate),
        where("temporaryRole.endDate", ">", now),
      );

      const querySnapshot = await getDocs(q);
      const expiringUsers = [];

      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data() as UserProfile;
        const tempRole = userData.temporaryRole!;

        const daysUntilExpiration = Math.ceil(
          (tempRole.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        expiringUsers.push({
          userId: docSnapshot.id,
          displayName: userData.displayName || "Usuário",
          email: userData.email || "",
          temporaryRole: tempRole.role,
          expiresAt: tempRole.endDate,
          daysUntilExpiration,
        });
      }

      // Ordenar por proximidade da expiração
      return expiringUsers.sort(
        (a, b) => a.daysUntilExpiration - b.daysUntilExpiration,
      );
    } catch (error) {
      console.error("Erro ao buscar usuários com roles expirando:", error);
      throw error;
    }
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
    try {
      // Verificar se o usuário que está fazendo a extensão tem permissão
      const adminUser = await getDoc(doc(db, "users", extendedBy));
      if (!adminUser.exists()) {
        throw new Error("Usuário administrador não encontrado");
      }

      const adminRole = adminUser.data().role as UserRole;
      if (!PermissionService.canManageUsers(adminRole)) {
        throw new Error(
          "Você não tem permissão para estender roles temporários",
        );
      }

      // Buscar usuário atual
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const currentUser = userDoc.data() as UserProfile;
      if (!currentUser.temporaryRole?.isActive) {
        throw new Error("Usuário não possui role temporário ativo");
      }

      // Atualizar data de expiração
      await setDoc(
        doc(db, "users", userId),
        {
          temporaryRole: {
            ...currentUser.temporaryRole,
            endDate: newEndDate,
            extendedAt: new Date(),
            extendedBy,
            extensionReason: reason.toUpperCase(),
          },
          lastLogin: new Date(),
        },
        { merge: true },
      );

      // Registrar extensão no histórico
      const roleChange: Omit<RoleChange, "id"> = {
        userId,
        oldRole: currentUser.temporaryRole.role,
        newRole: currentUser.temporaryRole.role, // Mesmo role, apenas estendido
        changeType: "temporary_extension",
        reason: `Role temporário estendido: ${reason.toUpperCase()}`,
        changedBy: extendedBy,
        changedAt: new Date(),
        temporaryPeriod: {
          startDate: currentUser.temporaryRole.startDate,
          endDate: newEndDate,
        },
        metadata: {
          ip: "captured-from-session",
          userAgent: "captured-from-session",
          device: "captured-from-session",
        },
      };

      await addDoc(collection(db, "role_changes"), roleChange);

      // Enviar notificação para o usuário (opcional)
      try {
        await this.notifyUserRoleChange(
          userId,
          currentUser.temporaryRole.role,
          "temporary_extension",
          `Seu perfil temporário foi estendido até ${newEndDate.toLocaleDateString("pt-BR")}`,
        );
      } catch (notificationError) {
        console.warn(
          "Aviso: Não foi possível enviar notificação de extensão:",
          notificationError,
        );
      }

      // Reagendar lembrete de expiração (opcional)
      try {
        await this.scheduleExpirationReminder(
          userId,
          currentUser.temporaryRole.role,
        );
      } catch (reminderError) {
        console.warn(
          "Aviso: Não foi possível reagendar lembrete:",
          reminderError,
        );
      }
    } catch (error) {
      console.error("Erro ao estender role temporário:", error);
      throw error;
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

      // Enviar notificação (opcional)
      try {
        await this.notifyUserRoleChange(
          userId,
          userData.baseRole,
          "revert",
          "Seu perfil temporário expirou e foi revertido automaticamente",
        );
      } catch (notificationError) {
        console.warn(
          "Aviso: Não foi possível enviar notificação de reversão:",
          notificationError,
        );
      }
    } catch (error) {
      console.error("Erro ao reverter perfil temporário:", error);
      throw error;
    }
  }

  /**
   * Verifica e processa períodos temporários expirados
   * Esta função deve ser executada periodicamente (ex: diariamente)
   */
  static async processExpiredTemporaryRoles(): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      const now = new Date();

      // Buscar usuários com roles temporários expirados
      const q = query(
        collection(db, "users"),
        where("temporaryRole.isActive", "==", true),
        where("temporaryRole.endDate", "<=", now),
      );

      const querySnapshot = await getDocs(q);

      for (const docSnapshot of querySnapshot.docs) {
        try {
          const userData = docSnapshot.data() as UserProfile;
          const temporaryRole = userData.temporaryRole!;

          // Reverter para o role base
          await setDoc(
            docSnapshot.ref,
            {
              role: userData.baseRole || "user",
              temporaryRole: {
                ...temporaryRole,
                isActive: false,
                expiredAt: now,
              },
              lastLogin: new Date(),
            },
            { merge: true },
          );

          // Registrar mudança automática
          const roleChange: Omit<RoleChange, "id"> = {
            userId: docSnapshot.id,
            oldRole: temporaryRole.role,
            newRole: userData.baseRole || "user",
            changeType: "automatic_revert",
            reason: "Período temporário expirado automaticamente",
            changedBy: "system",
            changedAt: now,
            metadata: {
              ip: "system",
              userAgent: "system",
              device: "system",
            },
          };

          await addDoc(collection(db, "role_changes"), roleChange);

          // Enviar notificação para o usuário (opcional)
          try {
            await this.notifyUserRoleChange(
              docSnapshot.id,
              userData.baseRole || "user",
              "automatic_revert",
              "Seu perfil temporário expirou e foi revertido automaticamente",
            );
          } catch (notificationError) {
            console.warn(
              `Aviso: Não foi possível enviar notificação para usuário ${docSnapshot.id}:`,
              notificationError,
            );
          }

          processed++;
        } catch (error) {
          console.error(`Erro ao processar usuário ${docSnapshot.id}:`, error);
          errors.push(`Usuário ${docSnapshot.id}: ${error}`);
        }
      }
    } catch (error) {
      console.error("Erro ao processar roles temporários expirados:", error);
      errors.push(`Erro geral: ${error}`);
    }

    return { processed, errors };
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
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map((doc) => doc.data() as UserProfile);

      const byRole: Record<string, number> = {};
      let temporary = 0;
      let active = 0;

      users.forEach((user) => {
        // Contar por role
        byRole[user.role] = (byRole[user.role] || 0) + 1;

        // Contar temporários
        if (user.temporaryRole?.isActive) {
          temporary++;
        }

        // Contar ativos (não temporários)
        if (!user.temporaryRole?.isActive) {
          active++;
        }
      });

      return {
        total: users.length,
        byRole,
        temporary,
        active,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      throw error;
    }
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
    try {
      let baseQuery: any = collection(db, "role_changes");

      // Aplicar filtros
      if (filters.userId) {
        baseQuery = query(baseQuery, where("userId", "==", filters.userId));
      }

      if (filters.changeType) {
        baseQuery = query(
          baseQuery,
          where("changeType", "==", filters.changeType),
        );
      }

      if (filters.changedBy) {
        baseQuery = query(
          baseQuery,
          where("changedBy", "==", filters.changedBy),
        );
      }

      if (filters.startDate) {
        baseQuery = query(
          baseQuery,
          where("changedAt", ">=", filters.startDate),
        );
      }

      if (filters.endDate) {
        baseQuery = query(baseQuery, where("changedAt", "<=", filters.endDate));
      }

      // Ordenar por data de mudança (mais recente primeiro)
      baseQuery = query(baseQuery, orderBy("changedAt", "desc"));

      // Aplicar limite
      if (filters.limit) {
        baseQuery = query(baseQuery, limit(filters.limit));
      }

      const querySnapshot = await getDocs(baseQuery);
      return querySnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as any;
        return {
          id: docSnapshot.id,
          ...data,
        } as RoleChange;
      });
    } catch (error) {
      console.error("Erro ao buscar histórico avançado:", error);
      throw error;
    }
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
    try {
      const changes = await this.getAdvancedRoleChangeHistory({
        startDate,
        endDate,
        limit: 1000, // Buscar todas as mudanças do período
      });

      const changesByType: Record<string, number> = {};
      const changesByRole: Record<string, number> = {};
      const userChanges: Record<string, number> = {};
      const securityAlerts: string[] = [];

      changes.forEach((change) => {
        // Contar por tipo
        changesByType[change.changeType] =
          (changesByType[change.changeType] || 0) + 1;

        // Contar por role
        changesByRole[change.newRole] =
          (changesByRole[change.newRole] || 0) + 1;

        // Contar por usuário
        userChanges[change.changedBy] =
          (userChanges[change.changedBy] || 0) + 1;

        // Verificar alertas de segurança
        if (
          change.changeType === "permanent" &&
          change.newRole === "admin_senior"
        ) {
          securityAlerts.push(
            `Promoção para Admin Senior: ${change.userId} por ${change.changedBy}`,
          );
        }

        if (
          change.changeType === "permanent" &&
          change.oldRole === "admin_senior"
        ) {
          securityAlerts.push(
            `Remoção de Admin Senior: ${change.userId} por ${change.changedBy}`,
          );
        }
      });

      // Top usuários por mudanças
      const topUsers = Object.entries(userChanges)
        .map(([userId, changes]) => ({ userId, changes }))
        .sort((a, b) => b.changes - a.changes)
        .slice(0, 10);

      return {
        period: { start: startDate, end: endDate },
        totalChanges: changes.length,
        changesByType,
        changesByRole,
        topUsers,
        securityAlerts,
      };
    } catch (error) {
      console.error("Erro ao gerar relatório de auditoria:", error);
      throw error;
    }
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
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Verificar se o usuário que está fazendo a mudança tem permissão
      const adminUser = await getDoc(doc(db, "users", changedBy));
      if (!adminUser.exists()) {
        errors.push("Usuário administrador não encontrado");
        return { isValid: false, warnings, errors };
      }

      const adminRole = adminUser.data().role as UserRole;
      if (!PermissionService.canChangeRole(adminRole, newRole)) {
        errors.push("Você não tem permissão para alterar este perfil");
        return { isValid: false, warnings, errors };
      }

      // Verificar se o usuário alvo existe
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        errors.push("Usuário alvo não encontrado");
        return { isValid: false, warnings, errors };
      }

      const currentUser = userDoc.data() as UserProfile;
      const oldRole = currentUser.role;

      // Verificar se é uma mudança para o mesmo role
      if (oldRole === newRole) {
        warnings.push("Usuário já possui este perfil");
      }

      // Verificar se é uma promoção significativa
      if (this.isSignificantPromotion(oldRole, newRole)) {
        warnings.push(
          "Esta é uma promoção significativa - considere aprovação adicional",
        );
      }

      // Verificar se o usuário tem mudanças recentes
      const recentChanges = await this.getAdvancedRoleChangeHistory({
        userId,
        limit: 5,
      });

      if (recentChanges.length > 0) {
        const lastChange = recentChanges[0];
        const daysSinceLastChange = Math.floor(
          (Date.now() - lastChange.changedAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysSinceLastChange < 7) {
          warnings.push("Usuário teve mudança de perfil há menos de 7 dias");
        }
      }

      return {
        isValid: errors.length === 0,
        warnings,
        errors,
      };
    } catch (error) {
      errors.push(`Erro de validação: ${error}`);
      return { isValid: false, warnings, errors };
    }
  }

  /**
   * Verifica se uma mudança é uma promoção significativa
   */
  private static isSignificantPromotion(
    oldRole: UserRole,
    newRole: UserRole,
  ): boolean {
    const roleHierarchy = [
      "user",
      "dispatcher",
      "gerente",
      "admin",
      "admin_senior",
    ];
    const oldIndex = roleHierarchy.indexOf(oldRole);
    const newIndex = roleHierarchy.indexOf(newRole);

    // Promoção de mais de 2 níveis é considerada significativa
    return newIndex - oldIndex > 2;
  }
}
