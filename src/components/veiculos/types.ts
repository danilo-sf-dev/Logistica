export interface Veiculo {
  id: string;
  placa: string;
  modelo?: string;
  marca: string;
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
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface VeiculoFormData {
  placa: string;
  modelo?: string;
  marca: string;
  ano: string;
  capacidade: string;
  tipoCarroceria: string;
  quantidadeEixos: string;
  tipoBau: string;
  status: string;
  unidadeNegocio: string;
  ultimaManutencao: string;
  proximaManutencao: string;
  motorista: string;
  observacao: string;
}

export interface VeiculosFiltersType {
  searchTerm: string;
  status?: string;
  tipoCarroceria?: string;
  tipoBau?: string;
  unidadeNegocio?: string;
}

export interface VeiculosSortConfig {
  field: keyof Veiculo;
  direction: "asc" | "desc";
}
