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

  const fetchRelatorios = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar dados de todas as entidades
      const [motoristas, veiculos, rotas, folgas] = await Promise.all([
        relatoriosService.buscarMotoristas(periodo),
        relatoriosService.buscarVeiculos(periodo),
        relatoriosService.buscarRotas(periodo),
        relatoriosService.buscarFolgas(periodo),
      ]);

      // Salvar dados brutos para exportação
      setDadosBrutosMotoristas(motoristas);
      setDadosBrutosVeiculos(veiculos);
      setDadosBrutosRotas(rotas);
      setDadosBrutosFolgas(folgas);

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
        motoristas.length + veiculos.length + rotas.length + folgas.length;
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
