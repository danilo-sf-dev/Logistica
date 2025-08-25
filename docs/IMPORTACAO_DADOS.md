# 📥 Importação de Dados - SGL

## 📋 Visão Geral

Este documento especifica a implementação da funcionalidade de importação de dados via Excel (XLSX) no Sistema de Gestão de Logística (SGL), seguindo a abordagem de botões de importação em cada seção.

## 🎯 Objetivos

- Permitir importação de dados via planilhas Excel
- Reduzir tempo de cadastro manual em 80%
- Eliminar erros de digitação
- Padronizar dados de entrada
- Manter consistência com a arquitetura atual

## 🏗️ Arquitetura da Solução

### Estrutura de Arquivos

```
src/
├── components/
│   ├── import/
│   │   ├── data/
│   │   │   ├── importService.ts          # Serviço base de importação
│   │   │   ├── validationService.ts      # Validação de dados
│   │   │   └── templateService.ts        # Geração de templates
│   │   ├── types/
│   │   │   └── importTypes.ts            # Tipos de importação
│   │   ├── ui/
│   │   │   ├── ImportModal.tsx           # Modal base de importação
│   │   │   ├── ImportProgress.tsx        # Componente de progresso
│   │   │   ├── ImportValidation.tsx      # Exibição de erros
│   │   │   └── FileUpload.tsx            # Upload de arquivos
│   │   └── utils/
│   │       ├── excelParser.ts            # Parser de Excel
│   │       ├── dataTransformer.ts        # Transformação de dados
│   │       └── templateGenerator.ts      # Geração de templates
│   └── [entidade]/
│       └── ui/
│           └── Import[Entidade]Modal.tsx # Modal específico por entidade
```

### Dependências Necessárias

```json
{
  "dependencies": {
    "papaparse": "^5.4.1",
    "react-dropzone": "^14.2.3",
    "file-upload-with-preview": "^4.1.0"
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.14"
  }
}
```

## 🔄 Fluxo de Usuário

### 1. Acesso à Importação

- Usuário navega para qualquer seção (Funcionários, Veículos, etc.)
- Vê botão "Importar Excel" ao lado do botão "Exportar Excel"

### 2. Download do Template

- Clica em "Importar Excel"
- Modal abre com opção de baixar template
- Template contém exemplo de dados e instruções

### 3. Preenchimento da Planilha

- Usuário baixa e preenche o template
- Segue as instruções e exemplos
- Salva a planilha

### 4. Upload e Validação

- Faz upload da planilha preenchida
- Sistema valida dados em tempo real
- Mostra erros e avisos

### 5. Confirmação e Importação

- Usuário revisa erros e confirma
- Sistema importa dados válidos
- Mostra relatório de resultado

### 6. Verificação

- Dados aparecem na tabela
- Usuário pode editar se necessário

### 7. Informações da Última Importação

- Modal exibe informações da última importação realizada
- Mostra nome do arquivo, data, status e usuário que fez a importação
- Captura automaticamente o usuário logado no sistema
- Atualiza automaticamente após nova importação
- Histórico visual para controle de operações

### 8. Flexibilidade de Uso do Template

- **Uso Padrão**: Preencher apenas a planilha "Template" e fazer upload
- **Personalização**: Usuário pode excluir planilhas "Instruções" e "Exemplo"
- **Renomeação**: Usuário pode renomear a planilha "Template" para qualquer nome
- **Detecção Inteligente**: Sistema detecta automaticamente a planilha com dados
- **Compatibilidade**: Funciona com arquivos de uma ou múltiplas planilhas

## 📊 Entidades Suportadas

### 1. Funcionários

**Campos Obrigatórios:**

- Nome
- CPF
- CNH
- Celular
- Cidade
- Função
- Status
- Tipo de Contrato
- Unidade de Negócio

**Campos Opcionais:**

- Email
- Endereço
- CEP
- Número
- Complemento
- CNH Vencimento
- CNH Categoria
- Exame Toxicológico
- Data de Admissão
- Salário
- Observação

### 2. Veículos

**Campos Obrigatórios:**

- Placa
- Marca
- Capacidade
- Tipo de Carroceria
- Quantidade de Eixos
- Tipo de Baú
- Status
- Unidade de Negócio

**Campos Opcionais:**

- Modelo
- Ano
- Última Manutenção
- Próxima Manutenção
- Motorista
- Observação

### 3. Cidades

**Campos Obrigatórios:**

- Nome
- Estado

**Campos Opcionais:**

- Região
- Distância
- Peso Mínimo
- Observação

**Validações Específicas:**

