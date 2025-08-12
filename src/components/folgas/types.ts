import type { TipoFolga, StatusFolga, BaseEntity } from "../../types";

export type Folga = BaseEntity & {
  funcionarioId: string; // ID do funcionário
  funcionarioNome: string; // Nome do funcionário (para exibição)
  dataInicio: string;
  dataFim: string;
  tipo: TipoFolga;
  status: StatusFolga;
  observacoes?: string;
  motivo?: string; // Motivo específico da solicitação
  documento?: string; // Número do documento (atestado, etc.)
  horas?: number; // Quantidade de horas (para banco de horas)
};

export type FolgaInput = Omit<Folga, "id" | "dataCriacao" | "dataAtualizacao">;
