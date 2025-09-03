# 📅 Guia de Implementação: Validação de Datas Componentizada

## 🎯 **Objetivo**

Este documento serve como referência para implementar validações de data de forma **componentizada e reutilizável** em todo o sistema, evitando problemas comuns como fuso horário, comparação incorreta de tipos e validações inconsistentes através de **componentes universais** e **hooks customizados**.

---

## 🚨 **Problemas Comuns Identificados (E SOLUCIONADOS)**

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

### **3. Problemas de Fuso Horário**

```typescript
// ❌ PROBLEMÁTICO - Usando UTC
const hoje = new Date().toISOString().split("T")[0]; // UTC

// ✅ CORRETO - Usando fuso horário local
const hoje = new Date();
const hojeLocal = hoje.toLocaleDateString("en-CA"); // Local
```

### **4. Validações Inconsistentes**

```typescript
// ❌ PROBLEMÁTICO - Validações espalhadas e diferentes
if (startDate < endDate) { ... }
if (new Date(input.date) < new Date()) { ... }

// ✅ CORRETO - Padrão consistente em todo o sistema
const hojeLocal = hoje.toLocaleDateString('en-CA');
if (input.date < hojeLocal) { ... }
```

---

## 🏗️ **ARQUITETURA COMPONENTIZADA RECOMENDADA**

### **Estrutura de Arquivos:**

```
src/
├── components/
│   └── common/
│       ├── DateInput.tsx          # Input de data reutilizável
│       ├── DateRangeInput.tsx     # Input de período reutilizável
│       ├── DateDisplay.tsx        # Exibição de data reutilizável
│       └── DateValidation.tsx     # Componente de validação
├── hooks/
│   ├── useDateValidation.ts       # Hook de validação
│   ├── useDateConversion.ts       # Hook de conversão
│   └── useDateForm.ts            # Hook de formulário de datas
├── services/
│   └── DateService.ts             # Serviço centralizado
├── contexts/
│   └── ValidationContext.tsx      # Contexto de validação
└── utils/
    └── dateUtils.ts               # Funções utilitárias (já implementado)
```

---

## 🎯 **SEPARAÇÃO DE RESPONSABILIDADES - REGRA FUNDAMENTAL**

### **🏗️ Por que Separar Responsabilidades?**

A componentização só funciona se **cada camada tiver uma responsabilidade específica** e **NUNCA interferir na outra**. Isso é crucial para:

- **✅ Segurança dos dados** - Importação/exportação funcionam perfeitamente
- **✅ Manutenibilidade** - Bugs ficam isolados em uma camada
- **✅ Testabilidade** - Cada camada pode ser testada independentemente
- **✅ Reutilização** - Componentes funcionam em qualquer contexto

### **🔒 Regra de Ouro:**

```
🎨 UI (Components)     → SÓ renderiza e captura input
🔍 Validação (Hooks)   → SÓ valida, NUNCA altera dados
⚙️ Processamento (Services) → SÓ processa dados de forma controlada
```

### **✅ Exemplos de Implementação Correta:**

#### **1. Componente de UI (SÓ Interface):**

```typescript
// DateInput.tsx - SÓ UI, NUNCA processa dados
export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
}) => {
  // ✅ SÓ renderiza e captura input
  // ❌ NUNCA processa, valida ou altera dados

  return (
    <div className="form-group">
      <label>{label} {required && <span>*</span>}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)} // ✅ Passa valor direto
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

#### **2. Hook de Validação (SÓ Validação):**

```typescript
// useDateValidation.ts - SÓ valida, NUNCA altera dados
export const useDateValidation = () => {
  const validateDate = useCallback((date: string) => {
    // ✅ SÓ retorna { isValid, error }
    // ❌ NUNCA altera o valor original

    if (!date) {
      return { isValid: false, error: "Data é obrigatória" };
    }

    const hoje = new Date();
    const hojeLocal = hoje.toLocaleDateString("en-CA");

    if (date < hojeLocal) {
      return { isValid: false, error: "Data não pode ser no passado" };
    }

    return { isValid: true }; // ✅ Valor original permanece intacto
  }, []);

  return { validateDate };
};
```

#### **3. Serviço de Processamento (SÓ Lógica de Negócio):**

```typescript
// DateService.ts - Processamento de dados
export class DateService {
  // ✅ Processa dados de forma controlada
  static normalizeForFirebase(date: string): Date {
    return normalizeDateForFirebase(date);
  }

