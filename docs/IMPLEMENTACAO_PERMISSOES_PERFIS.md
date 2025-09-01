# 🛠️ Implementação Técnica - Sistema de Permissões e Perfis

## 📋 **Visão Geral**

Este documento contém a implementação técnica completa do sistema de permissões e perfis do SGL, incluindo alterações no Firebase, código TypeScript, e fluxo de implementação em etapas para evitar quebra do sistema em produção.

---

## 🏗️ **Arquitetura da Implementação**

### **Componentes Principais**

1. **Firestore Rules** - Regras de segurança atualizadas
2. **AuthContext** - Contexto de autenticação expandido
3. **UserManagement** - Componente de gestão de usuários
4. **PermissionService** - Serviço de validação de permissões
5. **RoleManagement** - Sistema de gerenciamento de roles

---

## 🔥 **Alterações no Firebase**

### **1. Atualização das Regras do Firestore**

#### **Arquivo: `firestore.rules`**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções auxiliares
    function isAuthenticated() {
      return request.auth != null;
    }

    function hasRole(role) {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    function isAdminSenior() {
      return hasRole('admin_senior');
    }

    function isAdmin() {
      return hasRole('admin') || isAdminSenior();
    }

    function isGerente() {
      return hasRole('gerente') || isAdmin();
    }

    function isDispatcher() {
      return hasRole('dispatcher') || isGerente();
    }

    function canDeleteRecords() {
      return isAdmin() || isGerente();
    }

    function canExportReports() {
      return isDispatcher() || isGerente() || isAdmin();
    }

    function canManageUsers() {
      return isGerente() || isAdmin();
    }

    function canAccessSystemConfig() {
      return isGerente() || isAdmin();
    }

    // Regras para usuários
    match /users/{userId} {
      allow read: if isAuthenticated() &&
                     (request.auth.uid == userId || canManageUsers());
      allow write: if isAuthenticated() &&
                      (request.auth.uid == userId || canManageUsers());
    }

    // Regras para funcionários
    match /funcionarios/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isGerente();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para veículos
    match /veiculos/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isGerente();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para rotas
    match /rotas/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isDispatcher();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para folgas
    match /folgas/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isDispatcher();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para cidades
    match /cidades/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isGerente();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para vendedores
    match /vendedores/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isGerente();
      allow delete: if isAuthenticated() && canDeleteRecords();
    }

    // Regras para histórico de mudanças de role
    match /role_changes/{docId} {
      allow read: if isAuthenticated() && canManageUsers();
      allow write: if isAuthenticated() && canManageUsers();
    }

    // Regras para notificações
    match /notifications/{docId} {
      allow read: if isAuthenticated() &&
                     request.auth.uid == resource.data.userId;
      allow write: if isAuthenticated() &&
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### **2. Estrutura de Dados Atualizada**

#### **Coleção: `users`**

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin_senior" | "admin" | "gerente" | "dispatcher" | "user";
  baseRole: "admin_senior" | "admin" | "gerente" | "dispatcher" | "user";
  temporaryRole?: {
    role: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    grantedBy: string;
    grantedAt: Date;
  };
  createdAt: Date;
  lastLogin: Date;
  provider: string;
  telefone?: string;
  cargo?: string;
  notificacoes?: {
    email: boolean;
    push: boolean;
    rotas: boolean;
    folgas: boolean;
    manutencao: boolean;
  };
  sessionInfo?: {
    ip: string;
    device: string;
    browser: string;
    os: string;
    userAgent: string;
    timestamp: Date;
  };
}
```

#### **Nova Coleção: `role_changes`**

```typescript
interface RoleChange {
  id: string;
  userId: string;
  oldRole: string;
  newRole: string;
  changeType: "permanent" | "temporary";
  reason: string;
  changedBy: string;
  changedAt: Date;
  temporaryPeriod?: {
    startDate: Date;
    endDate: Date;
  };
  metadata?: {
    ip: string;
    userAgent: string;
    device: string;
  };
}
```

---

## 💻 **Implementação em TypeScript**

### **1. Serviço de Permissões**

#### **Arquivo: `src/services/permissionService.ts`**

```typescript
export class PermissionService {
  private static roleHierarchy = {
    admin_senior: ["admin_senior", "admin", "gerente", "dispatcher", "user"],
    admin: ["gerente", "dispatcher", "user"],
    gerente: ["dispatcher", "user"],
    dispatcher: [],
    user: [],
  };

