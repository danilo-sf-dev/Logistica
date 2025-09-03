// ========================================
// SERVIÇO DE GERENCIAMENTO DE ROLES
// ========================================

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { PermissionService } from "../permissionService";
import { toFirebaseTimestamp, getServerTimestamp } from "../../utils/dateUtils";
import type {
  UserProfile,
  RoleChange,
  RoleChangeType,
  UserRole,
} from "../../types";

/**
 * Serviço responsável pelo gerenciamento de roles e mudanças de perfil
 */
export class UserRoleService {
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
      // Verificar permissões
      await this.validateRoleChangePermissions(changedBy, newRole);

      // Buscar usuário atual
      const currentUser = await this.getUserById(userId);
      const oldRole = currentUser.role;

      // Preparar dados para atualização
      const updateData = this.prepareRoleUpdateData(
        newRole,
        changeType,
        reason, // ✅ PASSAR O MOTIVO PARA O MÉTODO
        temporaryPeriod,
      );

      // Atualizar usuário
      await setDoc(doc(db, "users", userId), updateData, { merge: true });

      // Limpar temporaryRole se for mudança permanente
      if (changeType === "permanent" && currentUser.temporaryRole) {
        await updateDoc(doc(db, "users", userId), {
          temporaryRole: deleteField(),
        });
      }

      // Notificar mudança no contexto se for o usuário atual
      if (userId === changedBy) {
        this.notifyProfileUpdate(userId);
      }

      // Registrar mudança no histórico
      await this.recordRoleChange({
        userId,
        oldRole,
        newRole,
        changeType,
        reason,
        changedBy,
        temporaryPeriod,
      });
    } catch (error) {
      console.error("Erro ao alterar role do usuário:", error);
      throw error;
    }
  }

  /**
   * Valida permissões para mudança de role
   */
  private static async validateRoleChangePermissions(
    changedBy: string,
    newRole: UserRole,
  ): Promise<void> {
    const adminUser = await getDoc(doc(db, "users", changedBy));
    if (!adminUser.exists()) {
      throw new Error("Usuário administrador não encontrado");
    }

    const adminRole = adminUser.data().role as UserRole;
    if (!PermissionService.canChangeRole(adminRole, newRole)) {
      throw new Error("Você não tem permissão para alterar este perfil");
    }
  }

  /**
   * Busca usuário por ID
   */
  private static async getUserById(userId: string): Promise<UserProfile> {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }
    return userDoc.data() as UserProfile;
  }

  /**
   * Prepara dados para atualização de role
   */
  private static prepareRoleUpdateData(
    newRole: UserRole,
    changeType: RoleChangeType,
    reason: string,
    temporaryPeriod?: { startDate: Date; endDate: Date },
  ): Partial<UserProfile> {
    const updateData: Partial<UserProfile> = {
      role: newRole,
      lastLogin: getServerTimestamp(),
    };

    if (changeType === "temporary" && temporaryPeriod) {
      updateData.temporaryRole = {
        role: newRole,
        startDate: toFirebaseTimestamp(temporaryPeriod.startDate),
        endDate: toFirebaseTimestamp(temporaryPeriod.endDate),
        reason: reason.toUpperCase(),
        grantedBy: "system",
        grantedAt: getServerTimestamp(),
        isActive: true,
      };
    } else {
      updateData.baseRole = newRole;
    }

    return updateData;
  }

  /**
   * Notifica atualização de perfil no contexto
   */
  private static notifyProfileUpdate(userId: string): void {
    window.dispatchEvent(
      new CustomEvent("userProfileUpdated", {
        detail: { userId },
      }),
    );
  }

  /**
   * Registra mudança de role no histórico
   */
  private static async recordRoleChange(data: {
    userId: string;
    oldRole: UserRole;
    newRole: UserRole;
    changeType: RoleChangeType;
    reason: string;
    changedBy: string;
    temporaryPeriod?: { startDate: Date; endDate: Date };
  }): Promise<void> {
    const roleChange: Omit<RoleChange, "id"> = {
      userId: data.userId,
      oldRole: data.oldRole,
      newRole: data.newRole,
      changeType: data.changeType,
      reason: data.reason.toUpperCase(),
      changedBy: data.changedBy,
      changedAt: getServerTimestamp(), // SOLUÇÃO DEFINITIVA: Usar serverTimestamp
      ...(data.temporaryPeriod && {
        temporaryPeriod: {
          startDate: toFirebaseTimestamp(data.temporaryPeriod.startDate),
          endDate: toFirebaseTimestamp(data.temporaryPeriod.endDate),
        },
      }),
      metadata: {
        ip: "captured-from-session",
        userAgent: "captured-from-session",
        device: "captured-from-session",
      },
    };

    await addDoc(collection(db, "role_changes"), roleChange);
  }
}
