// ========================================
// SERVIÇO DE VALIDAÇÃO DE USUÁRIOS
// ========================================

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { PermissionService } from "../permissionService";
import type { UserRole, RoleChangeType } from "../../types";

/**
 * Serviço responsável pelas validações de usuário
 */
export class UserValidationService {
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

      const currentUser = userDoc.data();
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
      const recentChanges = await this.getRecentRoleChanges(userId);
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

  /**
   * Obtém mudanças recentes de role para um usuário
   */
  private static async getRecentRoleChanges(userId: string): Promise<any[]> {
    try {
      const { collection, query, where, getDocs, orderBy, limit } =
        await import("firebase/firestore");
      const q = query(
        collection(db, "role_changes"),
        where("userId", "==", userId),
        orderBy("changedAt", "desc"),
        limit(5),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          changedAt: data.changedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error("Erro ao buscar mudanças recentes:", error);
      return [];
    }
  }

  /**
   * Valida período temporário
   */
  static validateTemporaryPeriod(startDate: Date, endDate: Date): boolean {
    if (startDate >= endDate) {
      throw new Error("Data de início deve ser anterior à data de fim");
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Meia-noite de hoje

    // Permitir datas de hoje em diante
    if (endDate < today) {
      throw new Error("Data de fim deve ser hoje ou futura");
    }

    return true;
  }

  /**
   * Normaliza datas e garante consistência
   */
  static normalizeDate(date: Date): Date {
    return new Date(date);
  }
}
