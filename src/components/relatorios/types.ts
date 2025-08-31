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
  cpf: string;
  cnh: string;
  cnhVencimento?: string;
  cnhCategoria?: string;
  celular: string;
  email?: string;
  endereco: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  cidade: string;
  funcao?: string;
  toxicoUltimoExame?: string;
  toxicoVencimento?: string;
  status: string;
  tipoContrato: string;
  unidadeNegocio: string;
  dataAdmissao?: string;
  salario?: string | null;
  observacao?: string;
  ativo: boolean;
  dataCriacao?: any;
  dataAtualizacao?: any;
}

export interface VeiculoData {
  id: string;
  placa: string;
  marca: string;
  modelo?: string;
  ano?: string;
  capacidade: string;
  tipoCarroceria: string;
  quantidadeEixos: string;
  tipoBau: string;
  status: string;
  unidadeNegocio: string;
  ultimaManutencao?: string;
  proximaManutencao?: string;
  motorista?: string;
  observacao?: string;
  dataCriacao?: any;
  dataAtualizacao?: any;
}

export interface RotaData {
  id: string;
  nome: string;
  dataRota: string;
  pesoMinimo: number;
  diaSemana: string[];
  cidades: string[];
  dataCriacao?: any;
  dataAtualizacao?: any;
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
  dadosFuncionarios: RelatorioData[];
  dadosVeiculos: RelatorioData[];
  dadosRotas: RelatorioData[];
  dadosFolgas: RelatorioData[];
  className?: string;
}

export interface GraficoCardProps {
  config: GraficoConfig;
  onDownload?: (tipo: string, formato?: "pdf" | "csv") => void;
  className?: string;
}

export interface RelatoriosDetalhadosProps {
  onDownload: (tipo: string, formato?: "pdf" | "csv") => void;
  className?: string;
  loading?: boolean;
}

// Tipos para estado dos relatórios
export interface RelatoriosState {
  loading: boolean;
  periodo: string;
  dadosMotoristas: RelatorioData[];
  dadosFuncionarios: RelatorioData[];
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
