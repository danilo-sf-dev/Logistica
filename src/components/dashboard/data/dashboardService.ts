import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import {
  DashboardStats,
  MotoristaStatus,
  RotaData,
  AtividadeRecente,
} from "../types";

// Função utilitária para converter timestamps do Firestore de forma segura
const safeToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (timestamp && typeof timestamp === "number") {
    return new Date(timestamp);
  }
  return new Date();
};

export class DashboardService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const funcionariosSnapshot = await getDocs(
        collection(db, "funcionarios"),
      );
      const vendedoresSnapshot = await getDocs(collection(db, "vendedores"));
      const cidadesSnapshot = await getDocs(collection(db, "cidades"));
      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));
      const rotasSnapshot = await getDocs(collection(db, "rotas"));
      const folgasSnapshot = await getDocs(collection(db, "folgas"));

      // Contar funcionários e motoristas da tabela funcionarios
      const funcionariosData = funcionariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalFuncionarios = funcionariosData.length;
      const totalMotoristas = funcionariosData.filter(
        (funcionario: any) => funcionario.funcao === "motorista",
      ).length;

      return {
        funcionarios: totalFuncionarios,
        motoristas: totalMotoristas,
        vendedores: vendedoresSnapshot.size,
        cidades: cidadesSnapshot.size,
        veiculos: veiculosSnapshot.size,
        rotas: rotasSnapshot.size,
        folgas: folgasSnapshot.size,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      throw error;
    }
  }

  static async getFuncionariosStatus(): Promise<MotoristaStatus[]> {
    try {
      const funcionariosSnapshot = await getDocs(
        collection(db, "funcionarios"),
      );
      const funcionariosData = funcionariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const statusCount = funcionariosData.reduce(
        (acc, funcionario: any) => {
          const status = funcionario.status || "disponivel";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const statusData = [
        {
          name: "Trabalhando",
          value: statusCount.trabalhando || 0,
          color: "#10B981",
        },
        {
          name: "Disponível",
          value: statusCount.disponivel || 0,
          color: "#3B82F6",
        },
        {
          name: "Folga",
          value: statusCount.folga || 0,
          color: "#F59E0B",
        },
        {
          name: "Férias",
          value: statusCount.ferias || 0,
          color: "#EF4444",
        },
      ];

      // Filtrar apenas valores maiores que 0
      return statusData.filter((status) => status.value > 0);
    } catch (error) {
      console.error("Erro ao buscar status dos funcionários:", error);
      throw error;
    }
  }

  static async getMotoristasStatus(): Promise<MotoristaStatus[]> {
    try {
      const funcionariosSnapshot = await getDocs(
        collection(db, "funcionarios"),
      );
      const funcionariosData = funcionariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filtrar apenas funcionários com função "motorista"
      const motoristasData = funcionariosData.filter(
        (funcionario: any) => funcionario.funcao === "motorista",
      );

      const statusCount = motoristasData.reduce(
        (acc, motorista: any) => {
          const status = motorista.status || "disponivel";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const statusData = [
        {
          name: "Trabalhando",
          value: statusCount.trabalhando || 0,
          color: "#10B981",
        },
        {
          name: "Disponível",
          value: statusCount.disponivel || 0,
          color: "#3B82F6",
        },
        {
          name: "Folga",
          value: statusCount.folga || 0,
          color: "#F59E0B",
        },
        {
          name: "Férias",
          value: statusCount.ferias || 0,
          color: "#EF4444",
        },
      ];

      // Filtrar apenas valores maiores que 0
      return statusData.filter((status) => status.value > 0);
    } catch (error) {
      console.error("Erro ao buscar status dos motoristas:", error);
      throw error;
    }
  }

  static async getVeiculosStatus(): Promise<MotoristaStatus[]> {
    try {
      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));
      const veiculosData = veiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const statusCount = veiculosData.reduce(
        (acc, veiculo: any) => {
          const status = veiculo.status || "disponivel";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const statusData = [
        {
          name: "Em Operação",
          value: statusCount.operacao || statusCount.trabalhando || 0,
          color: "#10B981",
        },
        {
          name: "Disponível",
          value: statusCount.disponivel || 0,
          color: "#3B82F6",
        },
        {
          name: "Manutenção",
          value: statusCount.manutencao || 0,
          color: "#F59E0B",
        },
        {
          name: "Inativo",
          value: statusCount.inativo || statusCount.parado || 0,
          color: "#EF4444",
        },
      ];

      // Filtrar apenas valores maiores que 0
      return statusData.filter((status) => status.value > 0);
    } catch (error) {
      console.error("Erro ao buscar status dos veículos:", error);
      throw error;
    }
  }

  static async getRotasData(): Promise<RotaData[]> {
    try {
      const rotasSnapshot = await getDocs(collection(db, "rotas"));
      const rotasData = rotasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const rotasPorDia = rotasData.reduce(
        (acc, rota: any) => {
          const dataCriacao = safeToDate(rota.dataCriacao);
          const data = dataCriacao.toLocaleDateString("pt-BR");
          acc[data] = (acc[data] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return Object.entries(rotasPorDia).map(([data, quantidade]) => ({
        data,
        quantidade,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados de rotas:", error);
      throw error;
    }
  }

  static async getAtividadesRecentes(): Promise<AtividadeRecente[]> {
    try {
      // Buscar as atividades mais recentes de diferentes coleções
      const rotasSnapshot = await getDocs(collection(db, "rotas"));
      const folgasSnapshot = await getDocs(collection(db, "folgas"));
      const funcionariosSnapshot = await getDocs(
        collection(db, "funcionarios"),
      );
      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));

      const atividades: AtividadeRecente[] = [];

      // Processar rotas
      rotasSnapshot.docs.forEach((doc) => {
        const rota: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(rota.dataCriacao);

        // Buscar nome do motorista se existir
        let motoristaNome = "Motorista não informado";
        if (rota.motoristaId) {
          const motoristaDoc = funcionariosSnapshot.docs.find(
            (d) => d.id === rota.motoristaId,
          );
          if (motoristaDoc) {
            motoristaNome = motoristaDoc.data().nome || motoristaNome;
          }
        }

        atividades.push({
          id: rota.id,
          tipo: "rota",
          titulo: `Nova rota criada para ${rota.destino || rota.cidadeDestino || "destino não informado"}`,
          descricao: `${motoristaNome} - ${dataCriacao.toLocaleString("pt-BR")}`,
          timestamp: dataCriacao,
          icon: "Map",
          color: "green",
        });
      });

      // Processar folgas
      folgasSnapshot.docs.forEach((doc) => {
        const folga: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(folga.dataCriacao);
        const dataInicio = safeToDate(folga.dataInicio);

        // Buscar nome do funcionário se existir
        let funcionarioNome = "Funcionário não informado";
        if (folga.funcionarioId) {
          const funcionarioDoc = funcionariosSnapshot.docs.find(
            (d) => d.id === folga.funcionarioId,
          );
          if (funcionarioDoc) {
            funcionarioNome = funcionarioDoc.data().nome || funcionarioNome;
          }
        }

        const statusText =
          folga.status === "aprovada"
            ? "aprovada"
            : folga.status === "pendente"
              ? "solicitada"
              : folga.status === "rejeitada"
                ? "rejeitada"
                : "solicitada";

        atividades.push({
          id: folga.id,
          tipo: "folga",
          titulo: `Folga ${statusText} para ${funcionarioNome}`,
          descricao: `${dataInicio.toLocaleDateString("pt-BR")} - ${dataCriacao.toLocaleString("pt-BR")}`,
          timestamp: dataCriacao,
          icon: "Calendar",
          color:
            folga.status === "aprovada"
              ? "green"
              : folga.status === "rejeitada"
                ? "red"
                : "blue",
        });
      });

      // Buscar dados adicionais
      const cidadesSnapshot = await getDocs(collection(db, "cidades"));
      const vendedoresSnapshot = await getDocs(collection(db, "vendedores"));

      // Processar novos motoristas (últimos 15 dias) - PRIORIDADE ALTA
      const quinzeDiasAtras = new Date();
      quinzeDiasAtras.setDate(quinzeDiasAtras.getDate() - 15);

      // Filtrar funcionários que são motoristas
      const motoristasData = funcionariosSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((funcionario: any) => funcionario.funcao === "motorista");

      motoristasData.forEach((motorista: any) => {
        const dataCriacao = safeToDate(
          motorista.dataCriacao || motorista.createdAt,
        );

        if (dataCriacao > quinzeDiasAtras) {
          atividades.push({
            id: motorista.id,
            tipo: "motorista",
            titulo: `Novo motorista cadastrado: ${motorista.nome || "Nome não informado"}`,
            descricao: `${motorista.cnh || "CNH não informada"} - ${dataCriacao.toLocaleString("pt-BR")}`,
            timestamp: dataCriacao,
            icon: "Car",
            color: "green",
          });
        }
      });

      // Processar novos veículos (últimos 15 dias) - PRIORIDADE ALTA
      veiculosSnapshot.docs.forEach((doc) => {
        const veiculo: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(
          veiculo.dataCriacao || veiculo.createdAt,
        );

        if (dataCriacao > quinzeDiasAtras) {
          atividades.push({
            id: veiculo.id,
            tipo: "veiculo",
            titulo: `Novo veículo cadastrado: ${veiculo.placa || "Placa não informada"}`,
            descricao: `${veiculo.modelo || "Modelo não informado"} - ${dataCriacao.toLocaleString("pt-BR")}`,
            timestamp: dataCriacao,
            icon: "Truck",
            color: "orange",
          });
        }
      });

      // Processar novos funcionários (últimos 15 dias)
      funcionariosSnapshot.docs.forEach((doc) => {
        const funcionario: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(
          funcionario.dataCriacao || funcionario.createdAt,
        );

        if (dataCriacao > quinzeDiasAtras) {
          atividades.push({
            id: funcionario.id,
            tipo: "funcionario",
            titulo: `Novo funcionário cadastrado: ${funcionario.nome || "Nome não informado"}`,
            descricao: `${funcionario.cargo || "Cargo não informado"} - ${dataCriacao.toLocaleString("pt-BR")}`,
            timestamp: dataCriacao,
            icon: "Users",
            color: "purple",
          });
        }
      });

      // Processar novas cidades (últimos 15 dias)
      cidadesSnapshot.docs.forEach((doc) => {
        const cidade: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(cidade.dataCriacao || cidade.createdAt);

        if (dataCriacao > quinzeDiasAtras) {
          atividades.push({
            id: cidade.id,
            tipo: "cidade",
            titulo: `Nova cidade cadastrada: ${cidade.nome || "Nome não informado"}`,
            descricao: `${cidade.estado || "Estado não informado"} - ${dataCriacao.toLocaleString("pt-BR")}`,
            timestamp: dataCriacao,
            icon: "Building2",
            color: "gray",
          });
        }
      });

      // Processar novos vendedores (últimos 15 dias)
      vendedoresSnapshot.docs.forEach((doc) => {
        const vendedor: any = { id: doc.id, ...doc.data() };
        const dataCriacao = safeToDate(
          vendedor.dataCriacao || vendedor.createdAt,
        );

        if (dataCriacao > quinzeDiasAtras) {
          atividades.push({
            id: vendedor.id,
            tipo: "vendedor",
            titulo: `Novo vendedor cadastrado: ${vendedor.nome || "Nome não informado"}`,
            descricao: `${vendedor.regiao || "Região não informada"} - ${dataCriacao.toLocaleString("pt-BR")}`,
            timestamp: dataCriacao,
            icon: "UserCheck",
            color: "blue",
          });
        }
      });

      // Ordenar por timestamp e pegar as 10 mais recentes
      return atividades
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);
    } catch (error) {
      console.error("Erro ao buscar atividades recentes:", error);
      throw error;
    }
  }

  static async getAllDashboardData() {
    try {
      // Buscar dados com tratamento individual de erro
      let stats, motoristasStatus, atividadesRecentes;

      try {
        stats = await this.getDashboardStats();
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        stats = {
          funcionarios: 0,
          motoristas: 0,
          vendedores: 0,
          cidades: 0,
          veiculos: 0,
          rotas: 0,
          folgas: 0,
        };
      }

      try {
        motoristasStatus = await this.getMotoristasStatus();
      } catch (error) {
        console.error("Erro ao buscar status dos motoristas:", error);
        motoristasStatus = [];
      }

      let veiculosStatus: MotoristaStatus[] = [];
      try {
        veiculosStatus = await this.getVeiculosStatus();
      } catch (error) {
        console.error("Erro ao buscar status dos veículos:", error);
        veiculosStatus = [];
      }

      try {
        atividadesRecentes = await this.getAtividadesRecentes();
      } catch (error) {
        console.error("Erro ao buscar atividades recentes:", error);
        atividadesRecentes = [];
      }

      return {
        stats,
        motoristasStatus,
        veiculosStatus,
        atividadesRecentes,
      };
    } catch (error) {
      console.error("Erro geral ao buscar dados do dashboard:", error);
      // Retornar dados padrão em caso de erro geral
      return {
        stats: {
          funcionarios: 0,
          motoristas: 0,
          vendedores: 0,
          cidades: 0,
          veiculos: 0,
          rotas: 0,
          folgas: 0,
        },
        motoristasStatus: [],
        veiculosStatus: [],
        atividadesRecentes: [],
      };
    }
  }
}