  static formatForDisplay(date: Date): string {
    return formatDateBR(date);
  }
}

// ImportService.ts - Lógica específica de importação
export class ImportService {
  static parseDateFromCSV(dateString: string): Date {
    // ✅ Lógica específica para importação
    return DateService.normalizeForFirebase(dateString);
  }
}

// ExportService.ts - Lógica específica de exportação
export class ExportService {
  static formatDateForCSV(date: Date): string {
    // ✅ Lógica específica para exportação
    return DateService.formatForDisplay(date);
  }
}
```

### **❌ Exemplos do que NUNCA fazer:**

#### **1. Componente Processando Dados:**

```typescript
// ❌ ERRADO - Componente alterando dados
const DateInput = ({ value, onChange }) => {
  const handleChange = (date) => {
    // ❌ Componente alterando dados
    const processedDate = DateService.normalizeForFirebase(date);
    onChange(processedDate);
  };
};
```

#### **2. Hook Alterando Dados:**

```typescript
// ❌ ERRADO - Hook alterando dados
const useDateValidation = () => {
  const validateAndTransform = (date) => {
    // ❌ Hook alterando dados
    if (isValid(date)) {
      return transformDate(date); // ❌ Alteração indesejada
    }
  };
};
```

### **🔄 Fluxo de Dados Seguro:**

```
1. 📥 USUÁRIO DIGITA → DateInput (UI)
2. 🔍 VALIDAÇÃO → useDateValidation (Hook)
3. ⚙️ PROCESSAMENTO → DateService (Serviço)
4. 💾 SALVAMENTO → Firebase
5. 📤 EXPORTAÇÃO → ExportService (Serviço)
6. 📥 IMPORTAÇÃO → ImportService (Serviço)
```

### **💡 Vantagens da Separação:**

#### **✅ Segurança:**

- **UI** não pode corromper dados
- **Validação** não altera valores
- **Processamento** é controlado e testável

#### **✅ Manutenibilidade:**

- **Bug na UI** = Só afeta interface
- **Bug na validação** = Só afeta validação
- **Bug no processamento** = Só afeta dados

#### **✅ Testabilidade:**

- **Testar UI** independente da lógica
- **Testar validação** independente da UI
- **Testar processamento** independente de tudo

### **📊 Impacto na Importação/Exportação:**

#### **✅ Por que Funciona Perfeitamente:**

1. **Importação de Dados:**
   - **Componentes de UI** não interferem na leitura de arquivos
   - **Hooks de validação** só validam, não alteram dados
   - **Serviços de importação** processam dados de forma controlada
   - **Dados chegam intactos** do arquivo para o sistema

2. **Exportação de Dados:**
   - **Componentes de UI** não interferem na escrita de arquivos
   - **Hooks de validação** não alteram dados durante exportação
   - **Serviços de exportação** formatam dados de forma controlada
   - **Dados saem intactos** do sistema para o arquivo

#### **🔄 Fluxo Seguro para Relatórios:**

```typescript
// ✅ IMPORTAÇÃO SEGURA
const importarCSV = (csvData: string[]) => {
  const data = csvData.map((row) => ({
    startDate: ImportService.parseDateFromCSV(row.startDate), // ✅ Processamento controlado
    endDate: ImportService.parseDateFromCSV(row.endDate), // ✅ Processamento controlado
  }));
};

