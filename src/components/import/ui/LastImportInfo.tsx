import React from "react";
import { Clock, Info } from "lucide-react";
import type { LastImportInfo as LastImportInfoType } from "../types/importTypes";

interface LastImportInfoProps {
  lastImport: LastImportInfoType | null;
}

export const LastImportInfo: React.FC<LastImportInfoProps> = ({
  lastImport,
}) => {
  if (!lastImport) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Nenhuma importação anterior
            </h4>
            <p className="text-sm text-gray-500">
              Esta será a primeira importação para esta entidade
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "partial":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Sucesso";
      case "partial":
        return "Parcial";
      case "failed":
        return "Falhou";
      default:
        return "Desconhecido";
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900">
            Última Importação
          </h4>

          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Arquivo:</span>
              <span className="text-sm font-medium text-blue-900">
                {lastImport.fileName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Data:</span>
              <span className="text-sm font-medium text-blue-900">
                {formatDate(lastImport.date)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Registros:</span>
              <span className="text-sm font-medium text-blue-900">
                {lastImport.importedRows} de {lastImport.totalRows}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Status:</span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lastImport.status)}`}
              >
                {getStatusText(lastImport.status)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Usuário:</span>
              <span className="text-sm font-medium text-blue-900">
                {lastImport.userName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
