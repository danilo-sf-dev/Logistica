# 📅 Guia de Implementação: Validação de Datas

## 🎯 **Objetivo**

Este documento serve como referência para implementar validações de data de forma consistente e confiável em todo o sistema, evitando problemas comuns como fuso horário, comparação incorreta de tipos e validações inconsistentes.

---

## 🚨 **Problemas Comuns Identificados**

### **1. Conversão Incorreta para Firebase**

```typescript
// ❌ PROBLEMÁTICO - Conversão automática para UTC
const startDate = new Date("2025-09-01"); // Cria data em UTC
// Firebase converte para timestamp UTC, causando "shift" de fuso horário
// Resultado: 31/08/2025 no banco (um dia antes)

// ✅ CORRETO - Normalizar para meio-dia local
const normalizeDate = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0); // Meio-dia local
  return localDate;
};
```

### **2. Comparação Incorreta de Tipos**

```typescript
// ❌ PROBLEMÁTICO - Comparando Date com string
const startDate = new Date(formData.startDate);
const now = new Date();
if (startDate < now) { ... } // Pode falhar

// ✅ CORRETO - Comparando strings no mesmo formato
const hojeLocal = hoje.toLocaleDateString('en-CA');
if (formData.startDate < hojeLocal) { ... } // Funciona sempre
```

### **2. Problemas de Fuso Horário**

```typescript
// ❌ PROBLEMÁTICO - Usando UTC
const hoje = new Date().toISOString().split("T")[0]; // UTC

// ✅ CORRETO - Usando fuso horário local
const hoje = new Date();
const hojeLocal = hoje.toLocaleDateString("en-CA"); // Local
```

### **3. Validações Inconsistentes**

```typescript
// ❌ PROBLEMÁTICO - Validações espalhadas e diferentes
if (startDate < endDate) { ... }
if (new Date(input.date) < new Date()) { ... }

// ✅ CORRETO - Padrão consistente em todo o sistema
const hojeLocal = hoje.toLocaleDateString('en-CA');
if (input.date < hojeLocal) { ... }
```

### **4. Problemas com Firebase e Fuso Horário**

```typescript
// ❌ PROBLEMÁTICO - Conversão automática para UTC
const startDate = new Date("2025-09-01"); // Cria data em UTC
// Firebase converte para timestamp UTC, causando "shift" de fuso horário

// ✅ CORRETO - Normalizar para meio-dia local antes de enviar
const normalizeDate = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0); // Meio-dia local
  return localDate;
};
```

```typescript
// ❌ PROBLEMÁTICO - Validações espalhadas e diferentes
if (startDate < endDate) { ... }
if (new Date(input.date) < new Date()) { ... }

// ✅ CORRETO - Padrão consistente em todo o sistema
const hojeLocal = hoje.toLocaleDateString('en-CA');
if (input.date < hojeLocal) { ... }
```

---

## 🛠️ **Implementação Padrão**

### **1. Template Básico de Validação**

```typescript
const validarData = (input: { dataInicio: string; dataFim: string }) => {
  const novosErros: Partial<Record<keyof typeof input, string>> = {};

  // Obter data atual no formato YYYY-MM-DD
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD

  // Validação de data de início
  if (!input.dataInicio) {
    novosErros.dataInicio = "Data de início é obrigatória";
  } else if (input.dataInicio < hojeLocal) {
    novosErros.dataInicio = "Data de início não pode ser no passado";
  }

  // Validação de data de fim
  if (!input.dataFim) {
    novosErros.dataFim = "Data de fim é obrigatória";
  } else if (input.dataFim <= input.dataInicio) {
    novosErros.dataFim = "Data de fim deve ser posterior à data de início";
  }

  return novosErros;
};
```

### **2. Validação de Período Máximo**

```typescript
// Validar que o período não exceda um limite
const diffDays = Math.ceil(
  (new Date(input.dataFim).getTime() - new Date(input.dataInicio).getTime()) /
    (1000 * 60 * 60 * 24)
);

if (diffDays > 365) {
  novosErros.dataFim = "O período não pode exceder 1 ano";
}
```

### **3. Validação de Data Única**

```typescript
// Para campos de data única (ex: data de rota)
if (!input.dataRota) {
  novosErros.dataRota = "Data da rota é obrigatória";
} else {
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");

  if (input.dataRota < hojeLocal) {
    novosErros.dataRota = "Data da rota não pode ser anterior ao dia atual";
  }
}
```

