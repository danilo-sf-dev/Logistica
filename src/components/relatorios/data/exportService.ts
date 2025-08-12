import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { RelatorioData } from "../types";

export const exportService = {
  // Exportar dados para PDF
  async exportToPDF(
    tipo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string,
  ): Promise<void> {
    try {
      console.log("Iniciando exportação PDF...", {
        tipo,
        dados: dados.length,
        dadosProcessados,
      });

      const doc = new jsPDF();
      const dataAtual = new Date().toLocaleDateString("pt-BR");

      // Título do relatório
      doc.setFontSize(20);
      doc.text(`Relatório de ${tipo}`, 20, 20);

      doc.setFontSize(12);
      doc.text(`Período: ${periodo}`, 20, 30);
      doc.text(`Data: ${dataAtual}`, 20, 40);

      // Resumo estatístico
      if (dadosProcessados.length > 0) {
        doc.setFontSize(16);
        doc.text("Resumo Estatístico", 20, 60);

        const total = dadosProcessados.reduce((sum, d) => sum + d.value, 0);
        const resumoData = dadosProcessados.map((item) => [
          item.name,
          item.value.toString(),
          total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
        ]);

        autoTable(doc, {
          head: [["Status", "Quantidade", "Percentual"]],
          body: resumoData,
          startY: 70,
          theme: "grid",
        });
      }

      // Dados detalhados
      if (dados.length > 0) {
        doc.setFontSize(16);
        doc.text("Dados Detalhados", 20, 140);

        const colunas = Object.keys(dados[0]).filter(
          (key) =>
            key !== "id" && key !== "dataCriacao" && key !== "dataAtualizacao",
        );

        const dadosTabela = dados.slice(0, 50).map((item) =>
          colunas.map((col) => {
            const valor = item[col];
            if (valor && typeof valor === "object" && valor.toDate) {
              // Firebase Timestamp
              return valor.toDate().toLocaleDateString("pt-BR");
            }
            if (valor instanceof Date) {
              return valor.toLocaleDateString("pt-BR");
            }
            return valor?.toString() || "";
          }),
        );

        autoTable(doc, {
          head: [
            colunas.map((col) => col.charAt(0).toUpperCase() + col.slice(1)),
          ],
          body: dadosTabela,
          startY: 150,
          theme: "grid",
          styles: { fontSize: 8 },
        });
      }

      // Salvar PDF
      const fileName = `relatorio_${tipo.toLowerCase()}_${periodo}_${dataAtual.replace(/\//g, "-")}.pdf`;
      doc.save(fileName);

      console.log(`PDF gerado com sucesso: ${fileName}`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    }
  },

  // Exportar dados para Excel
  async exportToCSV(
    tipo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string,
  ): Promise<void> {
    try {
      console.log("Iniciando exportação Excel...", {
        tipo,
        dados: dados.length,
        dadosProcessados,
      });

      const dataAtual = new Date().toLocaleDateString("pt-BR");

      // Criar workbook
      const wb = XLSX.utils.book_new();

      // Planilha 1: Resumo estatístico
      if (dadosProcessados.length > 0) {
        const total = dadosProcessados.reduce((sum, d) => sum + d.value, 0);
        const resumoData = [
          ["Status", "Quantidade", "Percentual"],
          ...dadosProcessados.map((item) => [
            item.name,
            item.value,
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
          ]),
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
      }

      // Planilha 2: Dados detalhados
      if (dados.length > 0) {
        const colunas = Object.keys(dados[0]).filter(
          (key) =>
            key !== "id" && key !== "dataCriacao" && key !== "dataAtualizacao",
        );

        const dadosDetalhados = [
          colunas.map((col) => col.charAt(0).toUpperCase() + col.slice(1)),
          ...dados.map((item) =>
            colunas.map((col) => {
              const valor = item[col];
              if (valor && typeof valor === "object" && valor.toDate) {
                // Firebase Timestamp
                return valor.toDate().toLocaleDateString("pt-BR");
              }
              if (valor instanceof Date) {
                return valor.toLocaleDateString("pt-BR");
              }
              return valor?.toString() || "";
            }),
          ),
        ];

        const wsDetalhado = XLSX.utils.aoa_to_sheet(dadosDetalhados);
        XLSX.utils.book_append_sheet(wb, wsDetalhado, "Dados Detalhados");
      }

      // Salvar arquivo
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `relatorio_${tipo.toLowerCase()}_${periodo}_${dataAtual.replace(/\//g, "-")}.xlsx`;
      saveAs(blob, fileName);

      console.log(`Excel gerado com sucesso: ${fileName}`);
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      throw error;
    }
  },

  // Exportar relatório específico
  async exportRelatorio(
    tipo: string,
    formato: "pdf" | "csv",
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string,
  ): Promise<void> {
    try {
      console.log(`Exportando relatório: ${tipo} em formato ${formato}`);

      if (formato === "pdf") {
        await this.exportToPDF(tipo, dados, dadosProcessados, periodo);
      } else {
        await this.exportToCSV(tipo, dados, dadosProcessados, periodo);
      }

      console.log("Exportação concluída com sucesso!");
    } catch (error) {
      console.error(`Erro ao exportar relatório ${tipo}:`, error);
      throw error;
    }
  },
};

export default exportService;
