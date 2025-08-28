import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatCPF, formatCelular } from "../../../utils/masks";

export class VendedoresExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Vendedores",
    campos: [
      "nome",
      "cpf",
      "email",
      "celular",
      "regiao",
      "codigoVendSistema",
      "unidadeNegocio",
      "tipoContrato",
      "cidadesAtendidas",
      "ativo",
    ],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      cpf: (valor) => (valor ? formatCPF(valor) : "N/A"),
      celular: (valor) => (valor ? formatCelular(valor) : "N/A"),
      email: (valor) => (valor ? valor.toLowerCase() : "N/A"),
      regiao: (valor) => {
        if (!valor) return "N/A";
        const regiaoMap: Record<string, string> = {
          norte: "Norte",
          nordeste: "Nordeste",
          "centro-oeste": "Centro-Oeste",
          sudeste: "Sudeste",
          sul: "Sul",
        };
        return regiaoMap[valor] || valor;
      },
      codigoVendSistema: (valor) => (valor ? valor : "N/A"),
      unidadeNegocio: (valor) => {
        if (!valor) return "N/A";
        const unidadeMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          ovos: "Ovos",
          ambos: "Ambos",
        };
        return unidadeMap[valor] || valor;
      },
      tipoContrato: (valor) => {
        if (!valor) return "N/A";
        const contratoMap: Record<string, string> = {
          clt: "CLT",
          pj: "PJ",
          autonomo: "Autônomo",
          outro: "Outro",
        };
        return contratoMap[valor] || valor;
      },
      cidadesAtendidas: (valor) => {
        if (!valor) return "N/A";
        if (Array.isArray(valor)) {
          return valor.join(", ");
        }
        return valor;
      },
      ativo: (valor) => {
        return valor ? "Ativo" : "Inativo";
      },
    },
    ordenacao: ["nome", "regiao", "unidadeNegocio"],
  };

  protected getFilteredData(dados: any[]): any[] {
    return dados.map((item) => {
      const filteredItem: any = {};

      this.config.campos.forEach((campo) => {
        if (campo === "cidadesAtendidas") {
          // Campo especial para cidades atendidas - será processado nos métodos de exportação
          filteredItem[campo] = item.cidadesAtendidas || [];
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
      "CPF",
      "E-mail",
      "Celular",
      "Região",
      "Código",
      "Unidade de Negócio",
      "Tipo de Contrato",
      "Cidades Atendidas",
      "Ativo",
    ];
  }

  // Método para obter configurações de largura de coluna específicas para vendedores
  protected getColumnWidths(): Record<number, { cellWidth: number }> {
    return {
      0: { cellWidth: 40 }, // Nome
      1: { cellWidth: 25 }, // CPF
      2: { cellWidth: 40 }, // E-mail
      3: { cellWidth: 25 }, // Celular
      4: { cellWidth: 20 }, // Região
      5: { cellWidth: 15 }, // Código
      6: { cellWidth: 25 }, // Unidade de Negócio
      7: { cellWidth: 25 }, // Tipo de Contrato
      8: { cellWidth: 40 }, // Cidades Atendidas
      9: { cellWidth: 15 }, // Ativo
    };
  }

  // Método auxiliar para processar dados com nomes das cidades
  private async processDataWithCidades(dados: any[]): Promise<any[]> {
    // Buscar todas as cidades para resolver os IDs
    const cidadesSnapshot = await getDocs(collection(db, "cidades"));
    const cidades = cidadesSnapshot.docs.map((doc) => ({
      id: doc.id,
      nome: doc.data().nome,
    }));

    return dados.map((item) => {
      const processedItem: any = {};

      this.config.campos.forEach((campo) => {
        if (campo === "cidadesAtendidas") {
          // Campo especial para nomes das cidades
          if (item.cidadesAtendidas && Array.isArray(item.cidadesAtendidas)) {
            const nomesCidades = item.cidadesAtendidas.map(
              (cidadeId: string) => {
                const cidade = cidades.find((c) => c.id === cidadeId);
                return cidade ? cidade.nome : "Cidade não encontrada";
              },
            );
            processedItem[campo] = nomesCidades.join(", ");
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

        // Separar dados por categoria
        const dadosPorRegiao = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Região:"),
        );
        const dadosPorUnidade = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Unidade:"),
        );
        const dadosPorContrato = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Contrato:"),
        );

        // Função para renderizar uma linha de cards
        const renderizarLinhaCards = (
          titulo: string,
          dados: any[],
          yPos: number,
        ) => {
          // Título da seção
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(titulo, margin, yPos);
          yPos += 3;

          // Card TOTAL
          const totalCards = dados.length + 1;
          const availableWidth = doc.internal.pageSize.getWidth() - margin * 2;
          const cardWidth = Math.min(
            35,
            (availableWidth - (totalCards - 1) * 4) / totalCards,
          );
          const cardSpacing = 4;
          let cardX = margin;

          // Card Total para esta categoria
          const totalCategoria = dados.reduce(
            (sum: number, d: any) => sum + d.value,
            0,
          );
          doc.setFontSize(5);
          doc.setFont("helvetica", "normal");
          doc.text("TOTAL", cardX, yPos);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(totalCategoria.toString(), cardX, yPos + 6);
          cardX += cardWidth + cardSpacing;

          // Cards para cada item da categoria
          dados.forEach((item: any) => {
            doc.setFontSize(5);
            doc.setFont("helvetica", "normal");
            const nomeLimpo = item.name.replace(
              /^(Região|Unidade|Contrato):\s*/,
              "",
            );
            doc.text(nomeLimpo.toUpperCase(), cardX, yPos);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            const percentText =
              totalCategoria > 0
                ? `${((item.value / totalCategoria) * 100).toFixed(1)}%`
                : "0%";
            doc.text(`${item.value} `, cardX, yPos + 6);

            // Percentual em texto menor
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(107, 114, 128);
            doc.text(
              `(${percentText})`,
              cardX + doc.getTextWidth(`${item.value} `),
              yPos + 6,
            );
            doc.setTextColor(0, 0, 0);

            cardX += cardWidth + cardSpacing;
          });

          return yPos + 12; // Retorna a posição Y para a próxima linha
        };

        // Renderizar cada linha de categoria
        if (dadosPorRegiao.length > 0) {
          yPosition = renderizarLinhaCards(
            "Distribuição por Região:",
            dadosPorRegiao,
            yPosition,
          );
        }

        if (dadosPorUnidade.length > 0) {
          yPosition = renderizarLinhaCards(
            "Distribuição por Unidade de Negócio:",
            dadosPorUnidade,
            yPosition,
          );
        }

        if (dadosPorContrato.length > 0) {
          yPosition = renderizarLinhaCards(
            "Distribuição por Tipo de Contrato:",
            dadosPorContrato,
            yPosition,
          );
        }

        yPosition += 5;
      }

      // Dados detalhados
      if (data.dados.length > 0) {
        yPosition += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Dados Detalhados", margin, yPosition);

        yPosition += 5;

        const dadosFiltrados = await this.processDataWithCidades(data.dados);
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

      // Planilha 2: Resumos por categoria
      if (data.dadosProcessados.length > 0) {
        // Separar dados por categoria
        const dadosPorRegiao = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Região:"),
        );
        const dadosPorUnidade = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Unidade:"),
        );
        const dadosPorContrato = data.dadosProcessados.filter((item: any) =>
          item.name.startsWith("Contrato:"),
        );

        // Função para criar planilha de resumo
        const criarPlanilhaResumo = (titulo: string, dados: any[]) => {
          const sheet = workbook.addWorksheet(titulo);
          const totalCategoria = dados.reduce(
            (sum: number, item: any) => sum + item.value,
            0,
          );

          sheet.getCell(1, 1).value = titulo;
          sheet.getCell(1, 1).font = { bold: true, size: 12 };

          sheet.getCell(3, 1).value = "Categoria";
          sheet.getCell(3, 2).value = "Quantidade";
          sheet.getCell(3, 3).value = "Percentual";

          [
            sheet.getCell(3, 1),
            sheet.getCell(3, 2),
            sheet.getCell(3, 3),
          ].forEach((cell) => {
            cell.font = { bold: true, size: 10 };
          });

          dados.forEach((item: any, index: number) => {
            const row = index + 4;
            const nomeLimpo = item.name.replace(
              /^(Região|Unidade|Contrato):\s*/,
              "",
            );
            sheet.getCell(row, 1).value = nomeLimpo;
            sheet.getCell(row, 2).value = item.value;
            sheet.getCell(row, 3).value =
              totalCategoria > 0
                ? `${((item.value / totalCategoria) * 100).toFixed(1)}%`
                : "0%";
          });

          return { sheet };
        };

        if (dadosPorRegiao.length > 0) {
          criarPlanilhaResumo("Resumo por Região", dadosPorRegiao);
        }

        if (dadosPorUnidade.length > 0) {
          criarPlanilhaResumo("Resumo por Unidade", dadosPorUnidade);
        }

        if (dadosPorContrato.length > 0) {
          criarPlanilhaResumo("Resumo por Contrato", dadosPorContrato);
        }

        // Resumo Geral
        const total = data.dadosProcessados.reduce(
          (sum: number, item: any) => sum + item.value,
          0,
        );

        const resumoGeralSheet = workbook.addWorksheet("Resumo Geral");
        resumoGeralSheet.getCell(1, 1).value = "RESUMO GERAL";
        resumoGeralSheet.getCell(1, 1).font = { bold: true, size: 12 };

        resumoGeralSheet.getCell(3, 1).value = "Categoria";
        resumoGeralSheet.getCell(3, 2).value = "Quantidade";
        resumoGeralSheet.getCell(3, 3).value = "Percentual";

        [
          resumoGeralSheet.getCell(3, 1),
          resumoGeralSheet.getCell(3, 2),
          resumoGeralSheet.getCell(3, 3),
        ].forEach((cell) => {
          cell.font = { bold: true, size: 10 };
        });

        data.dadosProcessados.forEach((item: any, index: number) => {
          const row = index + 4;
          resumoGeralSheet.getCell(row, 1).value = item.name;
          resumoGeralSheet.getCell(row, 2).value = item.value;
          resumoGeralSheet.getCell(row, 3).value =
            total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%";
        });
      }

      // Planilha 3: Dados detalhados
      if (data.dados.length > 0) {
        const detalhadoSheet = workbook.addWorksheet("Dados Detalhados");
        const dadosFiltrados = await this.processDataWithCidades(data.dados);
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
        `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      throw new Error("Erro ao exportar dados para Excel");
    }
  }
}
