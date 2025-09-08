import type { BaseEntity } from "../../types";

export interface Rota extends BaseEntity {
  nome: string;
  pesoMinimo: number;
  diaSemana: string[]; // Mudado de string para string[] para suportar múltiplos dias
  cidades: string[];
}

export type RotaInput = Omit<Rota, "id" | "dataCriacao" | "dataAtualizacao">;

export interface RotaFormData {
  nome: string;
  pesoMinimo: number;
  diaSemana: string[];
  cidades: string[];
}

export interface RotaFilters {
  searchTerm: string;
  diaSemana?: string; // Mantido como string para filtros simples
}

// Tipos para ordenação
export type RotaOrdenacaoCampo = "nome" | "pesoMinimo" | "cidades";
export type DirecaoOrdenacao = "asc" | "desc";

export interface RotaSortConfig {
  field: RotaOrdenacaoCampo | null;
  direction: DirecaoOrdenacao;
}
