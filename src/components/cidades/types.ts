export type Cidade = {
  id: string;
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: number | null;
  pesoMinimo?: number | null;
  rotaId?: string | null;
  observacao?: string;
  dataCriacao?: any;
  dataAtualizacao?: any;
};

export type CidadeInput = {
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: string;
  pesoMinimo?: string;
  rotaId?: string;
  observacao?: string;
};
