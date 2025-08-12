import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import type {
  MotoristaData,
  VeiculoData,
  RotaData,
  FolgaData,
  RelatorioData,
} from "../types";

export const relatoriosService = {
  // Função auxiliar para filtrar dados por período
  filtrarPorPeriodo(dados: any[], periodo: string): any[] {
    console.log(
      `Aplicando filtro de período: ${periodo} para ${dados.length} itens`,
    );

    const agora = new Date();
    let dataLimite: Date;

    switch (periodo) {
      case "semana":
        dataLimite = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "mes":
        dataLimite = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "trimestre":
        dataLimite = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "ano":
        dataLimite = new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        console.log(
          `Período não reconhecido: ${periodo}, retornando todos os dados`,
        );
        return dados; // Se período não reconhecido, retorna todos os dados
    }

    const dadosFiltrados = dados.filter((item) => {
      let dataItem: Date;

      // Tentar diferentes campos de data
      if (item.dataCriacao?.toDate) {
        dataItem = item.dataCriacao.toDate();
      } else if (item.dataCriacao instanceof Date) {
        dataItem = item.dataCriacao;
      } else if (item.dataAtualizacao?.toDate) {
        dataItem = item.dataAtualizacao.toDate();
      } else if (item.dataAtualizacao instanceof Date) {
        dataItem = item.dataAtualizacao;
      } else {
        // Se não encontrar data, incluir o item
        return true;
      }

      return dataItem >= dataLimite;
    });

    console.log(
      `Filtro aplicado: ${dados.length} -> ${dadosFiltrados.length} itens`,
    );
    return dadosFiltrados;
  },
  // Buscar dados dos motoristas
  async buscarMotoristas(periodo?: string): Promise<MotoristaData[]> {
    try {
      const motoristasSnapshot = await getDocs(collection(db, "motoristas"));
      let motoristas = motoristasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MotoristaData[];

      // Aplicar filtro por período se especificado
      if (periodo) {
        motoristas = this.filtrarPorPeriodo(motoristas, periodo);
      }

      return motoristas;
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
      throw error;
    }
  },

  // Buscar dados dos veículos
  async buscarVeiculos(periodo?: string): Promise<VeiculoData[]> {
    try {
      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));
      let veiculos = veiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VeiculoData[];

      // Aplicar filtro por período se especificado
      if (periodo) {
        veiculos = this.filtrarPorPeriodo(veiculos, periodo);
      }

      return veiculos;
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      throw error;
    }
  },

  // Buscar dados das rotas
  async buscarRotas(periodo?: string): Promise<RotaData[]> {
    try {
      const rotasSnapshot = await getDocs(collection(db, "rotas"));
      let rotas = rotasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RotaData[];

      // Aplicar filtro por período se especificado
      if (periodo) {
        rotas = this.filtrarPorPeriodo(rotas, periodo);
      }

      return rotas;
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      throw error;
    }
  },

  // Buscar dados das folgas
  async buscarFolgas(periodo?: string): Promise<FolgaData[]> {
    try {
      const folgasSnapshot = await getDocs(collection(db, "folgas"));
      let folgas = folgasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FolgaData[];

      // Aplicar filtro por período se especificado
      if (periodo) {
        folgas = this.filtrarPorPeriodo(folgas, periodo);
      }

      return folgas;
    } catch (error) {
      console.error("Erro ao buscar folgas:", error);
      throw error;
    }
  },

  // Processar dados dos motoristas para relatório
  processarDadosMotoristas(motoristas: MotoristaData[]): RelatorioData[] {
    const statusCount = motoristas.reduce(
      (acc, motorista) => {
        const status = motorista.status || "disponivel";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
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
  },

  // Processar dados dos veículos para relatório
  processarDadosVeiculos(veiculos: VeiculoData[]): RelatorioData[] {
    const statusCount = veiculos.reduce(
      (acc, veiculo) => {
        const status = veiculo.status || "disponivel";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      {
        name: "Disponível",
        value: statusCount.disponivel || 0,
        color: "#10B981",
      },
      {
        name: "Em Uso",
        value: statusCount.em_uso || 0,
        color: "#3B82F6",
      },
      {
        name: "Manutenção",
        value: statusCount.manutencao || 0,
        color: "#F59E0B",
      },
      {
        name: "Inativo",
        value: statusCount.inativo || 0,
        color: "#EF4444",
      },
    ];
  },

  // Processar dados das rotas para relatório
  processarDadosRotas(rotas: RotaData[]): RelatorioData[] {
    const statusCount = rotas.reduce(
      (acc, rota) => {
        const status = rota.status || "agendada";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      {
        name: "Agendada",
        value: statusCount.agendada || 0,
        color: "#3B82F6",
      },
      {
        name: "Em Andamento",
        value: statusCount.em_andamento || 0,
        color: "#F59E0B",
      },
      {
        name: "Concluída",
        value: statusCount.concluida || 0,
        color: "#10B981",
      },
      {
        name: "Cancelada",
        value: statusCount.cancelada || 0,
        color: "#EF4444",
      },
    ];
  },

  // Processar dados das folgas para relatório
  processarDadosFolgas(folgas: FolgaData[]): RelatorioData[] {
    const statusCount = folgas.reduce(
      (acc, folga) => {
        const status = folga.status || "pendente";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      {
        name: "Pendente",
        value: statusCount.pendente || 0,
        color: "#F59E0B",
      },
      {
        name: "Aprovada",
        value: statusCount.aprovada || 0,
        color: "#10B981",
      },
      {
        name: "Rejeitada",
        value: statusCount.rejeitada || 0,
        color: "#EF4444",
      },
    ];
  },
};

export default relatoriosService;
