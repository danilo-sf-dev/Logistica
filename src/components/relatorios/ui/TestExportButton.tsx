import React from "react";
import { Download } from "lucide-react";
import { exportService } from "../data/exportService";
import {
  testLibraries,
  testSimplePDF,
  testSimpleExcel,
} from "../data/testExport";

export const TestExportButton: React.FC = () => {
  const handleTestExport = async () => {
    try {
      console.log("=== TESTE DE EXPORTAÇÃO ===");

      // Testar bibliotecas
      console.log("1. Testando bibliotecas...");
      const librariesOk = testLibraries();

      if (librariesOk) {
        // Testar PDF simples
        console.log("2. Testando PDF simples...");
        testSimplePDF();

        // Testar Excel simples
        console.log("3. Testando Excel simples...");
        testSimpleExcel();

        // Testar exportação completa
        console.log("4. Testando exportação completa...");
        const dadosTeste = [
          { nome: "João Silva", status: "disponivel", cargo: "Motorista" },
          { nome: "Maria Santos", status: "trabalhando", cargo: "Motorista" },
          { nome: "Pedro Costa", status: "folga", cargo: "Ajudante" },
        ];

        const dadosProcessados = [
          { name: "Disponível", value: 1, color: "#10B981" },
          { name: "Trabalhando", value: 1, color: "#3B82F6" },
          { name: "Folga", value: 1, color: "#F59E0B" },
        ];

        await exportService.exportToPDF(
          "Teste",
          dadosTeste,
          dadosProcessados,
          "mes",
        );
        await exportService.exportToCSV(
          "Teste",
          dadosTeste,
          dadosProcessados,
          "mes",
        );
      }

      console.log("=== TESTE CONCLUÍDO ===");
    } catch (error) {
      console.error("Erro no teste de exportação:", error);
    }
  };

  return (
    <button
      onClick={handleTestExport}
      className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 z-50"
      title="Testar Exportação"
    >
      <Download className="h-6 w-6" />
    </button>
  );
};

export default TestExportButton;
