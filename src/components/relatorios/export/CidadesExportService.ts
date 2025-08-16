import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
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
      0: { cellWidth: 35 }, // Nome
      1: { cellWidth: 15 }, // Estado
      2: { cellWidth: 20 }, // Região
      3: { cellWidth: 20 }, // Distância
      4: { cellWidth: 20 }, // Peso Mínimo
      5: { cellWidth: 30 }, // Rota
      6: { cellWidth: 30 }, // Observação
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
        const totalCards = data.dadosProcessados.length + 1;
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
            cardX + doc.getTextWidth(`${item.value} `),
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

        const dadosTabela = dadosFiltrados
          .slice(0, 50)
          .map((item) => this.config.campos.map((campo) => item[campo] || ""));

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
      const wb = XLSX.utils.book_new();

      // Planilha 1: Cabeçalho minimalista
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

      const wsHeader = XLSX.utils.aoa_to_sheet(headerData);
      wsHeader["!cols"] = [{ width: 50 }];

      // Estilizar cabeçalho minimalista (preto e branco)
      if (wsHeader["A1"]) {
        wsHeader["A1"].s = {
          font: { bold: true, size: 12, color: { rgb: "000000" } },
        };
        wsHeader["A2"].s = {
          font: { size: 7, color: { rgb: "000000" } },
        };
        wsHeader["A3"].s = {
          font: { size: 7, color: { rgb: "000000" } },
        };
        wsHeader["A5"].s = {
          font: { size: 6, color: { rgb: "000000" } },
        };
        wsHeader["A6"].s = {
          font: { size: 6, color: { rgb: "000000" } },
        };
        wsHeader["A7"].s = {
          font: { size: 6, color: { rgb: "000000" } },
        };
      }

      XLSX.utils.book_append_sheet(wb, wsHeader, "Cabeçalho");

      // Planilha 2: Resumo estatístico
      if (data.dadosProcessados && data.dadosProcessados.length > 0) {
        const total = data.dadosProcessados.reduce(
          (sum: number, d: any) => sum + d.value,
          0
        );
        const resumoData = [
          ["RESUMO ESTATÍSTICO"],
          [""],
          ["Região", "Quantidade", "Percentual"],
          ...data.dadosProcessados.map((item: any) => [
            item.name,
            item.value,
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
          ]),
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        wsResumo["!cols"] = [{ width: 30 }, { width: 15 }, { width: 15 }];

        // Aplicar estilo minimalista ao cabeçalho
        if (wsResumo["A1"]) {
          wsResumo["A1"].s = {
            font: { bold: true, size: 9, color: { rgb: "000000" } },
          };
          wsResumo["A3"].s = {
            font: { bold: true, size: 6, color: { rgb: "000000" } },
          };
          wsResumo["B3"].s = {
            font: { bold: true, size: 6, color: { rgb: "000000" } },
          };
          wsResumo["C3"].s = {
            font: { bold: true, size: 6, color: { rgb: "000000" } },
          };
        }

        XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
      }

      // Planilha 3: Dados detalhados
      if (data.dados.length > 0) {
        const dadosFiltrados = await this.processDataWithRotas(data.dados);
        const colunas = this.getColumnHeaders();

        const dadosDetalhados = [
          ["DADOS DETALHADOS"],
          [""],
          colunas,
          ...dadosFiltrados.map((item) =>
            this.config.campos.map((campo) => item[campo] || "")
          ),
        ];

        const wsDetalhado = XLSX.utils.aoa_to_sheet(dadosDetalhados);

        // Configurar larguras específicas para cidades
        wsDetalhado["!cols"] = [
          { width: 20 }, // Nome
          { width: 10 }, // Estado
          { width: 15 }, // Região
          { width: 15 }, // Distância
          { width: 15 }, // Peso Mínimo
          { width: 25 }, // Rota
          { width: 25 }, // Observação
        ];

        // Aplicar estilo minimalista ao cabeçalho da planilha detalhada
        if (wsDetalhado["A1"]) {
          wsDetalhado["A1"].s = {
            font: { bold: true, size: 9, color: { rgb: "000000" } },
          };
        }

        // Estilizar cabeçalhos das colunas
        this.config.campos.forEach((_, index) => {
          const cellRef = XLSX.utils.encode_cell({ r: 2, c: index });
          if (wsDetalhado[cellRef]) {
            wsDetalhado[cellRef].s = {
              font: { bold: true, size: 6, color: { rgb: "000000" } },
            };
          }
        });

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

      const fileName = `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${new Date().toISOString().split("T")[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      throw error;
    }
  }
}
