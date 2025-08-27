import { BaseExportService, type ExportConfig } from "./BaseExportService";
import { formatCPF, formatCelular, formatMoeda } from "../../../utils/masks";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export class FuncionariosExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Funcionários",
    campos: [
      "nome",
      "cpf",
      "cnh",
      "cnhVencimento",
      "cnhCategoria",
      "celular",
      "email",
      "endereco",
      "cep",
      "cidade",
      "funcao",
      "status",
      "tipoContrato",
      "unidadeNegocio",
      "dataAdmissao",
      "salario",
      "toxicoUltimoExame",
      "toxicoVencimento",
      "ativo",
      "observacao",
    ],
    formatacao: {
      nome: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      cpf: (valor) => (valor ? formatCPF(valor) : "N/A"),
      cnh: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      celular: (valor) => (valor ? formatCelular(valor) : "N/A"),
      email: (valor) => (valor ? valor.toLowerCase() : "N/A"),
      endereco: (valor) => (valor ? valor : "N/A"),
      cep: (valor) => (valor ? valor : "N/A"),
      cidade: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      salario: (valor) => {
        if (!valor) return "N/A";
        return formatMoeda(valor);
      },
      cnhVencimento: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      toxicoUltimoExame: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      toxicoVencimento: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      dataAdmissao: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      status: (valor) => {
        if (!valor) return "N/A";
        const statusMap: Record<string, string> = {
          trabalhando: "Trabalhando",
          disponivel: "Disponível",
          folga: "Folga",
          ferias: "Férias",
        };
        return statusMap[valor] || valor;
      },
      tipoContrato: (valor) => {
        if (!valor) return "N/A";
        const contratoMap: Record<string, string> = {
          integral: "Integral",
          temporario: "Temporário",
          folguista: "Folguista",
          inativo: "Inativo",
        };
        return contratoMap[valor] || valor;
      },
      unidadeNegocio: (valor) => {
        if (!valor) return "N/A";
        const unidadeMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          ovos: "Ovos",
          ambos: "Ambos",
        };
        return unidadeMap[valor] || valor;
      },
      funcao: (valor) => {
        if (!valor) return "N/A";
        const funcaoMap: Record<string, string> = {
          motorista: "Motorista",
          ajudante: "Ajudante",
          outro: "Outro",
        };
        return funcaoMap[valor] || valor;
      },
      ativo: (valor) => {
        return valor ? "Ativo" : "Inativo";
      },
      observacao: (valor) => {
        if (!valor) return "N/A";
        return valor;
      },
    },
    ordenacao: ["nome", "status", "cidade"],
  };

  protected getFilteredData(dados: any[]): any[] {
    return dados.map((item) => {
      const filteredItem: any = {};
      this.config.campos.forEach((campo) => {
        if (item.hasOwnProperty(campo)) {
          filteredItem[campo] = this.formatValue(campo, item[campo]);
        } else {
          filteredItem[campo] = "N/A";
        }
      });
      return filteredItem;
    });
  }

  protected getColumnHeaders(): string[] {
    const headerMap: Record<string, string> = {
      nome: "Nome",
      cpf: "CPF",
      cnh: "CNH",
      cnhVencimento: "Vencimento CNH",
      cnhCategoria: "Categoria CNH",
      celular: "Celular",
      email: "E-mail",
      endereco: "Endereço",
      cep: "CEP",
      cidade: "Cidade",
      funcao: "Função",
      status: "Status",
      tipoContrato: "Tipo de Contrato",
      unidadeNegocio: "Unidade de Negócio",
      dataAdmissao: "Data de Admissão",
      salario: "Salário",
      toxicoUltimoExame: "Último Exame Toxicológico",
      toxicoVencimento: "Vencimento Toxicológico",
      ativo: "Ativo",
      observacao: "Observação",
    };

    return this.config.campos.map((campo) => headerMap[campo] || campo);
  }

  // Método para ajustar os cabeçalhos da tabela de resumo
  protected getResumoHeaders(): string[] {
    return ["Status", "Quantidade", "Percentual"];
  }

  // Método para obter configurações de largura de coluna específicas para funcionários
  protected getColumnWidths(): Record<number, { cellWidth: number }> {
    return {
      0: { cellWidth: 35 }, // Nome
      1: { cellWidth: 25 }, // CPF
      2: { cellWidth: 20 }, // CNH
      3: { cellWidth: 25 }, // Vencimento CNH
      4: { cellWidth: 20 }, // Categoria CNH
      5: { cellWidth: 25 }, // Celular
      6: { cellWidth: 30 }, // E-mail
      7: { cellWidth: 40 }, // Endereço
      8: { cellWidth: 15 }, // CEP
      9: { cellWidth: 25 }, // Cidade
      10: { cellWidth: 20 }, // Função
      11: { cellWidth: 20 }, // Status
      12: { cellWidth: 25 }, // Tipo de Contrato
      13: { cellWidth: 25 }, // Unidade de Negócio
      14: { cellWidth: 25 }, // Data de Admissão
      15: { cellWidth: 20 }, // Salário
      16: { cellWidth: 30 }, // Último Exame Toxicológico
      17: { cellWidth: 30 }, // Vencimento Toxicológico
      18: { cellWidth: 15 }, // Ativo
      19: { cellWidth: 30 }, // Observação
    };
  }

  // Sobrescrever o método exportToPDF para usar as larguras específicas
  async exportToPDF(data: any, userInfo?: any): Promise<void> {
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
          (sum: number, d: any) => sum + d.value,
          0,
        );

        // Grid dinâmico baseado no número de status
        const totalCards = data.dadosProcessados.length + 1; // +1 para o card TOTAL
        const availableWidth = doc.internal.pageSize.getWidth() - margin * 2;
        const cardWidth = Math.min(
          40,
          (availableWidth - (totalCards - 1) * 6) / totalCards,
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

        // Cards para cada status
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
            yPosition + 8,
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

      // Planilha 2: Resumo
      if (data.dadosProcessados.length > 0) {
        const resumoSheet = workbook.addWorksheet("Resumo");
        const total = data.dadosProcessados.reduce(
          (sum: number, d: any) => sum + d.value,
          0,
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
        `relatorio_${this.config.titulo?.toLowerCase()}_${data.periodo}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      throw new Error("Erro ao exportar dados para Excel");
    }
  }
}
