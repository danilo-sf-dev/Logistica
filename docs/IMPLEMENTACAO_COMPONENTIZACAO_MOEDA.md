# 💰 Implementação: Componentização de Valores Monetários

## 📋 Resumo

Este documento descreve a implementação completa da solução componentizada para valores monetários no sistema, incluindo a correção do problema original de formatação e a criação de componentes reutilizáveis.

---

## 🔍 Problema Original Identificado

### Comportamento Incorreto

O sistema estava interpretando valores monetários de forma incorreta:

```
Usuário digita: R$ 6.500,00
Sistema salvava: R$ 650.000,00 ❌ (100x maior!)
```

### Causa Raiz

1. **Máscara `maskMoeda`**: Sempre tratava os últimos 2 dígitos como centavos
2. **Processamento `onChange`**: Removia formatação mas não preservava intenção do usuário
3. **`normalizeMoneyString`**: Assumia formato decimal (ponto/vírgula) em vez de centavos

### Fluxo Problemático

```
Input: "6500,00"
↓ maskMoeda: "R$ 65,00" (já errado!)
↓ onChange: "6500"
↓ normalizeMoneyString: "65.00"
↓ Firebase: 65.00 (mas usuário queria 6500.00)
```

---

## ✅ Solução Implementada

### Estratégia de Componentização

Em vez de corrigir apenas o problema pontual, foi criada uma **solução componentizada reutilizável** que resolve o problema na raiz e pode ser usada em todo o sistema.

### Componentes Criados

#### **1. MoneyInput.tsx - Input Monetário Universal**

```typescript
interface MoneyInputProps {
  label: string;
  value: string; // String de centavos (ex: "650000" = R$ 6.500,00)
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

<MoneyInput
  label="Salário"
  value={formData.salario}
  onChange={(value) => setFormData({ ...formData, salario: value })}
  required
/>
```

#### **2. MoneyService.ts - Serviço Centralizado**

```typescript
export class MoneyService {
  // Converte centavos para Firebase (ex: "650000" → "6500.00")
  static normalizeForFirebase(centavos?: string | null): string | null;

  // Converte Firebase para centavos (ex: "6500.00" → "650000")
  static fromFirebaseValue(firebaseValue: any): string;

  // Formata para exibição (ex: "650000" → "R$ 6.500,00")
  static formatForDisplay(value: any): string;

  // Formata para exportação Excel/CSV (ex: "6500.00" → "R$ 6.500,00")
  static formatForExport(value: any): string;

  // Valida se valor é válido
  static isValid(centavos: string): boolean;

  // Converte para número decimal
  static toDecimal(centavos: string): number;
}
```

---

## 🔄 Fluxo de Dados Corrigido

### Fluxo Completo:

```
1. 👤 USUÁRIO DIGITA → MoneyInput
   Input: "6500,00"

2. 🔄 PROCESSAMENTO → MoneyInput.handleChange
   Resultado: "650000" (centavos)

3. 💾 SALVAMENTO → MoneyService.normalizeForFirebase
   Firebase: "6500.00" (decimal)

4. 📤 CARREGAMENTO → MoneyService.fromFirebaseValue
   Formulário: "650000" (centavos)

5. 👁️ EXIBIÇÃO → MoneyService.formatForDisplay
   Display: "R$ 6.500,00"
```

### Vantagens do Fluxo:

- ✅ **Consistência Total**: Mesmo formato em todo sistema
- ✅ **Precisão**: Trabalha com centavos, evita problemas de float
- ✅ **Reutilização**: Um componente, múltiplos usos
- ✅ **Manutenibilidade**: Lógica centralizada no serviço

---

## 🧪 Validação Completa

### Casos de Teste - Entrada:

| Input do Usuário | Processamento    | Centavos | Firebase  | Display       |
| ---------------- | ---------------- | -------- | --------- | ------------- |
| `6500,00`        | Reais + centavos | `650000` | `6500.00` | `R$ 6.500,00` |
| `1200,50`        | Reais + centavos | `120050` | `1200.50` | `R$ 1.200,50` |
| `50`             | Reais inteiros   | `5000`   | `50.00`   | `R$ 50,00`    |
| `5`              | Centavos         | `500`    | `5.00`    | `R$ 5,00`     |

### Casos de Teste - Carregamento:

| Firebase  | Centavos | Display       |
| --------- | -------- | ------------- |
| `6500.00` | `650000` | `R$ 6.500,00` |
| `1200.50` | `120050` | `R$ 1.200,50` |
| `null`    | `0`      | `R$ 0,00`     |

### Validação do Problema Original:

| Cenário   | Antes (❌)    | Depois (✅) |
| --------- | ------------- | ----------- |
| `6500,00` | R$ 650.000,00 | R$ 6.500,00 |
| `1200,50` | R$ 120.050,00 | R$ 1.200,50 |
| `50`      | R$ 5.000,00   | R$ 50,00    |

---

## 🎯 Implementação Padrão

### 1. Formulário (UI)

```typescript
// ✅ CORRETO - Usando MoneyInput
import { MoneyInput } from "../../common/MoneyInput";

<MoneyInput
  label="Salário"
  value={valores.salario || ""}
  onChange={(value) => onChange({ ...valores, salario: value })}
  disabled={somenteLeitura}
  required
/>
```

### 2. Serviço (Salvamento)

```typescript
// ✅ CORRETO - Usando MoneyService
import { MoneyService } from "../../../services/MoneyService";

const payload = {
  ...input,
  salario: MoneyService.normalizeForFirebase(input.salario),
};
await addDoc(collection(db, COLLECTION), payload);
```

### 3. Hook (Carregamento)

