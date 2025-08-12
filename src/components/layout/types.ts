import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Tipo para item de navegação
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  roles?: string[];
}

// Tipo para configuração do layout
export interface LayoutConfig {
  title: string;
  logo?: ReactNode;
  navigation: NavigationItem[];
  showUserProfile?: boolean;
  showLogout?: boolean;
  sidebarWidth?: string;
  mobileBreakpoint?: string;
}

// Tipo para props do componente Layout
export interface LayoutProps {
  config?: Partial<LayoutConfig>;
  children?: ReactNode;
  className?: string;
}

// Tipo para props do componente Sidebar
export interface SidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  userProfile?: {
    displayName?: string;
    role?: string;
  };
  onLogout: () => void;
  className?: string;
}

// Tipo para props do componente Header
export interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  className?: string;
}

// Tipo para props do componente MainContent
export interface MainContentProps {
  children: ReactNode;
  className?: string;
}

// Tipo para estado do layout
export interface LayoutState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
