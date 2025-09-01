import React from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  History,
  Search,
  Shield,
  Edit,
  Settings,
} from "lucide-react";
import type { UserManagementFormProps, UserManagementData } from "../types";

export const UserManagementForm: React.FC<UserManagementFormProps> = ({
  className = "",
}) => {
  // Dados mockados para o layout (serão substituídos por dados reais depois)
  const mockUsers: UserManagementData[] = [
    {
      uid: "user1",
      email: "admin@empresa.com",
      displayName: "Administrador Principal",
      photoURL: null,
      role: "admin_senior",
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date(),
      provider: "email",
      telefone: "(11) 99999-9999",
      cargo: "Administrador",
    },
    {
      uid: "user2",
      email: "gerente@empresa.com",
      displayName: "João Silva",
      photoURL: null,
      role: "gerente",
      createdAt: new Date("2024-02-01"),
      lastLogin: new Date(),
      provider: "email",
      telefone: "(11) 88888-8888",
      cargo: "Gerente de Logística",
    },
    {
      uid: "user3",
      email: "funcionario@empresa.com",
      displayName: "Maria Santos",
      photoURL: null,
      role: "dispatcher",
      createdAt: new Date("2024-03-01"),
      lastLogin: new Date(),
      provider: "email",
      telefone: "(11) 77777-7777",
      cargo: "Funcionária",
    },
  ];

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin_senior: "Administrador Sr",
      admin: "Administrador",
      gerente: "Gerente",
      dispatcher: "Funcionário",
      user: "Usuário",
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin_senior: "bg-red-100 text-red-800",
      admin: "bg-purple-100 text-purple-800",
      gerente: "bg-blue-100 text-blue-800",
      dispatcher: "bg-green-100 text-green-800",
      user: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da Seção */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          Gestão de Usuários
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie perfis, permissões e acesso dos usuários do sistema
        </p>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn-primary flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </button>
          <button className="btn-secondary flex items-center">
            <History className="w-4 h-4 mr-2" />
            Histórico
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="space-y-4">
          {/* Campo de Busca - Largura Total */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>

          {/* Dropdowns - Organizados em Grid Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 w-full">
              <option>Todos os Perfis</option>
              <option>Administrador Sr</option>
              <option>Administrador</option>
              <option>Gerente</option>
              <option>Funcionário</option>
              <option>Usuário</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 w-full">
              <option>Todos os Status</option>
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Pendente</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 w-full sm:col-span-2 lg:col-span-1">
              <option>Todas as Unidades</option>
              <option>Matriz</option>
              <option>Filial 1</option>
              <option>Filial 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        {user.photoURL ? (
                          <img
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                            src={user.photoURL}
                            alt={user.displayName || ""}
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-xs sm:text-sm">
                              {user.displayName?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || "Sem nome"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.cargo || "Não informado"}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 p-1.5 sm:p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900 p-1.5 sm:p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total de Usuários
              </p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {mockUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Usuários Ativos
              </p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {mockUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Administradores
              </p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {mockUsers.filter((u) => u.role.includes("admin")).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Última Atividade
              </p>
              <p className="text-sm font-semibold text-gray-900">Hoje</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de Funcionalidade Futura */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <UserCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Funcionalidade em Desenvolvimento
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Esta aba está sendo desenvolvida para permitir a gestão completa
                de usuários, incluindo alteração de perfis, permissões e
                histórico de mudanças.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