// ✅ EXPORTAÇÃO SEGURA
const exportarCSV = (dados: any[]) => {
  return dados.map((item) => ({
    startDate: ExportService.formatDateForCSV(item.startDate), // ✅ Formatação controlada
    endDate: ExportService.formatDateForCSV(item.endDate), // ✅ Formatação controlada
  }));
};
```

#### **🎯 Benefícios para Relatórios:**

- **✅ Consistência** na formatação de datas
- **✅ Validação** automática durante importação
- **✅ Formatação** padronizada na exportação
- **✅ Zero interferência** da interface do usuário
- **✅ Dados preservados** em todo o fluxo

---

## 🧩 **COMPONENTES REUTILIZÁVEIS**

### **1. DateInput.tsx - Input de Data Universal**

```typescript
interface DateInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  required = false,
  error,
  disabled = false,
  placeholder = "Selecione uma data",
  className = "",
}) => {
  // Internamente usa normalizeDateForFirebase e validações
  // Evita repetir lógica de conversão em cada formulário

  return (
    <div className={`form-group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`input-field ${error ? "border-red-500" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
```

### **2. DateRangeInput.tsx - Input de Período**

```typescript
interface DateRangeInputProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minStartDate?: string;
  maxEndDate?: string;
  required?: boolean;
  errors?: { startDate?: string; endDate?: string };
  className?: string;
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  maxEndDate,
  required = false,
  errors = {},
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <DateInput
        label="Data Início"
        value={startDate}
        onChange={onStartDateChange}
        minDate={minStartDate}
        maxDate={endDate}
        required={required}
        error={errors.startDate}
      />
      <DateInput
        label="Data Fim"
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
        maxDate={maxEndDate}
        required={required}
        error={errors.endDate}
      />
    </div>
  );
};
```

### **3. DateDisplay.tsx - Exibição de Data**

```typescript
interface DateDisplayProps {
  date: Date | string | FirebaseDate;
  format?: "short" | "long" | "time" | "relative";
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  format = "short",
  className = "",
}) => {
  const formatDate = (date: Date | string | FirebaseDate) => {
    const dateObj = typeof date === 'string' ? new Date(date) : fromFirebaseDate(date);

    switch (format) {
      case "short":
        return dateObj.toLocaleDateString("pt-BR");
      case "long":
        return dateObj.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      case "time":
        return dateObj.toLocaleString("pt-BR");
      case "relative":
        return getRelativeTimeString(dateObj);
      default:
        return dateObj.toLocaleDateString("pt-BR");
    }
  };

  return (
    <span className={className}>
      {formatDate(date)}
    </span>
  );
};
```

---

## 🪝 **HOOKS CUSTOMIZADOS**

### **1. useDateValidation.ts - Hook de Validação**

```typescript
export const useDateValidation = () => {
  const validateDate = useCallback((date: string) => {
    if (!date) {
      return { isValid: false, error: "Data é obrigatória" };
    }

    const hoje = new Date();
    const hojeLocal = hoje.toLocaleDateString("en-CA");

    if (date < hojeLocal) {
      return { isValid: false, error: "Data não pode ser no passado" };
    }

    return { isValid: true };
  }, []);

  const validatePeriod = useCallback(
    (startDate: string, endDate: string, maxDays: number = 365) => {
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
    },
    []
  );

  return { validateDate, validatePeriod };
};
```

### **2. useDateConversion.ts - Hook de Conversão**

```typescript
export const useDateConversion = () => {
  const normalizeForFirebase = useCallback((date: string) => {
    return normalizeDateForFirebase(date);
  }, []);

  const toFirebaseTimestamp = useCallback((date: string) => {
    return toFirebaseTimestamp(date);
  }, []);

  const getServerTimestamp = useCallback(() => {
    return getServerTimestamp();
  }, []);

  const formatForDisplay = useCallback((date: Date | string | FirebaseDate) => {
    return formatDateBR(date);
  }, []);

  return {
    normalizeForFirebase,
    toFirebaseTimestamp,
    getServerTimestamp,
    formatForDisplay,
  };
};
```

### **3. useDateForm.ts - Hook de Formulário de Datas**

```typescript
export const useDateForm = (initialData: DateFormData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<DateFormErrors>({});
  const { validateDate, validatePeriod } = useDateValidation();
  const { normalizeForFirebase } = useDateConversion();

  const updateField = useCallback(
    (field: keyof DateFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpar erro do campo quando atualizado
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors: DateFormErrors = {};

    // Validações específicas baseadas no tipo de formulário
    if (formData.type === "temporary") {
      const startValidation = validateDate(formData.startDate);
      if (!startValidation.isValid) {
        newErrors.startDate = startValidation.error;
      }

      const periodValidation = validatePeriod(
        formData.startDate,
        formData.endDate
      );
      if (!periodValidation.isValid) {
        newErrors.endDate = periodValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDate, validatePeriod]);

  const getNormalizedData = useCallback(() => {
    return {
      ...formData,
      startDate: normalizeForFirebase(formData.startDate),
      endDate: normalizeForFirebase(formData.endDate),
    };
  }, [formData, normalizeForFirebase]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    getNormalizedData,
    setFormData,
    setErrors,
  };
};
```

---

## 🔧 **SERVIÇO CENTRALIZADO**

### **DateService.ts - Serviço Unificado**

```typescript
export class DateService {
  /**
   * Normaliza data para Firebase (evita problemas de fuso horário)
   */
  static normalizeForFirebase(date: string | Date): Date {
    return normalizeDateForFirebase(date);
  }

  /**
   * Converte data para Timestamp do Firebase
   */
  static toFirebaseTimestamp(date: string | Date): Timestamp {
    return toFirebaseTimestamp(date);
  }

  /**
   * Obtém timestamp do servidor Firebase
   */
  static getServerTimestamp(): FieldValue {
    return getServerTimestamp();
  }

  /**
   * Valida se data está no futuro
   */
  static validateFutureDate(date: string): ValidationResult {
    return validateFutureDate(date);
  }

  /**
   * Valida período de datas
   */
  static validatePeriod(
    startDate: string,
    endDate: string,
    maxDays: number = 365
  ): ValidationResult {
    return validateDatePeriod(startDate, endDate, maxDays);
  }

  /**
   * Formata data para exibição
   */
  static formatForDisplay(date: Date | string | FirebaseDate): string {
    return formatDateBR(date);
  }

  /**
   * Obtém data atual no formato YYYY-MM-DD
   */
  static getCurrentDateString(): string {
    return getCurrentDateString();
  }
}
```

---

## 🎯 **IMPLEMENTAÇÃO PADRÃO COMPONENTIZADA**

### **Antes (Código Duplicado):**

```typescript
// ❌ PROBLEMÁTICO - Lógica duplicada em cada componente
const validar = (input: RotaFormData) => {
  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");
  if (input.dataRota < hojeLocal) {
    novosErros.dataRota = "Data da rota não pode ser anterior ao dia atual";
  }
};

// ❌ PROBLEMÁTICO - Conversão manual em cada serviço
const temporaryPeriod = {
  startDate: new Date(formData.startDate), // Cria data em UTC
  endDate: new Date(formData.endDate), // Cria data em UTC
};
```

### **Depois (Componentizado):**

```typescript
// ✅ CORRETO - Componente reutilizável
<DateInput
  label="Data da Rota"
  value={formData.dataRota}
  onChange={setDataRota}
  minDate={DateService.getCurrentDateString()}
  required
/>

// ✅ CORRETO - Hook reutilizável
const { validateDate } = useDateValidation();
const dateValidation = validateDate(formData.dataRota);

// ✅ CORRETO - Serviço centralizado
const temporaryPeriod = {
  startDate: DateService.normalizeForFirebase(formData.startDate),
  endDate: DateService.normalizeForFirebase(formData.endDate),
};
```

---

## 📋 **CASOS DE USO COMPONENTIZADOS**

### **1. Alteração de Perfil Temporário (Gestão de Usuários)**

```typescript
// ✅ COMPONENTIZADO - Usando componentes reutilizáveis
export const UserRoleChangeModal: React.FC = () => {
  const { validateDate, validatePeriod } = useDateValidation();
  const { normalizeForFirebase } = useDateConversion();

  return (
    <form>
      {/* ... outros campos ... */}

      {formData.changeType === "temporary" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4>Configuração do Período Temporário</h4>

          <DateRangeInput
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) => updateField("startDate", date)}
            onEndDateChange={(date) => updateField("endDate", date)}
            minStartDate={DateService.getCurrentDateString()}
            required
            errors={errors}
          />
        </div>
      )}
    </form>
  );
};
```

### **2. Solicitação de Folgas**

```typescript
// ✅ COMPONENTIZADO - Usando componentes reutilizáveis
export const FolgaFormModal: React.FC = () => {
  const { validatePeriod } = useDateValidation();
  const { normalizeForFirebase } = useDateConversion();

  return (
    <form>
      <DateRangeInput
        startDate={valores.dataInicio}
        endDate={valores.dataFim}
        onStartDateChange={(date) => setValores({ ...valores, dataInicio: date })}
        onEndDateChange={(date) => setValores({ ...valores, dataFim: date })}
        required
        errors={erros}
      />
    </form>
  );
};
```

### **3. Criação de Rotas**

```typescript
// ✅ COMPONENTIZADO - Usando componentes reutilizáveis
export const RotaForm: React.FC = () => {
  const { validateDate } = useDateValidation();

  return (
    <form>
      <DateInput
        label="Data da Rota"
        value={formData.dataRota}
        onChange={(date) => updateField("dataRota", date)}
        minDate={DateService.getCurrentDateString()}
        required
        error={errors.dataRota}
      />
    </form>
  );
};
```

---

## 🔧 **FUNÇÕES UTILITÁRIAS (JÁ IMPLEMENTADAS)**

### **1. Função para Obter Data Atual**

```typescript
// src/utils/dateUtils.ts - JÁ IMPLEMENTADO
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
// src/utils/dateUtils.ts - JÁ IMPLEMENTADO
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
// src/utils/dateUtils.ts - JÁ IMPLEMENTADO
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