### **4. Normalização para Firebase**

```typescript
// Função para normalizar datas antes de enviar para o Firebase
const normalizeDateForFirebase = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0); // Meio-dia local
  return localDate;
};

// Uso no serviço
updateData.temporaryRole = {
  startDate: normalizeDateForFirebase(temporaryPeriod.startDate),
  endDate: normalizeDateForFirebase(temporaryPeriod.endDate),
  // ... outros campos
};
```

```typescript
// Para campos de data única (ex: data de rota)
if (!input.dataRota) {
  novosErros.dataRota = "Data da rota é obrigatória";
} else {
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");

  if (input.dataRota < hojeLocal) {
    novosErros.dataRota = "Data da rota não pode ser anterior ao dia atual";
  }
}
```

---

## 📋 **Casos de Uso Específicos**

### **1. Alteração de Perfil Temporário (Gestão de Usuários)**

```typescript
// Validações para período temporário
if (formData.changeType === "temporary") {
  // Validar que as datas sejam fornecidas
  if (!formData.startDate) {
    showNotification(
      "Data de início é obrigatória para alterações temporárias",
      "error"
    );
    return;
  }

  if (!formData.endDate) {
    showNotification(
      "Data de fim é obrigatória para alterações temporárias",
      "error"
    );
    return;
  }

  // Obter a data de hoje no fuso horário local (formato YYYY-MM-DD)
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD

  // Validar que a data de início não seja no passado
  if (formData.startDate < hojeLocal) {
    showNotification("A data de início não pode ser no passado", "error");
    return;
  }

  // Validar que a data de fim seja posterior à data de início
  if (formData.endDate <= formData.startDate) {
    showNotification(
      "A data de fim deve ser posterior à data de início",
      "error"
    );
    return;
  }

  // Validar que o período não exceda 1 ano
  const diffDays = Math.ceil(
    (new Date(formData.endDate).getTime() -
      new Date(formData.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays > 365) {
    showNotification("O período temporário não pode exceder 1 ano", "error");
    return;
  }
}
```

### **2. Solicitação de Folgas**

```typescript
// Validação de folgas
if (input.dataInicio && input.dataFim) {
  const inicio = new Date(input.dataInicio);
  const fim = new Date(input.dataFim);

  if (inicio > fim) {
    novosErros.dataFim = "Data de fim deve ser posterior à data de início";
  }
}
```

### **3. Criação de Rotas**

```typescript
// Validação de rotas
if (!input.dataRota) {
  novosErros.dataRota = "Data da rota é obrigatória";
} else {
  // Obter a data de hoje no fuso horário local
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");

  if (input.dataRota < hojeLocal) {
    novosErros.dataRota = "Data da rota não pode ser anterior ao dia atual";
  }
}
```

---

## 🔧 **Funções Utilitárias Recomendadas**

### **1. Função para Obter Data Atual**

```typescript
// src/utils/dateUtils.ts
export const getCurrentDateString = (): string => {
  const hoje = new Date();
  return hoje.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
};

export const getCurrentDateLocal = (): Date => {
  return new Date();
};
```

### **2. Função para Validar Período**

```typescript
export const validateDatePeriod = (
  startDate: string,
  endDate: string,
  maxDays: number = 365
): { isValid: boolean; error?: string } => {
  if (!startDate || !endDate) {
    return { isValid: false, error: "Datas são obrigatórias" };
  }

  if (endDate <= startDate) {
    return {
      isValid: false,
      error: "Data de fim deve ser posterior à data de início",
    };
  }

  const diffDays = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays > maxDays) {
    return {
      isValid: false,
      error: `O período não pode exceder ${maxDays} dias`,
    };
  }

  return { isValid: true };
};
```

### **3. Função para Validar Data Futura**

```typescript
export const validateFutureDate = (
  date: string
): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: "Data é obrigatória" };
  }

  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");

  if (date < hojeLocal) {
    return { isValid: false, error: "Data não pode ser no passado" };
  }

  return { isValid: true };
};
```

---

## 📝 **Checklist de Implementação**

### **Antes de Implementar:**

