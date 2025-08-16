/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { relatoriosService } from "../data/relatoriosService";
import { ExportServiceFactory, type ExportData } from "../export";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import type {
  RelatorioData,
  MotoristaData,
  VeiculoData,
  RotaData,
  FolgaData,
} from "../types";
import type { Cidade } from "../../cidades/types";
import type { Vendedor } from "../../vendedores/types";

// Função auxiliar para obter cor baseada na região
const getCorRegiao = (regiao: string): string => {
  const coresRegiao: Record<string, string> = {
    Sudeste: "#3B82F6", // Azul
    Sul: "#10B981", // Verde
    Nordeste: "#F59E0B", // Laranja
    "Centro-Oeste": "#8B5CF6", // Roxo
    Norte: "#EF4444", // Vermelho
    "Não definida": "#6B7280", // Cinza
  };
  return coresRegiao[regiao] || "#6B7280";
};

export const useRelatorios = () => {
  const { showNotification } = useNotification();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");
  const [dadosMotoristas, setDadosMotoristas] = useState<RelatorioData[]>([]);
  const [dadosVeiculos, setDadosVeiculos] = useState<RelatorioData[]>([]);
  const [dadosRotas, setDadosRotas] = useState<RelatorioData[]>([]);
  const [dadosFolgas, setDadosFolgas] = useState<RelatorioData[]>([]);

  // Dados brutos para exportação
  const [dadosBrutosMotoristas, setDadosBrutosMotoristas] = useState<
    MotoristaData[]
  >([]);
  const [dadosBrutosVeiculos, setDadosBrutosVeiculos] = useState<VeiculoData[]>(
    [],
  );
  const [dadosBrutosRotas, setDadosBrutosRotas] = useState<RotaData[]>([]);
  const [dadosBrutosFolgas, setDadosBrutosFolgas] = useState<FolgaData[]>([]);
  const [dadosBrutosCidades, setDadosBrutosCidades] = useState<Cidade[]>([]);
  const [dadosBrutosVendedores, setDadosBrutosVendedores] = useState<
    Vendedor[]
  >([]);

  const fetchRelatorios = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar dados de todas as entidades
      const [motoristas, veiculos, rotas, folgas, cidades, vendedores] =
        await Promise.all([
          relatoriosService.buscarMotoristas(periodo),
          relatoriosService.buscarVeiculos(periodo),
          relatoriosService.buscarRotas(periodo),
          relatoriosService.buscarFolgas(periodo),
          relatoriosService.buscarCidades(periodo),
          relatoriosService.buscarVendedores(periodo),
        ]);

      // Salvar dados brutos para exportação
      setDadosBrutosMotoristas(motoristas);
      setDadosBrutosVeiculos(veiculos);
      setDadosBrutosRotas(rotas);
      setDadosBrutosFolgas(folgas);
      setDadosBrutosCidades(cidades);
      setDadosBrutosVendedores(vendedores);

      // Processar dados para relatórios
      const dadosMotoristasProcessados =
        relatoriosService.processarDadosMotoristas(motoristas);
      const dadosVeiculosProcessados =
        relatoriosService.processarDadosVeiculos(veiculos);
      const dadosRotasProcessados =
        relatoriosService.processarDadosRotas(rotas); // Voltar para dados de status
      const dadosFolgasProcessados =
        relatoriosService.processarDadosFolgas(folgas);

      setDadosMotoristas(dadosMotoristasProcessados);
      setDadosVeiculos(dadosVeiculosProcessados);
      setDadosRotas(dadosRotasProcessados);
      setDadosFolgas(dadosFolgasProcessados);

      setLoading(false);

      // Mostrar notificação de sucesso
      const totalItens =
        motoristas.length +
        veiculos.length +
        rotas.length +
        folgas.length +
        cidades.length +
        vendedores.length;
      showNotification(
        `Dados carregados: ${totalItens} itens encontrados`,
        "success",
      );
    } catch (error) {
      console.error("Erro ao buscar dados para relatórios:", error);
      setLoading(false);
      showNotification("Erro ao carregar dados dos relatórios", "error");
    }
  }, [periodo]);

  useEffect(() => {
    fetchRelatorios();
  }, [fetchRelatorios]);

  const handleDownload = useCallback(
    async (tipo: string, formato: "pdf" | "csv" = "pdf") => {
      try {
        // Verificar se é um relatório detalhado
        const isDetalhado = tipo.includes("_detalhado");

        let dados: any[] = [];
        let dadosProcessados: RelatorioData[] = [];
        let nomeTipo = "";

        const mensagemInicial = isDetalhado
          ? `Gerando relatório detalhado...`
          : "Gerando relatório...";
        showNotification(mensagemInicial, "info");

        switch (tipo) {
          case "motoristas":
          case "motoristas_detalhado":
          case "funcionarios":
          case "funcionarios_detalhado":
          case "status_dos_funcionários":
          case "status_dos_funcionarios":
          case "status_dos_motoristas":
            dados = dadosBrutosMotoristas;
            dadosProcessados = dadosMotoristas;
            nomeTipo = "Funcionários";
            break;
          case "veiculos":
          case "veiculos_detalhado":
          case "status_dos_veículos":
          case "status_dos_veiculos":
            dados = dadosBrutosVeiculos;
            dadosProcessados = dadosVeiculos;
            nomeTipo = "Veículos";
            break;
          case "rotas":
          case "rotas_detalhado":
          case "status_das_rotas":
            dados = dadosBrutosRotas;
            dadosProcessados = dadosRotas;
            nomeTipo = "Rotas";
            break;
          case "folgas":
          case "folgas_detalhado":
          case "status_das_folgas":
            dados = dadosBrutosFolgas;
            dadosProcessados = dadosFolgas;
            nomeTipo = "Folgas";
            break;
          case "cidades":
          case "cidades_detalhado":
            dados = dadosBrutosCidades;
            // Estatísticas por região
            const estatisticasRegiao = dadosBrutosCidades.reduce(
              (acc, cidade) => {
                const regiao = cidade.regiao || "Não definida";
                acc[regiao] = (acc[regiao] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            // Criar dados para todas as regiões, incluindo as que não têm cidades
            dadosProcessados = [];

            // Definir todas as regiões do Brasil (em maiúsculas como nos dados)
            const todasRegioes = [
              "NORDESTE",
              "CENTRO-OESTE",
              "SUL",
              "NORTE",
              "SUDESTE",
            ];

            // Adicionar todas as regiões, mesmo as que não têm cidades
            todasRegioes.forEach((regiao) => {
              dadosProcessados.push({
                name: regiao,
                value: estatisticasRegiao[regiao] || 0,
                color: getCorRegiao(regiao),
              });
            });

            nomeTipo = "Cidades";
            break;
          case "vendedores_detalhado":
            dados = dadosBrutosVendedores;

            // Estatísticas por região
            const estatisticasRegiaoVendedores = dadosBrutosVendedores.reduce(
              (acc, vendedor) => {
                const regiao = vendedor.regiao || "Não definida";
                acc[regiao] = (acc[regiao] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            // Estatísticas por unidade de negócio
            const estatisticasUnidade = dadosBrutosVendedores.reduce(
              (acc, vendedor) => {
                const unidade = vendedor.unidadeNegocio || "Não definida";
                acc[unidade] = (acc[unidade] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            // Estatísticas por tipo de contrato
            const estatisticasContrato = dadosBrutosVendedores.reduce(
              (acc, vendedor) => {
                const contrato = vendedor.tipoContrato || "Não definido";
                acc[contrato] = (acc[contrato] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            // Criar dados processados combinando todas as estatísticas
            dadosProcessados = [];

            // Adicionar estatísticas por região
            Object.entries(estatisticasRegiaoVendedores).forEach(
              ([regiao, quantidade]) => {
                dadosProcessados.push({
                  name: `Região: ${regiao}`,
                  value: quantidade,
                  color: "#3B82F6", // Azul padrão
                });
              },
            );

            // Adicionar estatísticas por unidade de negócio
            Object.entries(estatisticasUnidade).forEach(
              ([unidade, quantidade]) => {
                dadosProcessados.push({
                  name: `Unidade: ${unidade}`,
                  value: quantidade,
                  color: "#10B981", // Verde padrão
                });
              },
            );

            // Adicionar estatísticas por tipo de contrato
            Object.entries(estatisticasContrato).forEach(
              ([contrato, quantidade]) => {
                dadosProcessados.push({
                  name: `Contrato: ${contrato}`,
                  value: quantidade,
                  color: "#F59E0B", // Laranja padrão
                });
              },
            );

            // Ordenar por quantidade decrescente
            dadosProcessados.sort((a, b) => b.value - a.value);

            nomeTipo = "Vendedores";
            break;
          default:
            console.error(`Tipo de relatório não reconhecido: ${tipo}`);
            showNotification("Tipo de relatório não reconhecido", "error");
            return;
        }

        const exportService = ExportServiceFactory.createService(tipo);
        const exportData: ExportData = {
          dados,
          dadosProcessados,
          periodo,
        };

        // Preparar informações do usuário para o relatório
        const userInfo = userProfile
          ? {
              displayName: userProfile.displayName,
              email: userProfile.email,
              cargo: userProfile.cargo,
            }
          : undefined;

        await exportService.exportRelatorio(formato, exportData, userInfo);

        const tipoRelatorio = isDetalhado ? "Relatório Detalhado" : "Relatório";
        showNotification(
          `${tipoRelatorio} de ${nomeTipo} exportado com sucesso!`,
          "success",
        );
      } catch (error) {
        console.error("Erro ao exportar relatório:", error);
        showNotification("Erro ao exportar relatório", "error");
      }
    },
    [
      dadosBrutosMotoristas,
      dadosBrutosVeiculos,
      dadosBrutosRotas,
      dadosBrutosFolgas,
      dadosBrutosCidades,
      dadosBrutosVendedores,
      dadosMotoristas,
      dadosVeiculos,
      dadosRotas,
      dadosFolgas,
      periodo,
      showNotification,
    ],
  );

  const handlePeriodoChange = useCallback(
    (novoPeriodo: string) => {
      setPeriodo(novoPeriodo);

      // Mostrar notificação de carregamento
      showNotification("Atualizando dados...", "info");

      // Recarregar dados com o novo período
      fetchRelatorios();
    },
    [fetchRelatorios, showNotification],
  );

  return {
    loading,
    periodo,
    dadosMotoristas,
    dadosVeiculos,
    dadosRotas,
    dadosFolgas,
    handleDownload,
    handlePeriodoChange,
    refetch: fetchRelatorios,
  };
};

export default useRelatorios;