## 📝 **CHECKLIST DE IMPLEMENTAÇÃO COMPONENTIZADA**

### **Antes de Implementar:**

- [ ] Identificar o tipo de validação necessária (data única, período, etc.)
- [ ] Verificar se já existe componente similar no sistema
- [ ] Definir interface do componente (props, tipos)
- [ ] Planejar reutilização em outros lugares

### **Durante a Implementação:**

- [ ] Criar componente reutilizável em `src/components/common/`
- [ ] Implementar validações usando hooks customizados
- [ ] Usar `DateService` para operações de data
- [ ] Adicionar comentários explicativos
- [ ] Implementar tratamento de erros consistente

### **Após a Implementação:**

- [ ] Testar componente em diferentes cenários
- [ ] Verificar reutilização em outros formulários
- [ ] Documentar uso do componente
- [ ] Atualizar documentação existente

---

## 🚀 **EXEMPLO COMPLETO DE IMPLEMENTAÇÃO COMPONENTIZADA**

```typescript
// src/components/common/DateRangeInput.tsx
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  maxEndDate,
  required = false,
  errors = {},
  className = "",
}) => {
  const { validatePeriod } = useDateValidation();
  const { normalizeForFirebase } = useDateConversion();

  // Validação automática do período
  useEffect(() => {
    if (startDate && endDate) {
      const validation = validatePeriod(startDate, endDate);
      if (!validation.isValid) {
        // Notificar erro via callback ou contexto
      }
    }
  }, [startDate, endDate, validatePeriod]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <DateInput
        label="Data Início"
        value={startDate}
        onChange={onStartDateChange}
        minDate={minStartDate}
        maxDate={endDate}
        required={required}
        error={errors.startDate}
      />
      <DateInput
        label="Data Fim"
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
        maxDate={maxEndDate}
        required={required}
        error={errors.endDate}
      />
    </div>
  );
};
```

