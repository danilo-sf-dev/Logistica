# Pacote Relatórios

Este pacote contém os componentes e lógica relacionados aos relatórios e análises do sistema de logística.

## Estrutura

```
relatorios/
├── data/
│   └── relatoriosService.ts        # Serviços de dados
├── state/
│   └── useRelatorios.ts            # Hook para gerenciar estado
├── ui/
│   ├── RelatorioHeader.tsx         # Cabeçalho dos relatórios
│   ├── ResumoCards.tsx             # Cards de resumo estatístico
│   ├── GraficoCard.tsx             # Componente de gráficos
│   └── RelatoriosDetalhados.tsx    # Relatórios detalhados
├── pages/
│   └── RelatoriosPage.tsx          # Página principal
├── types.ts                        # Definições de tipos
├── Relatorios.tsx                  # Componente principal
├── index.ts                        # Exportações do pacote
├── index.tsx                       # Ponto de entrada
└── README.md                       # Esta documentação
```

## Componentes

### Relatorios

Componente principal que renderiza a página de relatórios.

```tsx
import Relatorios from "./components/relatorios";

<Relatorios />;
```

### RelatoriosPage

Página principal que orquestra todos os componentes de relatórios.

```tsx
import { RelatoriosPage } from "./components/relatorios";

<RelatoriosPage />;
```

### RelatorioHeader

Cabeçalho com título e seletor de período.

```tsx
import { RelatorioHeader } from "./components/relatorios";

<RelatorioHeader periodo={periodo} onPeriodoChange={handlePeriodoChange} />;
```

### ResumoCards

Cards com resumos estatísticos das principais métricas.

```tsx
import { ResumoCards } from "./components/relatorios";

<ResumoCards
  dadosMotoristas={dadosMotoristas}
  dadosVeiculos={dadosVeiculos}
  dadosRotas={dadosRotas}
  dadosFolgas={dadosFolgas}
/>;
```

### GraficoCard

Componente reutilizável para exibir gráficos.

```tsx
import { GraficoCard } from "./components/relatorios";

<GraficoCard
  config={{
    titulo: "Status dos Motoristas",
    tipo: "pie",
    dados: dadosMotoristas,
    altura: 256,
  }}
  onDownload={handleDownload}
/>;
```

### RelatoriosDetalhados

Seção com botões para download de relatórios detalhados.

```tsx
import { RelatoriosDetalhados } from "./components/relatorios";

<RelatoriosDetalhados onDownload={handleDownload} />;
```

## Hooks

### useRelatorios

Hook principal para gerenciar o estado dos relatórios.

```tsx
import { useRelatorios } from "./components/relatorios";

const {
  loading,
  periodo,
  dadosMotoristas,
  dadosVeiculos,
  dadosRotas,
  dadosFolgas,
  handleDownload,
  handlePeriodoChange,
  refetch,
} = useRelatorios();
```

## Serviços

### relatoriosService

Serviço para buscar e processar dados dos relatórios.

### exportService

Serviço para exportar relatórios em PDF e Excel.

```tsx
import { exportService } from "./components/relatorios";

// Exportar para PDF
await exportService.exportToPDF("Motoristas", dados, dadosProcessados, "mes");

// Exportar para Excel
await exportService.exportToCSV("Motoristas", dados, dadosProcessados, "mes");
```

```tsx
import { relatoriosService } from "./components/relatorios";

// Buscar dados
const motoristas = await relatoriosService.buscarMotoristas();
const veiculos = await relatoriosService.buscarVeiculos();

// Processar dados
const dadosMotoristas = relatoriosService.processarDadosMotoristas(motoristas);
```

## Tipos

### RelatorioData

```tsx
interface RelatorioData {
  name: string;
  value: number;
  color: string;
}
```

### GraficoConfig

```tsx
interface GraficoConfig {
  titulo: string;
  tipo: "pie" | "bar" | "line";
  dados: RelatorioData[];
  altura?: number;
  cor?: string;
}
```

### RelatoriosState

```tsx
interface RelatoriosState {
  loading: boolean;
  periodo: string;
  dadosMotoristas: RelatorioData[];
  dadosVeiculos: RelatorioData[];
  dadosRotas: RelatorioData[];
  dadosFolgas: RelatorioData[];
}
```

## Funcionalidades

### Relatórios em Tempo Real

- Dados atualizados automaticamente
- Indicadores de carregamento
- Tratamento de erros

### Gráficos Interativos

- Gráficos de pizza para status
- Gráficos de barras para comparações
- Tooltips informativos
- Responsivos para diferentes telas

### Filtros por Período

- Semana
- Mês
- Trimestre
- Ano

### Download de Relatórios

- **PDF**: Documentos formatados para impressão com tabelas e gráficos
- **Excel (XLSX)**: Planilhas com múltiplas abas para análise de dados
- Modal de seleção de formato
- Relatórios detalhados por categoria
- Botões de download em cada gráfico

### Métricas Principais

- Total de motoristas
- Total de veículos
- Rotas ativas
- Folgas pendentes

## Integração com Firebase

### Coleções Utilizadas

- `motoristas`: Dados dos funcionários
- `veiculos`: Dados da frota
- `rotas`: Dados das rotas
- `folgas`: Dados das folgas

### Processamento de Dados

- Agregação por status
- Contagem de registros
- Cálculo de percentuais
- Mapeamento de cores

## Boas Práticas

1. **Separação de Responsabilidades**: Cada componente tem uma função específica
2. **Reutilização**: Componentes são modulares e reutilizáveis
3. **Tipagem**: Todos os componentes são tipados com TypeScript
4. **Performance**: Dados buscados em paralelo com Promise.all
5. **Responsividade**: Layout adaptável para diferentes dispositivos
6. **Acessibilidade**: Componentes seguem boas práticas de acessibilidade

## Uso

```tsx
import Relatorios, { useRelatorios } from "./components/relatorios";

function App() {
  return (
    <div>
      <Relatorios />
    </div>
  );
}
```

## Extensibilidade

O pacote foi projetado para ser facilmente extensível:

- Adicionar novos tipos de gráficos
- Incluir novas métricas
- Implementar filtros adicionais
- Adicionar novos relatórios
- Integrar com outras fontes de dados
