// ========================================
// SERVIÇO DE PERFIL DE USUÁRIO
// ========================================

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { UserProfile } from "../../types";

/**
 * Serviço responsável pelas operações básicas de perfil de usuário
 */
export class UserProfileService {
  /**
   * Obtém usuários por perfil específico
   */
  static async getUsersByRole(role: string): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      return this.mapUserDocuments(querySnapshot.docs);
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
      const users = this.mapUserDocuments(querySnapshot.docs);
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
      const usersQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(usersQuery);

      return this.mapUserDocuments(querySnapshot.docs).filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.displayName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.cargo?.toLowerCase().includes(searchLower)
        );
      });
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
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  /**
   * Desativa um usuário (soft delete)
   */
  static async deactivateUser(userId: string): Promise<void> {
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
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
      throw error;
    }
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
      const users = this.mapUserDocuments(usersSnapshot.docs);

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
   * Mapeia documentos do Firestore para objetos UserProfile
   */
  private static mapUserDocuments(docs: any[]): UserProfile[] {
    return docs.map((doc) => ({
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
  }
}