- [ ] Identificar o tipo de validação necessária (data única, período, etc.)
- [ ] Definir mensagens de erro claras e consistentes
- [ ] Verificar se há validações similares no sistema para referência

### **Durante a Implementação:**

- [ ] Usar `toLocaleDateString('en-CA')` para data atual
- [ ] Comparar strings diretamente (não objetos Date)
- [ ] Implementar validações em ordem lógica
- [ ] Adicionar comentários explicativos

### **Após a Implementação:**

- [ ] Testar com datas passadas, presentes e futuras
- [ ] Testar com diferentes fusos horários
- [ ] Verificar se as mensagens de erro são claras
- [ ] Documentar o padrão usado

---

## 🚀 **Exemplo Completo de Implementação**

```typescript
// Hook de validação de datas
export const useDateValidation = () => {
  const validarDatas = useCallback(
    (input: {
      dataInicio: string;
      dataFim: string;
      tipo: "folga" | "rota" | "perfil";
    }) => {
      const novosErros: Partial<Record<keyof typeof input, string>> = {};

      // Obter data atual
      const hoje = new Date();
      const hojeLocal = hoje.toLocaleDateString("en-CA");

      // Validações específicas por tipo
      switch (input.tipo) {
        case "folga":
          if (!input.dataInicio) {
            novosErros.dataInicio = "Data de início é obrigatória";
          }
          if (!input.dataFim) {
            novosErros.dataFim = "Data de fim é obrigatória";
          }
          if (
            input.dataInicio &&
            input.dataFim &&
            input.dataFim <= input.dataInicio
          ) {
            novosErros.dataFim =
              "Data de fim deve ser posterior à data de início";
          }
          break;

        case "rota":
          if (!input.dataInicio) {
            novosErros.dataInicio = "Data da rota é obrigatória";
          } else if (input.dataInicio < hojeLocal) {
            novosErros.dataInicio =
              "Data da rota não pode ser anterior ao dia atual";
          }
          break;

        case "perfil":
          if (!input.dataInicio) {
            novosErros.dataInicio = "Data de início é obrigatória";
          } else if (input.dataInicio < hojeLocal) {
            novosErros.dataInicio = "Data de início não pode ser no passado";
          }
          if (!input.dataFim) {
            novosErros.dataFim = "Data de fim é obrigatória";
          } else if (input.dataFim <= input.dataInicio) {
            novosErros.dataFim =
              "Data de fim deve ser posterior à data de início";
          }
          break;
      }

      return novosErros;
    },
    []
  );

  return { validarDatas };
};
```

---

## 📚 **Referências no Sistema**

### **Implementações Existentes:**

- **Gestão de Usuários**: `src/components/configuracoes/state/useUserManagement.ts`
- **Rotas**: `src/components/rotas/state/useRotas.ts`
- **Folgas**: `src/components/folgas/state/useFolgas.ts`

### **Padrões Seguidos:**

- Uso de `toLocaleDateString('en-CA')` para data atual
- Comparação direta de strings de data
- Validações em ordem lógica
- Mensagens de erro consistentes

---

## ⚠️ **Armadilhas a Evitar**

1. **Não compare objetos Date diretamente** - Use strings no formato YYYY-MM-DD
2. **Não use UTC para datas locais** - Sempre use o fuso horário local
3. **Não misture formatos de data** - Mantenha consistência
4. **Não ignore validações de período** - Sempre valide início e fim
5. **Não esqueça de limpar formulários** - Evite dados antigos causando problemas
6. **Não envie datas para Firebase sem normalizar** - Use `setHours(12, 0, 0, 0)` para evitar "shift" de fuso horário
7. **Não confie na conversão automática de datas** - Sempre normalize antes de enviar para o banco

---

## 🎯 **Resumo dos Princípios**

1. **Consistência**: Use sempre o mesmo padrão de validação
2. **Simplicidade**: Compare strings, não objetos Date
3. **Localização**: Use fuso horário local, não UTC
4. **Clareza**: Mensagens de erro claras e específicas
5. **Manutenibilidade**: Comentários e funções reutilizáveis
6. **Normalização**: Sempre normalize datas para meio-dia local antes de enviar para Firebase
7. **Prevenção**: Antecipe problemas de fuso horário e UTC

---

_Última atualização: Janeiro 2025 - Baseado na implementação da Gestão de Usuários_
