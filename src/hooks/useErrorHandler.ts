import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

interface ErrorHandlerOptions {
  showNotification?: boolean;
  redirectToErrorPage?: boolean;
  errorPageType?: "400" | "401" | "403" | "404" | "500";
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleError = useCallback(
    (error: any, options: ErrorHandlerOptions = {}) => {
      const {
        showNotification: shouldShowNotification = true,
        redirectToErrorPage = false,
        errorPageType = "500",
        fallbackMessage = "Ocorreu um erro inesperado",
      } = options;

      // Log do erro para debugging
      console.error("Erro capturado:", error);

      // Determinar o tipo de erro baseado no código ou mensagem
      let errorType = errorPageType;
      let errorMessage = fallbackMessage;

      if (error?.code) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage =
              "Usuário não encontrado. Verifique se o email está correto ou use o login com Google.";
            break;
          case "auth/wrong-password":
            errorMessage =
              "Senha incorreta. Verifique sua senha e tente novamente.";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido. Verifique o formato do email.";
            break;
          case "auth/invalid-credential":
            errorMessage =
              "Credenciais inválidas. Verifique seu email e senha, ou use o login com Google.";
            break;
          case "auth/operation-not-allowed":
            errorMessage =
              "Método de login não habilitado. Entre em contato com o administrador.";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "Muitas tentativas. Tente novamente em alguns minutos.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Erro de conexão. Verifique sua internet e tente novamente.";
            errorType = "500";
            break;
          case "permission-denied":
            errorMessage = "Você não tem permissão para esta ação.";
            errorType = "403";
            break;
          case "not-found":
            errorMessage = "Recurso não encontrado.";
            errorType = "404";
            break;
          default:
            errorMessage =
              "Ocorreu um erro inesperado. Tente novamente ou use o login com Google.";
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Mostrar notificação se habilitado
      if (shouldShowNotification) {
        showNotification(errorMessage, "error");
      }

      // Redirecionar para página de erro se habilitado
      if (redirectToErrorPage) {
        navigate(`/error/${errorType}`);
      }

      return {
        errorType,
        errorMessage,
        originalError: error,
      };
    },
    [navigate, showNotification],
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      options: ErrorHandlerOptions = {},
    ): Promise<T | null> => {
      try {
        return await asyncFunction();
      } catch (error) {
        handleError(error, options);
        return null;
      }
    },
    [handleError],
  );

  return {
    handleError,
    handleAsyncError,
  };
};
