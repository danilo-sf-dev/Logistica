// ========================================
// UTILITÁRIO PARA REVERSÃO MANUAL DE PERFIS TEMPORÁRIOS
// ========================================

import { UserManagementService } from "../services/userManagementService";

/**
 * Executa reversão manual imediata de perfis temporários expirados
 * Função de emergência para casos urgentes
 */
export const executeManualRoleRevert = async () => {
  try {
    const result = await UserManagementService.processExpiredTemporaryRoles();

    if (result.processed > 0) {
      console.log(`✅ ${result.processed} perfil(is) revertido(s) manualmente`);
    }

    if (result.errors.length > 0) {
      console.error("❌ Erros encontrados:", result.errors);
    }

    return result;
  } catch (error) {
    console.error("❌ Erro na reversão manual:", error);
    throw error;
  }
};
