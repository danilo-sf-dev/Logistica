import type { BaseEntity } from "../../types";

export type Cidade = BaseEntity & {
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: number | null;
  pesoMinimo?: number | null;
  rotaId?: string | null;
  observacao?: string;
};

export type CidadeInput = Omit<
  Cidade,
  "id" | "dataCriacao" | "dataAtualizacao"
>;

// Tipo para formulário que aceita strings nos campos numéricos
export type CidadeFormData = {
  nome: string;
  estado: string;
  regiao: string;
  distancia: string;
  pesoMinimo: string;
  rotaId: string;
  observacao: string;
};
