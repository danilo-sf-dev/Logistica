import type {
  BaseEntity,
  TipoFuncao,
  StatusFuncionario,
  TipoContrato,
  UnidadeNegocio,
} from "../../types";

export type Funcionario = BaseEntity & {
  nome: string;
  cpf: string;
  cnh: string;
  cnhVencimento?: string;
  cnhCategoria?: string;
  celular: string;
  email?: string;
  endereco: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  cidade: string;
  funcao?: TipoFuncao;
  toxicoUltimoExame?: string;
  toxicoVencimento?: string;
  status: StatusFuncionario;
  tipoContrato: TipoContrato;
  unidadeNegocio: UnidadeNegocio;
  dataAdmissao?: string;
  salario?: string | null;
  observacao?: string;
  ativo: boolean;
};

export type FuncionarioInput = Omit<
  Funcionario,
  "id" | "dataCriacao" | "dataAtualizacao"
>;