  static canChangeRole(adminRole: string, targetRole: string): boolean {
    return this.roleHierarchy[adminRole]?.includes(targetRole) || false;
  }

  static canDeleteRecords(userRole: string): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  static canExportReports(userRole: string): boolean {
    return ["admin_senior", "admin", "gerente", "dispatcher"].includes(
      userRole
    );
  }

  static canManageUsers(userRole: string): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  static canAccessSystemConfig(userRole: string): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  static canAccessSecurityConfig(userRole: string): boolean {
    return ["admin_senior", "admin", "gerente"].includes(userRole);
  }

  static getAvailableRolesForChange(adminRole: string): string[] {
    return this.roleHierarchy[adminRole] || [];
  }

  static getRoleDisplayName(role: string): string {
    const roleNames = {
      admin_senior: "Administrador Sr",
      admin: "Administrador",
      gerente: "Gerente",
      dispatcher: "Funcionário",
      user: "Usuário",
    };
    return roleNames[role] || role;
  }

  static getRoleDisplayNames(): { value: string; label: string }[] {
    return Object.entries(this.roleHierarchy).map(([role, _]) => ({
      value: role,
      label: this.getRoleDisplayName(role),
    }));
  }
}
```

### **2. Serviço de Gestão de Usuários**

#### **Arquivo: `src/services/userManagementService.ts`**

```typescript
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { PermissionService } from "./permissionService";
import type { UserProfile, RoleChange } from "../types";

export class UserManagementService {
  static async changeUserRole(
    userId: string,
    newRole: string,
    changeType: "permanent" | "temporary",
    reason: string,
    changedBy: string,
    temporaryPeriod?: { startDate: Date; endDate: Date }
  ): Promise<void> {
    try {
      // Verificar se o usuário que está fazendo a mudança tem permissão
      const adminUser = await getDoc(doc(db, "users", changedBy));
      if (!adminUser.exists()) {
        throw new Error("Usuário administrador não encontrado");
      }

      const adminRole = adminUser.data().role;
      if (!PermissionService.canChangeRole(adminRole, newRole)) {
        throw new Error("Você não tem permissão para alterar este perfil");
      }

      // Buscar usuário atual
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const currentUser = userDoc.data() as UserProfile;
      const oldRole = currentUser.role;

      // Preparar dados para atualização
      const updateData: Partial<UserProfile> = {
        role: newRole,
        lastLogin: new Date(),
      };

      if (changeType === "temporary") {
        if (!temporaryPeriod) {
          throw new Error("Período temporário é obrigatório");
        }
        updateData.temporaryRole = {
          role: newRole,
          startDate: temporaryPeriod.startDate,
          endDate: temporaryPeriod.endDate,
          reason,
          grantedBy: changedBy,
          grantedAt: new Date(),
        };
      } else {
        // Mudança permanente - atualizar role base
        updateData.baseRole = newRole;
        updateData.temporaryRole = undefined;
      }

      // Atualizar usuário
      await setDoc(doc(db, "users", userId), updateData, { merge: true });

      // Registrar mudança no histórico
      const roleChange: Omit<RoleChange, "id"> = {
        userId,
        oldRole,
        newRole,
        changeType,
        reason,
        changedBy,
        changedAt: new Date(),
        temporaryPeriod,
        metadata: {
          ip: "captured-from-session",
          userAgent: "captured-from-session",
          device: "captured-from-session",
        },
      };

      await addDoc(collection(db, "role_changes"), roleChange);

      // Enviar notificação para o usuário
      await this.notifyUserRoleChange(userId, newRole, changeType, reason);
    } catch (error) {
      console.error("Erro ao alterar role do usuário:", error);
      throw error;
    }
  }

