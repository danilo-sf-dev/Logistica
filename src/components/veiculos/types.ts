import type {
  BaseEntity,
  StatusVeiculo,
  UnidadeNegocio,
  DirecaoOrdenacao,
  TipoCarroceria,
} from "../../types";

export interface Veiculo extends BaseEntity {
  placa: string;
  modelo?: string;
  marca: string;
  ano?: string;
  capacidade: string;
  tipoCarroceria: TipoCarroceria;
  quantidadeEixos: string;
  tipoBau: string;
  status: StatusVeiculo;
  unidadeNegocio: UnidadeNegocio;
  ultimaManutencao?: string;
  proximaManutencao?: string;
  motorista?: string;
  observacao?: string;
}

export type VeiculoInput = Omit<
  Veiculo,
  "id" | "dataCriacao" | "dataAtualizacao"
>;

// Tipo para formulário que aceita strings nos campos de seleção
export type VeiculoFormData = {
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  capacidade: string;
  tipoCarroceria: TipoCarroceria;
  quantidadeEixos: string;
  tipoBau: string;
  status: StatusVeiculo;
  unidadeNegocio: UnidadeNegocio;
  ultimaManutencao: string;
  proximaManutencao: string;
  motorista?: string;
  observacao: string;
};

export interface VeiculosFiltersType {
  searchTerm: string;
  status?: string;
  tipoCarroceria?: string;
  tipoBau?: string;
  unidadeNegocio?: string;
}

export interface VeiculosSortConfig {
  field: keyof Veiculo;
  direction: DirecaoOrdenacao;
}
