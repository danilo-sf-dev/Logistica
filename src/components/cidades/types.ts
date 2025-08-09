export type Cidade = {
  id: string;
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: number | null;
  observacao?: string;
  dataCriacao?: any; // Timestamp do Firestore
  dataAtualizacao?: any; // Timestamp do Firestore
};

export type CidadeInput = {
  nome: string;
  estado: string;
  regiao?: string;
  distancia?: string; // mantemos como string no formulário e convertemos no service
  observacao?: string;
};
