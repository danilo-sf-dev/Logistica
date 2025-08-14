import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { RelatorioData } from "../types";

export interface ExportConfig {
  campos: string[];
  formatacao?: Record<string, (valor: any) => any>;
  ordenacao?: string[];
  titulo?: string;
}

export interface ExportData {
  dados: any[];
  dadosProcessados: RelatorioData[];
  periodo: string;
}

export abstract class BaseExportService {
  protected abstract config: ExportConfig;

  protected formatValue(field: string, value: any): any {
    if (this.config.formatacao?.[field]) {
      return this.config.formatacao[field](value);
    }

    // Formatação padrão para tipos comuns
    if (value && typeof value === "object" && value.toDate) {
      // Firebase Timestamp
      return value.toDate().toLocaleDateString("pt-BR");
    }
    if (value instanceof Date) {
      return value.toLocaleDateString("pt-BR");
    }
    if (value === null || value === undefined) {
      return "";
    }
    return value.toString();
  }

  protected getFilteredData(dados: any[]): any[] {
    return dados.map((item) => {
      const filteredItem: any = {};
      this.config.campos.forEach((campo) => {
        if (item.hasOwnProperty(campo)) {
          filteredItem[campo] = this.formatValue(campo, item[campo]);
        }
      });
      return filteredItem;
    });
  }

  protected getColumnHeaders(): string[] {
    return this.config.campos.map(
      (campo) => campo.charAt(0).toUpperCase() + campo.slice(1)
    );
  }

  async exportToPDF(data: ExportData): Promise<void> {
    try {
      console.log("Iniciando exportação PDF...", {
        tipo: this.config.titulo,
        dados: data.dados.length,
      });

      const doc = new jsPDF("landscape");
      const dataAtual = new Date().toLocaleDateString("pt-BR");

      // Título do relatório
      doc.setFontSize(20);
      doc.text(`Relatório de ${this.config.titulo}`, 20, 20);

      doc.setFontSize(12);
      doc.text(`Período: ${data.periodo}`, 20, 30);
      doc.text(`Data: ${dataAtual}`, 20, 40);

      // Resumo estatístico
      if (data.dadosProcessados.length > 0) {
        doc.setFontSize(16);
        doc.text("Resumo Estatístico", 20, 60);

        const total = data.dadosProcessados.reduce(
          (sum, d) => sum + d.value,
          0
        );
        const resumoData = data.dadosProcessados.map((item) => [
          item.name,
          item.value.toString(),
          total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
        ]);

        autoTable(doc, {
          head: [["Status", "Quantidade", "Percentual"]],
          body: resumoData,
          startY: 70,
          theme: "grid",
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
          },
        });
      }

      // Dados detalhados
      if (data.dados.length > 0) {
        doc.setFontSize(16);
        doc.text("Dados Detalhados", 20, 140);

        const dadosFiltrados = this.getFilteredData(data.dados);
        const colunas = this.getColumnHeaders();

        const dadosTabela = dadosFiltrados
          .slice(0, 50)
          .map((item) => this.config.campos.map((campo) => item[campo] || ""));

        autoTable(doc, {
          head: [colunas],
          body: dadosTabela,
          startY: 150,
          theme: "grid",
          styles: { fontSize: 8 },
          columnStyles: {
            ...Object.fromEntries(
              this.config.campos.map((_, index) => [index, { cellWidth: 30 }])
            ),
          },
        });
      }

      // Salvar PDF
      const fileName = `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${dataAtual.replace(/\//g, "-")}.pdf`;
      doc.save(fileName);

      console.log(`PDF gerado com sucesso: ${fileName}`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    }
  }

  async exportToExcel(data: ExportData): Promise<void> {
    try {
      console.log("Iniciando exportação Excel...", {
        tipo: this.config.titulo,
        dados: data.dados.length,
      });

      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const wb = XLSX.utils.book_new();

      // Planilha 1: Resumo estatístico
      if (data.dadosProcessados.length > 0) {
        const total = data.dadosProcessados.reduce(
          (sum, d) => sum + d.value,
          0
        );
        const resumoData = [
          ["Status", "Quantidade", "Percentual"],
          ...data.dadosProcessados.map((item) => [
            item.name,
            item.value,
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
          ]),
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        wsResumo["!cols"] = [{ width: 20 }, { width: 15 }, { width: 15 }];

        XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
      }

      // Planilha 2: Dados detalhados
      if (data.dados.length > 0) {
        const dadosFiltrados = this.getFilteredData(data.dados);
        const colunas = this.getColumnHeaders();

        const dadosDetalhados = [
          colunas,
          ...dadosFiltrados.map((item) =>
            this.config.campos.map((campo) => item[campo] || "")
          ),
        ];

        const wsDetalhado = XLSX.utils.aoa_to_sheet(dadosDetalhados);
        wsDetalhado["!cols"] = this.config.campos.map(() => ({ width: 15 }));

        XLSX.utils.book_append_sheet(wb, wsDetalhado, "Dados Detalhados");
      }

      // Salvar arquivo
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        bookSST: false,
        compression: true,
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${dataAtual.replace(/\//g, "-")}.xlsx`;
      saveAs(blob, fileName);

      console.log(`Excel gerado com sucesso: ${fileName}`);
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      throw error;
    }
  }

  async exportRelatorio(
    formato: "pdf" | "csv",
    data: ExportData
  ): Promise<void> {
    try {
      console.log(
        `Exportando relatório: ${this.config.titulo} em formato ${formato}`
      );

      if (formato === "pdf") {
        await this.exportToPDF(data);
      } else {
        await this.exportToExcel(data);
      }

      console.log("Exportação concluída com sucesso!");
    } catch (error) {
      console.error(`Erro ao exportar relatório ${this.config.titulo}:`, error);
      throw error;
    }
  }
}
