import { useEffect } from "react";

export const useResizeObserver = () => {
  useEffect(() => {
    // Suprimir o erro do ResizeObserver que é comum em bibliotecas de gráficos
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Função para verificar se a mensagem contém o erro do ResizeObserver
    const isResizeObserverError = (message: any): boolean => {
      if (typeof message === "string") {
        return (
          message.includes(
            "ResizeObserver loop completed with undelivered notifications",
          ) ||
          message.includes("ResizeObserver") ||
          message.includes("resize observer")
        );
      }
      return false;
    };

    console.error = (...args: any[]) => {
      if (isResizeObserverError(args[0])) {
        // Suprimir este erro específico
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      if (isResizeObserverError(args[0])) {
        // Suprimir este warning específico
        return;
      }
      originalWarn.apply(console, args);
    };

    console.log = (...args: any[]) => {
      if (isResizeObserverError(args[0])) {
        // Suprimir este log específico
        return;
      }
      originalLog.apply(console, args);
    };

    // Listener para erros não capturados
    const handleError = (event: ErrorEvent) => {
      if (isResizeObserverError(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };

    // Listener para promises rejeitadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isResizeObserverError(event.reason)) {
        event.preventDefault();
        return false;
      }
    };

    // Suprimir também no nível global
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (
      type: string,
      listener: any,
      options?: any,
    ) {
      if (type === "error" && typeof listener === "function") {
        const wrappedListener = (event: ErrorEvent) => {
          if (isResizeObserverError(event.message)) {
            return false;
          }
          return listener(event);
        };
        return originalAddEventListener.call(
          this,
          type,
          wrappedListener,
          options,
        );
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      // Restaurar console original
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;

      // Restaurar addEventListener original
      window.addEventListener = originalAddEventListener;

      // Remover listeners
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);
};
