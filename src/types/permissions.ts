// ========================================
// TIPOS PARA SISTEMA DE PERMISSÕES E PERFIS
// ========================================

// ========================================
// PERFIS DE USUÁRIO
// ========================================

/**
 * Perfis de usuário hierárquicos (do maior para o menor)
 */
export type UserRole =
  | "admin_senior" // Administrador Senior - Acesso total
  | "admin" // Administrador - Acesso total com restrições
  | "gerente" // Gerente - Acesso operacional + gestão limitada
  | "dispatcher" // Funcionário - Usuário constante do sistema
  | "user"; // Usuário - Apenas visualização

/**
 * Nomes amigáveis para os perfis
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin_senior: "Administrador Sr",
  admin: "Administrador",
  gerente: "Gerente",
  dispatcher: "Funcionário",
  user: "Usuário",
};

/**
 * Hierarquia de permissões para alteração de perfis
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  admin_senior: ["admin_senior", "admin", "gerente", "dispatcher", "user"],
  admin: ["gerente", "dispatcher", "user"],
  gerente: ["dispatcher", "user"],
  dispatcher: [],
  user: [],
};

// ========================================
// PERMISSÕES GRANULARES
// ========================================

/**
 * Tipos de operações CRUD
 */
export type CrudOperation = "create" | "read" | "update" | "delete";

/**
 * Tipos de funcionalidades do sistema
 */
export type SystemFeature =
  | "dashboard"
  | "funcionarios"
  | "veiculos"
  | "rotas"
  | "folgas"
  | "cidades"
  | "vendedores"
  | "relatorios"
  | "gestao_usuarios"
  | "configuracoes"
  | "sistema"
  | "seguranca";

/**
 * Matriz de permissões por funcionalidade
 */
export interface FeaturePermissions {
  feature: SystemFeature;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManage: boolean;
}

// ========================================
// PERFIL DE USUÁRIO EXPANDIDO
// ========================================

/**
 * Perfil temporário de usuário
 */
export interface TemporaryRole {
  role: UserRole;
  startDate: Date;
  endDate: Date;
  reason: string;
  grantedBy: string;
  grantedAt: Date;
  isActive: boolean;
}

/**
 * Perfil de usuário expandido com sistema de permissões
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  // Sistema de perfis
  role: UserRole; // Perfil atual (pode ser temporário)
  baseRole: UserRole; // Perfil base/permanente
  temporaryRole?: TemporaryRole; // Perfil temporário se aplicável

  // Metadados
  createdAt: Date;
  lastLogin: Date;
  provider: string;

  // Informações pessoais
  telefone?: string;
  cargo?: string;

  // Configurações de notificação
  notificacoes?: {
    email: boolean;
    push: boolean;
    rotas: boolean;
    folgas: boolean;
    manutencao: boolean;
  };

  // Informações de sessão
  sessionInfo?: {
    ip: string;
    device: string;
    browser: string;
    os: string;
    userAgent: string;
    timestamp: Date;
  };

  // Status do usuário
  status: "ativo" | "inativo" | "suspenso";
  lastActivity?: Date;
}

// ========================================
// HISTÓRICO DE MUDANÇAS DE PERFIL
// ========================================

/**
 * Tipo de mudança de perfil
 */
export type RoleChangeType = "permanent" | "temporary" | "revert";

/**
 * Mudança de perfil registrada
 */
export interface RoleChange {
  id: string;
  userId: string;
  oldRole: UserRole;
  newRole: UserRole;
  changeType: RoleChangeType;
  reason: string;
  changedBy: string;
  changedAt: Date;

  // Período temporário (se aplicável)
  temporaryPeriod?: {
    startDate: Date;
    endDate: Date;
  };

  // Metadados da mudança
  metadata?: {
    ip: string;
    userAgent: string;
    device: string;
    location?: string;
  };

  // Aprovação (se necessário)
  approvedBy?: string;
  approvedAt?: Date;
  approvalNotes?: string;
}

// ========================================
// CONFIGURAÇÕES DE PERMISSÕES
// ========================================

/**
 * Configuração de permissões para um perfil
 */
export interface RolePermissions {
  role: UserRole;
  permissions: Record<
    SystemFeature,
    {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      export: boolean;
      manage: boolean;
    }
  >;
  canManageUsers: boolean;
  canAccessSystemConfig: boolean;
  canAccessSecurityConfig: boolean;
  canDeleteRecords: boolean;
  canExportReports: boolean;
}

// ========================================
// VALIDAÇÕES E UTILITÁRIOS
// ========================================

/**
 * Resultado da validação de permissões
 */
export interface PermissionValidationResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: UserRole;
  currentRole: UserRole;
}

/**
 * Contexto para verificação de permissões
 */
export interface PermissionContext {
  userId: string;
  userRole: UserRole;
  targetUserId?: string;
  targetUserRole?: UserRole;
  feature?: SystemFeature;
  operation?: CrudOperation;
}

// ========================================
// TIPOS DE EXPORTAÇÃO
// ========================================

/**
 * Tipos de relatórios que podem ser exportados
 */
export type ExportableReport =
  | "funcionarios"
  | "veiculos"
  | "rotas"
  | "folgas"
  | "cidades"
  | "vendedores"
  | "usuarios"
  | "auditoria";

/**
 * Configuração de exportação
 */
export interface ExportConfig {
  reportType: ExportableReport;
  format: "pdf" | "excel" | "csv";
  filters?: Record<string, any>;
  includeSensitiveData: boolean;
  requestedBy: string;
  requestedAt: Date;
}

// ========================================
// AUDITORIA E LOGS
// ========================================

/**
 * Níveis de log de auditoria
 */
export type AuditLogLevel = "info" | "warning" | "error" | "critical";

/**
 * Ações auditáveis
 */
export type AuditableAction =
  | "user_login"
  | "user_logout"
  | "role_change"
  | "permission_change"
  | "data_access"
  | "data_modification"
  | "export_request"
  | "system_config_change";

/**
 * Log de auditoria
 */
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  action: AuditableAction;
  level: AuditLogLevel;
  description: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

// ========================================
// NOTIFICAÇÕES DE SEGURANÇA
// ========================================

/**
 * Tipos de notificação de segurança
 */
export type SecurityNotificationType =
  | "role_change"
  | "permission_violation"
  | "suspicious_activity"
  | "login_attempt"
  | "data_export"
  | "system_config_change";

/**
 * Notificação de segurança
 */
export interface SecurityNotification {
  id: string;
  type: SecurityNotificationType;
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  metadata?: Record<string, any>;
}
