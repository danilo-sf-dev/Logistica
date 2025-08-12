import React, { Component, ErrorInfo, ReactNode } from "react";
import { ServerErrorPage } from "../ErrorPages";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para debugging
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI customizada de fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de fallback
      return <ServerErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
