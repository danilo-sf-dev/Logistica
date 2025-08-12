import React from "react";
import { Shield, Globe } from "lucide-react";
import type { SegurancaProps } from "../types";

export const SegurancaForm: React.FC<SegurancaProps> = ({
  userProfile,
  className = "",
}) => {
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
                <p>
                  Último login:{" "}
                  {userProfile?.lastLogin
                    ? new Date(userProfile.lastLogin.toDate()).toLocaleString(
                        "pt-BR",
                      )
                    : "N/A"}
                </p>
                <p>IP: 192.168.1.100</p>
                <p>Dispositivo: Chrome - Windows</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-secondary">Encerrar Todas as Sessões</button>
        </div>
      </div>
    </div>
  );
};

export default SegurancaForm;