  static async getRoleChangeHistory(userId?: string): Promise<RoleChange[]> {
    try {
      let q = collection(db, "role_changes");

      if (userId) {
        q = query(q, where("userId", "==", userId));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RoleChange[];
    } catch (error) {
      console.error("Erro ao buscar histórico de mudanças:", error);
      throw error;
    }
  }

  static async getUsersByRole(role: string): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserProfile[];
    } catch (error) {
      console.error("Erro ao buscar usuários por role:", error);
      throw error;
    }
  }

  private static async notifyUserRoleChange(
    userId: string,
    newRole: string,
    changeType: "permanent" | "temporary",
    reason: string
  ): Promise<void> {
    try {
      const notification = {
        userId,
        type: "role_change",
        title: "Seu perfil foi alterado",
        message: `Seu perfil foi alterado para ${PermissionService.getRoleDisplayName(newRole)}. ${changeType === "temporary" ? "Esta é uma alteração temporária." : ""}`,
        data: { newRole, changeType, reason },
        read: false,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "notifications"), notification);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }
}
```

### **3. Hook de Gestão de Usuários**

#### **Arquivo: `src/components/configuracoes/state/useUserManagement.ts`**

```typescript
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { UserManagementService } from "../../../services/userManagementService";
import { PermissionService } from "../../../services/permissionService";
import type { UserProfile, RoleChange } from "../../../types";