- **Unicidade**: Nome + Estado deve ser único no sistema
- **Formato**: Nome e Estado são convertidos para maiúsculas
- **Região**: Convertida para maiúsculas
- **Observação**: Convertida para maiúsculas
- **Números**: Distância e Peso Mínimo devem ser números válidos

**Nota:** O campo "Rota" foi removido do template de importação para simplificar o processo. As cidades devem ser vinculadas às rotas manualmente após a importação através da interface do sistema.

### 4. Vendedores

**Campos Obrigatórios:**

- Nome
- CPF
- Celular
- Região
- Unidade de Negócio
- Tipo de Contrato

**Campos Opcionais:**

- Email
- Código do Sistema
- Cidades Atendidas

**Validações Específicas:**

- **Unicidade**: CPF deve ser único no sistema
- **Email**: Deve ser único no sistema (se fornecido)
- **Código Sistema**: Deve ser único no sistema (se fornecido)
- **Formato**: Nome e Região são convertidos para maiúsculas
- **Email**: Convertido para minúsculas
- **Código Sistema**: Convertido para maiúsculas
- **Unidade Negócio**: Convertida para minúsculas
- **CPF**: Deve ter exatamente 11 dígitos
- **Celular**: Deve ter 10 ou 11 dígitos
- **Região**: Deve ser uma das opções válidas (SUDESTE, NORDESTE, SUL, NORTE, CENTRO-OESTE)
- **Unidade Negócio**: Deve ser uma das opções válidas (frigorifico, ovos, ambos)
- **Tipo Contrato**: Deve ser uma das opções válidas (clt, pj, autonomo, outro)
- **Cidades Atendidas**: Separadas por vírgula e convertidas em array

### 5. Rotas

**Campos Obrigatórios:**

- Nome
- Data da Rota
- Peso Mínimo
- Dia da Semana
- Cidades

### 6. Folgas

**Campos Obrigatórios:**

- Funcionário ID
- Nome do Funcionário
- Data Início
- Data Fim
- Tipo
- Status

**Campos Opcionais:**

- Observações
- Motivo
- Documento
- Horas

## 🛠️ Implementação Técnica

### 1. Serviços de Validação

#### ValidationService

Serviço base para validação padronizada de todas as entidades:

```typescript
export class ValidationService {
  // Validação de unicidade genérica
  static validateUniqueness<T>(...)

  // Validação de campos obrigatórios
  static validateRequiredFields(...)

  // Validação de campos numéricos
  static validateNumericFields(...)

  // Combinação de múltiplas validações
  static combineValidationResults(...)
}
```

**Benefícios:**

- **Reutilização**: Código padronizado para todas as entidades
- **Consistência**: Mesmo padrão de validação e mensagens
- **Manutenibilidade**: Centralização da lógica de validação

### 2. Tipos e Interfaces

```typescript
// src/components/import/types/importTypes.ts

export interface ImportConfig {
  entityType:
    | "funcionarios"
    | "veiculos"
    | "cidades"
    | "vendedores"
    | "rotas"
    | "folgas";
  requiredFields: string[];
  optionalFields: string[];
  validationRules: ValidationRule[];
  transformations: FieldTransformation[];
  templateConfig: TemplateConfig;
}

export interface ValidationRule {
  field: string;
  rule:
    | "required"
    | "email"
    | "cpf"
    | "cnh"
    | "placa"
    | "phone"
    | "date"
    | "number"
    | "unique";
  message: string;
  options?: any;
}

export interface FieldTransformation {
  field: string;
  transform:
    | "cleanNumeric"
    | "uppercase"
    | "lowercase"
    | "trim"
    | "formatDate"
    | "formatCurrency";
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  duration: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
  severity: "error" | "warning";
}

export interface ImportProgress {
  current: number;
  total: number;
  percentage: number;
  status: "parsing" | "validating" | "importing" | "completed" | "error";
  message: string;
}

export interface TemplateConfig {
  headers: string[];
  exampleData: any[];
  instructions: string[];
  validations: string[];
}

export interface LastImportInfo {
  id: string;
  entityType: string;
  fileName: string;
  date: Date;
  importedRows: number;
  totalRows: number;
  status: "success" | "partial" | "failed";
  userId: string;
  userName: string;
}
```

### 2. Serviço Base de Importação

