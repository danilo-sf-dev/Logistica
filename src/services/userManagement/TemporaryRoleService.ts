// ========================================
// SERVIÇO DE ROLES TEMPORÁRIOS
// ========================================

import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { PermissionService } from "../permissionService";
import {
  toFirebaseTimestamp,
  fromFirebaseDate,
  getServerTimestamp,
} from "../../utils/dateUtils";
import type { UserProfile, RoleChange, UserRole } from "../../types";

/**
 * Serviço responsável pelo gerenciamento de roles temporários
 */
export class TemporaryRoleService {
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
      // Verificar permissões
      await this.validateExtensionPermissions(extendedBy);

      // Buscar usuário atual
      const currentUser = await this.getUserById(userId);
      if (!currentUser.temporaryRole?.isActive) {
        throw new Error("Usuário não possui role temporário ativo");
      }

      // Atualizar data de expiração
      await setDoc(
        doc(db, "users", userId),
        {
          temporaryRole: {
            ...currentUser.temporaryRole,
            endDate: toFirebaseTimestamp(newEndDate),
            extendedAt: getServerTimestamp(), // Usar serverTimestamp para auditoria
            extendedBy,
            extensionReason: reason.toUpperCase(),
          },
          lastLogin: getServerTimestamp(), // Usar serverTimestamp para auditoria
        },
        { merge: true },
      );

