# Correção da Importação de Cidades em Vendedores

## Problema Identificado

Durante a importação de vendedores via Excel, o campo "cidades atendidas" estava salvando os **nomes das cidades** em vez dos **IDs das cidades** já cadastradas no banco de dados.

### Cenário do Problema

- **Formulário manual**: Cidades são vinculadas corretamente pelos IDs
- **Importação Excel**: Cidades eram salvas pelos nomes, causando inconsistência

### Evidências do Problema

1. **Firebase Console**: Mostrava arrays com nomes de cidades em vez de IDs
2. **Dados inconsistentes**: Alguns registros com nomes, outros com IDs
3. **Falha na integridade**: Relacionamentos quebrados entre vendedores e cidades

## Solução Implementada

### Arquivo Modificado

- `src/components/import/data/vendedoresImportService.ts`

### Mudanças Realizadas

#### 1. Importações Adicionadas

```typescript
import { cidadesService } from "../../cidades/data/cidadesService";
import type { Cidade } from "../../cidades/types";
```

#### 2. Cache de Cidades

```typescript
private cidadesCache: Cidade[] = [];
private cidadesLoaded = false;
```

#### 3. Função de Normalização

```typescript
private normalizeCityName(name: string): string {
  return name
    .normalize("NFD") // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
    .replace(/[^\w\s]/g, "") // Remover pontuação e caracteres especiais
    .replace(/\s+/g, " ") // Normalizar espaços
    .trim()
    .toUpperCase();
}
```

#### 4. Função de Busca de Cidades

```typescript
private async buscarCidadePorNome(nomeCidade: string): Promise<string | null> {
  // Carregar cidades se ainda não foram carregadas
  if (!this.cidadesLoaded) {
    try {
      this.cidadesCache = await cidadesService.listar();
      this.cidadesLoaded = true;
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
      return null;
    }
  }

  const nomeNormalizado = this.normalizeCityName(nomeCidade);

  // Buscar cidade exata
  let cidade = this.cidadesCache.find(
    (c) => this.normalizeCityName(c.nome) === nomeNormalizado
  );

  if (cidade) {
    return cidade.id;
  }

  // Buscar cidade que contenha o nome (busca parcial)
  cidade = this.cidadesCache.find(
    (c) => this.normalizeCityName(c.nome).includes(nomeNormalizado)
  );

  if (cidade) {
    return cidade.id;
  }

  // Buscar cidade que seja contida no nome (busca reversa)
  cidade = this.cidadesCache.find(
    (c) => nomeNormalizado.includes(this.normalizeCityName(c.nome))
  );

  return cidade ? cidade.id : null;
}
```

#### 5. Modificação do TransformData

```typescript
if (row[8]) {
  // Converter string de cidades separadas por vírgula em array
  const cidadesArray = row[8]
    .toString()
    .split(",")
    .map((cidade: string) => cidade.trim())
    .filter((cidade: string) => cidade.length > 0);

  if (cidadesArray.length > 0) {
    // Buscar IDs das cidades pelos nomes
    const cidadesIds: string[] = [];
    const cidadesNaoEncontradas: string[] = [];

    for (const nomeCidade of cidadesArray) {
      const cidadeId = await this.buscarCidadePorNome(nomeCidade);
      if (cidadeId) {
        cidadesIds.push(cidadeId);
      } else {
        cidadesNaoEncontradas.push(nomeCidade);
      }
    }

    // Adicionar apenas as cidades encontradas
    if (cidadesIds.length > 0) {
      transformed.cidadesAtendidas = cidadesIds;
    }

    // Log das cidades não encontradas para debug
    if (cidadesNaoEncontradas.length > 0) {
      console.warn(
        `Cidades não encontradas para o vendedor ${transformed.nome}:`,
        cidadesNaoEncontradas
      );
    }
  }
}
```

## Funcionalidades da Solução

### 1. Busca Inteligente

- **Busca exata**: Procura por correspondência exata do nome
- **Busca parcial**: Procura cidades que contenham o nome informado
- **Busca reversa**: Procura cidades cujo nome esteja contido no nome informado

### 2. Normalização de Dados

- Remove acentos e caracteres especiais
- Converte para maiúsculas
- Normaliza espaços
- Remove pontuação

### 3. Cache de Performance

- Carrega cidades uma única vez por importação
- Evita consultas repetidas ao banco de dados
- Melhora performance da importação

### 4. Tratamento de Erros

- Log de cidades não encontradas
- Continua importação mesmo com cidades faltantes
- Não falha a importação por cidades inexistentes

## Exemplo de Uso

### Dados de Entrada (Excel)

```
Nome: João Silva
Cidades Atendidas: São Paulo,Rio de Janeiro,Salvador
```

### Processamento

1. Divide a string: `["São Paulo", "Rio de Janeiro", "Salvador"]`
2. Para cada cidade, busca o ID correspondente no banco
3. Se encontrar: adiciona o ID ao array
4. Se não encontrar: registra no log de warning

### Dados de Saída (Firebase)

```json
{
  "cidadesAtendidas": ["id_cidade_1", "id_cidade_2", "id_cidade_3"]
}
```

## Benefícios

1. **Integridade dos Dados**: Relacionamentos corretos entre vendedores e cidades
2. **Consistência**: Mesmo formato de dados independente da origem (formulário ou importação)
3. **Flexibilidade**: Aceita variações nos nomes das cidades
4. **Performance**: Cache evita consultas desnecessárias
5. **Robustez**: Não falha a importação por cidades não encontradas

## Testes Recomendados

1. Importar vendedores com cidades existentes
2. Importar vendedores com cidades inexistentes
3. Importar vendedores com nomes de cidades com acentos
4. Importar vendedores com nomes de cidades parciais
5. Verificar logs de cidades não encontradas

## Data da Implementação

Janeiro de 2025
