import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { saveAs } from "file-saver";
import type { RelatorioData } from "../types";
import ExcelJS from "exceljs";

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

export interface UserInfo {
  displayName: string | null;
  email: string | null;
  cargo?: string;
}

export abstract class BaseExportService {
  protected abstract config: ExportConfig;

  // Cores minimalistas (preto e branco)
  protected readonly CORPORATE_COLORS = {
    primary: [0, 0, 0] as [number, number, number], // Preto
    secondary: [107, 114, 128] as [number, number, number], // Cinza
    accent: [0, 0, 0] as [number, number, number], // Preto
    warning: [0, 0, 0] as [number, number, number], // Preto
    danger: [0, 0, 0] as [number, number, number], // Preto
    light: [249, 250, 251] as [number, number, number], // Cinza claro
    dark: [0, 0, 0] as [number, number, number], // Preto
  };

  // Configurações de fonte
  protected readonly FONT_CONFIG = {
    title: { size: 20, style: "bold" },
    subtitle: { size: 14, style: "bold" },
    header: { size: 12, style: "bold" },
    body: { size: 10, style: "normal" },
    small: { size: 8, style: "normal" },
  };

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
    // Formatação para strings de data no formato YYYY-MM-DD
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
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

  protected getColumnWidths(): Record<number, { cellWidth: number }> {
    return Object.fromEntries(
      this.config.campos.map((campo, index) => {
        // Largura específica para o nome do funcionário
        if (campo === "funcionarioNome") {
          return [index, { cellWidth: 80 }];
        }
        // Largura padrão para outros campos
        return [index, { cellWidth: 25 }];
      })
    );
  }

  protected getResumoHeaders(): string[] {
    return ["Status", "Quantidade", "Percentual"];
  }

  protected formatPeriodo(periodo: string): string {
    const periodosMap: Record<string, string> = {
      semana: "Semana",
      mes: "Mês",
      trimestre: "Trimestre",
      ano: "Ano",
      folgas: "Folgas",
      funcionarios: "Funcionários",
      veiculos: "Veículos",
      rotas: "Rotas",
      vendedores: "Vendedores",
      cidades: "Cidades",
    };
    return (
      periodosMap[periodo] || periodo.charAt(0).toUpperCase() + periodo.slice(1)
    );
  }

  protected getCurrentDateTime(): string {
    const now = new Date();
    return now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  protected drawCorporateHeader(doc: jsPDF, userInfo?: UserInfo): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = 10;

    // Título do relatório (esquerda)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Relatório de ${this.config.titulo}`, margin, yPosition);

    // Sistema e período (esquerda)
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema de Gestão de Logística", margin, yPosition + 7.5);
    doc.text(
      `Período de Referência: ${this.formatPeriodo(this.config.titulo?.toLowerCase() || "")}`,
      margin,
      yPosition + 4
    );

    // Informações do usuário (direita)
    if (userInfo?.displayName) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      const userText = `Gerado por: ${userInfo.displayName}`;
      const userWidth = doc.getTextWidth(userText);
      doc.text(userText, pageWidth - margin - userWidth, yPosition + 2);

      if (userInfo.cargo) {
        const cargoText = `Cargo: ${userInfo.cargo}`;
        const cargoWidth = doc.getTextWidth(cargoText);
        doc.text(cargoText, pageWidth - margin - cargoWidth, yPosition + 5);
      }
    }