      // Registrar extensão no histórico
      await this.recordExtension({
        userId,
        currentUser,
        newEndDate,
        reason,
        extendedBy,
      });
    } catch (error) {
      console.error("Erro ao estender role temporário:", error);
      throw error;
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

        // Converter FirebaseDate para Date antes de usar getTime()
        const endDate = fromFirebaseDate(tempRole.endDate);

        const daysUntilExpiration = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        expiringUsers.push({
          userId: docSnapshot.id,
          displayName: userData.displayName || "Usuário",
          email: userData.email || "",
          temporaryRole: tempRole.role,
          expiresAt: endDate,
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
   * Verifica se há perfis temporários expirados
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
      return this.mapUserDocuments(querySnapshot.docs);
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
      await this.recordRevert({
        userId,
        userData,
      });
    } catch (error) {
      console.error("Erro ao reverter perfil temporário:", error);
      throw error;
    }
  }

  /**
   * Verifica e processa períodos temporários expirados
   */
  static async processExpiredTemporaryRoles(): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      const now = new Date();

      // Buscar usuários com roles temporários ativos
      const q = query(
        collection(db, "users"),
        where("temporaryRole.isActive", "==", true),
      );

      const querySnapshot = await getDocs(q);

      // Verificar cada usuário individualmente para comparar datas corretamente
      for (const docSnapshot of querySnapshot.docs) {
        try {
          const userData = docSnapshot.data() as UserProfile;
          const temporaryRole = userData.temporaryRole!;

          // Converter endDate para Date se necessário
          const endDate = fromFirebaseDate(temporaryRole.endDate);

          // Verificar se o perfil temporário expirou
          if (endDate <= now) {
            console.log(
              `🔄 Revertendo perfil temporário: ${userData.displayName}`,
            );

            // Reverter para o role base
            await setDoc(
              docSnapshot.ref,
              {
                role: userData.baseRole || "user",
                temporaryRole: {
                  ...temporaryRole,
                  isActive: false,
                  expiredAt: toFirebaseTimestamp(now),
                },
                lastLogin: getServerTimestamp(), // Usar serverTimestamp para auditoria
              },
              { merge: true },
            );

            // Registrar mudança automática
            await this.recordAutomaticRevert({
              userId: docSnapshot.id,
              userData,
              temporaryRole,
              now,
            });

            processed++;
          }
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
   * Resolve inconsistência específica: remove temporaryRole de usuário já convertido para permanente
   */
  static async fixPermanentUserWithTemporaryRole(
    userId: string,
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = userDoc.data() as UserProfile;

      // Verificar se é o caso que queremos resolver
      if (
        userData.role === userData.baseRole &&
        userData.temporaryRole?.isActive
      ) {
        console.log(
          `Corrigindo inconsistência para usuário ${userId}: role=${userData.role}, baseRole=${userData.baseRole}`,
        );

        // Remover temporaryRole
        await updateDoc(doc(db, "users", userId), {
          temporaryRole: deleteField(),
        });

        // Registrar correção automática
        await addDoc(collection(db, "role_changes"), {
          userId,
          oldRole: userData.temporaryRole.role,
          newRole: userData.baseRole,
          changeType: "automatic_revert",
          reason: "Correção automática: usuário já convertido para permanente",
          changedBy: "system",
          changedAt: new Date(),
          metadata: {
            ip: "system",
            userAgent: "system",
            device: "system",
          },
        });

        console.log(
          `Campo temporaryRole removido com sucesso para usuário ${userId}`,
        );
      } else {
        console.log(
          `Usuário ${userId} não precisa de correção: role=${userData.role}, baseRole=${userData.baseRole}, hasTemporary=${!!userData.temporaryRole?.isActive}`,
        );
      }
    } catch (error) {
      console.error(`Erro ao corrigir usuário ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Valida permissões para extensão de role temporário
   */
  private static async validateExtensionPermissions(
    extendedBy: string,
  ): Promise<void> {
    const adminUser = await getDoc(doc(db, "users", extendedBy));
    if (!adminUser.exists()) {
      throw new Error("Usuário administrador não encontrado");
    }

    const adminRole = adminUser.data().role as UserRole;
    if (!PermissionService.canManageUsers(adminRole)) {
      throw new Error("Você não tem permissão para estender roles temporários");
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
   * Registra extensão de role temporário
   */
  private static async recordExtension(data: {
    userId: string;
    currentUser: UserProfile;
    newEndDate: Date;
    reason: string;
    extendedBy: string;
  }): Promise<void> {
    const roleChange: Omit<RoleChange, "id"> = {
      userId: data.userId,
      oldRole: data.currentUser.temporaryRole!.role,
      newRole: data.currentUser.temporaryRole!.role, // Mesmo role, apenas estendido
      changeType: "temporary_extension",
      reason: `Role temporário estendido: ${data.reason.toUpperCase()}`,
      changedBy: data.extendedBy,
      changedAt: getServerTimestamp(), // SOLUÇÃO DEFINITIVA: Usar serverTimestamp
      temporaryPeriod: {
        startDate: toFirebaseTimestamp(
          fromFirebaseDate(data.currentUser.temporaryRole!.startDate),
        ),
        endDate: toFirebaseTimestamp(data.newEndDate),
      },
      metadata: {
        ip: "captured-from-session",
        userAgent: "captured-from-session",
        device: "captured-from-session",
      },
    };

    await addDoc(collection(db, "role_changes"), roleChange);
  }

  /**
   * Registra reversão de role temporário
   */
  private static async recordRevert(data: {
    userId: string;
    userData: UserProfile;
  }): Promise<void> {
    const roleChange: Omit<RoleChange, "id"> = {
      userId: data.userId,
      oldRole: data.userData.temporaryRole!.role,
      newRole: data.userData.baseRole!,
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
  }

  /**
   * Registra reversão automática
   */
  private static async recordAutomaticRevert(data: {
    userId: string;
    userData: UserProfile;
    temporaryRole: any;
    now: Date;
  }): Promise<void> {
    const roleChange: Omit<RoleChange, "id"> = {
      userId: data.userId,
      oldRole: data.temporaryRole.role,
      newRole: data.userData.baseRole || "user",
      changeType: "automatic_revert",
      reason: "Período temporário expirado automaticamente",
      changedBy: "system",
      changedAt: getServerTimestamp(), // SOLUÇÃO DEFINITIVA: Usar serverTimestamp
      metadata: {
        ip: "system",
        userAgent: "system",
        device: "system",
      },
    };

    await addDoc(collection(db, "role_changes"), roleChange);
  }

  /**
   * Mapeia documentos do Firestore para objetos UserProfile
   */
  private static mapUserDocuments(docs: any[]): UserProfile[] {
    return docs.map((doc) => ({
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
  }
}