```typescript
// src/components/import/data/importService.ts

export abstract class BaseImportService {
  protected abstract config: ImportConfig;

  async importFromExcel(file: File): Promise<ImportResult> {
    const startTime = Date.now();

    try {
      // 1. Parse do arquivo
      const data = await this.parseExcelFile(file);

      // 2. Validação
      const validation = await this.validateData(data);

      // 3. Transformação
      const transformedData = await this.transformData(data);

      // 4. Importação
      const result = await this.saveToDatabase(transformedData);

      // 5. Salvar log de importação
      result.duration = Date.now() - startTime;
      await this.saveImportLog(result, file.name, file.size);

      return result;
    } catch (error) {
      throw new Error(`Erro na importação: ${error.message}`);
    }
  }

  async generateTemplate(): Promise<Blob> {
    const template = this.config.templateConfig;
    const workbook = XLSX.utils.book_new();

    // Planilha 1: Instruções
    const instructionsSheet = this.createInstructionsSheet();
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instruções");

    // Planilha 2: Template
    const templateSheet = this.createTemplateSheet();
    XLSX.utils.book_append_sheet(workbook, templateSheet, "Template");

    // Planilha 3: Exemplo
    const exampleSheet = this.createExampleSheet();
    XLSX.utils.book_append_sheet(workbook, exampleSheet, "Exemplo");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  protected abstract validateData(data: any[]): Promise<ValidationResult>;
  protected abstract transformData(data: any[]): Promise<any[]>;
  protected abstract saveToDatabase(data: any[]): Promise<void>;

  // Método para salvar log de importação
  protected async saveImportLog(
    result: ImportResult,
    fileName: string,
    fileSize: number
  ): Promise<void> {
    try {
      const { user } = useAuth();
      const importLog: Omit<ImportLog, "id"> = {
        userId: user?.uid || "unknown",
        userName: user?.displayName || "Usuário",
        entityType: this.config.entityType,
        fileName,
        fileSize,
        totalRows: result.totalRows,
        importedRows: result.importedRows,
        failedRows: result.failedRows,
        errors: result.errors,
        warnings: result.warnings,
        startTime: new Date(),
        endTime: new Date(),
        duration: result.duration,
        status:
          result.failedRows === 0
            ? "success"
            : result.importedRows > 0
              ? "partial"
              : "failed",
        ipAddress: "client-ip", // Implementar captura de IP
        userAgent: navigator.userAgent,
      };

      await addDoc(collection(db, "import_logs"), importLog);
    } catch (error) {
      console.error("Erro ao salvar log de importação:", error);
    }
  }
}

// Serviço para buscar informações da última importação
export async function getLastImportInfo(
  entityType: string
): Promise<LastImportInfo | null> {
  try {
    const importLogsRef = collection(db, "import_logs");
    const q = query(
      importLogsRef,
      where("entityType", "==", entityType),
      orderBy("startTime", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      entityType: data.entityType,
      fileName: data.fileName,
      date: data.startTime.toDate(),
      importedRows: data.importedRows,
      totalRows: data.totalRows,
      status: data.status,
      userId: data.userId,
      userName: data.userName || "Usuário",
    };
  } catch (error) {
    console.error("Erro ao buscar última importação:", error);
    return null;
  }
}
```

### 3. Serviços Específicos por Entidade

```typescript
// src/components/import/data/funcionariosImportService.ts

export class FuncionariosImportService extends BaseImportService {
  protected config: ImportConfig = {
    entityType: "funcionarios",
    requiredFields: [
      "nome",
      "cpf",
      "cnh",
      "celular",
      "cidade",
      "funcao",
      "status",
      "tipoContrato",
      "unidadeNegocio",
    ],
    optionalFields: [
      "email",
      "endereco",
      "cep",
      "numero",
      "complemento",
      "cnhVencimento",
      "cnhCategoria",
      "toxicoUltimoExame",
      "toxicoVencimento",
      "dataAdmissao",
      "salario",
      "observacao",
    ],
    validationRules: [
      { field: "cpf", rule: "cpf", message: "CPF inválido" },
      { field: "cnh", rule: "required", message: "CNH obrigatória" },
      { field: "celular", rule: "phone", message: "Celular inválido" },
      { field: "email", rule: "email", message: "Email inválido" },
      { field: "cpf", rule: "unique", message: "CPF já cadastrado" },
      { field: "cnh", rule: "unique", message: "CNH já cadastrada" },
    ],
    transformations: [
      { field: "cpf", transform: "cleanNumeric" },
      { field: "celular", transform: "cleanNumeric" },
      { field: "cep", transform: "cleanNumeric" },
      { field: "nome", transform: "uppercase" },
      { field: "email", transform: "lowercase" },
    ],
    templateConfig: {
      headers: [
        "Nome*",
        "CPF*",
        "CNH*",
        "Celular*",
        "Email",
        "Cidade*",
        "Função*",
        "Status*",
        "Tipo Contrato*",
        "Unidade Negócio*",
      ],
      exampleData: [
        [
          "JOÃO SILVA",
          "12345678901",
          "12345678901",
          "11999999999",
          "joao@email.com",
          "São Paulo",
          "motorista",
          "disponivel",
          "clt",
          "frigorifico",
        ],
        [
          "MARIA SANTOS",
          "98765432100",
          "98765432100",
          "11888888888",
          "maria@email.com",
          "Rio de Janeiro",
          "auxiliar",
          "trabalhando",
          "pj",
          "ovos",
        ],
      ],
      instructions: [
        "1. Preencha todos os campos marcados com *",
        "2. CPF deve ter 11 dígitos sem pontos ou traços",
        "3. Celular deve ter 10 ou 11 dígitos",
        "4. Email deve ser válido (opcional)",
        "5. Função: motorista, auxiliar, supervisor",
        "6. Status: disponivel, trabalhando, folga, ferias",
        "7. Tipo Contrato: clt, pj, autonomo, outro",
        "8. Unidade Negócio: frigorifico, ovos, ambos",
      ],
      validations: [
        "CPF deve ser único no sistema",
        "CNH deve ser única no sistema",
        "Email deve ser único (se fornecido)",
        "Data de admissão deve ser válida",
        "Salário deve ser numérico",
      ],
    },
  };
}
```

