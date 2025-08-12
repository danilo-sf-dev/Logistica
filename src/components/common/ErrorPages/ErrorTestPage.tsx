import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  AlertTriangle,
  Shield,
  Lock,
  Server,
  ArrowLeft,
} from "lucide-react";

export const ErrorTestPage: React.FC = () => {
  const navigate = useNavigate();

  const errorPages = [
    {
      code: "400",
      title: "Bad Request",
      path: "/error/400",
      description: "Requisição inválida",
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    },
    {
      code: "401",
      title: "Unauthorized",
      path: "/error/401",
      description: "Acesso não autorizado",
      icon: <Shield className="h-6 w-6 text-red-500" />,
    },
    {
      code: "403",
      title: "Forbidden",
      path: "/error/403",
      description: "Acesso proibido",
      icon: <Lock className="h-6 w-6 text-red-500" />,
    },
    {
      code: "404",
      title: "Not Found",
      path: "/error/404",
      description: "Página não encontrada",
      icon: <Search className="h-6 w-6 text-red-500" />,
    },
    {
      code: "500",
      title: "Server Error",
      path: "/error/500",
      description: "Erro interno do servidor",
      icon: <Server className="h-6 w-6 text-red-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Páginas de Erro - SGL
          </h1>
          <p className="text-lg text-gray-600">
            Teste todas as páginas de erro disponíveis no sistema
          </p>
        </div>

        {/* Botão Voltar */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        {/* Grid de Páginas de Erro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorPages.map((page) => (
            <div
              key={page.code}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                {page.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-500">{page.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-mono">
                  {page.code}
                </span>
              </div>

              <button
                onClick={() => navigate(page.path)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Testar Página
              </button>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Como Usar
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              • <strong>Error Boundary:</strong> Captura erros de JavaScript
              automaticamente
            </p>
            <p>
              • <strong>Hook useErrorHandler:</strong> Para tratamento
              programático de erros
            </p>
            <p>
              • <strong>Rotas:</strong> Acesse diretamente via URL (ex:
              /error/404)
            </p>
            <p>
              • <strong>Personalização:</strong> Todas as páginas são
              customizáveis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorTestPage;
