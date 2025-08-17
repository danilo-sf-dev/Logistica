# 🔌 API e Estrutura de Dados - SGL

## 📋 Visão Geral

Este documento descreve a estrutura de dados e APIs do Sistema de Gestão de Logística (SGL), baseado no Firebase Firestore.

## 🏗️ Arquitetura da API

### Firebase Services Utilizados

- **Firestore**: Banco de dados NoSQL
- **Authentication**: Autenticação de usuários
- **Hosting**: Hospedagem da aplicação
- **Cloud Messaging**: Notificações push
- **Storage**: Armazenamento de arquivos (preparado)

### Estrutura de Coleções

```
firestore/
├── users/              # Usuários do sistema
├── funcionarios/       # Funcionários (antigo motoristas)
├── veiculos/          # Veículos da frota
├── rotas/             # Rotas de entrega
├── folgas/            # Solicitações de folga
├── cidades/           # Cidades atendidas
├── vendedores/        # Vendedores
└── configuracoes/     # Configurações do sistema
```

## 📊 Estrutura de Dados

### 👥 Users Collection

```typescript
interface User {
  uid: string; // ID único do Firebase Auth
  email: string; // Email do usuário
  displayName: string | null; // Nome de exibição
  photoURL: string | null; // URL da foto de perfil
  role: "admin" | "gerente" | "dispatcher" | "user";
  telefone?: string; // Telefone do usuário
  cargo?: string; // Cargo/função
  createdAt: Timestamp; // Data de criação
  lastLogin: Timestamp; // Último login
  provider: string; // Provedor de autenticação
}
```

**Exemplo:**

```json
{
  "uid": "abc123def456",
  "email": "admin@empresa.com",
  "displayName": "João Silva",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "role": "admin",
  "telefone": "(73) 99999-9999",
  "cargo": "Gerente de Logística",
  "createdAt": "2025-01-15T10:30:00Z",
  "lastLogin": "2025-01-20T14:45:00Z",
  "provider": "google.com"
}
```

### 👨‍💼 Funcionarios Collection