---

## 📚 **REFERÊNCIAS NO SISTEMA**

### **Implementações Existentes (Para Migração):**

- **Gestão de Usuários**: `src/components/configuracoes/state/useUserManagement.ts`
- **Rotas**: `src/components/rotas/state/useRotas.ts`
- **Folgas**: `src/components/folgas/state/useFolgas.ts`

### **Padrões a Seguir:**

- Uso de `DateService` para todas as operações de data
- Componentes reutilizáveis em `src/components/common/`
- Hooks customizados para lógica de validação
- Contexto de validação para estado global

---

## ⚠️ **ARMADILHAS A EVITAR (COMPONENTIZAÇÃO)**

1. **Não crie componentes muito específicos** - Mantenha flexibilidade
2. **Não ignore a reutilização** - Sempre pense em outros usos
3. **Não duplique lógica de validação** - Use hooks customizados
4. **Não esqueça de documentar** - Componentes reutilizáveis precisam de docs
5. **Não ignore a consistência** - Mantenha padrões visuais
6. **Não crie dependências circulares** - Estruture bem as importações
7. **Não ignore testes** - Componentes reutilizáveis precisam de testes robustos

---

## 🎯 **RESUMO DOS PRINCÍPIOS COMPONENTIZADOS**

1. **Reutilização**: Um componente, múltiplos usos
2. **Consistência**: Mesmo comportamento em todo o sistema
3. **Manutenibilidade**: Corrigir em um lugar, funciona em todos
4. **Flexibilidade**: Componentes adaptáveis a diferentes contextos
5. **Testabilidade**: Lógica centralizada, fácil de testar
6. **Documentação**: Uso claro e exemplos de implementação
7. **Padrões**: Seguir convenções estabelecidas

---

## 🚀 **PRÓXIMOS PASSOS PARA COMPONENTIZAÇÃO**

1. **Criar estrutura de pastas** para componentes comuns
2. **Implementar DateInput** como primeiro componente
3. **Implementar DateRangeInput** para períodos
4. **Criar hooks customizados** para validação e conversão
5. **Implementar DateService** como serviço centralizado
6. **Migrar formulários existentes** para usar componentes
7. **Testar e documentar** cada componente

---

_Última atualização: Janeiro 2025 - Baseado na implementação da Gestão de Usuários e direcionamento para componentização_
