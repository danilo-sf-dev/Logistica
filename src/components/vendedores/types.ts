export type Vendedor = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  celular: string;
  regiao: string;
  codigoVendSistema?: string;
  unidadeNegocio: "frigorifico" | "ovos" | "ambos";
  tipoContrato: "clt" | "pj" | "autonomo" | "outro";
  ativo: boolean;
  dataCriacao?: any;
  dataAtualizacao?: any;
};

export type VendedorInput = {
  nome: string;
  cpf: string;
  email?: string;
  celular: string;
  regiao: string;
  codigoVendSistema?: string;
  unidadeNegocio: "frigorifico" | "ovos" | "ambos";
  tipoContrato: "clt" | "pj" | "autonomo" | "outro";
  ativo: boolean;
};
