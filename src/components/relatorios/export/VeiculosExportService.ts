import { BaseExportService, type ExportConfig } from "./BaseExportService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export class VeiculosExportService extends BaseExportService {
  protected config: ExportConfig = {
    titulo: "Veículos",
    campos: [
      "placa",
      "marca",
      "modelo",
      "ano",
      "capacidade",
      "tipoCarroceria",
      "quantidadeEixos",
      "tipoBau",
      "status",
      "unidadeNegocio",
      "ultimaManutencao",
      "proximaManutencao",
      "motorista",
      "observacao",
    ],
    formatacao: {
      placa: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      marca: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      modelo: (valor) => (valor ? valor.toUpperCase() : "N/A"),
      ano: (valor) => (valor ? valor : "N/A"),
      capacidade: (valor) => {
        if (!valor) return "N/A";
        return `${valor} kg`;
      },
      tipoCarroceria: (valor) => {
        if (!valor) return "N/A";
        const tipoMap: Record<string, string> = {
          truck: "Truck",
          toco: "Toco",
          bitruck: "Bitruck",
          carreta: "Carreta",
          carreta_ls: "Carreta LS",
          carreta_3_eixos: "Carreta 3 Eixos",
          truck_3_eixos: "Truck 3 Eixos",
          truck_4_eixos: "Truck 4 Eixos",
        };
        return tipoMap[valor] || valor;
      },
      quantidadeEixos: (valor) => {
        if (!valor) return "N/A";
        const num = parseInt(valor);
        return `${valor} eixo${num !== 1 ? "s" : ""}`;
      },
      tipoBau: (valor) => {
        if (!valor) return "N/A";
        const tipoMap: Record<string, string> = {
          frigorifico: "Frigorífico",
          carga_seca: "Carga Seca",
          baucher: "Baucher",
          graneleiro: "Graneleiro",
          tanque: "Tanque",
          caçamba: "Caçamba",
          plataforma: "Plataforma",
        };
        return tipoMap[valor] || valor;
      },
      status: (valor) => {
        if (!valor) return "N/A";
        const statusMap: Record<string, string> = {
          disponivel: "Disponível",
          em_uso: "Em Uso",
          manutencao: "Manutenção",
          inativo: "Inativo",
          acidentado: "Acidentado",
        };
        return statusMap[valor] || valor;
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
      ultimaManutencao: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      proximaManutencao: (valor) => {
        if (!valor) return "N/A";
        if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
          const [year, month, day] = valor.split("-");
          return `${day}/${month}/${year}`;
        }
        if (valor.toDate) return valor.toDate().toLocaleDateString("pt-BR");
        return valor;
      },
      motorista: (valor) => {
        if (!valor) return "Não atribuído";
        return valor;
      },
      observacao: (valor) => {
        if (!valor) return "N/A";
        return valor;
      },
    },
    ordenacao: ["placa", "status", "marca"],
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
      placa: "Placa",
      marca: "Marca",
      modelo: "Modelo",
      ano: "Ano",
      capacidade: "Capacidade",
      tipoCarroceria: "Carroceria",
      quantidadeEixos: "Quantidade de Eixos",
      tipoBau: "Tipo de Baú",
      status: "Status",
      unidadeNegocio: "Unidade de Negócio",
      ultimaManutencao: "Última Manutenção",
      proximaManutencao: "Próxima Manutenção",
      motorista: "Motorista",
      observacao: "Observação",
    };

    return this.config.campos.map((campo) => headerMap[campo] || campo);
  }

  // Método para ajustar os cabeçalhos da tabela de resumo
  protected getResumoHeaders(): string[] {
    return ["Status", "Quantidade", "Percentual"];
  }

  // Método para obter configurações de largura de coluna específicas para veículos
  protected getColumnWidths(): Record<number, { cellWidth: number }> {
    return {
      0: { cellWidth: 20 }, // Placa
      1: { cellWidth: 10 }, // Marca
      2: { cellWidth: 15 }, // Modelo
      3: { cellWidth: 15 }, // Ano
      4: { cellWidth: 18 }, // Capacidade
      5: { cellWidth: 20 }, // Tipo de Carroceria
      6: { cellWidth: 25 }, // Quantidade de Eixos
      7: { cellWidth: 20 }, // Tipo de Baú
      8: { cellWidth: 20 }, // Status
      9: { cellWidth: 25 }, // Unidade de Negócio
      10: { cellWidth: 25 }, // Última Manutenção
      11: { cellWidth: 25 }, // Próxima Manutenção
      12: { cellWidth: 20 }, // Motorista
      13: { cellWidth: 20 }, // Observação
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
      if (data.dadosProcessados.length > 0) {
        const total = data.dadosProcessados.reduce(
          (sum: number, d: any) => sum + d.value,
          0,
        );
        const resumoData = [
          ["RESUMO ESTATÍSTICO"],
          [""],
          ["Status", "Quantidade", "Percentual"],
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
        const dadosFiltrados = this.getFilteredData(data.dados);
        const colunas = this.getColumnHeaders();

        const dadosDetalhados = [
          ["DADOS DETALHADOS"],
          [""],
          colunas,
          ...dadosFiltrados.map((item) =>
            this.config.campos.map((campo) => item[campo] || ""),
          ),
        ];

        const wsDetalhado = XLSX.utils.aoa_to_sheet(dadosDetalhados);

        // Configurar larguras específicas para veículos
        wsDetalhado["!cols"] = [
          { width: 12 }, // Placa
          { width: 10 }, // Marca
          { width: 12 }, // Modelo
          { width: 8 }, // Ano
          { width: 12 }, // Capacidade
          { width: 18 }, // Tipo de Carroceria
          { width: 15 }, // Quantidade de Eixos
          { width: 12 }, // Tipo de Baú
          { width: 12 }, // Status
          { width: 15 }, // Unidade de Negócio
          { width: 15 }, // Última Manutenção
          { width: 15 }, // Próxima Manutenção
          { width: 18 }, // Motorista
          { width: 20 }, // Observação
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
