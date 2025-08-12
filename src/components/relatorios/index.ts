// Exportações principais
export { default } from "./Relatorios";
export { default as Relatorios } from "./Relatorios";

// Exportações das páginas
export { default as RelatoriosPage } from "./pages/RelatoriosPage";

// Exportações dos componentes UI
export { default as RelatorioHeader } from "./ui/RelatorioHeader";
export { default as ResumoCards } from "./ui/ResumoCards";
export { default as GraficoCard } from "./ui/GraficoCard";
export { default as RelatoriosDetalhados } from "./ui/RelatoriosDetalhados";
export { default as ExportModal } from "./ui/ExportModal";

// Exportações dos hooks de estado
export { default as useRelatorios } from "./state/useRelatorios";

// Exportações de serviços
export { default as relatoriosService } from "./data/relatoriosService";
export { default as exportService } from "./data/exportService";

// Exportações de tipos
export * from "./types";
