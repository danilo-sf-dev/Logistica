import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
  description?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  className?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  title,
  message,
  description,
  icon,
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = true,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="max-w-md w-full mx-auto text-center px-4">
        {/* Código do erro */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">{code}</h1>
        </div>

        {/* Ícone personalizado */}
        {icon && (
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">{icon}</div>
          </div>
        )}

        {/* Título e mensagem */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-lg text-gray-600 mb-4">{message}</p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Ir para o Dashboard
            </button>
          )}

          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          )}

          {showRefreshButton && (
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
