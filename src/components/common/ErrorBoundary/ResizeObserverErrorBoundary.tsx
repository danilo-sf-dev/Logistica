import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ResizeObserverErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Verificar se é um erro do ResizeObserver
    if (
      error.message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      console.log("🔧 Erro do ResizeObserver capturado pelo Error Boundary");
      return { hasError: false }; // Não mostrar erro para ResizeObserver
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Verificar se é um erro do ResizeObserver
    if (
      error.message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      console.log("🔧 Erro do ResizeObserver suprimido pelo Error Boundary");
      return; // Não fazer nada para erros do ResizeObserver
    }

    // Para outros erros, logar normalmente
    console.error(
      "Error caught by ResizeObserverErrorBoundary:",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-800 font-semibold">Algo deu errado</h2>
          <p className="text-red-600">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
