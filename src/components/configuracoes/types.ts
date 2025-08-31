// Tipos para dados do perfil
export interface PerfilData {
  displayName: string;
  email: string;
  telefone: string;
  cargo: string;
}

export interface PerfilFormData {
  displayName: string;
  email: string;
  telefone: string;
  cargo: string;
}

// Tipos para configurações de notificações
export interface NotificacoesConfig {
  email: boolean;
  push: boolean;
  rotas: boolean;
  folgas: boolean;
  manutencao: boolean;
}

// Tipos para configurações do sistema
export interface SistemaConfig {
  idioma: string;
  timezone: string;
  backup: boolean;
}

// Tipos para abas de configuração
export interface ConfigTab {
  id: string;
  name: string;
  icon: any; // LucideIcon
}

// Tipos para validação de formulários
export interface FormErrors {
  [key: string]: string;
}

// Tipos para props dos componentes
export interface ConfiguracoesProps {
  className?: string;
}

export interface PerfilFormProps {
  data: PerfilData;
  errors: FormErrors;
  loading: boolean;
  onSubmit: (data: PerfilData) => Promise<void>;
  onChange: (field: keyof PerfilData, value: string) => void;
  className?: string;
}

export interface NotificacoesFormProps {
  config: NotificacoesConfig;
  onChange: (key: keyof NotificacoesConfig) => void;
  onSubmit?: () => Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface SistemaFormProps {
  config: SistemaConfig;
  onChange: (key: keyof SistemaConfig, value: any) => void;
  onSubmit?: () => Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface SegurancaProps {
  userProfile?: {
    uid?: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    role?: string;
    createdAt?: Date | any; // Pode ser Date ou Timestamp do Firestore
    lastLogin?: Date | any; // Pode ser Date ou Timestamp do Firestore
    provider?: string;
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
  } | null;
  className?: string;
}

// Tipos para configurações de idioma e timezone
export interface IdiomaOption {
  value: string;
  label: string;
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}
