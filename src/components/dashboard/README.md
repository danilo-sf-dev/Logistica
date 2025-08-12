# Dashboard Package

Este pacote implementa a nova arquitetura modular para o dashboard do sistema de logística.

## Estrutura

```
dashboard/
├── data/
│   └── dashboardService.ts      # Serviços de dados e comunicação com Firebase
├── pages/
│   └── DashboardPage.tsx        # Página principal do dashboard
├── state/
│   └── useDashboard.ts          # Hook de estado e gerenciamento de dados
├── types.ts                     # Definições de tipos TypeScript
├── ui/
│   ├── DashboardCharts.tsx      # Componente de gráficos
│   ├── RecentActivities.tsx     # Componente de atividades recentes
│   └── StatsCards.tsx           # Componente de cards de estatísticas
├── Dashboard.tsx                # Componente legado (wrapper)
├── index.ts                     # Exportações principais
└── README.md                    # Esta documentação
```

## Componentes

### DashboardPage

Página principal que orquestra todos os componentes do dashboard. Gerencia estados de loading e erro.

### StatsCards

Exibe cards com estatísticas principais:

- Funcionários
- Motoristas
- Vendedores
- Cidades
- Veículos
- Rotas Ativas

### DashboardCharts

Renderiza gráficos usando Recharts:

- Gráfico de pizza com status dos motoristas
- Gráfico de pizza com status dos veículos

**Características:**

- Filtra automaticamente valores 0% para melhor visualização
- Mostra apenas status com dados reais
- Cores consistentes para cada tipo de status

### RecentActivities

Lista as atividades mais recentes do sistema com ícones e cores diferenciadas:

- **Motoristas**: Novos motoristas cadastrados (últimos 15 dias) - Prioridade alta
- **Veículos**: Novos veículos cadastrados (últimos 15 dias) - Prioridade alta
- **Rotas**: Novas rotas criadas com nome do motorista
- **Folgas**: Solicitações de folga com status e nome do funcionário
- **Funcionários**: Novos funcionários cadastrados (últimos 15 dias)
- **Cidades**: Novas cidades cadastradas (últimos 15 dias)
- **Vendedores**: Novos vendedores cadastrados (últimos 15 dias)

**Características:**

- Máximo de 10 atividades
- Scroll automático quando necessário (máximo 6 visíveis)
- Ordenação por data mais recente

## Serviços

### DashboardService

Classe estática que encapsula todas as operações de dados:

- `getDashboardStats()`: Busca estatísticas básicas
- `getMotoristasStatus()`: Calcula distribuição de status dos motoristas
- `getVeiculosStatus()`: Calcula distribuição de status dos veículos
- `getAtividadesRecentes()`: Busca atividades recentes de múltiplas coleções
- `getAllDashboardData()`: Busca todos os dados em paralelo

## Estado

### useDashboard

Hook customizado que gerencia:

- Estado dos dados do dashboard
- Loading states
- Tratamento de erros
- Função de refresh

## Tipos

Definições TypeScript para:

- `DashboardStats`: Estatísticas básicas
- `MotoristaStatus`: Dados para gráfico de status
- `RotaData`: Dados para gráfico de rotas
- `AtividadeRecente`: Estrutura de atividades recentes
- `DashboardData`: Estado completo do dashboard

## Uso

```tsx
import { DashboardPage } from "./components/dashboard";

// Em um componente ou rota
<DashboardPage />;
```

## Migração

O arquivo `Dashboard.js` original foi mantido como wrapper para garantir compatibilidade com imports existentes, mas agora delega para a nova arquitetura.

## Benefícios da Nova Arquitetura

1. **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outras partes do sistema
3. **Testabilidade**: Componentes menores são mais fáceis de testar
4. **Manutenibilidade**: Código mais organizado e fácil de manter
5. **Type Safety**: Tipos TypeScript bem definidos
6. **Performance**: Busca de dados otimizada com Promise.all
7. **Robustez**: Tratamento robusto de erros e timestamps do Firestore
8. **Fallbacks**: Dados padrão em caso de falha na busca

## Correções de Erro Implementadas

### Problema Original

- Erro `toDate is not a function` ao tentar converter timestamps do Firestore
- Falha em queries com campos inexistentes
- Quebra completa do dashboard quando um método falha

### Soluções Implementadas

1. **Função `safeToDate()`**: Converte timestamps de forma segura, lidando com diferentes tipos de dados
2. **Queries Simplificadas**: Removidas queries complexas que dependem de campos específicos
3. **Tratamento Individual de Erros**: Cada método tem seu próprio tratamento de erro
4. **Fallbacks**: Dados padrão retornados em caso de falha
5. **Filtros de Dados**: Apenas documentos com campos necessários são processados
