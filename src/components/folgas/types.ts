import type { TipoFolga, StatusFolga, BaseEntity } from "../../types";

export type Folga = BaseEntity & {
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string | Date; // ✅ Pode ser string ou Date (Firebase)
  dataFim: string | Date; // ✅ Pode ser string ou Date (Firebase)
  tipo: TipoFolga;
  status: StatusFolga;
  observacoes?: string;
  motivo?: string;
  documento?: string;
  horas?: number;
};

export type FolgaInput = Omit<Folga, "id" | "dataCriacao" | "dataAtualizacao">;

// ✅ FolgaFormData sempre usa string para datas (formulário)
export interface FolgaFormData {
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string; // Sempre string no formulário
  dataFim: string; // Sempre string no formulário
  tipo: TipoFolga;
  status: StatusFolga;
  observacoes?: string;
  motivo?: string;
  documento?: string;
  horas?: number | null;
}
