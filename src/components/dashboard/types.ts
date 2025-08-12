export interface DashboardStats {
  funcionarios: number;
  motoristas: number;
  vendedores: number;
  cidades: number;
  veiculos: number;
  rotas: number;
  folgas: number;
}

export interface MotoristaStatus {
  name: string;
  value: number;
  color: string;
}

export interface RotaData {
  data: string;
  quantidade: number;
}

export interface AtividadeRecente {
  id: string;
  tipo:
    | "rota"
    | "folga"
    | "veiculo"
    | "motorista"
    | "funcionario"
    | "cidade"
    | "vendedor";
  titulo: string;
  descricao: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface DashboardData {
  stats: DashboardStats;
  motoristasStatus: MotoristaStatus[];
  veiculosStatus: MotoristaStatus[];
  atividadesRecentes: AtividadeRecente[];
  loading: boolean;
}