```typescript
// ✅ CORRETO - Convertendo Firebase para componente
import { MoneyService } from "../../../services/MoneyService";

const editarFuncionario = useCallback((f: Funcionario) => {
  setValores({
    salario: MoneyService.fromFirebaseValue(f.salario),
  });
}, []);
```

### 4. Exportação (Relatórios)

```typescript
// ✅ CORRETO - Formatação padronizada para exportação
import { MoneyService } from "../../../services/MoneyService";

formatacao: {
  salario: (valor) => {
    if (!valor) return "N/A";
    return MoneyService.formatForExport(valor); // Específico para exportação
  },
}
```

### 5. Importação Excel

```typescript
// ✅ CORRETO - Conversão de valores Excel para centavos
import { MoneyService } from "../../../services/MoneyService";

private convertSalaryToCentavos(salaryString: string): string {
  if (!salaryString || salaryString.trim() === "") return "0";

  let salary = salaryString.trim();

  // Remove caracteres não numéricos exceto vírgula e ponto
  salary = salary.replace(/[^\d.,]/g, "");

  // Trata formato brasileiro (ex: "3.500,00")
  if (salary.includes(",")) {
    salary = salary.replace(/\./g, "").replace(",", ".");
  }

  const numericValue = parseFloat(salary);
  const centavos = Math.round(numericValue * 100);

  return centavos.toString();
}

// Uso na transformação
salario: this.convertSalaryToCentavos(row[16]?.toString().trim() || ""),
```

---

## 📚 Implementação Realizada

### Módulo Funcionários - Migração Completa

#### Arquivos Modificados:

1. **`FuncionarioFormModal.tsx`**:
   - Removido: Input manual com `maskMoeda`
   - Adicionado: `MoneyInput` componentizado

2. **`funcionariosService.ts`**:
   - Removido: Função `normalizeMoneyString` local
   - Adicionado: `MoneyService.normalizeForFirebase()`

3. **`useFuncionarios.ts`**:
   - Modificado: Conversão Firebase com `MoneyService.fromFirebaseValue()`

4. **`FuncionariosTableExportService.ts`**:
   - Modificado: Formatação com `MoneyService.formatForDisplay()`

### Novos Arquivos Criados:

1. **`src/components/common/MoneyInput.tsx`** - Componente reutilizável
2. **`src/services/MoneyService.ts`** - Serviço centralizado
3. **`src/components/common/index.ts`** - Export atualizado

---

## 🔧 Migração de Outros Módulos

### Checklist de Migração:

1. **✅ Formulário**: Substituir inputs manuais por `MoneyInput`
2. **✅ Serviço**: Usar `MoneyService.normalizeForFirebase()` no salvamento
3. **✅ Hook**: Usar `MoneyService.fromFirebaseValue()` no carregamento
4. **✅ Exportação**: Usar `MoneyService.formatForDisplay()` na formatação
5. **✅ Importação**: Verificar se precisa de conversão especial

### Status dos Módulos:

- ✅ **Funcionários**: **Implementado completamente**
- ⚠️ **Vendedores**: Verificar se tem campos monetários
- ⚠️ **Outros módulos**: Identificar campos de valor/preço

---

## 🎯 Benefícios Alcançados

### ✅ Problemas Resolvidos:

- **Formatação incorreta**: R$ 6.500,00 ≠ R$ 650.000,00
- **Inconsistência**: Display ≠ Valor salvo
- **Duplicação de código**: Lógica espalhada em vários arquivos
- **Manutenção difícil**: Mudanças em múltiplos lugares

### ✅ Vantagens da Componentização:

- **Reutilização**: Um componente, múltiplos usos
- **Consistência**: Mesmo comportamento em todo sistema
- **Manutenibilidade**: Correção em um lugar, funciona em todos
- **Testabilidade**: Lógica centralizada, fácil de testar
- **Escalabilidade**: Fácil aplicação em novos módulos

---

## ⚠️ Armadilhas Evitadas

1. **Não misturar formatos** - Sempre usar centavos nos componentes
2. **Não usar máscaras antigas** - `maskMoeda` foi substituída pelo componente
3. **Não esquecer conversões** - Firebase ↔ Centavos sempre via MoneyService
4. **Não duplicar lógica** - Usar sempre o serviço centralizado
5. **Não ignorar validações** - Usar `MoneyService.isValid()` quando necessário

---

## 📈 Monitoramento

### Correções Implementadas:

- ✅ **Problema de Cursor Corrigido**: Simplificada lógica de formatação para não interferir na digitação
- ✅ **Digitação Natural**: Usuário pode digitar normalmente sem travamento do cursor
- ✅ **Formatação Otimizada**: Exibição formatada sem interferir na entrada de dados
- ✅ **Exportação Excel Corrigida**: Método específico `formatForExport()` para valores do Firebase
- ✅ **Valores Corretos na Exportação**: R$ 65,00 em vez de R$ 650,00
- ✅ **Importação Excel Corrigida**: Função `convertSalaryToCentavos()` para converter valores Excel
- ✅ **Formatos Brasileiros Suportados**: 3500.00, 3500,00 ou 3.500,00 na importação
- ✅ **Validações de Edição Ajustadas**: Datas vencidas não impedem edição de funcionários existentes
- ✅ **Tratamento de Salário Vazio**: Valores vazios ou zero são tratados como null no Firebase

### Validações Recomendadas:

- **Testes manuais**: Digitar diferentes valores
- **Logs**: Monitorar salvamentos de valores monetários
- **Feedback**: Acompanhar relatos de usuários
- **Casos especiais**: Valores grandes, centavos ímpares, valores pequenos

---

## 🏷️ Tags

`#moeda` `#componentizacao` `#reutilizacao` `#padronizacao` `#centavos` `#firebase` `#correcao`

---

**Autor:** Sistema Logística  
**Data:** Janeiro 2025  
**Versão:** 2.0 (Unificada)
