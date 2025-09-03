# 📅 Componentes de Data Componentizados

## 🎯 **Visão Geral**

Este conjunto de componentes implementa a **componentização de datas** conforme a documentação de referência, seguindo o princípio de **separação de responsabilidades**:

- **🎨 UI (Components)** → SÓ renderiza e captura input
- **🔍 Validação (Hooks)** → SÓ valida, NUNCA altera dados
- **⚙️ Processamento (Services)** → SÓ processa dados de forma controlada

---

## 🧩 **Componentes Disponíveis**

### **1. DateInput.tsx**

Componente reutilizável para input de data única.

```tsx
import { DateInput } from "../common/DateInput";

<DateInput
  label="Data da Rota"
  value={formData.dataRota}
  onChange={(date) => setDataRota(date)}
  minDate={DateService.getCurrentDateString()}
  required
  error={errors.dataRota}
/>;
```

**Props:**

- `label`: Rótulo do campo
- `value`: Valor atual (string YYYY-MM-DD)
- `onChange`: Callback quando valor muda
- `minDate`/`maxDate`: Limites de data
- `required`: Campo obrigatório
- `error`: Mensagem de erro
- `disabled`: Campo desabilitado

### **2. DateRangeInput.tsx**

Componente reutilizável para input de período de datas.

```tsx
import { DateRangeInput } from "../common/DateRangeInput";

<DateRangeInput
  startDate={formData.startDate}
  endDate={formData.endDate}
  onStartDateChange={(date) => setStartDate(date)}
  onEndDateChange={(date) => setEndDate(date)}
  minStartDate={DateService.getCurrentDateString()}
  required
  errors={errors}
/>;
```

**Props:**

- `startDate`/`endDate`: Datas de início e fim
- `onStartDateChange`/`onEndDateChange`: Callbacks para mudanças
- `minStartDate`/`maxEndDate`: Limites de período
- `errors`: Objeto com erros de cada campo
- `startDateLabel`/`endDateLabel`: Rótulos customizados

### **3. DateDisplay.tsx**

Componente reutilizável para exibição de datas.

```tsx
import { DateDisplay } from "../common/DateDisplay";

<DateDisplay date={user.createdAt} format="long" showTime />;
```

**Props:**

- `date`: Data a ser exibida (Date, string ou FirebaseDate)
- `format`: Formato de exibição ("short", "long", "time", "relative")
- `showTime`: Mostrar hora junto com a data

---

## 🪝 **Hooks Customizados**

### **1. useDateValidation**

Hook para validação de datas (SÓ valida, NUNCA altera dados).

```tsx
import { useDateValidation } from "../../hooks";

const { validateDate, validatePeriod } = useDateValidation();

// Validação individual
const startValidation = validateDate(formData.startDate);
if (!startValidation.isValid) {
  console.log("Erro:", startValidation.error);
}

// Validação de período
const periodValidation = validatePeriod(formData.startDate, formData.endDate);
```

**Métodos disponíveis:**

- `validateDate(date)`: Valida data única
- `validatePeriod(start, end)`: Valida período
- `validateDateInRange(date, start, end)`: Valida data em intervalo
- `validateDateFormat(date)`: Valida formato de data
- `validateDateComplete(date)`: Validação completa
- `validatePeriodComplete(start, end)`: Validação completa de período

### **2. useDateConversion**

Hook para conversão de datas (SÓ converte, NUNCA altera dados).

```tsx
import { useDateConversion } from "../../hooks";

const { normalizeForFirebase, getCurrentDateString, formatForDisplay } =
  useDateConversion();

// Normalizar para Firebase
const firebaseDate = normalizeForFirebase("2025-01-15");

// Data atual
const hoje = getCurrentDateString(); // "2025-01-15"

// Formatar para exibição
const dataFormatada = formatForDisplay(firebaseDate);
```

**Métodos disponíveis:**

- `normalizeForFirebase(date)`: Normaliza para Firebase
- `toFirebaseTimestamp(date)`: Converte para Timestamp
- `getServerTimestamp()`: Timestamp do servidor
- `formatForDisplay(date)`: Formata para exibição
- `getCurrentDateString()`: Data atual como string

### **3. useDateForm**

Hook para gerenciamento de formulários de datas.

```tsx
import { useDateForm } from "../../hooks";

const dateForm = useDateForm({
  startDate: "",
  endDate: "",
  type: "temporary",
});

// Atualizar campo
dateForm.updateField("startDate", "2025-01-15");

// Validar formulário
const isValid = dateForm.validateForm();

// Dados normalizados para Firebase
const normalizedData = dateForm.getNormalizedData();
```

**Métodos disponíveis:**

- `updateField(field, value)`: Atualiza campo específico
- `validateForm()`: Valida todo o formulário
- `getNormalizedData()`: Dados para Firebase
- `getMinStartDate()`: Data mínima para início
- `getMinEndDate()`: Data mínima para fim

