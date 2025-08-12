# Arquitetura de Tipos Centralizada

Este diretório contém os tipos TypeScript centralizados utilizados em todo o sistema, seguindo o princípio de desacoplamento e flexibilidade.

## Estrutura

### Tipos Base

- `BaseEntity` - Interface base para todas as entidades do sistema
- `Status` - Tipos de status padrão
- `DirecaoOrdenacao` - Direções de ordenação (asc/desc)

### Tipos de Negócio

- `TipoContrato` - Tipos de contrato de funcionários
- `TipoContratoVendedor` - Tipos de contrato de vendedores
- `TipoFuncao` - Funções de funcionários
- `UnidadeNegocio` - Unidades de negócio
- `StatusFuncionario` - Status de funcionários
- `TipoFolga` - Tipos de folgas/afastamentos
- `StatusFolga` - Status de folgas
- `TipoVeiculo` - Tipos de veículos
- `StatusVeiculo` - Status de veículos
- `TipoRota` - Tipos de rotas
- `StatusRota` - Status de rotas

### Interfaces Utilitárias

- `Paginacao` - Interface para paginação
- `Filtros` - Interface para filtros
- `CrudActions<T>` - Interface para ações CRUD
- `ValidacaoErro` - Interface para erros de validação
- `ResultadoValidacao` - Interface para resultado de validação
- `ConfiguracaoFormulario` - Interface para configurações de formulário
- `ConfiguracaoTabela` - Interface para configurações de tabela
- `ConfiguracaoModal` - Interface para configurações de modal

## Benefícios

### 1. Desacoplamento

- Tipos comuns centralizados evitam duplicação
- Mudanças em tipos base refletem em todo o sistema
- Redução de inconsistências entre módulos

### 2. Flexibilidade

- Fácil adição de novos tipos
- Reutilização de tipos em diferentes contextos
- Manutenção simplificada

### 3. Consistência

- Padronização de nomenclatura
- Tipos bem definidos e documentados
- Melhor IntelliSense e detecção de erros

## Uso

### Importação de Tipos

```typescript
import type { BaseEntity, Status, DirecaoOrdenacao } from "../../types";
```

### Extensão de Tipos Base

```typescript
export type MinhaEntidade = BaseEntity & {
  nome: string;
  // outros campos específicos
};
```

### Uso de Tipos Utilitários

```typescript
export type MinhaEntidadeInput = Omit<
  MinhaEntidade,
  "id" | "dataCriacao" | "dataAtualizacao"
>;
```

## Convenções

1. **Nomenclatura**: Use PascalCase para interfaces e tipos
2. **Comentários**: Documente tipos complexos ou específicos do negócio
3. **Organização**: Agrupe tipos relacionados
4. **Reutilização**: Prefira tipos existentes a criar novos similares
5. **Extensibilidade**: Use interfaces genéricas quando possível

## Manutenção

- Adicione novos tipos conforme necessário
- Mantenha a documentação atualizada
- Revise periodicamente tipos não utilizados
- Considere breaking changes ao modificar tipos existentes
