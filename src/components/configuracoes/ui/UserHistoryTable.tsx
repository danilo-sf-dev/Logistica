import React from "react";
import { History, ChevronUp, ChevronDown } from "lucide-react";
import { PermissionService } from "../../../services/permissionService";

import type { RoleChange } from "../../../types/permissions";

interface UserHistoryTableProps {
  roleChanges: RoleChange[];
  userMap: Record<string, { displayName: string; email: string }>;
  ordenarPor: "changedAt" | "userId" | "changeType";
  direcaoOrdenacao: "asc" | "desc";
  onOrdenar: (campo: "changedAt" | "userId" | "changeType") => void;
}

export const UserHistoryTable: React.FC<UserHistoryTableProps> = ({
  roleChanges,
  userMap,
  ordenarPor,
  direcaoOrdenacao,
  onOrdenar,
}) => {
  const getRoleDisplayName = (role: string) => {
    return PermissionService.getRoleDisplayName(role as any);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 flex items-center">
          <History className="w-5 h-5 mr-2 flex-shrink-0" />
          Histórico de Alterações
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onOrdenar("changedAt")}
              >
                <div className="flex items-center">
                  Data
                  {ordenarPor === "changedAt" &&
                    (direcaoOrdenacao === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onOrdenar("userId")}
              >
                <div className="flex items-center">
                  Usuário
                  {ordenarPor === "userId" &&
                    (direcaoOrdenacao === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                De → Para
              </th>
              <th
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onOrdenar("changeType")}
              >
                <div className="flex items-center">
                  Tipo
                  {ordenarPor === "changeType" &&
                    (direcaoOrdenacao === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roleChanges.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 sm:px-6 py-4 text-center text-gray-500"
                >
                  Nenhuma alteração registrada
                </td>
              </tr>
            ) : (
              roleChanges.slice(0, 10).map((change) => (
                <tr key={change.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(change.changedAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {userMap[change.userId]?.displayName ||
                          "Usuário não encontrado"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {userMap[change.userId]?.email || change.userId}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRoleDisplayName(change.oldRole)} →{" "}
                    {getRoleDisplayName(change.newRole)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        change.changeType === "permanent"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {change.changeType === "permanent"
                        ? "Permanente"
                        : "Temporário"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] sm:max-w-none">
                    <div className="truncate" title={change.reason}>
                      {change.reason}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
