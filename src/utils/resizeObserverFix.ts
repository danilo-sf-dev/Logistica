// Solução direta para o erro do ResizeObserver
// Este arquivo deve ser importado no início da aplicação

console.log("🔧 Inicializando supressão do erro ResizeObserver...");

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
    console.log("🔧 Erro do ResizeObserver suprimido");
    return;
  }
  originalError.apply(console, args);
};

// Sobrescrever console.warn
console.warn = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    // Suprimir completamente o warning do ResizeObserver
    console.log("🔧 Warning do ResizeObserver suprimido");
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
        console.log(
          "🔧 Erro do ResizeObserver capturado e suprimido via addEventListener",
        );
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
      console.log("🔧 Promise rejeitada do ResizeObserver suprimida");
      event.preventDefault();
      return false;
    }
  },
);

// Também interceptar no nível do window.onerror
const originalOnError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  if (isResizeObserverError(message)) {
    console.log("🔧 Erro do ResizeObserver suprimido via window.onerror");
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
    console.log(
      "🔧 Erro do ResizeObserver capturado via window.addEventListener",
    );
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
  }
});

// Suprimir também no nível do React Error Boundary
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (isResizeObserverError(args[0])) {
    console.log(
      "🔧 Erro do ResizeObserver suprimido via console.error override",
    );
    return;
  }
  originalConsoleError.apply(console, args);
};

console.log("✅ Supressão do erro ResizeObserver inicializada com sucesso!");