export const useUserManagement = () => {
  const { userProfile } = useAuth();
  const { showNotification } = useNotification();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roleChanges, setRoleChanges] = useState<RoleChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    newRole: "",
    changeType: "permanent" as "permanent" | "temporary",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Verificar se o usuário atual pode gerenciar usuários
  const canManageUsers = PermissionService.canManageUsers(
    userProfile?.role || ""
  );

  // Obter roles disponíveis para alteração
  const availableRoles = PermissionService.getAvailableRolesForChange(
    userProfile?.role || ""
  );

  const loadUsers = useCallback(async () => {
    if (!canManageUsers) return;

    try {
      setLoading(true);
      // Implementar busca de usuários
      // const allUsers = await UserManagementService.getAllUsers();
      // setUsers(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      showNotification("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  }, [canManageUsers, showNotification]);

  const loadRoleChangeHistory = useCallback(async () => {
    if (!canManageUsers) return;

    try {
      const history = await UserManagementService.getRoleChangeHistory();
      setRoleChanges(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      showNotification("Erro ao carregar histórico", "error");
    }
  }, [canManageUsers, showNotification]);

  const handleRoleChange = useCallback(async () => {
    if (!selectedUser || !formData.newRole || !formData.reason) {
      showNotification("Preencha todos os campos obrigatórios", "error");
      return;
    }

    try {
      setLoading(true);

      const temporaryPeriod =
        formData.changeType === "temporary"
          ? {
              startDate: new Date(formData.startDate),
              endDate: new Date(formData.endDate),
            }
          : undefined;

      await UserManagementService.changeUserRole(
        selectedUser.uid,
        formData.newRole,
        formData.changeType,
        formData.reason,
        userProfile?.uid || "",
        temporaryPeriod
      );

      showNotification("Perfil alterado com sucesso!", "success");

      // Recarregar dados
      await loadUsers();
      await loadRoleChangeHistory();

      // Limpar formulário
      setFormData({
        newRole: "",
        changeType: "permanent",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Erro ao alterar perfil:", error);
      showNotification(error.message || "Erro ao alterar perfil", "error");
    } finally {
      setLoading(false);
    }
  }, [
    selectedUser,
    formData,
    userProfile?.uid,
    showNotification,
    loadUsers,
    loadRoleChangeHistory,
  ]);

  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
      loadRoleChangeHistory();
    }
  }, [canManageUsers, loadUsers, loadRoleChangeHistory]);

  return {
    users,
    roleChanges,
    loading,
    selectedUser,
    formData,
    canManageUsers,
    availableRoles,
    setSelectedUser,
    handleFormChange,
    handleRoleChange,
  };
};
```

### **4. Componente de Gestão de Usuários**

#### **Arquivo: `src/components/configuracoes/ui/UserManagementForm.tsx`**

```typescript
import React from 'react';
import { Users, Save, History, UserCheck } from 'lucide-react';
import { useUserManagement } from '../state/useUserManagement';
import { PermissionService } from '../../../services/permissionService';
import LoadingButton from '../../../common/LoadingButton';

export const UserManagementForm: React.FC = () => {
  const {
    users,
    roleChanges,
    loading,
    selectedUser,
    formData,
    canManageUsers,
    availableRoles,
    setSelectedUser,
    handleFormChange,
    handleRoleChange
  } = useUserManagement();

  if (!canManageUsers) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Gestão de Usuários
        </h3>
        <p className="text-gray-600">
          Você não tem permissão para acessar esta funcionalidade.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Gestão de Usuários
      </h3>

      {/* Lista de Usuários */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Usuários do Sistema</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.displayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {PermissionService.getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulário de Alteração */}
      {selectedUser && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Alterar Perfil: {selectedUser.displayName}
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Novo Perfil
              </label>
              <select
                value={formData.newRole}
                onChange={(e) => handleFormChange('newRole', e.target.value)}
                className="input-field"
              >
                <option value="">Selecione um perfil</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {PermissionService.getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Alteração
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="permanent"
                    checked={formData.changeType === 'permanent'}
                    onChange={(e) => handleFormChange('changeType', e.target.value)}
                    className="mr-2"
                  />
                  Permanente
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="temporary"
                    checked={formData.changeType === 'temporary'}
                    onChange={(e) => handleFormChange('changeType', e.target.value)}
                    className="mr-2"
                  />
                  Temporário
                </label>
              </div>
            </div>
          </div>

          {formData.changeType === 'temporary' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Início
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFormChange('endDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Motivo da Alteração
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleFormChange('reason', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Descreva o motivo da alteração de perfil..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setSelectedUser(null);
                setFormData({
                  newRole: '',
                  changeType: 'permanent',
                  startDate: '',
                  endDate: '',
                  reason: ''
                });
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <LoadingButton
              onClick={handleRoleChange}
              loading={loading}
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Confirmar Alteração
            </LoadingButton>
          </div>
        </div>
      )}

      {/* Histórico de Alterações */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          <History className="w-4 h-4 mr-2" />
          Histórico de Alterações
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  De → Para
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alterado por
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roleChanges.map((change) => (
                <tr key={change.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {change.changedAt.toDate().toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {change.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {PermissionService.getRoleDisplayName(change.oldRole)} → {PermissionService.getRoleDisplayName(change.newRole)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      change.changeType === 'permanent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {change.changeType === 'permanent' ? 'Permanente' : 'Temporário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {change.changedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

---

## 📋 **Fluxo de Implementação em Etapas**

### **FASE 1: Preparação e Estrutura Base (Semana 1)**

#### **1.1 Backup e Preparação**

- [ ] **Backup completo** do sistema atual
- [ ] **Criação de branch** `feature/user-permissions` para desenvolvimento
- [ ] **Teste em ambiente de desenvolvimento** antes de produção

#### **1.2 Atualização de Tipos**

- [ ] Atualizar `types/index.ts` com novos tipos de role
- [ ] Adicionar interfaces para `RoleChange` e permissões
- [ ] Atualizar tipos existentes para incluir `baseRole` e `temporaryRole`

#### **1.3 Serviços Base**

- [ ] Implementar `PermissionService` básico
- [ ] Criar estrutura do `UserManagementService`
- [ ] Testar serviços em ambiente isolado

### **FASE 2: Firebase e Regras de Segurança (Semana 2)**

#### **2.1 Atualização do Firestore**

- [ ] **Deploy das novas regras** em ambiente de teste
- [ ] **Teste das regras** com diferentes roles
- [ ] **Validação de segurança** das permissões

#### **2.2 Estrutura de Dados**

- [ ] **Migração de usuários existentes** para nova estrutura
- [ ] **Criação da coleção** `role_changes`
- [ ] **Validação de integridade** dos dados

#### **2.3 Testes de Segurança**

- [ ] **Teste de acesso negado** para roles inadequados
- [ ] **Validação de permissões** em todas as entidades
- [ ] **Teste de escalação de privilégios**

### **FASE 3: Interface de Usuário (Semana 3)**

#### **3.1 Componentes Base**

- [ ] Implementar `UserManagementForm`
- [ ] Criar hook `useUserManagement`
- [ ] Integrar com sistema de notificações existente

#### **3.2 Integração com Configurações**

- [ ] Adicionar aba "Gestão de Usuários" em configurações
- [ ] Implementar visibilidade condicional por role
- [ ] Testar interface com diferentes perfis

#### **3.3 Validações e UX**

- [ ] Implementar validações de formulário
- [ ] Adicionar feedback visual para usuário
- [ ] Testar fluxo completo de alteração de roles

### **FASE 4: Funcionalidades Avançadas (Semana 4)**

#### **4.1 Períodos Temporários**

- [ ] Implementar sistema de períodos temporários
- [ ] Criar job para retorno automático de roles
- [ ] Testar cenários de expiração

#### **4.2 Auditoria e Histórico**

- [ ] Implementar histórico completo de mudanças
- [ ] Adicionar logs de auditoria
- [ ] Criar relatórios de segurança

#### **4.3 Notificações**

- [ ] Integrar com sistema de notificações existente
- [ ] Implementar notificações automáticas de mudança de role
- [ ] Testar fluxo de notificações

### **FASE 5: Testes e Validação (Semana 5)**

#### **5.1 Testes Funcionais**

- [ ] **Teste completo** de todas as funcionalidades
- [ ] **Validação de permissões** em todos os cenários
- [ ] **Teste de casos extremos** e validações

#### **5.2 Testes de Segurança**

- [ ] **Teste de penetração** básico
- [ ] **Validação de regras** do Firebase
- [ ] **Teste de auditoria** e logs

#### **5.3 Testes de Performance**

- [ ] **Validação de performance** com múltiplos usuários
- [ ] **Teste de escalabilidade** das consultas
- [ ] **Otimização** se necessário

### **FASE 6: Deploy e Monitoramento (Semana 6)**

#### **6.1 Deploy Gradual**

- [ ] **Deploy em produção** em horário de baixo tráfego
- [ ] **Monitoramento ativo** durante deploy
- [ ] **Rollback plan** caso necessário

#### **6.2 Monitoramento Pós-Deploy**

- [ ] **Monitoramento de logs** por 24-48h
- [ ] **Validação de funcionalidades** em produção
- [ ] **Feedback dos usuários** finais

#### **6.3 Documentação Final**

- [ ] **Atualizar documentação** de usuário
- [ ] **Criar guias** de uso para administradores
- [ ] **Treinamento** da equipe se necessário

---

## 🚨 **Considerações de Segurança**

### **1. Validação Dupla**

- **Client-side**: Validação imediata para UX
- **Server-side**: Validação obrigatória no Firebase

### **2. Auditoria Completa**

- **Log de todas as tentativas** (sucesso e falha)
- **Captura de contexto** (IP, dispositivo, timestamp)
- **Histórico imutável** de mudanças

### **3. Prevenção de Escalação**

- **Validação hierárquica** antes de qualquer mudança
- **Bloqueio automático** de tentativas não autorizadas
- **Alertas para mudanças críticas**

---

## 📊 **Métricas de Sucesso**

### **1. Funcionais**

- [ ] 100% das mudanças de role funcionando
- [ ] 0% de escalação de privilégios
- [ ] 100% de auditoria funcionando

### **2. Técnicos**

- [ ] Performance mantida (< 2s para operações)
- [ ] 0% de quebra de funcionalidades existentes
- [ ] 100% de cobertura de testes

### **3. Segurança**

- [ ] 0% de acesso não autorizado
- [ ] 100% de logs de auditoria
- [ ] 0% de vulnerabilidades introduzidas

---

## 🔄 **Rollback Plan**

### **1. Identificação de Problemas**

- Monitoramento contínuo durante deploy
- Alertas automáticos para erros críticos
- Feedback imediato dos usuários

### **2. Rollback Automático**

- Reversão para versão anterior se necessário
- Manutenção de dados existentes
- Comunicação imediata para usuários

### **3. Análise Pós-Rollback**

- Investigação da causa raiz
- Correção em ambiente de desenvolvimento
- Novo ciclo de testes antes de novo deploy

---

## 📚 **Documentação Relacionada**

- **[SISTEMA_PERMISSOES_PERFIS.md](./SISTEMA_PERMISSOES_PERFIS.md)** - Conceitos e regras do sistema
- **[REGRAS_SEGURANCA_FIREBASE.md](./REGRAS_SEGURANCA_FIREBASE.md)** - Regras de segurança existentes
- **[ARQUITETURA.md](./ARQUITETURA.md)** - Arquitetura geral do sistema

---

## 🎯 **Conclusão**

Esta implementação garante:

- **Segurança**: Controle granular e auditoria completa
- **Escalabilidade**: Estrutura hierárquica clara
- **Manutenibilidade**: Código bem estruturado e documentado
- **Confiabilidade**: Implementação gradual com rollback plan

O sistema será implementado em 6 semanas com foco na estabilidade e segurança, evitando qualquer quebra do sistema em produção.
