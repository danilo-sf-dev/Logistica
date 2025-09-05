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
  cidadesAtendidas?: string[]; // Array de IDs das cidades que o vendedor atende
  dataCriacao: string | Date; // ✅ Pode ser string ou Date (Firebase)
  dataAtualizacao: string | Date; // ✅ Pode ser string ou Date (Firebase)
};

export type VendedorInput = Omit<
  Vendedor,
  "id" | "dataCriacao" | "dataAtualizacao"
>;
