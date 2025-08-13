// Tipos para dados de relatórios
export interface RelatorioData {
  name: string;
  value: number;
  color: string;
}

export interface RelatorioPeriodo {
  value: string;
  label: string;
}

// Tipos para dados de diferentes entidades
export interface MotoristaData {
  id: string;
  nome: string;
  status: string;
  cargo: string;
  dataContratacao?: any;
}

export interface VeiculoData {
  id: string;
  placa: string;
  modelo: string;
  status: string;
  ano: number;
}

export interface RotaData {
  id: string;
  origem: string;
  destino: string;
  status: string;
  dataInicio?: any;
  dataFim?: any;
}

export interface FolgaData {
  id: string;
  funcionarioId: string;
  tipo: string;
  status: string;
  dataInicio?: any;
  dataFim?: any;
}

// Tipos para resumos estatísticos
export interface ResumoEstatistico {
  titulo: string;
  valor: number;
  icone: any; // LucideIcon
  cor: string;
  descricao?: string;
}

// Tipos para configurações de gráficos
export interface GraficoConfig {
  titulo: string;
  tipo: "pie" | "bar" | "line" | "horizontal-bar";
  dados: RelatorioData[];
  altura?: number;
  cor?: string;
}

// Tipos para props dos componentes
export interface RelatoriosProps {
  className?: string;
}

export interface RelatorioHeaderProps {
  periodo: string;
  onPeriodoChange: (periodo: string) => void;
  loading?: boolean;
  className?: string;
}

export interface ResumoCardsProps {
  dadosMotoristas: RelatorioData[];
  dadosVeiculos: RelatorioData[];
  dadosRotas: RelatorioData[];
  dadosFolgas: RelatorioData[];
  className?: string;
}

export interface GraficoCardProps {
  config: GraficoConfig;
  onDownload: (tipo: string, formato?: "pdf" | "csv") => void;
  className?: string;
}

export interface RelatoriosDetalhadosProps {
  onDownload: (tipo: string, formato?: "pdf" | "csv") => void;
  className?: string;
}

// Tipos para estado dos relatórios
export interface RelatoriosState {
  loading: boolean;
  periodo: string;
  dadosMotoristas: RelatorioData[];
  dadosVeiculos: RelatorioData[];
  dadosRotas: RelatorioData[];
  dadosFolgas: RelatorioData[];
}

// Tipos para filtros de relatórios
export interface RelatorioFiltros {
  periodo: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: string;
  tipo?: string;
}
