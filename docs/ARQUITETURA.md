# Documentação Técnica - Sistema de Gestão de Logística (SGL)

## 📋 Visão Geral

O SGL é um sistema web completo desenvolvido em React com Firebase, projetado para gerenciar operações logísticas de empresas do setor de Frigorífico e Ovos. O sistema oferece uma interface moderna, responsiva e intuitiva para gestão de funcionários, veículos, rotas e folgas.

## 🏗️ Arquitetura

### Frontend

- **Framework**: React 18 com Hooks
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Context API + useState/useEffect
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast
- **Exportação**: XLSX, jsPDF, file-saver

### Backend (Firebase)

- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Firestore (NoSQL)
- **Hospedagem**: Firebase Hosting
- **Funções**: Cloud Functions (preparado)
- **Notificações**: Firebase Cloud Messaging
- **Storage**: Firebase Storage (preparado)

## 📁 Estrutura de Dados

### Coleções do Firestore

#### users

```javascript
{
  uid: "string",
  email: "string",
  displayName: "string",
  role: "admin" | "gerente" | "dispatcher" | "user",
  telefone: "string",
  cargo: "string",
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

#### funcionarios

```javascript
{
  nome: "string",
  cpf: "string",
  cnh: "string",
  telefone: "string",
  email: "string",
  endereco: "string",
  cidade: "string",
  status: "trabalhando" | "disponivel" | "folga" | "ferias",
  unidadeNegocio: "frigorifico" | "ovos",
  dataAdmissao: "string",
  salario: "number",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### veiculos

```javascript
{
  placa: "string",
  modelo: "string",
  marca: "string",
  ano: "number",
  capacidade: "number",
  status: "disponivel" | "em_uso" | "manutencao" | "inativo",
  unidadeNegocio: "frigorifico" | "ovos",
  ultimaManutencao: "string",
  proximaManutencao: "string",
  funcionario: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### rotas

```javascript
{
  origem: "string",
  destino: "string",
  funcionario: "string",
  veiculo: "string",
  dataPartida: "string",
  dataChegada: "string",
  status: "agendada" | "em_andamento" | "concluida" | "cancelada",
  unidadeNegocio: "frigorifico" | "ovos",
  observacoes: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### folgas

```javascript
{
  funcionario: "string",
  dataInicio: "string",
  dataFim: "string",
  tipo: "folga" | "ferias" | "outro",
  status: "pendente" | "aprovada" | "rejeitada",
  motivo: "string",
  observacoes: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### cidades

```javascript
{
  nome: "string",
  estado: "string",
  regiao: "string",
  distancia: "number",
  pesoMinimo: "number",
  rota: "string",
  observacao: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### vendedores

```javascript
{
  nome: "string",
  cpf: "string",
  codigoVendSistema: "string",
  email: "string",
  telefone: "string",
  estado: "string",
  regiao: "string",
  cidadesAtendidas: "string[]",
  unidadeNegocio: "frigorifico" | "ovos",
  tipoContrato: "string",
  ativo: "boolean",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

## 🆕 **Novas Funcionalidades Implementadas**

### 📊 **Sistema de Relatórios Avançado**

#### Arquitetura de Exportação

```
src/components/relatorios/export/
├── BaseExportService.ts           # Classe base para exportação
├── BaseTableExportService.ts      # Classe base para exportação de tabelas
├── FuncionariosExportService.ts   # Serviço específico para funcionários
├── VeiculosExportService.ts       # Serviço específico para veículos
├── RotasExportService.ts          # Serviço específico para rotas
├── FolgasExportService.ts         # Serviço específico para folgas
├── CidadesExportService.ts        # Serviço específico para cidades
├── VendedoresExportService.ts     # Serviço específico para vendedores
└── index.ts                       # Factory e exportações
```

#### Componentes de Interface

```
src/components/relatorios/ui/
├── ExportModal.tsx                # Modal para escolher formato
├── RelatoriosDetalhados.tsx       # Seção de relatórios detalhados
├── GraficoCard.tsx                # Componente de gráficos com exportação
└── ...
```

#### Serviços de Exportação

**BaseExportService**: Classe abstrata que define a estrutura base para exportação

```typescript
abstract class BaseExportService {
  protected abstract config: ExportConfig;

  async exportToPDF(
    titulo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string
  ): Promise<void>;
  async exportToCSV(
    titulo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string
  ): Promise<void>;
  protected formatValue(field: string, value: any): any;
  protected getFilteredData(dados: any[]): any[];
  protected getColumnHeaders(): string[];
}
```

**BaseTableExportService**: Classe base para exportação de dados tabulares

```typescript
abstract class BaseTableExportService {
  protected abstract config: TableExportConfig;

  async exportToExcel(
    dados: any[],
    filtros?: TableExportFilters
  ): Promise<void>;
  protected async formatValue(field: string, value: any): Promise<any>;
  protected async getFilteredData(dados: any[]): Promise<any[]>;
  protected getColumnHeaders(): string[];
  protected generateFileName(): string;
}
```

#### Factory Pattern

```typescript
export class ExportServiceFactory {
  static createService(tipo: string): BaseExportService {
    switch (tipo.toLowerCase()) {
      case "funcionarios":
      case "funcionarios_detalhado":
        return new FuncionariosExportService();
      case "veiculos":
      case "veiculos_detalhado":
        return new VeiculosExportService();
      // ... outros casos
    }
  }
}
```

### 🔧 **Melhorias Técnicas**

#### Formatação Brasileira

- **Datas**: Formato DD/MM/YYYY
- **CPF**: Formato 000.000.000-00
- **Telefone**: Formato (73) 99999-9999
- **Números**: Separador decimal vírgula

#### Layout Minimalista

- **Cores**: Preto e branco
- **Tipografia**: Fonte sans-serif
- **Espaçamento**: Consistente
- **Contraste**: Alto para melhor legibilidade

#### Nomenclatura de Arquivos

- **Padrão**: `entity_dd-MM-YYYY.xlsx`
- **Exemplos**:
  - `funcionarios_16-01-2025.xlsx`
  - `veiculos_16-01-2025.xlsx`
  - `rotas_16-01-2025.xlsx`

#### Tipos Separados

Cada pacote possui seu próprio arquivo de tipos:

```
src/components/
├── funcionarios/types.ts
├── veiculos/types.ts
├── rotas/types.ts
├── folgas/types.ts
├── cidades/types.ts
├── vendedores/types.ts
└── relatorios/types.ts
```

## 📁 **Estrutura de Componentes**

### Módulo de Relatórios

```
src/components/relatorios/
├── data/
│   └── relatoriosService.ts        # Serviços de dados
├── export/                         # 🆕 Sistema de exportação
│   ├── BaseExportService.ts
│   ├── BaseTableExportService.ts
│   ├── FuncionariosExportService.ts
│   ├── VeiculosExportService.ts
│   ├── RotasExportService.ts
│   ├── FolgasExportService.ts
│   ├── CidadesExportService.ts
│   ├── VendedoresExportService.ts
│   └── index.ts
├── state/
│   └── useRelatorios.ts            # Hook para gerenciar estado
├── ui/
│   ├── RelatorioHeader.tsx         # Cabeçalho dos relatórios
│   ├── ResumoCards.tsx             # Cards de resumo estatístico
│   ├── GraficoCard.tsx             # Componente de gráficos
│   ├── RelatoriosDetalhados.tsx    # 🆕 Relatórios detalhados
│   └── ExportModal.tsx             # 🆕 Modal de exportação
├── pages/
│   └── RelatoriosPage.tsx          # Página principal
├── types.ts                        # Definições de tipos
├── Relatorios.tsx                  # Componente principal
├── index.ts                        # Exportações do pacote
├── index.tsx                       # Ponto de entrada
└── README.md                       # Documentação
```

### Módulo Common

```
src/components/common/
├── modals/
│   ├── ConfirmationModal.tsx       # Modal de confirmação
│   ├── TableExportModal.tsx        # 🆕 Modal de exportação de tabelas
│   ├── ConfirmationModalConfig.ts
│   ├── ConfirmationModalTypes.ts
│   └── index.ts
├── ErrorBoundary/
├── ErrorPages/
└── index.ts
```

## 🔧 **Configurações Técnicas**

### Dependências Adicionadas

```json
{
  "dependencies": {
    "xlsx": "^0.18.5", // Exportação Excel
    "jspdf": "^3.0.1", // Geração de PDF
    "jspdf-autotable": "^5.0.2", // Tabelas em PDF
    "file-saver": "^2.0.5" // Download de arquivos
  }
}
```

### Configurações de Exportação

#### Excel (XLSX)

- **Formato**: XLSX (Excel 2007+)
- **Encoding**: UTF-8
- **Headers**: Personalizados por entidade
- **Formatação**: Datas brasileiras, números formatados
- **Estilo**: Layout minimalista (preto e branco)

#### PDF

- **Formato**: A4
- **Orientação**: Portrait
- **Margens**: 20mm
- **Fonte**: Arial, 10pt
- **Cores**: Preto e branco
- **Headers**: Título, subtítulo, data de geração

### Configurações de Formatação

#### Datas

```typescript
// Formatação brasileira
const formatDate = (date: Date | string): string => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("pt-BR");
  }
  return date.toString();
};
```

#### CPF

```typescript
const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};
```

#### Telefone

```typescript
const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
```

## 🚀 **Fluxo de Exportação**

### 1. Usuário Solicita Exportação

1. Usuário clica no botão de exportação
2. Modal de exportação é exibido
3. Usuário escolhe o formato (Excel ou PDF)
4. Sistema inicia o processo de exportação

### 2. Processamento dos Dados

1. Sistema busca os dados do Firestore
2. Aplica filtros se necessário
3. Formata os dados conforme configuração
4. Gera cabeçalhos e estrutura

### 3. Geração do Arquivo

#### Para Excel:

1. Cria workbook com XLSX
2. Adiciona worksheet com dados
3. Aplica formatação
4. Gera arquivo .xlsx

#### Para PDF:

1. Cria documento com jsPDF
2. Adiciona cabeçalho com título
3. Gera tabela com jsPDF-AutoTable
4. Adiciona rodapé com informações
5. Gera arquivo .pdf

### 4. Download

1. Sistema gera blob do arquivo
2. Usa file-saver para download
3. Arquivo é salvo automaticamente
4. Notificação de sucesso é exibida

## 📊 **Tipos de Relatórios**

### Relatórios de Status

- **Status dos Funcionários**: Distribuição por status
- **Status dos Veículos**: Distribuição por status
- **Status das Rotas**: Distribuição por status
- **Status das Folgas**: Distribuição por status

### Relatórios Detalhados

- **Funcionários Detalhado**: Lista completa com todos os dados
- **Veículos Detalhado**: Lista completa com dados técnicos
- **Rotas Detalhado**: Lista completa com informações de rota
- **Folgas Detalhado**: Lista completa com solicitações
- **Cidades Detalhado**: Lista completa com dados geográficos
- **Vendedores Detalhado**: Lista completa com dados comerciais

## 🔒 **Segurança e Validação**

### Validação de Dados

- **Campos obrigatórios**: Validação antes da exportação
- **Formato de dados**: Validação de tipos e formatos
- **Sanitização**: Remoção de caracteres especiais
- **Limites**: Controle de tamanho de arquivos

### Validação de Formulários

O sistema implementa um padrão consistente de validação em todas as entidades:

#### **Padrão de Validação**

- **Hook-based**: Validação centralizada no hook de cada entidade
- **Submit-only**: Validação apenas no momento do submit
- **Visual feedback**: Bordas vermelhas e mensagens específicas
- **Conditional**: Validação desabilitada para entidades inativas

#### **Entidades com Validação**

- **Cidades**: Unicidade nome+estado, normalização de acentos
- **Vendedores**: CPF único, email único, formato de dados
- **Funcionários**: CPF, CNH, celular, CEP obrigatórios
- **Veículos**: Ano, capacidade, eixos, formato de placa
- **Rotas**: Data futura, peso mínimo, dias da semana
- **Folgas**: Datas válidas, funcionário, horas específicas

#### **Feedback Visual**

- **Asteriscos pretos**: Campos obrigatórios
- **Bordas vermelhas**: Campos com erro
- **Mensagens específicas**: Erro detalhado por campo
- **Push de notificação**: Lista consolidada de erros

### Permissões

- **Controle de acesso**: Verificação de permissões por relatório
- **Auditoria**: Log de exportações realizadas
- **Rate limiting**: Controle de frequência de exportações

## 🎯 **Performance**

### Otimizações Implementadas

- **Lazy loading**: Carregamento sob demanda
- **Pagination**: Paginação de dados grandes
- **Caching**: Cache de dados frequentemente acessados
- **Compression**: Compressão de arquivos grandes

### Métricas de Performance

- **Tempo de geração**: < 5 segundos para arquivos pequenos
- **Tamanho de arquivo**: Otimizado para download rápido
- **Memória**: Uso eficiente de memória
- **CPU**: Processamento otimizado

## 🔄 **Manutenção e Evolução**

### Estrutura Modular

- **Serviços independentes**: Cada entidade tem seu serviço
- **Configuração centralizada**: Configurações em arquivos separados
- **Tipos TypeScript**: Tipagem forte para manutenibilidade
- **Documentação**: Comentários e documentação inline

### Extensibilidade

- **Novos formatos**: Fácil adição de novos formatos
- **Novas entidades**: Estrutura preparada para novas entidades
- **Customização**: Configurações personalizáveis
- **Plugins**: Arquitetura preparada para plugins

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.1.0  
**Status:** ✅ Sistema operacional com novas funcionalidades de exportação
