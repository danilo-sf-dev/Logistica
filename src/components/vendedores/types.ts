import type {
  BaseEntity,
  UnidadeNegocio,
  TipoContratoVendedor,
} from "../../types";

export type Vendedor = BaseEntity & {
  nome: string;
  cpf: string;
  email?: string;
  celular: string;
  regiao: string;
  codigoVendSistema?: string;
  unidadeNegocio: UnidadeNegocio;
  tipoContrato: TipoContratoVendedor;
  ativo: boolean;
};

export type VendedorInput = Omit<
  Vendedor,
  "id" | "dataCriacao" | "dataAtualizacao"
>;
