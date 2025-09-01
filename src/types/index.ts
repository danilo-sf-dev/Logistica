// Tipos comuns utilizados em todo o sistema

// Status padrão para entidades
export type Status =
  | "ativo"
  | "inativo"
  | "pendente"
  | "aprovado"
  | "rejeitado"
  | "cancelado";

// Tipos de ordenação
export type DirecaoOrdenacao = "asc" | "desc";

// Tipos de notificação
export type TipoNotificacao = "success" | "error" | "warning" | "info";

// Tipos de modal
export type TipoModal = "danger" | "warning" | "success" | "info";

// Tipos de ação
export type TipoAcao =
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success";

// Tipos de contrato
export type TipoContrato = "integral" | "temporario" | "folguista" | "inativo";
export type TipoContratoVendedor = "clt" | "pj" | "autonomo" | "outro";

// Tipos de função
export type TipoFuncao = "motorista" | "ajudante" | "outro";

// Tipos de unidade de negócio
export type UnidadeNegocio = "frigorifico" | "ovos" | "ambos";

// Tipos de status de funcionário
export type StatusFuncionario =
  | "trabalhando"
  | "disponivel"
  | "folga"
  | "ferias";

// Tipos de folga
export type TipoFolga =
  | "folga" // Folga regular
  | "ferias" // Férias anuais
  | "licenca" // Licença médica
  | "atestado" // Atestado médico
  | "banco_horas" // Banco de horas
  | "compensacao" // Compensação de horas
  | "suspensao" // Suspensão disciplinar
  | "afastamento" // Afastamento por acidente de trabalho
  | "maternidade" // Licença maternidade
  | "paternidade" // Licença paternidade
  | "luto" // Licença por luto
  | "casamento" // Licença para casamento
  | "doacao_sangue" // Licença para doação de sangue
  | "servico_militar" // Licença para serviço militar
  | "capacitacao" // Licença para capacitação/curso
  | "outros"; // Outros tipos

// Status de folga
export type StatusFolga = "pendente" | "aprovada" | "rejeitada" | "cancelada";

// Tipos de veículo
export type TipoVeiculo = "caminhao" | "van" | "carro" | "moto" | "outro";

// Tipos de carroceria
export type TipoCarroceria =
  | "truck"
  | "toco"
  | "bitruck"
  | "carreta"
  | "carreta_ls"
  | "carreta_3_eixos"
  | "truck_3_eixos"
  | "truck_4_eixos";

// Status de veículo
export type StatusVeiculo =
  | "ativo"
  | "inativo"
  | "manutencao"
  | "acidentado"
  | "disponivel"
  | "em_uso";

// Tipos de rota
export type TipoRota = "entregas" | "coletas" | "transferencia" | "outros";

// Status de rota
export type StatusRota =
  | "pendente"
  | "em_andamento"
  | "concluida"
  | "cancelada";

// Interface base para entidades
export interface BaseEntity {
  id: string;
  dataCriacao?: any;
  dataAtualizacao?: any;
}

// Interface para paginação
export interface Paginacao {
  paginaAtual: number;
  itensPorPagina: number;
  total: number;
  totalPaginas: number;
  inicio: number;
  fim: number;
}

// Interface para filtros
export interface Filtros {
  termoBusca: string;
  paginaAtual: number;
  ordenarPor: string;
  direcaoOrdenacao: DirecaoOrdenacao;
}

// Interface para ações de CRUD
export interface CrudActions<T> {
  criar: (
    input: Omit<T, "id" | "dataCriacao" | "dataAtualizacao">,
  ) => Promise<string>;
  atualizar: (id: string, input: Partial<T>) => Promise<void>;
  excluir: (id: string) => Promise<void>;
  listar: () => Promise<T[]>;
  buscarPorId: (id: string) => Promise<T | null>;
}

// Interface para validação
export interface ValidacaoErro {
  campo: string;
  mensagem: string;
}

// Interface para resultado de validação
export interface ResultadoValidacao {
  valido: boolean;
  erros: ValidacaoErro[];
}

// Interface para configurações de formulário
export interface ConfiguracaoFormulario {
  camposObrigatorios: string[];
  validacoes: Record<string, (valor: any) => string | null>;
  transformacoes: Record<string, (valor: any) => any>;
}

// Interface para configurações de tabela
export interface ConfiguracaoTabela {
  colunas: string[];
  ordenaveis: string[];
  filtros: string[];
  acoes: string[];
}

// Interface para configurações de modal
export interface ConfiguracaoModal {
  titulo: string;
  tamanho: "sm" | "md" | "lg" | "xl";
  fecharAoConfirmar: boolean;
  mostrarOverlay: boolean;
}

// ========================================
// EXPORTAÇÃO DOS TIPOS DE PERMISSÕES
// ========================================

// Re-exportar todos os tipos de permissões
export * from "./permissions";
