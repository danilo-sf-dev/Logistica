import React from "react";
import { Shield, Globe } from "lucide-react";
import type { SegurancaProps } from "../types";

export const SegurancaForm: React.FC<SegurancaProps> = ({
  userProfile,
  className = "",
}) => {
  // Função para formatar a data do último login
  const formatLastLogin = (lastLogin: any): string => {
    if (!lastLogin) return "N/A";

    try {
      // Verifica se é um Timestamp do Firestore (tem método toDate)
      if (lastLogin && typeof lastLogin.toDate === "function") {
        return new Date(lastLogin.toDate()).toLocaleString("pt-BR");
      }

      // Verifica se é um Date JavaScript ou timestamp
      if (lastLogin instanceof Date) {
        return lastLogin.toLocaleString("pt-BR");
      }

      // Se for um timestamp numérico
      if (typeof lastLogin === "number") {
        return new Date(lastLogin).toLocaleString("pt-BR");
      }

      // Se for uma string de data
      if (typeof lastLogin === "string") {
        return new Date(lastLogin).toLocaleString("pt-BR");
      }

      return "N/A";
    } catch (error) {
      console.error("Erro ao formatar data do último login:", error);
      return "N/A";
    }
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Segurança</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Segurança da Conta
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Para alterar sua senha, entre em contato com o administrador
                  do sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informações de Sessão
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Último login: {formatLastLogin(userProfile?.lastLogin)}</p>
                <p>IP: 192.168.1.100</p>
                <p>Dispositivo: Chrome - Windows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegurancaForm;
