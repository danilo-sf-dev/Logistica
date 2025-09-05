// ========================================
// SERVIÇO DE NOTIFICAÇÕES DE USUÁRIO
// ========================================

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { PermissionService } from "../permissionService";
import type { UserRole } from "../../types";

/**
 * Serviço responsável pelas notificações de usuário
 */
export class UserNotificationService {
  /**
   * Envia notificação avançada para mudança de role
   */
  static async notifyUserRoleChange(
    userId: string,
    newRole: UserRole,
    changeType: string,
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
  static async scheduleExpirationReminder(
    userId: string,
    temporaryRole: UserRole,
  ): Promise<void> {
    try {
      // Buscar usuário para obter data de expiração
      const userDoc = await this.getUserById(userId);
      if (!userDoc) return;

      const tempRole = userDoc.temporaryRole;
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
          willRevertTo: userDoc.baseRole || "user",
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
   * Busca usuário por ID (método auxiliar)
   */
  private static async getUserById(userId: string): Promise<any> {
    try {
      const { getDoc, doc } = await import("firebase/firestore");
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        ...userData,
        temporaryRole: userData.temporaryRole
          ? {
              ...userData.temporaryRole,
              startDate:
                userData.temporaryRole.startDate?.toDate() || new Date(),
              endDate: userData.temporaryRole.endDate?.toDate() || new Date(),
              grantedAt:
                userData.temporaryRole.grantedAt?.toDate() || new Date(),
            }
          : undefined,
      };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }
}
