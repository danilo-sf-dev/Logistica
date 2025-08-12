import type { BaseEntity } from "../../types";

export interface Rota extends BaseEntity {
  nome: string;
  dataRota: string;
  pesoMinimo: number;
  diaSemana: string[]; // Mudado de string para string[] para suportar múltiplos dias
  cidades: string[];
}

export type RotaInput = Omit<Rota, "id" | "dataCriacao" | "dataAtualizacao">;

// Alias para compatibilidade
export type RotaFormData = RotaInput;

export interface RotaFilters {
  searchTerm: string;
  diaSemana?: string; // Mantido como string para filtros simples
}
