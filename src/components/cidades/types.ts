import type { BaseEntity } from "../../types";

export type Cidade = BaseEntity & {
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: number | null;
  pesoMinimo?: number | null;
  rotaId?: string | null;
  observacao?: string;
  dataCriacao: string | Date; // ✅ Pode ser string ou Date (Firebase)
  dataAtualizacao: string | Date; // ✅ Pode ser string ou Date (Firebase)
};

export type CidadeInput = Omit<
  Cidade,
  "id" | "dataCriacao" | "dataAtualizacao"
>;

export type CidadeFormData = {
  nome: string;
  estado: string;
  regiao: string;
  distancia: string;
  pesoMinimo: string;
  rotaId: string;
  observacao: string;
};
