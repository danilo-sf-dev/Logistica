# Correção de CPF com Zeros à Esquerda na Importação

## Problema Identificado

O Microsoft Excel remove automaticamente os zeros à esquerda de números, causando erro na validação de CPF durante a importação de vendedores.

### Cenários do Problema

1. **CPF com zero no início**: `03063118524` → Excel salva como `3063118524` (10 dígitos)
2. **CPF terminando em zero**: `45612398700` → Excel salva como `456123987` (9 dígitos)
3. **Validação falha**: Sistema espera exatamente 11 dígitos

### Evidências do Problema

- **Erro de validação**: "CPF deve ter exatamente 11 dígitos"
- **Importação falha**: Vendedores não são importados
- **Dados corrompidos**: CPFs inválidos no sistema

## Solução Implementada

### Arquivo Modificado

- `src/components/import/data/vendedoresImportService.ts`

### Lógica de Correção

```typescript
// Validações específicas
// Validar formato de CPF (10 ou 11 dígitos)
if (row[1]) {
  const cpfLimpo = row[1].toString().replace(/\D/g, "");
  if (cpfLimpo.length === 10) {
    // Adicionar zero à esquerda se tiver 10 dígitos
    const cpfOriginal = row[1].toString().trim();
    row[1] = "0" + cpfLimpo;
    warnings.push({
      row: rowNumber,
      field: "cpf",
      message: `CPF "${cpfOriginal}" foi corrigido para "${row[1]}" (zero à esquerda adicionado automaticamente)`,
      value: row[1],
      severity: "warning",
    });
  } else if (cpfLimpo.length !== 11) {
    errors.push({
      row: rowNumber,
      field: "cpf",
      message: `CPF "${row[1].toString().trim()}" deve ter 11 dígitos. Se o Excel removeu zeros à esquerda, adicione manualmente.`,
      value: row[1],
      severity: "error",
    });
  }
}
```

## Funcionalidades da Solução

### 1. Detecção Automática

- **10 dígitos**: Adiciona zero à esquerda automaticamente
- **11 dígitos**: Mantém como está
- **Outros tamanhos**: Gera erro com orientação

### 2. Correção Inteligente

- **Preserva original**: Mantém o valor original para referência
- **Aplica correção**: Adiciona zero à esquerda quando necessário
- **Atualiza dados**: Modifica o array de dados para processamento

### 3. Feedback ao Usuário

- **Warning**: Informa sobre correção automática
- **Error**: Orienta sobre correção manual quando necessário
- **Transparência**: Mostra valor original e corrigido

## Exemplos de Uso

### Caso 1: CPF com 10 dígitos (zero removido)

```
Entrada: 3063118524
Processamento: Detecta 10 dígitos → Adiciona zero à esquerda
Saída: 03063118524
Warning: "CPF '3063118524' foi corrigido para '03063118524'"
```

### Caso 2: CPF com 11 dígitos (correto)

```
Entrada: 12345678901
Processamento: Detecta 11 dígitos → Mantém como está
Saída: 12345678901
Warning: Nenhum
```

### Caso 3: CPF com 9 dígitos (múltiplos zeros removidos)

```
Entrada: 456123987
Processamento: Detecta 9 dígitos → Gera erro
Saída: Erro
Error: "CPF '456123987' deve ter 11 dígitos. Se o Excel removeu zeros à esquerda, adicione manualmente."
```

## Benefícios

1. **Automação**: Corrige automaticamente casos comuns
2. **Flexibilidade**: Aceita CPFs com zeros removidos
3. **Orientação**: Fornece feedback claro ao usuário
4. **Robustez**: Não falha a importação por zeros removidos
5. **Transparência**: Mostra exatamente o que foi corrigido

## Casos de Uso

### ✅ Casos Corrigidos Automaticamente

- `3063118524` → `03063118524`
- `1234567890` → `01234567890`
- `9876543210` → `09876543210`

### ❌ Casos que Requerem Correção Manual

- `456123987` (9 dígitos - múltiplos zeros removidos)
- `123456789012` (12 dígitos - CPF inválido)
- `abc123def` (contém letras)

## Implementação em Outros Serviços

A mesma lógica foi implementada em:

- `funcionariosImportService.ts` (já existia)
- `vendedoresImportService.ts` (implementado agora)

## Data da Implementação

Janeiro de 2025

## Status

✅ Implementado e testado
