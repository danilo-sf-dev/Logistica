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
      `Aplicando filtro de período: ${periodo} para ${dados.length} itens`
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
          `Período não reconhecido: ${periodo}, retornando todos os dados`
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
      `Filtro aplicado: ${dados.length} -> ${dadosFiltrados.length} itens`
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

      console.log("📊 Dados de motoristas retornados:", {
        total: motoristas.length,
        campos: motoristas.length > 0 ? Object.keys(motoristas[0]) : [],
        exemplo: motoristas.length > 0 ? motoristas[0] : null,
      });

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

      console.log("📊 Dados de veículos retornados:", {
        total: veiculos.length,
        campos: veiculos.length > 0 ? Object.keys(veiculos[0]) : [],
        exemplo: veiculos.length > 0 ? veiculos[0] : null,
      });

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

      console.log("📊 Dados de rotas retornados:", {
        total: rotas.length,
        campos: rotas.length > 0 ? Object.keys(rotas[0]) : [],
        exemplo: rotas.length > 0 ? rotas[0] : null,
      });

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

      console.log("📊 Dados de folgas retornados:", {
        total: folgas.length,
        campos: folgas.length > 0 ? Object.keys(folgas[0]) : [],
        exemplo: folgas.length > 0 ? folgas[0] : null,
      });

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
      {} as Record<string, number>
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
  },

  // Processar dados dos veículos para relatório
  processarDadosVeiculos(veiculos: VeiculoData[]): RelatorioData[] {
    const statusCount = veiculos.reduce(
      (acc, veiculo) => {
        const status = veiculo.status || "disponivel";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusData = [
      {
        name: "Em Operação",
        value:
          statusCount.operacao ||
          statusCount.trabalhando ||
          statusCount.em_uso ||
          0,
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
  },

  // Processar dados das rotas para relatório (formato temporal)
  processarDadosRotasTemporal(rotas: RotaData[]): RelatorioData[] {
    console.log("Processando dados temporais de rotas:", rotas);

    // Agrupar rotas por data de criação
    const rotasPorData = rotas.reduce(
      (acc, rota) => {
        let dataCriacao: Date;

        if (rota.dataCriacao?.toDate) {
          dataCriacao = rota.dataCriacao.toDate();
        } else if (rota.dataCriacao instanceof Date) {
          dataCriacao = rota.dataCriacao;
        } else {
          dataCriacao = new Date();
        }

        const dataStr = dataCriacao.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!acc[dataStr]) {
          acc[dataStr] = 0;
        }
        acc[dataStr]++;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("Rotas por data:", rotasPorData);

    // Converter para formato do gráfico
    const dadosTemporais = Object.entries(rotasPorData)
      .sort(
        ([a], [b]) =>
          new Date(a.split("/").reverse().join("-")).getTime() -
          new Date(b.split("/").reverse().join("-")).getTime()
      )
      .map(([data, quantidade]) => ({
        name: data,
        value: quantidade,
        color: "#3B82F6",
      }));

    console.log("Dados temporais das rotas:", dadosTemporais);
    return dadosTemporais;
  },

  // Processar dados das rotas para relatório
  processarDadosRotas(rotas: RotaData[]): RelatorioData[] {
    console.log("Processando dados de rotas:", rotas);

    // Agrupar rotas por dia da semana
    const rotasPorDia = rotas.reduce(
      (acc, rota) => {
        if (rota.diaSemana && Array.isArray(rota.diaSemana)) {
          rota.diaSemana.forEach((dia) => {
            acc[dia] = (acc[dia] || 0) + 1;
          });
        }
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("Rotas por dia da semana:", rotasPorDia);

    const dadosPorDia = [
      {
        name: "Segunda-feira",
        value: rotasPorDia["Segunda-feira"] || 0,
        color: "#3B82F6",
      },
      {
        name: "Terça-feira",
        value: rotasPorDia["Terça-feira"] || 0,
        color: "#10B981",
      },
      {
        name: "Quarta-feira",
        value: rotasPorDia["Quarta-feira"] || 0,
        color: "#F59E0B",
      },
      {
        name: "Quinta-feira",
        value: rotasPorDia["Quinta-feira"] || 0,
        color: "#8B5CF6",
      },
      {
        name: "Sexta-feira",
        value: rotasPorDia["Sexta-feira"] || 0,
        color: "#EF4444",
      },
      {
        name: "Sábado",
        value: rotasPorDia["Sábado"] || 0,
        color: "#6B7280",
      },
      {
        name: "Domingo",
        value: rotasPorDia["Domingo"] || 0,
        color: "#F97316",
      },
    ];

    console.log("Dados por dia da semana:", dadosPorDia);

    // Filtrar apenas valores maiores que 0
    const resultado = dadosPorDia.filter((dia) => dia.value > 0);
    console.log("Resultado final das rotas:", resultado);
    return resultado;
  },

  // Processar dados das folgas para relatório
  processarDadosFolgas(folgas: FolgaData[]): RelatorioData[] {
    console.log("Processando dados de folgas:", folgas);

    const statusCount = folgas.reduce(
      (acc, folga) => {
        const status = folga.status || "pendente";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("Status count das folgas:", statusCount);

    const statusData = [
      {
        name: "Pendente",
        value: statusCount.pendente || 0,
        color: "#F59E0B", // Laranja - aguardando aprovação
      },
      {
        name: "Aprovada",
        value: statusCount.aprovada || 0,
        color: "#10B981", // Verde - aprovada
      },
      {
        name: "Rejeitada",
        value: statusCount.rejeitada || 0,
        color: "#EF4444", // Vermelho - rejeitada
      },
      {
        name: "Cancelada",
        value: statusCount.cancelada || 0,
        color: "#6B7280", // Cinza - cancelada
      },
    ];

    console.log("Status data das folgas:", statusData);

    // Retornar todos os status, mesmo com valor 0
    console.log("Resultado final das folgas:", statusData);
    return statusData;
  },
};

export default relatoriosService;
