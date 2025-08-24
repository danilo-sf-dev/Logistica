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

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  value?: any;
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
  fileName: string;
  date: Date;
  status: "success" | "partial" | "failed";
  userName: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ImportError[];
  warnings: ImportWarning[];
}

export interface ImportLog {
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
