export interface Rota {
  id: string;
  nome: string;
  dataRota: string;
  pesoMinimo: number;
  diaSemana: string[]; // Mudado de string para string[] para suportar múltiplos dias
  cidades: string[];
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface RotaFormData {
  nome: string;
  dataRota: string;
  pesoMinimo: number;
  diaSemana: string[]; // Mudado de string para string[]
  cidades: string[];
}

export interface RotaFilters {
  searchTerm: string;
  diaSemana?: string; // Mantido como string para filtros simples
}
