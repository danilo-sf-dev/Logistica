import React, { useState, useEffect } from "react";
import { Shield, Globe } from "lucide-react";
import type { SegurancaProps } from "../types";
import SessionService from "../../../services/sessionService";

export const SegurancaForm: React.FC<SegurancaProps> = ({
  userProfile,
  className = "",
}) => {
  const [sessionInfo, setSessionInfo] = useState<{
    ip: string;
    device: string;
    browser: string;
    os: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Carregar informações de sessão
  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        setLoading(true);

        // Se temos informações salvas no perfil, usar elas
        if (userProfile?.sessionInfo) {
          const formatted = SessionService.formatSessionInfo(
            userProfile.sessionInfo,
          );
          setSessionInfo(formatted);
        } else {
          // Caso contrário, capturar informações atuais
          const currentSession = await SessionService.getSessionInfo();
          const formatted = SessionService.formatSessionInfo(currentSession);
          setSessionInfo(formatted);
        }
      } catch (error) {
        console.error("Erro ao carregar informações de sessão:", error);
        setSessionInfo({
          ip: "Não disponível",
          device: "Não disponível",
          browser: "Não disponível",
          os: "Não disponível",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSessionInfo();
  }, [userProfile?.sessionInfo]);

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
                <p>
                  IP:{" "}
                  {loading
                    ? "Carregando..."
                    : sessionInfo?.ip || "Não disponível"}
                </p>
                <p>
                  Dispositivo:{" "}
                  {loading
                    ? "Carregando..."
                    : sessionInfo?.device || "Não disponível"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegurancaForm;