    // Data e hora (direita)
    const dateTimeText = `Data: ${this.getCurrentDateTime()}`;
    const dateTimeWidth = doc.getTextWidth(dateTimeText);
    doc.text(dateTimeText, pageWidth - margin - dateTimeWidth, yPosition + 8);

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);

    return yPosition + 15;
  }

  protected drawReportTitle(doc: jsPDF, yPosition: number): number {
    // Não precisamos mais deste método pois o título já está no cabeçalho
    return yPosition;
  }

  protected drawFooter(doc: jsPDF): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

    // Informações do rodapé
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    const footerText = "Sistema de Gestão de Logística.";
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);

    // Número da página
    const pageText = `Página ${doc.getCurrentPageInfo().pageNumber} de ${doc.getCurrentPageInfo().pageNumber}`;
    doc.text(
      pageText,
      (pageWidth - doc.getTextWidth(pageText)) / 2,
      pageHeight - 15
    );
  }

  async exportToPDF(data: ExportData, userInfo?: UserInfo): Promise<void> {
    try {
      const doc = new jsPDF("landscape");
      const margin = 10;

      // Cabeçalho minimalista
      let yPosition = this.drawCorporateHeader(doc, userInfo);

      // Resumo estatístico
      if (data.dadosProcessados.length > 0) {
        yPosition += 5;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Resumo Estatístico", margin, yPosition);

        yPosition += 4;

        const total = data.dadosProcessados.reduce(
          (sum, d) => sum + d.value,
          0
        );

        // Grid dinâmico baseado no número de status
        const totalCards = data.dadosProcessados.length + 1; // +1 para o card TOTAL
        const availableWidth = doc.internal.pageSize.getWidth() - margin * 2;
        const cardWidth = Math.min(
          40, // Reduzido de 50 para 40 para caber mais cards
          (availableWidth - (totalCards - 1) * 6) / totalCards // Reduzido spacing de 8 para 6
        );
        const cardSpacing = 6; // Reduzido de 8 para 6
        let cardX = margin;

        // Card Total
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("TOTAL", cardX, yPosition);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(total.toString(), cardX, yPosition + 8);
        cardX += cardWidth + cardSpacing;

        // Cards para cada status
        data.dadosProcessados.forEach((item) => {
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.text(item.name.toUpperCase(), cardX, yPosition);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const percentText =
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%";
          doc.text(`${item.value} `, cardX, yPosition + 8);

          // Percentual em texto menor
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text(
            `(${percentText})`,
            cardX + doc.getTextWidth(`${item.value} `) + 3,
            yPosition + 8
          );
          doc.setTextColor(0, 0, 0);

          cardX += cardWidth + cardSpacing;
        });

        yPosition += 10;
      }

      // Dados detalhados
      if (data.dados.length > 0) {
        yPosition += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Dados Detalhados", margin, yPosition);

        yPosition += 5;

        const dadosFiltrados = this.getFilteredData(data.dados);
        const colunas = this.getColumnHeaders();

        const dadosTabela = dadosFiltrados.map((item) =>
          this.config.campos.map((campo) => item[campo] || "")
        );

        autoTable(doc, {
          head: [colunas],
          body: dadosTabela,
          startY: yPosition,
          theme: "plain",
          styles: {
            fontSize: 7,
            cellPadding: 2,
            textColor: [0, 0, 0],
          },
          headStyles: {
            textColor: [107, 114, 128],
            fontStyle: "bold",
            fontSize: 6,
            lineColor: [209, 213, 219],
            lineWidth: 0.5,
          },
          bodyStyles: {
            textColor: [0, 0, 0],
            fontSize: 7,
            lineColor: [229, 231, 235],
            lineWidth: 0.5,
          },
          columnStyles: this.getColumnWidths(),
          margin: { left: margin, right: margin },
        });
      }

      // Rodapé
      this.drawFooter(doc);

      // Salvar PDF
      const fileName = `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    }
  }

  async exportToExcel(data: ExportData, userInfo?: UserInfo): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();

      // Planilha 1: Cabeçalho
      const headerSheet = workbook.addWorksheet("Cabeçalho");
      const headerData = [
        [`Relatório de ${this.config.titulo}`],
        ["Sistema de Gestão de Logística"],
        [`Período de Referência: ${this.formatPeriodo(data.periodo)}`],
        [""],
        [`Gerado por: ${userInfo?.displayName || "Sistema"}`],
        [`Cargo: ${userInfo?.cargo || "N/A"}`],
        [`Data: ${this.getCurrentDateTime()}`],
        [""],
      ];

      headerData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellObj = headerSheet.getCell(rowIndex + 1, colIndex + 1);
          cellObj.value = cell;
          if (rowIndex === 0) {
            cellObj.font = { bold: true, size: 12 };
          } else if (rowIndex < 3) {
            cellObj.font = { size: 10 };
          } else {
            cellObj.font = { size: 9 };
          }
        });
      });

      // Planilha 2: Resumo
      if (data.dadosProcessados.length > 0) {
        const resumoSheet = workbook.addWorksheet("Resumo");
        const total = data.dadosProcessados.reduce(
          (sum, d) => sum + d.value,
          0
        );

        resumoSheet.getCell(1, 1).value = "RESUMO ESTATÍSTICO";
        resumoSheet.getCell(1, 1).font = { bold: true, size: 12 };

        resumoSheet.getCell(3, 1).value = "Status";
        resumoSheet.getCell(3, 2).value = "Quantidade";
        resumoSheet.getCell(3, 3).value = "Percentual";

        [
          resumoSheet.getCell(3, 1),
          resumoSheet.getCell(3, 2),
          resumoSheet.getCell(3, 3),
        ].forEach((cell) => {
          cell.font = { bold: true, size: 10 };
        });

        data.dadosProcessados.forEach((item, index) => {
          const row = index + 4;
          resumoSheet.getCell(row, 1).value = item.name;
          resumoSheet.getCell(row, 2).value = item.value;
          resumoSheet.getCell(row, 3).value =
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%";
        });
      }

      // Planilha 3: Dados detalhados
      if (data.dados.length > 0) {
        const detalhadoSheet = workbook.addWorksheet("Dados Detalhados");
        const dadosFiltrados = this.getFilteredData(data.dados);
        const colunas = this.getColumnHeaders();

        detalhadoSheet.getCell(1, 1).value = "DADOS DETALHADOS";
        detalhadoSheet.getCell(1, 1).font = { bold: true, size: 12 };

        // Cabeçalhos
        colunas.forEach((coluna, index) => {
          const cell = detalhadoSheet.getCell(3, index + 1);
          cell.value = coluna;
          cell.font = { bold: true, size: 10 };
        });

        // Dados
        dadosFiltrados.forEach((item, rowIndex) => {
          this.config.campos.forEach((campo, colIndex) => {
            detalhadoSheet.getCell(rowIndex + 4, colIndex + 1).value =
              item[campo] || "";
          });
        });
      }

      // Gerar arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        blob,
        `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      throw new Error("Erro ao exportar dados para Excel");
    }
  }

  async exportRelatorio(
    formato: "pdf" | "csv",
    data: ExportData,
    userInfo?: UserInfo
  ): Promise<void> {
    try {
      if (formato === "pdf") {
        await this.exportToPDF(data, userInfo);
      } else {
        await this.exportToExcel(data, userInfo);
      }
    } catch (error) {
      console.error(`Erro ao exportar relatório ${this.config.titulo}:`, error);
      throw error;
    }
  }
}
