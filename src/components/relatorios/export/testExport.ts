import { ExportServiceFactory } from "./index";
import type { ExportData } from "./BaseExportService";

// Dados de teste para funcionários
const dadosTesteFuncionarios = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "12345678901",
    cnh: "12345678901",
    cnhVencimento: "2025-12-31",
    cnhCategoria: "E",
    celular: "73999999999",
    email: "joao@empresa.com",
    cidade: "Salvador",
    status: "trabalhando",
    tipoContrato: "clt",
    unidadeNegocio: "logistica",
    dataAdmissao: "2023-01-15",
    funcao: "motorista",
    toxicoUltimoExame: "2024-01-15",
    toxicoVencimento: "2025-01-15",
    observacao: "Funcionário exemplar",
  },
  {
    id: "2",
    nome: "Maria Santos",
    cpf: "98765432109",
    cnh: "98765432109",
    cnhVencimento: "2024-06-30",
    cnhCategoria: "D",
    celular: "73888888888",
    email: "maria@empresa.com",
    cidade: "Feira de Santana",
    status: "disponivel",
    tipoContrato: "pj",
    unidadeNegocio: "vendas",
    dataAdmissao: "2023-03-20",
    funcao: "auxiliar",
    toxicoUltimoExame: "2024-03-20",
    toxicoVencimento: "2025-03-20",
    observacao: "Boa performance",
  },
];

const dadosProcessadosTeste = [
  { name: "Trabalhando", value: 1, color: "#10B981" },
  { name: "Disponível", value: 1, color: "#3B82F6" },
];

export const testarExportacao = async () => {
  try {
    console.log("=== TESTANDO NOVA ESTRUTURA DE EXPORTAÇÃO ===");

    // Testar criação do serviço
    const funcionariosService =
      ExportServiceFactory.createService("funcionarios");
    console.log("✅ Serviço de funcionários criado com sucesso");

    // Testar configuração
    console.log("📋 Configuração:", {
      titulo: funcionariosService["config"].titulo,
      campos: funcionariosService["config"].campos,
      totalCampos: funcionariosService["config"].campos.length,
    });

    // Preparar dados de teste
    const exportData: ExportData = {
      dados: dadosTesteFuncionarios,
      dadosProcessados: dadosProcessadosTeste,
      periodo: "mes",
    };

    console.log("📊 Dados preparados:", {
      totalDados: exportData.dados.length,
      totalProcessados: exportData.dadosProcessados.length,
      periodo: exportData.periodo,
    });

    // Testar formatação (sem exportar arquivo)
    const dadosFormatados = funcionariosService["getFilteredData"](
      dadosTesteFuncionarios
    );
    console.log("🎨 Dados formatados:", dadosFormatados);

    console.log("✅ Teste concluído com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

// Função para testar todos os serviços
export const testarTodosServicos = async () => {
  const tipos = [
    "funcionarios",
    "veiculos",
    "rotas",
    "folgas",
    "cidades",
    "vendedores",
  ];

  console.log("=== TESTANDO TODOS OS SERVIÇOS ===");

  for (const tipo of tipos) {
    try {
      const service = ExportServiceFactory.createService(tipo);
      console.log(
        `✅ ${tipo}: ${service["config"].titulo} - ${service["config"].campos.length} campos`
      );
    } catch (error) {
      console.error(`❌ ${tipo}:`, error);
    }
  }
};
