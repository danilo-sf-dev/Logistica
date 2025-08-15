// Solução direta para o erro do ResizeObserver
// Este arquivo deve ser importado no início da aplicação

// Interceptar o erro do ResizeObserver antes de qualquer coisa
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// Função para verificar se é um erro do ResizeObserver
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

// Sobrescrever console.error
console.error = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    // Suprimir completamente o erro do ResizeObserver
    return;
  }
  originalError.apply(console, args);
};

// Sobrescrever console.warn
console.warn = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    // Suprimir completamente o warning do ResizeObserver
    return;
  }
  originalWarn.apply(console, args);
};

// Sobrescrever console.log
console.log = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    // Suprimir completamente o log do ResizeObserver
    return;
  }
  originalLog.apply(console, args);
};

// Interceptar erros não capturados
const originalAddEventListener = window.addEventListener;
window.addEventListener = function (
  type: string,
  listener: any,
  options?: any,
) {
  if (type === "error") {
    const wrappedListener = (event: ErrorEvent) => {
      if (isResizeObserverError(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
      return listener(event);
    };
    return originalAddEventListener.call(this, type, wrappedListener, options);
  }
  return originalAddEventListener.call(this, type, listener, options);
};

// Interceptar promises rejeitadas
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    if (isResizeObserverError(event.reason)) {
      event.preventDefault();
      return false;
    }
  },
);

// Também interceptar no nível do window.onerror
const originalOnError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  if (isResizeObserverError(message)) {
    return true; // Previne o erro de ser exibido
  }
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

// Interceptar também no nível do window.addEventListener('error')
window.addEventListener("error", (event) => {
  if (isResizeObserverError(event.message)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
  }
});

// Suprimir também no nível do React Error Boundary
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    return;
  }
  originalConsoleError.apply(console, args);
};
