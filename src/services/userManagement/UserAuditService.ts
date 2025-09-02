// ========================================
// SERVIÇO DE AUDITORIA DE USUÁRIOS
// ========================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { AuditLog, RoleChange, RoleChangeType } from "../../types";

/**
 * Serviço responsável pela auditoria e logs de usuário
 */
export class UserAuditService {
  /**
   * Cria log de auditoria
   */
  static async createAuditLog(logData: Omit<AuditLog, "id">): Promise<void> {
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
   * Obtém o histórico de mudanças de perfil
   */
  static async getRoleChangeHistory(userId?: string): Promise<RoleChange[]> {
    try {
      let finalQuery: any = collection(db, "role_changes");

      if (userId) {
        finalQuery = query(finalQuery, where("userId", "==", userId));
      }

      finalQuery = query(finalQuery, orderBy("changedAt", "desc"), limit(100));

      const querySnapshot = await getDocs(finalQuery);
      return this.mapRoleChangeDocuments(querySnapshot.docs);
    } catch (error) {
      console.error("Erro ao buscar histórico de mudanças:", error);
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
      return this.mapRoleChangeDocuments(querySnapshot.docs);
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
   * Mapeia documentos do Firestore para objetos RoleChange
   */
  private static mapRoleChangeDocuments(docs: any[]): RoleChange[] {
    return docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        changedAt: data.changedAt?.toDate() || new Date(),
        temporaryPeriod: data.temporaryPeriod
          ? {
              ...data.temporaryPeriod,
              startDate: data.temporaryPeriod.startDate?.toDate() || new Date(),
              endDate: data.temporaryPeriod.endDate?.toDate() || new Date(),
            }
          : undefined,
      } as RoleChange;
    });
  }
}
