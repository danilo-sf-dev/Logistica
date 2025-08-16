import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { ExportConfig } from "./BaseExportService";

export interface TableExportConfig extends ExportConfig {
  titulo: string;
  campos: string[];
  formatacao?: Record<string, (valor: any) => any | Promise<any>>;
}

export interface TableExportFilters {
  termoBusca?: string;
  filtroRegiao?: string;
  filtroStatus?: string;
  filtroContrato?: string;
  filtroFuncao?: string;
  filtroAtivo?: string;
  filtroUnidadeNegocio?: string;
  filtroCidade?: string;
  filtroTipo?: string;
  ordenarPor?: string;
  direcaoOrdenacao?: string;
  [key: string]: any;
}

export abstract class BaseTableExportService {
  protected abstract config: TableExportConfig;

  protected async formatValue(field: string, value: any): Promise<any> {
    if (this.config.formatacao?.[field]) {
      const result = this.config.formatacao[field](value);
      return result instanceof Promise ? await result : result;
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
    // Formatação para campos booleanos (ativo/inativo)
    if (field === "ativo" && typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }
    if (value === null || value === undefined) {
      return "";
    }
    return value.toString();
  }

  protected async getFilteredData(dados: any[]): Promise<any[]> {
    const filteredItems = [];

    for (const item of dados) {
      const filteredItem: any = {};
      for (const campo of this.config.campos) {
        if (item.hasOwnProperty(campo)) {
          filteredItem[campo] = await this.formatValue(campo, item[campo]);
        }
      }
      filteredItems.push(filteredItem);
    }

    return filteredItems;
  }

  protected getColumnHeaders(): string[] {
    const headerMap: Record<string, string> = {
      // Cidades
      estado: "Estado",
      regiao: "Região",
      distancia: "Distância",
      observacao: "Observação",
      dataCriacao: "Data Criação",

      // Vendedores
      cpf: "CPF",
      email: "E-mail",
      celular: "Celular",
      codigoVendSistema: "Código Sistema",
      unidadeNegocio: "Unidade Negócio",
      tipoContrato: "Tipo Contrato",
      cidadesAtendidas: "Cidades Atendidas",
      ativo: "Ativo",

      // Folgas
      funcionarioNome: "Funcionário",
      dataInicio: "Data Início",
      dataFim: "Data Fim",
      tipo: "Tipo",
      status: "Status",
      observacoes: "Observações",
      motivo: "Motivo",
      documento: "Documento",
      horas: "Horas",

      // Funcionários
      cnh: "CNH",
      cnhVencimento: "Vencimento CNH",
      cnhCategoria: "Categoria CNH",
      endereco: "Endereço",
      cep: "CEP",
      cidade: "Cidade",
      funcao: "Função",
      salario: "Salário",
      toxicoUltimoExame: "Último Exame Toxicológico",
      toxicoVencimento: "Vencimento Toxicológico",
      dataAdmissao: "Data Admissão",

      // Veículos
      quantidadeEixos: "Quantidade de Eixos",
      ultimaManutencao: "Última Manutenção",
      proximaManutencao: "Próxima Manutenção",
      motorista: "Motorista",

      // Rotas
      nome: "Nome da Rota",
      dataRota: "Data da Rota",
      diaSemana: "Dias da Semana",
      cidades: "Cidades Vinculadas",
      tempoEstimado: "Tempo Estimado",
    };

    return this.config.campos.map(
      (campo) =>
        headerMap[campo] || campo.charAt(0).toUpperCase() + campo.slice(1),
    );
  }

  protected generateFileName(filtros: TableExportFilters): string {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `${this.config.titulo.toLowerCase()}_${dataAtual}`;
    return `${nomeArquivo}.xlsx`;
  }

  protected generateFilterInfo(filtros: TableExportFilters): string[][] {
    const info: string[][] = [];

    // Cabeçalho das informações de filtro
    info.push(["INFORMAÇÕES DE FILTRO E ORDENAÇÃO"]);
    info.push([]);

    // Data e hora da exportação
    const dataHora = new Date().toLocaleString("pt-BR");
    info.push(["Data/Hora da Exportação:", dataHora]);
    info.push([]);

    // Filtros aplicados
    const filtrosAplicados: string[] = [];

    if (filtros.termoBusca) {
      filtrosAplicados.push(`Termo de busca: "${filtros.termoBusca}"`);
    }
    if (filtros.filtroRegiao && filtros.filtroRegiao !== "todos") {
      filtrosAplicados.push(`Região: ${filtros.filtroRegiao}`);
    }
    if (filtros.filtroStatus && filtros.filtroStatus !== "todos") {
      const statusMap: Record<string, string> = {
        disponivel: "Disponível",
        em_uso: "Em Uso",
        manutencao: "Manutenção",
        inativo: "Inativo",
        acidentado: "Acidentado",
      };
      const statusTraduzido =
        statusMap[filtros.filtroStatus] || filtros.filtroStatus;
      filtrosAplicados.push(`Status: ${statusTraduzido}`);
    }
    if (filtros.filtroContrato && filtros.filtroContrato !== "todos") {
      const contratoMap: Record<string, string> = {
        clt: "CLT",
        pj: "PJ",
        autonomo: "Autônomo",
        outro: "Outro",
      };
      const contratoTraduzido =
        contratoMap[filtros.filtroContrato] || filtros.filtroContrato;
      filtrosAplicados.push(`Tipo de Contrato: ${contratoTraduzido}`);
    }
    if (filtros.filtroFuncao && filtros.filtroFuncao !== "todos") {
      filtrosAplicados.push(`Função: ${filtros.filtroFuncao}`);
    }
    if (filtros.filtroAtivo && filtros.filtroAtivo !== "todos") {
      const ativoText = filtros.filtroAtivo === "true" ? "Sim" : "Não";
      filtrosAplicados.push(`Ativo: ${ativoText}`);
    }
    if (
      filtros.filtroUnidadeNegocio &&
      filtros.filtroUnidadeNegocio !== "todos"
    ) {
      const unidadesMap: Record<string, string> = {
        frigorifico: "Frigorífico",
        ovos: "Ovos",
        ambos: "Ambos",
      };
      const unidadeTraduzida =
        unidadesMap[filtros.filtroUnidadeNegocio] ||
        filtros.filtroUnidadeNegocio;
      filtrosAplicados.push(`Unidade de Negócio: ${unidadeTraduzida}`);
    }
    if (filtros.filtroCidade) {
      filtrosAplicados.push(`Cidade: ${filtros.filtroCidade}`);
    }
    if (filtros.filtroTipo && filtros.filtroTipo !== "todos") {
      const tipoMap: Record<string, string> = {
        folga: "Folga",
        ferias: "Férias",
        licenca: "Licença Médica",
        atestado: "Atestado Médico",
        banco_horas: "Banco de Horas",
        compensacao: "Compensação de Horas",
        suspensao: "Suspensão Disciplinar",
        afastamento: "Afastamento por Acidente",
        maternidade: "Licença Maternidade",
        paternidade: "Licença Paternidade",
        luto: "Licença por Luto",
        casamento: "Licença para Casamento",
        doacao_sangue: "Licença para Doação de Sangue",
        servico_militar: "Licença para Serviço Militar",
        capacitacao: "Licença para Capacitação",
        outros: "Outros",
      };
      const tipoTraduzido = tipoMap[filtros.filtroTipo] || filtros.filtroTipo;
      filtrosAplicados.push(`Tipo: ${tipoTraduzido}`);
    }
    if (filtros.filtroDiaSemana && filtros.filtroDiaSemana !== "todos") {
      const diasMap: Record<string, string> = {
        domingo: "Domingo",
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado",
      };
      const diaTraduzido =
        diasMap[filtros.filtroDiaSemana] || filtros.filtroDiaSemana;
      filtrosAplicados.push(`Dia da Semana: ${diaTraduzido}`);
    }
    if (
      filtros.filtroTipoCarroceria &&
      filtros.filtroTipoCarroceria !== "todos"
    ) {
      const tiposMap: Record<string, string> = {
        truck: "Truck",
        toco: "Toco",
        bitruck: "Bitruck",
        carreta: "Carreta",
        carreta_ls: "Carreta LS",
        carreta_3_eixos: "Carreta 3 Eixos",
        truck_3_eixos: "Truck 3 Eixos",
        truck_4_eixos: "Truck 4 Eixos",
      };
      const tipoTraduzido =
        tiposMap[filtros.filtroTipoCarroceria] || filtros.filtroTipoCarroceria;
      filtrosAplicados.push(`Tipo de Carroceria: ${tipoTraduzido}`);
    }
    if (filtros.filtroTipoBau && filtros.filtroTipoBau !== "todos") {
      const tiposMap: Record<string, string> = {
        frigorifico: "Frigorífico",
        carga_seca: "Carga Seca",
        baucher: "Baucher",
        graneleiro: "Graneleiro",
        tanque: "Tanque",
        caçamba: "Caçamba",
        plataforma: "Plataforma",
      };
      const tipoTraduzido =
        tiposMap[filtros.filtroTipoBau] || filtros.filtroTipoBau;
      filtrosAplicados.push(`Tipo de Baú: ${tipoTraduzido}`);
    }

    if (filtrosAplicados.length > 0) {
      info.push(["Filtros Aplicados:"]);
      filtrosAplicados.forEach((filtro) => {
        info.push([filtro]);
      });
      info.push([]);
    }

    // Ordenação
    if (filtros.ordenarPor) {
      const direcao =
        filtros.direcaoOrdenacao === "asc" ? "Crescente" : "Decrescente";
      info.push(["Ordenação:", `${filtros.ordenarPor} (${direcao})`]);
      info.push([]);
    }

    // Total de registros
    info.push(["Total de Registros:", "Será preenchido dinamicamente"]);
    info.push([]);

    return info;
  }

  public async exportToExcel(
    dados: any[],
    filtros: TableExportFilters,
  ): Promise<void> {
    try {
      // Gerar dados filtrados
      const dadosFiltrados = await this.getFilteredData(dados);

      // Gerar informações de filtro
      const filterInfo = this.generateFilterInfo(filtros);

      // Atualizar total de registros
      filterInfo[filterInfo.length - 2] = [
        "Total de Registros:",
        dadosFiltrados.length.toString(),
      ];

      // Criar workbook
      const workbook = XLSX.utils.book_new();

      // Preparar dados para a planilha
      const sheetData: any[][] = [];

      // Adicionar informações de filtro
      sheetData.push(...filterInfo);

      // Adicionar linha em branco
      sheetData.push([]);

      // Adicionar cabeçalhos da tabela
      sheetData.push(this.getColumnHeaders());

      // Adicionar dados
      dadosFiltrados.forEach((item) => {
        const row: any[] = [];
        this.config.campos.forEach((campo) => {
          row.push(item[campo] || "");
        });
        sheetData.push(row);
      });

      // Criar worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Configurar largura das colunas
      const colWidths = this.getColumnHeaders().map((header) => ({
        wch: Math.max(header.length, 15),
      }));
      worksheet["!cols"] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, this.config.titulo);

      // Gerar arquivo e fazer download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = this.generateFileName(filtros);
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      throw new Error("Erro ao exportar dados para Excel");
    }
  }
}