```typescript
interface Funcionario {
  id: string; // ID único do documento
  nome: string; // Nome completo
  cpf: string; // CPF (formato: 000.000.000-00)
  cnh: string; // Número da CNH
  telefone: string; // Telefone (formato: (73) 99999-9999)
  email?: string; // Email (opcional)
  endereco: string; // Endereço completo
  cidade: string; // Cidade
  status: "trabalhando" | "disponivel" | "folga" | "ferias";
  funcao: "motorista" | "ajudante" | "outro";
  dataAdmissao?: string; // Data de admissão (YYYY-MM-DD)
  salario?: number; // Salário (opcional)
  unidadeNegocio?: "frigorifico" | "ovos" | "ambos";
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "func_001",
  "nome": "Maria Santos",
  "cpf": "123.456.789-00",
  "cnh": "12345678901",
  "telefone": "(73) 99999-9999",
  "email": "maria@empresa.com",
  "endereco": "Rua das Flores, 123, Centro",
  "cidade": "Ilhéus",
  "status": "disponivel",
  "funcao": "motorista",
  "dataAdmissao": "2024-01-15",
  "salario": 2500.0,
  "unidadeNegocio": "frigorifico",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🚛 Veiculos Collection

```typescript
interface Veiculo {
  id: string; // ID único do documento
  placa: string; // Placa do veículo
  modelo: string; // Modelo do veículo
  marca: string; // Marca do veículo
  ano: number; // Ano de fabricação
  capacidade: number; // Capacidade em kg
  status: "disponivel" | "em_uso" | "manutencao" | "inativo";
  unidadeNegocio?: "frigorifico" | "ovos" | "ambos";
  ultimaManutencao?: string; // Data da última manutenção (YYYY-MM-DD)
  proximaManutencao?: string; // Data da próxima manutenção (YYYY-MM-DD)
  funcionario?: string; // ID do funcionário responsável
  observacoes?: string; // Observações adicionais
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "veic_001",
  "placa": "ABC1234",
  "modelo": "Sprinter",
  "marca": "Mercedes-Benz",
  "ano": 2022,
  "capacidade": 3000,
  "status": "disponivel",
  "unidadeNegocio": "frigorifico",
  "ultimaManutencao": "2024-12-15",
  "proximaManutencao": "2025-06-15",
  "funcionario": "func_001",
  "observacoes": "Veículo em excelente estado",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🗺️ Rotas Collection

```typescript
interface Rota {
  id: string; // ID único do documento
  origem: string; // Cidade de origem
  destino: string; // Cidade de destino
  funcionario: string; // ID do funcionário responsável
  veiculo: string; // ID do veículo
  dataPartida: string; // Data e hora de partida (YYYY-MM-DD HH:mm)
  dataChegada: string; // Data e hora de chegada (YYYY-MM-DD HH:mm)
  status: "agendada" | "em_andamento" | "concluida" | "cancelada";
  unidadeNegocio?: "frigorifico" | "ovos" | "ambos";
  observacoes?: string; // Observações da rota
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "rota_001",
  "origem": "Ilhéus",
  "destino": "Salvador",
  "funcionario": "func_001",
  "veiculo": "veic_001",
  "dataPartida": "2025-01-25 08:00",
  "dataChegada": "2025-01-25 12:00",
  "status": "agendada",
  "unidadeNegocio": "frigorifico",
  "observacoes": "Entrega de produtos refrigerados",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 📅 Folgas Collection

```typescript
interface Folga {
  id: string; // ID único do documento
  funcionario: string; // ID do funcionário
  dataInicio: string; // Data de início (YYYY-MM-DD)
  dataFim: string; // Data de fim (YYYY-MM-DD)
  tipo: "folga" | "ferias" | "outro";
  status: "pendente" | "aprovada" | "rejeitada";
  motivo: string; // Motivo da solicitação
  observacoes?: string; // Observações adicionais
  aprovadoPor?: string; // ID do usuário que aprovou
  dataAprovacao?: Timestamp; // Data da aprovação
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "folga_001",
  "funcionario": "func_001",
  "dataInicio": "2025-02-01",
  "dataFim": "2025-02-03",
  "tipo": "folga",
  "status": "pendente",
  "motivo": "Compromisso pessoal",
  "observacoes": "Solicitação com antecedência",
  "aprovadoPor": null,
  "dataAprovacao": null,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🏙️ Cidades Collection

```typescript
interface Cidade {
  id: string; // ID único do documento
  nome: string; // Nome da cidade
  estado: string; // Estado
  regiao: string; // Região (Sudeste, Sul, Nordeste, etc.)
  distancia?: number; // Distância em km (opcional)
  pesoMinimo?: number; // Peso mínimo em kg (opcional)
  rota?: string; // ID da rota associada (opcional)
  observacao?: string; // Observações adicionais
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "cidade_001",
  "nome": "Salvador",
  "estado": "BA",
  "regiao": "Nordeste",
  "distancia": 450,
  "pesoMinimo": 1000,
  "rota": "rota_001",
  "observacao": "Capital do estado",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 👨‍💼 Vendedores Collection

```typescript
interface Vendedor {
  id: string; // ID único do documento
  nome: string; // Nome completo
  cpf: string; // CPF (formato: 000.000.000-00)
  codigoVendSistema: string; // Código interno do sistema
  email: string; // Email corporativo
  telefone: string; // Telefone (formato: (73) 99999-9999)
  estado: string; // Estado de atuação
  regiao: string; // Região de atuação
  cidadesAtendidas: string[]; // Array de cidades atendidas
  unidadeNegocio?: "frigorifico" | "ovos" | "ambos";
  tipoContrato?: string; // Tipo de contrato
  ativo: boolean; // Status ativo/inativo
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "vend_001",
  "nome": "Carlos Oliveira",
  "cpf": "987.654.321-00",
  "codigoVendSistema": "VEND001",
  "email": "carlos@empresa.com",
  "telefone": "(73) 88888-8888",
  "estado": "BA",
  "regiao": "Nordeste",
  "cidadesAtendidas": ["Salvador", "Ilhéus", "Itabuna"],
  "unidadeNegocio": "frigorifico",
  "tipoContrato": "CLT",
  "ativo": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

## 🆕 **Novas Funcionalidades de Exportação**

### 📊 **Sistema de Relatórios**

#### Estrutura de Dados para Relatórios

```typescript
interface RelatorioData {
  name: string; // Nome do item
  value: number; // Valor/quantidade
  color: string; // Cor para gráficos
}

interface ExportConfig {
  campos: string[]; // Campos a serem exportados
  formatacao?: Record<string, (valor: any) => any>; // Formatação personalizada
  ordenacao?: string[]; // Ordem dos campos
  titulo?: string; // Título do relatório
}

interface ExportData {
  dados: any[]; // Dados brutos
  dadosProcessados: RelatorioData[]; // Dados processados para gráficos
  periodo: string; // Período do relatório
}
```

#### Tipos de Relatórios Disponíveis

1. **Relatórios de Status**
   - Status dos Funcionários
   - Status dos Veículos
   - Status das Rotas
   - Status das Folgas

2. **Relatórios Detalhados**
   - Funcionários Detalhado
   - Veículos Detalhado
   - Rotas Detalhado
   - Folgas Detalhado
   - Cidades Detalhado
   - Vendedores Detalhado

### 📤 **Sistema de Exportação**

#### Formatos Suportados

- **Excel (XLSX)**: Planilha para análise de dados
- **PDF**: Documento formatado para impressão

#### Configurações de Exportação

```typescript
interface TableExportConfig extends ExportConfig {
  titulo: string; // Título do relatório
  campos: string[]; // Campos a serem exportados
  formatacao?: Record<string, (valor: any) => any | Promise<any>>; // Formatação personalizada
}

interface TableExportFilters {
  termoBusca?: string; // Termo de busca
  filtroRegiao?: string; // Filtro por região
  filtroStatus?: string; // Filtro por status
  filtroContrato?: string; // Filtro por tipo de contrato
  filtroFuncao?: string; // Filtro por função
  filtroAtivo?: string; // Filtro por status ativo
  filtroUnidadeNegocio?: string; // Filtro por unidade de negócio
  filtroCidade?: string; // Filtro por cidade
  filtroTipo?: string; // Filtro por tipo
  ordenarPor?: string; // Campo para ordenação
  direcaoOrdenacao?: string; // Direção da ordenação (asc/desc)
  [key: string]: any; // Outros filtros dinâmicos
}
```

#### Nomenclatura de Arquivos

- **Padrão**: `entity_dd-MM-YYYY.xlsx`
- **Exemplos**:
  - `funcionarios_16-01-2025.xlsx`
  - `veiculos_16-01-2025.xlsx`
  - `rotas_16-01-2025.xlsx`
  - `folgas_16-01-2025.xlsx`
  - `cidades_16-01-2025.xlsx`
  - `vendedores_16-01-2025.xlsx`

#### Formatação Brasileira

```typescript
// Formatação de datas
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

// Formatação de CPF
const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Formatação de telefone
const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
```

## 🔧 **Serviços de API**

### Relatórios Service

```typescript
class RelatoriosService {
  // Buscar dados para relatórios
  async buscarMotoristas(): Promise<Funcionario[]>;
  async buscarVeiculos(): Promise<Veiculo[]>;
  async buscarRotas(): Promise<Rota[]>;
  async buscarFolgas(): Promise<Folga[]>;
  async buscarCidades(): Promise<Cidade[]>;
  async buscarVendedores(): Promise<Vendedor[]>;

  // Processar dados para gráficos
  processarDadosMotoristas(motoristas: Funcionario[]): RelatorioData[];
  processarDadosVeiculos(veiculos: Veiculo[]): RelatorioData[];
  processarDadosRotas(rotas: Rota[]): RelatorioData[];
  processarDadosFolgas(folgas: Folga[]): RelatorioData[];
}
```

### Export Service

```typescript
abstract class BaseExportService {
  protected abstract config: ExportConfig;

  // Exportar para PDF
  async exportToPDF(
    titulo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string
  ): Promise<void>;

  // Exportar para Excel
  async exportToCSV(
    titulo: string,
    dados: any[],
    dadosProcessados: RelatorioData[],
    periodo: string
  ): Promise<void>;

  // Métodos auxiliares
  protected formatValue(field: string, value: any): any;
  protected getFilteredData(dados: any[]): any[];
  protected getColumnHeaders(): string[];
  protected generateFileName(titulo: string): string;
}

abstract class BaseTableExportService {
  protected abstract config: TableExportConfig;

  // Exportar tabela para Excel
  async exportToExcel(
    dados: any[],
    filtros?: TableExportFilters
  ): Promise<void>;

  // Métodos auxiliares
  protected async formatValue(field: string, value: any): Promise<any>;
  protected async getFilteredData(dados: any[]): Promise<any[]>;
  protected getColumnHeaders(): string[];
  protected generateFileName(): string;
}
```

### Factory Pattern

```typescript
class ExportServiceFactory {
  static createService(tipo: string): BaseExportService {
    switch (tipo.toLowerCase()) {
      case "funcionarios":
      case "funcionarios_detalhado":
        return new FuncionariosExportService();
      case "veiculos":
      case "veiculos_detalhado":
        return new VeiculosExportService();
      case "rotas":
      case "rotas_detalhado":
        return new RotasExportService();
      case "folgas":
      case "folgas_detalhado":
        return new FolgasExportService();
      case "cidades":
      case "cidades_detalhado":
        return new CidadesExportService();
      case "vendedores":
      case "vendedores_detalhado":
        return new VendedoresExportService();
      default:
        throw new Error(`Tipo de relatório não suportado: ${tipo}`);
    }
  }
}
```

## 🔒 **Segurança e Validação**

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Funcionários - apenas usuários autenticados
    match /funcionarios/{docId} {
      allow read, write: if request.auth != null;
    }