### 4. Componentes de Interface

#### 4.1 Modal Base de Importação

**Características do Modal:**

- **Layout Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Rolagem Inteligente**: Área de conteúdo com scroll independente
- **Gerenciamento de Erros**: Interface otimizada para grandes volumes
- **Botões Contextuais**: "Ver Todos" para expandir/recolher erros
- **Cards Visuais**: Erros e avisos organizados em cards separados
- **Indicadores Visuais**: Cores e ícones para melhor identificação

```typescript
// src/components/import/ui/ImportModal.tsx

interface ImportModalProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: ImportResult) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  entityType,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'template' | 'upload' | 'validation' | 'progress' | 'result'>('template');
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [lastImport, setLastImport] = useState<LastImportInfo | null>(null);

  // Carregar informações da última importação
  useEffect(() => {
    if (isOpen) {
      loadLastImportInfo(entityType);
    }
  }, [isOpen, entityType]);

  const loadLastImportInfo = async (entityType: string) => {
    try {
      const lastImportInfo = await getLastImportInfo(entityType);
      setLastImport(lastImportInfo);
    } catch (error) {
      console.error('Erro ao carregar última importação:', error);
    }
  };

  const handleDownloadTemplate = async () => {
    const service = getImportService(entityType);
    const template = await service.generateTemplate();
    saveAs(template, `template_${entityType}.xlsx`);
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStep('validation');
  };

  const handleValidation = async () => {
    if (!file) return;

    setStep('progress');
    const service = getImportService(entityType);

    try {
      const result = await service.importFromExcel(file);
      setResult(result);
      setStep('result');
      onSuccess(result);

      // Atualizar informações da última importação
      await loadLastImportInfo(entityType);
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Importar {getEntityName(entityType)}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Informações da Última Importação */}
        {lastImport && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Última Importação</h4>
                <p className="text-sm text-blue-700">
                  Arquivo: <span className="font-medium">{lastImport.fileName}</span>
                </p>
                <p className="text-sm text-blue-700">
                  Data: <span className="font-medium">{formatDate(lastImport.date)}</span>
                </p>
                <p className="text-sm text-blue-700">
                  Registros: <span className="font-medium">{lastImport.importedRows} importados</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'template' && (
          <TemplateStep onDownload={handleDownloadTemplate} onNext={() => setStep('upload')} />
        )}

        {step === 'upload' && (
          <UploadStep onFileSelect={handleFileUpload} onBack={() => setStep('template')} />
        )}

        {step === 'validation' && (
          <ValidationStep
            file={file!}
            onValidate={handleValidation}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'progress' && (
          <ProgressStep progress={progress} />
        )}

        {step === 'result' && (
          <ResultStep result={result!} onClose={onClose} />
        )}
      </div>
    </Modal>
  );
};
```

#### 4.2 Componente de Informações da Última Importação

