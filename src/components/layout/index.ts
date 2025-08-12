// Exportações principais
export { default } from "./Layout";
export { default as Layout } from "./Layout";

// Exportações dos componentes UI
export { default as Sidebar } from "./ui/Sidebar";
export { default as Header } from "./ui/Header";
export { default as MainContent } from "./ui/MainContent";

// Exportações dos hooks de estado
export { default as useLayout } from "./state/useLayout";

// Exportações de configuração
export {
  default as defaultNavigation,
  getNavigationByRole,
} from "./config/navigation";

// Exportações de tipos
export * from "./types";