    // Veículos - apenas usuários autenticados
    match /veiculos/{docId} {
      allow read, write: if request.auth != null;
    }

    // Rotas - apenas usuários autenticados
    match /rotas/{docId} {
      allow read, write: if request.auth != null;
    }

    // Folgas - apenas usuários autenticados
    match /folgas/{docId} {
      allow read, write: if request.auth != null;
    }

    // Cidades - apenas usuários autenticados
    match /cidades/{docId} {
      allow read, write: if request.auth != null;
    }

    // Vendedores - apenas usuários autenticados
    match /vendedores/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Validação de Dados

```typescript
// Validação de CPF
const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return false;

  // Verificar dígitos repetidos
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Validar dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

  return true;
};

// Validação de email
const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de telefone
const validarTelefone = (telefone: string): boolean => {
  const telefoneLimpo = telefone.replace(/\D/g, "");
  return telefoneLimpo.length === 11;
};
```

## 📊 **Métricas e Monitoramento**

### KPIs Disponíveis

```typescript
interface KPIs {
  totalFuncionarios: number;
  funcionariosAtivos: number;
  funcionariosFolga: number;
  funcionariosFerias: number;
  totalVeiculos: number;
  veiculosDisponiveis: number;
  veiculosEmUso: number;
  veiculosManutencao: number;
  totalRotas: number;
  rotasAgendadas: number;
  rotasEmAndamento: number;
  rotasConcluidas: number;
  totalFolgas: number;
  folgasPendentes: number;
  folgasAprovadas: number;
  totalCidades: number;
  totalVendedores: number;
  vendedoresAtivos: number;
}
```

### Logs de Auditoria

```typescript
interface AuditLog {
  id: string;
  usuario: string; // ID do usuário
  acao: string; // Ação realizada
  entidade: string; // Entidade afetada
  entidadeId: string; // ID da entidade
  dadosAnteriores?: any; // Dados antes da alteração
  dadosNovos?: any; // Dados após a alteração
  timestamp: Timestamp; // Data/hora da ação
  ip?: string; // IP do usuário
  userAgent?: string; // User agent do navegador
}
```

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.1.0  
**Status:** ✅ API operacional com novas funcionalidades de exportação