```typescript
// src/components/import/ui/LastImportInfo.tsx

interface LastImportInfoProps {
  lastImport: LastImportInfo | null;
}

export const LastImportInfo: React.FC<LastImportInfoProps> = ({ lastImport }) => {
  if (!lastImport) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Nenhuma importação anterior</h4>
            <p className="text-sm text-gray-500">
              Esta será a primeira importação para esta entidade
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'partial':
        return 'Parcial';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900">Última Importação</h4>

          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Arquivo:</span>
              <span className="text-sm font-medium text-blue-900">{lastImport.fileName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Data:</span>
              <span className="text-sm font-medium text-blue-900">
                {formatDate(lastImport.date)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Registros:</span>
              <span className="text-sm font-medium text-blue-900">
                {lastImport.importedRows} de {lastImport.totalRows}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Status:</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lastImport.status)}`}>
                {getStatusText(lastImport.status)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Usuário:</span>
              <span className="text-sm font-medium text-blue-900">{lastImport.userName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 4.3 Componente de Upload

```typescript
// src/components/import/ui/FileUpload.tsx

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['.xlsx', '.xls'],
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Solte o arquivo aqui...'
          : 'Arraste e solte um arquivo Excel aqui, ou clique para selecionar'
        }
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Formatos aceitos: {acceptedTypes.join(', ')} | Máximo: {maxSize / 1024 / 1024}MB
      </p>
    </div>
  );
};
```

### 5. Integração nas Páginas Existentes

#### 5.1 Exemplo: FuncionariosListPage

```typescript
// src/components/funcionarios/pages/FuncionariosListPage.tsx

export const FuncionariosListPage: React.FC = () => {
  const [showImportModal, setShowImportModal] = useState(false);

  // ... código existente ...

  const handleImportSuccess = (result: ImportResult) => {
    showNotification(
      `Importação concluída: ${result.importedRows} registros importados, ${result.failedRows} falharam`,
      result.failedRows === 0 ? 'success' : 'warning'
    );
    // Recarregar dados da tabela
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Funcionários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os funcionários da empresa
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportClick}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </button>
        </div>
      </div>

      {/* ... resto do código existente ... */}

      {/* Modal de Importação */}
      <ImportModal
        entityType="funcionarios"
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};
```

## 📋 Templates de Importação

### Estrutura dos Templates

Cada template terá 3 planilhas:

1. **Instruções**: Guia completo de preenchimento com opções de uso
2. **Template**: Planilha vazia com cabeçalhos para preenchimento
3. **Exemplo**: Dados fictícios para referência

### Flexibilidade dos Templates

O sistema foi projetado para máxima flexibilidade:

- **Uso Simples**: Preencher apenas a planilha "Template" e fazer upload
- **Personalização**: Usuário pode excluir planilhas "Instruções" e "Exemplo"
- **Renomeação**: Usuário pode renomear a planilha "Template" para qualquer nome
- **Detecção Automática**: Sistema identifica automaticamente a planilha com dados
- **Compatibilidade**: Funciona com arquivos de uma ou múltiplas planilhas

### Exemplo: Template de Funcionários

#### Planilha 1: Instruções

```
IMPORTAÇÃO DE FUNCIONÁRIOS - INSTRUÇÕES

📋 COMO USAR ESTE TEMPLATE:

✅ OPÇÃO 1 - USO SIMPLES (RECOMENDADO):
   1. Vá para a planilha 'Template'
   2. Preencha seus dados na planilha 'Template'
   3. Salve o arquivo
   4. Faça upload no sistema
   5. Pronto! Os dados serão importados automaticamente

✅ OPÇÃO 2 - PERSONALIZAÇÃO:
   - Você pode excluir as planilhas 'Instruções' e 'Exemplo'
   - Você pode renomear a planilha 'Template' para qualquer nome
   - O sistema detectará automaticamente a planilha com dados

📝 REGRAS DE PREENCHIMENTO:
   - Todos os campos marcados com * são obrigatórios
   - Não deixe linhas em branco entre os dados
   - Preencha apenas na planilha 'Template' (ou sua planilha renomeada)

📊 FORMATO DOS DADOS:
   - Nome: Texto (será convertido para maiúsculas)
   - CPF: 11 dígitos sem pontos ou traços
   - CNH: Número da CNH
   - Celular: 10 ou 11 dígitos
   - Email: Formato válido (opcional)

🔍 VALIDAÇÕES:
   - CPF deve ser único no sistema
   - CNH deve ser única no sistema
   - Email deve ser único (se fornecido)

💡 DICA:
   - Veja a planilha 'Exemplo' para referência de preenchimento
   - O sistema aceita o arquivo mesmo se você excluir outras planilhas
   - O sistema aceita o arquivo mesmo se você renomear a planilha 'Template'
```

#### Planilha 2: Template

```
Nome* | CPF* | CNH* | Celular* | Email | Cidade* | Função* | Status* | Tipo Contrato* | Unidade Negócio*
```

#### Planilha 3: Exemplo

```
Nome* | CPF* | CNH* | Celular* | Email | Cidade* | Função* | Status* | Tipo Contrato* | Unidade Negócio*
JOÃO SILVA | 12345678901 | 12345678901 | 11999999999 | joao@email.com | São Paulo | motorista | disponivel | clt | frigorifico
MARIA SANTOS | 98765432100 | 98765432100 | 11888888888 | maria@email.com | Rio de Janeiro | auxiliar | trabalhando | pj | ovos
```

### Exemplo: Template de Cidades

#### Planilha 1: Instruções

```
IMPORTAÇÃO DE CIDADES - INSTRUÇÕES

📋 COMO USAR ESTE TEMPLATE:

✅ OPÇÃO 1 - USO SIMPLES (RECOMENDADO):
   1. Vá para a planilha 'Template'
   2. Preencha seus dados na planilha 'Template'
   3. Salve o arquivo
   4. Faça upload no sistema
   5. Pronto! Os dados serão importados automaticamente

✅ OPÇÃO 2 - PERSONALIZAÇÃO:
   - Você pode excluir as planilhas 'Instruções' e 'Exemplo'
   - Você pode renomear a planilha 'Template' para qualquer nome
   - O sistema detectará automaticamente a planilha com dados

📝 REGRAS DE PREENCHIMENTO:
   - Todos os campos marcados com * são obrigatórios
   - Não deixe linhas em branco entre os dados
   - Preencha apenas na planilha 'Template' (ou sua planilha renomeada)

📊 FORMATO DOS DADOS:
   - Nome: Nome da cidade (será convertido para maiúsculas)
   - Estado: Sigla do estado (será convertido para maiúsculas)
   - Região: Região geográfica (opcional, será convertido para minúsculas)
   - Distância: Distância em km da sede (opcional, apenas números)
   - Peso Mínimo: Peso mínimo em kg para entrega (opcional, apenas números)
   - Observação: Observações adicionais (opcional)

🔍 VALIDAÇÕES:
   - Nome e Estado são obrigatórios
   - Nome da cidade deve ser único no sistema
   - Distância e Peso Mínimo devem ser números válidos
   - Estado deve ser uma sigla válida (SP, RJ, MG, etc.)

💡 DICA:
   - Veja a planilha 'Exemplo' para referência de preenchimento
   - O sistema aceita o arquivo mesmo se você excluir outras planilhas
   - O sistema aceita o arquivo mesmo se você renomear a planilha 'Template'
```

#### Planilha 2: Template

```
Nome* | Estado* | Região | Distância (km) | Peso Mínimo (kg) | Observação
```

#### Planilha 3: Exemplo

```
Nome* | Estado* | Região | Distância (km) | Peso Mínimo (kg) | Observação
SÃO PAULO | SP | sudeste | 0 | 1000 | Capital do estado
RIO DE JANEIRO | RJ | sudeste | 430 | 500 | Cidade maravilhosa
BELO HORIZONTE | MG | sudeste | 586 | 800 | Capital de Minas
```

### Exemplo: Template de Vendedores

#### Planilha 1: Instruções

```
IMPORTAÇÃO DE VENDEDORES - INSTRUÇÕES

📋 COMO USAR ESTE TEMPLATE:

✅ OPÇÃO 1 - USO SIMPLES (RECOMENDADO):
   1. Vá para a planilha 'Template'
   2. Preencha seus dados na planilha 'Template'
   3. Salve o arquivo
   4. Faça upload no sistema
   5. Pronto! Os dados serão importados automaticamente

✅ OPÇÃO 2 - PERSONALIZAÇÃO:
   - Você pode excluir as planilhas 'Instruções' e 'Exemplo'
   - Você pode renomear a planilha 'Template' para qualquer nome
   - O sistema detectará automaticamente a planilha com dados

📝 REGRAS DE PREENCHIMENTO:
   - Todos os campos marcados com * são obrigatórios
   - Não deixe linhas em branco entre os dados
   - Preencha apenas na planilha 'Template' (ou sua planilha renomeada)
   - CPF deve ser válido (não apenas 11 dígitos, mas um CPF real)

📊 FORMATO DOS DADOS:
   - Nome: Nome completo (será convertido para maiúsculas)
   - CPF: 11 dígitos sem pontos ou traços (deve ser um CPF válido)
   - Email: Formato válido (opcional, será convertido para minúsculas)
   - Celular: 10 ou 11 dígitos sem formatação
   - Região: SUDESTE, NORDESTE, SUL, NORTE, CENTRO-OESTE (será convertido para maiúsculas)
   - Código Sistema: Código interno (opcional, será convertido para maiúsculas)
   - Unidade Negócio: frigorifico, ovos, ambos
   - Tipo Contrato: clt, pj, autonomo, outro
   - Cidades Atendidas: Separadas por vírgula (opcional)

🔍 VALIDAÇÕES:
   - CPF deve ser único no sistema e válido
   - Email deve ser único no sistema (se fornecido)
   - Código do Sistema deve ser único no sistema (se fornecido)
   - Região deve ser uma das opções válidas
   - Unidade de Negócio deve ser uma das opções válidas
   - Tipo de Contrato deve ser uma das opções válidas

💡 DICA:
   - Veja a planilha 'Exemplo' para referência de preenchimento
   - O sistema aceita o arquivo mesmo se você excluir outras planilhas
   - O sistema aceita o arquivo mesmo se você renomear a planilha 'Template'
```

#### Planilha 2: Template

```
Nome* | CPF* | Email | Celular* | Região* | Código Sistema | Unidade Negócio* | Tipo Contrato* | Cidades Atendidas
```

#### Planilha 3: Exemplo

```
Nome* | CPF* | Email | Celular* | Região* | Código Sistema | Unidade Negócio* | Tipo Contrato* | Cidades Atendidas
JOÃO SILVA | 12345678901 | joao@empresa.com | 11999999999 | SUDESTE | VEND001 | frigorifico | clt | São Paulo,Rio de Janeiro
MARIA SANTOS | 98765432100 | maria@empresa.com | 11888888888 | NORDESTE | VEND002 | ovos | pj | Salvador,Ilhéus
```

## 🔒 Segurança e Validação

### Regras de Validação

1. **Campos Obrigatórios**: Verificação de preenchimento
2. **Formato de Dados**: Validação de formato (CPF, email, etc.)
3. **Unicidade**: Verificação de duplicatas no sistema e no arquivo
4. **Integridade**: Validação de relacionamentos
5. **Tamanho**: Limite de registros por importação
6. **Formatação**: Conversão automática de maiúsculas/minúsculas

### Validação de Duplicidade

O sistema possui validação robusta de duplicidade que funciona em dois níveis:

#### **1. Duplicatas no Sistema**

- Verifica se o registro já existe no banco de dados
- **Cidades**: Nome + Estado deve ser único
- **Funcionários**: CPF e CNH devem ser únicos
- **Veículos**: Placa deve ser única
- **Vendedores**: CPF deve ser único
- **Rotas**: Nome deve ser único
- **Folgas**: Funcionário + Data deve ser único

#### **2. Duplicatas no Arquivo**

- Verifica se há registros duplicados dentro do próprio arquivo
- Impede importação de múltiplas linhas com os mesmos dados
- Mensagem clara indicando qual linha está duplicada

#### **3. Feedback ao Usuário**

- **Modal de Resultado**: Exibe todos os erros encontrados
- **Mensagens Específicas**: Indica exatamente qual campo está duplicado
- **Sugestões**: Orienta o usuário sobre como corrigir
- **Botão "Tentar Novamente"**: Permite nova tentativa após correção
- **Gerenciamento de Muitos Erros**: Interface otimizada para grandes volumes de erros
- **Rolagem Inteligente**: Área com scroll para visualizar todos os erros
- **Botão "Ver Todos"**: Expande/recolhe lista quando há muitos erros

### Detecção Inteligente de Planilhas

O sistema possui detecção automática de planilhas com dados:

- **Palavras-chave**: Procura por planilhas com nomes como "template", "dados", "cidades", etc.
- **Fallback**: Se não encontrar, usa a segunda planilha (assumindo que a primeira é instruções)
- **Validação**: Verifica se a planilha contém dados reais
- **Logs**: Informa qual planilha está sendo lida para debug

### Cenários Suportados

| Cenário                 | Funciona? | Detalhes                      |
| ----------------------- | --------- | ----------------------------- |
| **Template original**   | ✅        | Planilha "Template" detectada |
| **Template renomeado**  | ✅        | "Cidades", "Dados", etc.      |
| **Apenas 1 planilha**   | ✅        | Se contiver dados             |
| **Múltiplas planilhas** | ✅        | Detecta automaticamente       |
| **Planilha vazia**      | ❌        | Erro informativo              |

### Tratamento de Erros

1. **Erros Críticos**: Impedem importação completamente
2. **Avisos**: Permitem importação com alerta
3. **Logs**: Registro completo de operações
4. **Rollback**: Desfazer em caso de falha
5. **Feedback Visual**: Modal com detalhes dos erros
6. **Sugestões**: Orientações para correção dos problemas
7. **Interface Responsiva**: Modal adaptável para qualquer quantidade de erros
8. **Gerenciamento de Volume**: Otimizado para grandes volumes de dados

## 📊 Logs e Auditoria

### Estrutura de Logs

```typescript
interface ImportLog {
  id: string;
  userId: string;
  userName: string;
  entityType: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  startTime: Date;
  endTime: Date;
  duration: number;
  status: "success" | "partial" | "failed";
  ipAddress: string;
  userAgent: string;
}
```

### Armazenamento

- **Coleção**: `import_logs`
- **Retenção**: 1 ano
- **Backup**: Automático
- **Acesso**: Apenas administradores

## 🚀 Cronograma de Implementação

### Fase 1 (2 semanas) ✅ **CONCLUÍDA**

- [x] Estrutura base de importação
- [x] Serviço de parsing Excel
- [x] Validação básica
- [x] Template de Cidades
- [x] Modal de importação
- [x] Detecção inteligente de planilhas
- [x] Flexibilidade de uso do template

### Fase 2 (2 semanas) ✅ **EM ANDAMENTO**

- [x] Templates de Cidades ✅
- [x] Templates de Vendedores ✅
- [ ] Templates de Veículos
- [ ] Templates de Funcionários
- [x] Validações específicas ✅
- [x] Tratamento de erros ✅
- [x] Logs de importação ✅

### Fase 3 (1 semana)

- [ ] Templates de Vendedores e Rotas
- [ ] Validações avançadas
- [ ] Testes e refinamentos

### Fase 4 (1 semana)

- [ ] Template de Folgas
- [ ] Documentação
- [ ] Treinamento
- [ ] Deploy

## 📈 Métricas de Sucesso

1. **Redução de 80% no tempo de cadastro**
2. **Zero erros de digitação**
3. **100% de dados padronizados**
4. **Taxa de sucesso > 95% nas importações**
5. **Feedback positivo dos usuários**

## 🔄 Manutenção e Evolução

### Atualizações Futuras

1. **Importação em lote** (múltiplas entidades)
2. **Integração com APIs externas**
3. **Validação em tempo real**
4. **Templates personalizados**
5. **Agendamento de importações**

### Monitoramento

1. **Métricas de uso**
2. **Taxa de erro**
3. **Performance**
4. **Feedback dos usuários**

## 📋 Resumo das Melhorias Implementadas

### ✅ **Funcionalidades Adicionadas:**

1. **Flexibilidade Total de Templates**
   - Usuário pode excluir planilhas desnecessárias
   - Usuário pode renomear planilhas
   - Sistema detecta automaticamente a planilha com dados

2. **Instruções Melhoradas**
   - Instruções claras com emojis e formatação
   - Duas opções de uso (simples e personalizado)
   - Dicas sobre flexibilidade do sistema

3. **Detecção Inteligente**
   - Busca por palavras-chave em nomes de planilhas
   - Fallback para segunda planilha
   - Validação de dados reais
   - Logs informativos

4. **Simplificação de Campos**
   - Remoção do campo "Rota" do template de cidades
   - Foco em dados essenciais
   - Vinculação manual após importação

5. **Validação Robusta de Duplicidade**
   - Verificação de duplicatas no sistema
   - Verificação de duplicatas no arquivo
   - Mensagens de erro específicas e claras
   - Feedback visual completo ao usuário

6. **Formatação Automática**
   - Conversão automática para maiúsculas
   - Padronização de dados
   - Validação de formatos numéricos

7. **Interface Responsiva**
   - Modal adaptável para qualquer quantidade de erros
   - Rolagem inteligente para grandes volumes
   - Gerenciamento visual de muitos erros
   - Cards visuais para melhor organização

### 🎯 **Benefícios Alcançados:**

- **🎯 Simplicidade**: Template mais limpo e fácil de usar
- **🔧 Flexibilidade**: Usuário pode personalizar como quiser
- **📝 Clareza**: Instruções muito mais claras e organizadas
- **⚡ Eficiência**: Processo de importação mais rápido
- **🛡️ Robustez**: Funciona em diversos cenários
- **🔒 Segurança**: Validação completa de duplicidade
- **👥 Usabilidade**: Feedback claro e orientações para correção
- **📱 Responsividade**: Interface adaptável para qualquer dispositivo
- **📊 Escalabilidade**: Suporte a grandes volumes de dados

---

**Documento criado em:** Janeiro 2025  
**Versão:** 1.2  
**Última atualização:** Janeiro 2025  
**Responsável:** Equipe de Desenvolvimento SGL

**Principais Atualizações v1.2:**

- ✅ Validação robusta de duplicidade (sistema + arquivo)
- ✅ Serviço padronizado de validação (ValidationService)
- ✅ Interface responsiva para grandes volumes de erros
- ✅ Modal com rolagem inteligente e gerenciamento visual
- ✅ Feedback completo e orientações para correção
- ✅ Implementação completa da importação de Vendedores
- ✅ Validações específicas para CPF, Email, Código Sistema
- ✅ Formatação automática de dados (maiúsculas/minúsculas)
- ✅ Conversão de cidades atendidas de string para array