---

## 🔧 **Serviço Centralizado**

### **DateService**

Serviço unificado para todas as operações de data.

```tsx
import { DateService } from "../../services/DateService";

// Normalizar para Firebase
const firebaseDate = DateService.normalizeForFirebase("2025-01-15");

// Validar data futura
const validation = DateService.validateFutureDate("2025-01-15");

// Formatar para exibição
const displayDate = DateService.formatForDisplay(firebaseDate);

// Data atual
const hoje = DateService.getCurrentDateString();
```

---

## 📋 **Exemplo de Implementação Completa**

### **Formulário de Alteração de Perfil Temporário**

```tsx
import React from "react";
import { DateRangeInput } from "../common/DateRangeInput";
import { DateService } from "../../services/DateService";
import { useDateValidation, useDateForm } from "../../hooks";

export const UserRoleChangeModal: React.FC = () => {
  // ✅ HOOKS COMPONENTIZADOS
  const { validateDate, validatePeriod } = useDateValidation();
  const dateForm = useDateForm({
    startDate: formData.startDate,
    endDate: formData.endDate,
    type: "temporary",
  });

  // ✅ VALIDAÇÃO COMPONENTIZADA
  const validateTemporaryPeriod = () => {
    const startValidation = validateDate(formData.startDate);
    if (!startValidation.isValid) return false;

    const endValidation = validateDate(formData.endDate);
    if (!endValidation.isValid) return false;

    const periodValidation = validatePeriod(
      formData.startDate,
      formData.endDate,
    );
    return periodValidation.isValid;
  };

  // ✅ SUBMISSÃO COM VALIDAÇÃO
  const handleSubmit = () => {
    if (!validateTemporaryPeriod()) return;

    const normalizedData = dateForm.getNormalizedData();
    // Salvar no Firebase...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ COMPONENTE COMPONENTIZADO */}
      <DateRangeInput
        startDate={formData.startDate}
        endDate={formData.endDate}
        onStartDateChange={(date) => dateForm.updateField("startDate", date)}
        onEndDateChange={(date) => dateForm.updateField("endDate", date)}
        minStartDate={DateService.getCurrentDateString()}
        required
        errors={dateForm.errors}
      />

      <button type="submit">Salvar</button>
    </form>
  );
};
```

---

## 🚀 **Vantagens da Componentização**

### **✅ Segurança dos Dados**

- **UI** não pode corromper dados
- **Validação** não altera valores
- **Processamento** é controlado e testável

### **✅ Manutenibilidade**

- **Bug na UI** = Só afeta interface
- **Bug na validação** = Só afeta validação
- **Bug no processamento** = Só afeta dados

### **✅ Reutilização**

- **Um componente** = Múltiplos usos
- **Lógica centralizada** = Fácil de testar
- **Padrões consistentes** = Mesmo comportamento

### **✅ Importação/Exportação**

- **Dados preservados** em todo o fluxo
- **Zero interferência** da interface
- **Processamento controlado** para relatórios

---

## 📚 **Casos de Uso Recomendados**

### **1. Formulários com Datas**

- Alteração de perfil temporário
- Solicitação de folgas
- Criação de rotas
- Agendamentos

### **2. Validações de Período**

- Períodos de trabalho
- Intervalos de datas
- Datas de início/fim
- Períodos de validade

### **3. Exibição de Datas**

- Tabelas de dados
- Cards de informação
- Históricos
- Relatórios

---

## ⚠️ **Armadilhas a Evitar**

1. **❌ Não crie componentes muito específicos** - Mantenha flexibilidade
2. **❌ Não ignore a reutilização** - Sempre pense em outros usos
3. **❌ Não duplique lógica de validação** - Use hooks customizados
4. **❌ Não esqueça de documentar** - Componentes reutilizáveis precisam de docs
5. **❌ Não ignore a consistência** - Mantenha padrões visuais

---

## 🔄 **Migração de Código Existente**

### **Antes (Código Duplicado):**

```tsx
// ❌ PROBLEMÁTICO - Lógica duplicada
const validar = (input) => {
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");
  if (input.dataRota < hojeLocal) {
    novosErros.dataRota = "Data não pode ser no passado";
  }
};
```

### **Depois (Componentizado):**

```tsx
// ✅ CORRETO - Componente reutilizável
<DateInput
  label="Data da Rota"
  value={formData.dataRota}
  onChange={setDataRota}
  minDate={DateService.getCurrentDateString()}
  required
/>;

// ✅ CORRETO - Hook reutilizável
const { validateDate } = useDateValidation();
const dateValidation = validateDate(formData.dataRota);
```

---

_Implementação baseada na documentação de referência para componentização de datas_
