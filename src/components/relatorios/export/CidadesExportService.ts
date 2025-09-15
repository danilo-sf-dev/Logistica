import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export class CidadesExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Cidades",
    campos: [
      "nome",
      "estado",
      "regiao",
      "distancia",
      "pesoMinimo",
      "rota",
      "observacao",
    ],
    formatacao: {
      distancia: (valor) => {
        if (!valor) return "-";
        return `${valor} km`;
      },
      pesoMinimo: (valor) => {
        if (!valor) return "-";
        return `${valor} kg`;
      },
    },
    ordenacao: ["nome", "estado", "regiao"],
  };

  protected getFilteredData(dados: any[]): any[] {
    return dados.map((item) => {
      const filteredItem: any = {};

      this.config.campos.forEach((campo) => {
        if (campo === "rota") {
          // Campo especial para nome da rota - será processado nos métodos de exportação
          filteredItem[campo] = item.rotaId || "-";
        } else if (item.hasOwnProperty(campo)) {
          filteredItem[campo] = this.formatValue(campo, item[campo]);
        }
      });

      return filteredItem;
    });
  }

  protected getColumnHeaders(): string[] {
    return [
      "Nome",
      "Estado",
      "Região",
      "Distância",
      "Peso Mínimo",
      "Rota",
      "Observação",
    ];
  }

  // Método para obter configurações de largura de coluna específicas para cidades
  protected getColumnWidths(): Record<number, { cellWidth: number }> {
    return {
      0: { cellWidth: 50 }, // Nome
      1: { cellWidth: 15 }, // Estado
      2: { cellWidth: 30 }, // Região
      3: { cellWidth: 20 }, // Distância
      4: { cellWidth: 20 }, // Peso Mínimo
      5: { cellWidth: 30 }, // Rota
      6: { cellWidth: 70 }, // Observação
    };
  }

  // Método auxiliar para processar dados com nomes das rotas
  private async processDataWithRotas(dados: any[]): Promise<any[]> {
    // Buscar todas as rotas para resolver os IDs
    const rotasSnapshot = await getDocs(collection(db, "rotas"));
    const rotas = rotasSnapshot.docs.map((doc) => ({
      id: doc.id,
      nome: doc.data().nome,
    }));

    return dados.map((item) => {
      const processedItem: any = {};

      this.config.campos.forEach((campo) => {
        if (campo === "rota") {
          // Campo especial para nome da rota
          if (item.rotaId) {
            const rota = rotas.find((r) => r.id === item.rotaId);
            processedItem[campo] = rota ? rota.nome : "Rota não encontrada";
          } else {
            processedItem[campo] = "-";
          }
        } else if (item.hasOwnProperty(campo)) {
          processedItem[campo] = this.formatValue(campo, item[campo]);
        }
      });

      return processedItem;
    });
  }

  // Sobrescrever o método exportToPDF para usar as larguras específicas
  async exportToPDF(data: any, userInfo?: any): Promise<void> {
    try {
      const doc = new jsPDF("landscape");
      const margin = 10;

      // Cabeçalho minimalista
      let yPosition = this.drawCorporateHeader(doc, userInfo);

      // Resumo estatístico - usar dadosProcessados que já foram processados
      if (data.dadosProcessados && data.dadosProcessados.length > 0) {
        yPosition += 5;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Resumo Estatístico", margin, yPosition);

        yPosition += 4;

        const total = data.dadosProcessados.reduce(
          (sum: number, d: any) => sum + d.value,
          0
        );

        // Grid dinâmico baseado no número de regiões
        const totalCards = data.dadosProcessados.length + 1; // +1 para o card TOTAL
        const availableWidth = doc.internal.pageSize.getWidth() - margin * 2;
        const cardWidth = Math.min(
          40,
          (availableWidth - (totalCards - 1) * 6) / totalCards
        );
        const cardSpacing = 6;
        let cardX = margin;

        // Card Total
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("TOTAL", cardX, yPosition);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(total.toString(), cardX, yPosition + 8);
        cardX += cardWidth + cardSpacing;

        // Cards para cada região
        data.dadosProcessados.forEach((item: any) => {
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

        const dadosFiltrados = await this.processDataWithRotas(data.dados);
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

  // Sobrescrever o método exportToExcel para usar as larguras específicas
  async exportToExcel(data: any, userInfo?: any): Promise<void> {
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
      if (data.dadosProcessados && data.dadosProcessados.length > 0) {
        const resumoSheet = workbook.addWorksheet("Resumo");
        const total = data.dadosProcessados.reduce(
          (sum: number, d: any) => sum + d.value,
          0
        );

        resumoSheet.getCell(1, 1).value = "RESUMO ESTATÍSTICO";
        resumoSheet.getCell(1, 1).font = { bold: true, size: 12 };

        resumoSheet.getCell(3, 1).value = "Região";
        resumoSheet.getCell(3, 2).value = "Quantidade";
        resumoSheet.getCell(3, 3).value = "Percentual";

        [
          resumoSheet.getCell(3, 1),
          resumoSheet.getCell(3, 2),
          resumoSheet.getCell(3, 3),
        ].forEach((cell) => {
          cell.font = { bold: true, size: 10 };
        });

        data.dadosProcessados.forEach((item: any, index: number) => {
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
        const dadosFiltrados = await this.processDataWithRotas(data.dados);
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
}
