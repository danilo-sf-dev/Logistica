// ========================================
// HOOK PARA VERIFICAÇÃO AUTOMÁTICA DE PERFIS TEMPORÁRIOS
// ========================================

import { useEffect, useRef } from "react";
import { UserManagementService } from "../services/userManagementService";

/**
 * Hook para executar verificação automática de perfis temporários expirados
 * Executa a cada 5 minutos quando o usuário está logado
 */
export const useTemporaryRoleScheduler = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const checkExpiredRoles = async () => {
    // Evitar execuções simultâneas
    if (isRunningRef.current) return;

    isRunningRef.current = true;

    try {
      const result = await UserManagementService.processExpiredTemporaryRoles();

      if (result.processed > 0) {
        console.log(
          `✅ ${result.processed} perfil(is) temporário(s) revertido(s) automaticamente`,
        );
      }

      if (result.errors.length > 0) {
        console.error("❌ Erros durante verificação:", result.errors);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar perfis temporários:", error);
    } finally {
      isRunningRef.current = false;
    }
  };

  useEffect(() => {
    // Executar verificação imediatamente
    checkExpiredRoles();

    // Configurar verificação periódica a cada 5 minutos
    intervalRef.current = setInterval(checkExpiredRoles, 5 * 60 * 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    checkExpiredRoles,
  };
};
