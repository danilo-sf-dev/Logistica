# 🔐 Plano de Segurança para Produção - SGL

## 📋 **Visão Geral**

Este documento apresenta um plano abrangente para implementar medidas de segurança críticas no Sistema de Gestão de Logística (SGL) antes da implantação em produção.

**Status Atual:** ⚠️ **Sistema em Desenvolvimento - Não Seguro para Produção**  
**Objetivo:** ✅ **Sistema Seguro para Produção**  
**Prazo Estimado:** 2-3 semanas de implementação

---

## 🎯 **Análise de Riscos Identificados**

### 🔴 **Riscos Críticos (Implementação Imediata)**

| Risco                            | Impacto | Probabilidade | Prioridade |
| -------------------------------- | ------- | ------------- | ---------- |
| Ataques de Força Bruta           | Alto    | Alta          | 🔴 Crítica |
| Vulnerabilidades XSS             | Alto    | Média         | 🔴 Crítica |
| Exposição de Código Fonte        | Médio   | Alta          | 🟡 Alta    |
| Falta de Validação Server-Side   | Alto    | Média         | 🔴 Crítica |
| Dependência de Serviços Externos | Médio   | Média         | 🟡 Alta    |

### 🟡 **Riscos Médios (Implementação Secundária)**

| Risco              | Impacto | Probabilidade | Prioridade |
| ------------------ | ------- | ------------- | ---------- |
| Falta de Auditoria | Médio   | Baixa         | 🟡 Média   |
| Logs Insuficientes | Baixo   | Média         | 🟢 Baixa   |

---

## 📋 **Plano de Implementação por Fases**

### **FASE 1: Proteções Críticas (Semana 1)**

_Implementações que não quebram o sistema atual_

1. **Rate Limiting** - Proteção contra força bruta
2. **Content Security Policy** - Proteção contra XSS
3. **Desabilitar Source Maps** - Proteção de código fonte
4. **Melhorar Captura de IP** - Eliminar dependência externa

### **FASE 2: Validações Avançadas (Semana 2)**

_Implementações que requerem testes extensivos_

1. **Validação Server-Side** - Regras do Firestore
2. **Sanitização Avançada** - Proteção contra injeção
3. **Auditoria de Ações** - Logs de segurança

### **FASE 3: Monitoramento (Semana 3)**

_Implementações de monitoramento e alertas_

1. **Sistema de Alertas** - Notificações de segurança
2. **Dashboard de Segurança** - Monitoramento em tempo real
3. **Testes de Penetração** - Validação final

---

## 🔴 **FASE 1: PROTEÇÕES CRÍTICAS**

### **1.1 Rate Limiting - Proteção contra Força Bruta**

#### **Motivo da Implementação**

- **Problema:** Sistema permite tentativas ilimitadas de login
- **Risco:** Ataques de força bruta podem comprometer contas
- **Impacto:** Comprometimento de credenciais de usuários

#### **Implementação**

**1.1.1 Instalar Dependência**

```bash
npm install express-rate-limit
```

**1.1.2 Criar Middleware de Rate Limiting**

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

// Rate limiting para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// Rate limiting para criação de contas
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas
  message: {
    error: "Muitas tentativas de criação de conta. Tente novamente em 1 hora.",
    code: "SIGNUP_RATE_LIMIT_EXCEEDED",
  },
});

// Rate limiting para operações sensíveis
export const sensitiveOperationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 operações
  message: {
    error: "Muitas operações. Tente novamente em 5 minutos.",
    code: "OPERATION_RATE_LIMIT_EXCEEDED",
  },
});
```

**1.1.3 Integrar no AuthContext**

```typescript
// src/contexts/AuthContext.tsx
// Adicionar no início do arquivo
import { loginLimiter } from "../middleware/rateLimiter";

// Modificar a função login
const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    // Verificar rate limit antes da tentativa
    const rateLimitKey = `login:${email}`;
    const currentAttempts = await checkRateLimit(rateLimitKey);

    if (currentAttempts >= 5) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    const result = await signInWithEmailAndPassword(auth, email, password);

    // Reset rate limit em caso de sucesso
    await resetRateLimit(rateLimitKey);

    // ... resto do código existente
    return result;
  } catch (error) {
    // Incrementar contador de tentativas em caso de falha
    await incrementRateLimit(rateLimitKey);
    throw error;
  }
};
```

**1.1.4 Implementar Funções de Rate Limit**

```typescript
// src/services/rateLimitService.ts
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase/config";

export class RateLimitService {
  private static COLLECTION = "rateLimits";

  static async checkRateLimit(key: string): Promise<number> {
    try {
      const docRef = doc(db, this.COLLECTION, key);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutos

        // Verificar se ainda está na janela de tempo
        if (now - data.timestamp < windowMs) {
          return data.attempts || 0;
        }
      }
      return 0;
    } catch (error) {
      console.error("Erro ao verificar rate limit:", error);
      return 0;
    }
  }

  static async incrementRateLimit(key: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, key);
      await setDoc(
        docRef,
        {
          attempts: increment(1),
          timestamp: Date.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Erro ao incrementar rate limit:", error);
    }
  }

  static async resetRateLimit(key: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, key);
      await setDoc(docRef, {
        attempts: 0,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao resetar rate limit:", error);
    }
  }
}
```

### **1.2 Content Security Policy (CSP)**

#### **Motivo da Implementação**

- **Problema:** Ausência de proteção contra ataques XSS
- **Risco:** Execução de scripts maliciosos no navegador
- **Impacto:** Comprometimento de sessões e dados de usuários

#### **Implementação**

**1.2.1 Configurar CSP no Vite**

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // ... configuração existente
    server: {
      port: 3000,
      open: true,
      headers: {
        // Headers existentes
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "unsafe-none",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer-when-downgrade",

        // NOVO: Content Security Policy
        "Content-Security-Policy":
          mode === "production"
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; frame-src 'self' https://accounts.google.com;"
            : "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
      },
    },
    // ... resto da configuração
  };
});
```

**1.2.2 Adicionar Meta Tag CSP**

```html
<!-- index.html -->
<head>
  <!-- ... meta tags existentes -->

  <!-- Content Security Policy -->
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; 
                 script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com; 
                 style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
                 font-src 'self' https://fonts.gstatic.com; 
                 img-src 'self' data: https:; 
                 connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; 
                 frame-src 'self' https://accounts.google.com;"
  />
</head>
```

**1.2.3 Criar Utilitário de Sanitização**

```typescript
// src/utils/sanitization.ts
export class SanitizationUtils {
  // Sanitizar HTML
  static sanitizeHTML(input: string): string {
    if (!input) return "";

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  // Sanitizar para atributos
  static sanitizeAttribute(input: string): string {
    if (!input) return "";

    return input
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Validar e sanitizar URLs
  static sanitizeURL(url: string): string {
    if (!url) return "";

    try {
      const urlObj = new URL(url);
      // Permitir apenas HTTP e HTTPS
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        return "";
      }
      return urlObj.toString();
    } catch {
      return "";
    }
  }

  // Sanitizar dados de formulário
  static sanitizeFormData(data: any): any {
    if (typeof data === "string") {
      return this.sanitizeHTML(data);
    }

    if (typeof data === "object" && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};

      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeFormData(value);
      }

      return sanitized;
    }

    return data;
  }
}
```

### **1.3 Desabilitar Source Maps em Produção**

#### **Motivo da Implementação**

- **Problema:** Source maps expõem código fonte em produção
- **Risco:** Engenharia reversa e análise de vulnerabilidades
- **Impacto:** Exposição de lógica de negócio e possíveis vulnerabilidades

#### **Implementação**

**1.3.1 Modificar Configuração do Vite**

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // ... configuração existente
    build: {
      outDir: "dist",
      sourcemap: mode === "development", // ✅ Só habilitar em desenvolvimento
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
            ui: ["@headlessui/react", "@heroicons/react", "lucide-react"],
          },
        },
      },
    },
    // ... resto da configuração
  };
});
```

**1.3.2 Configurar Firebase Hosting**

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.map" // ✅ Ignorar source maps
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.map",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
}
```

### **1.4 Melhorar Captura de IP**

#### **Motivo da Implementação**

- **Problema:** Dependência de serviço externo para captura de IP
- **Risco:** Falha do serviço externo e possível vazamento de dados
- **Impacto:** Perda de funcionalidade e possíveis problemas de privacidade

#### **Implementação**

**1.4.1 Criar Firebase Function para Captura de IP**

```typescript
// functions/src/ipService.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const getClientIP = functions.https.onCall(async (data, context) => {
  // Verificar se o usuário está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Usuário deve estar autenticado"
    );
  }

  try {
    // Capturar IP do cliente
    const clientIP =
      context.rawRequest.ip ||
      context.rawRequest.connection.remoteAddress ||
      context.rawRequest.socket.remoteAddress ||
      context.rawRequest.headers["x-forwarded-for"]?.split(",")[0] ||
      "Não disponível";

    // Capturar informações do User-Agent
    const userAgent =
      context.rawRequest.headers["user-agent"] || "Não disponível";

    // Capturar informações geográficas (opcional)
    const geoInfo = await getGeoInfo(clientIP);

    return {
      ip: clientIP,
      userAgent,
      geoInfo,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
  } catch (error) {
    console.error("Erro ao capturar IP:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erro ao capturar informações do cliente"
    );
  }
});

async function getGeoInfo(ip: string) {
  // Implementar serviço de geolocalização se necessário
  // Por enquanto, retornar informações básicas
  return {
    country: "BR",
    region: "Unknown",
    city: "Unknown",
  };
}
```

**1.4.2 Atualizar SessionService**

```typescript
// src/services/sessionService.ts
import { getFunctions, httpsCallable } from "firebase/functions";

export class SessionService {
  // ... métodos existentes

  // NOVO: Capturar IP via Firebase Functions
  static async getIPAddress(): Promise<string> {
    try {
      const functions = getFunctions();
      const getClientIP = httpsCallable(functions, "getClientIP");

      const result = await getClientIP();
      const data = result.data as any;

      return data.ip || "Não disponível";
    } catch (error) {
      console.error("Erro ao obter IP via Firebase Functions:", error);

      // Fallback para método anterior (temporário)
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (fallbackError) {
        console.error("Erro no fallback de IP:", fallbackError);
        return "Não disponível";
      }
    }
  }

  // NOVO: Obter informações completas via Firebase Functions
  static async getSessionInfo(): Promise<SessionInfo> {
    try {
      const functions = getFunctions();
      const getClientIP = httpsCallable(functions, "getClientIP");

      const result = await getClientIP();
      const data = result.data as any;

      const deviceInfo = this.getDeviceInfo();

      return {
        ...deviceInfo,
        ip: data.ip,
        timestamp: new Date(),
        geoInfo: data.geoInfo,
      };
    } catch (error) {
      console.error("Erro ao obter informações de sessão:", error);

      // Fallback para método anterior
      const deviceInfo = this.getDeviceInfo();
      const ip = await this.getIPAddress();

      return {
        ...deviceInfo,
        ip,
        timestamp: new Date(),
      };
    }
  }
}
```

---

## 🟡 **FASE 2: VALIDAÇÕES AVANÇADAS**

### **2.1 Validação Server-Side no Firestore**

#### **Motivo da Implementação**

- **Problema:** Validação apenas no cliente pode ser contornada
- **Risco:** Dados maliciosos podem ser inseridos no banco
- **Impacto:** Corrupção de dados e possíveis vulnerabilidades

#### **Implementação**

**2.1.1 Atualizar Regras do Firestore**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções de validação
    function isValidEmail(email) {
      return email.matches('^[^@]+@[^@]+\\.[^@]+$');
    }

    function isValidCPF(cpf) {
      return cpf.matches('^[0-9]{11}$');
    }

    function isValidPhone(phone) {
      return phone.matches('^[0-9]{10,11}$');
    }

    function isValidCEP(cep) {
      return cep.matches('^[0-9]{8}$');
    }

    function sanitizeString(str) {
      return str.replace(/[<>\"'&]/g, '');
    }

    function validateFuncionarioData(data) {
      return data.nome is string &&
             data.nome.size() > 0 &&
             data.nome.size() <= 100 &&
             sanitizeString(data.nome) == data.nome &&
             isValidCPF(data.cpf) &&
             isValidPhone(data.celular) &&
             (data.email == null || isValidEmail(data.email)) &&
             (data.cep == null || isValidCEP(data.cep));
    }

    function validateVeiculoData(data) {
      return data.placa is string &&
             data.placa.size() > 0 &&
             data.placa.size() <= 10 &&
             data.modelo is string &&
             data.modelo.size() > 0 &&
             data.modelo.size() <= 50 &&
             data.marca is string &&
             data.marca.size() > 0 &&
             data.marca.size() <= 30;
    }

    function validateRotaData(data) {
      return data.nome is string &&
             data.nome.size() > 0 &&
             data.nome.size() <= 100 &&
             data.origem is string &&
             data.origem.size() > 0 &&
             data.destino is string &&
             data.destino.size() > 0;
    }

    // Regras existentes com validação
    match /funcionarios/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gerente'] &&
        validateFuncionarioData(request.resource.data);
    }

    match /veiculos/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gerente'] &&
        validateVeiculoData(request.resource.data);
    }

    match /rotas/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'gerente', 'dispatcher'] &&
        validateRotaData(request.resource.data);
    }

    // ... outras regras existentes
  }
}
```

### **2.2 Sistema de Auditoria**

#### **Motivo da Implementação**

- **Problema:** Falta de rastreamento de ações dos usuários
- **Risco:** Impossibilidade de investigar incidentes de segurança
- **Impacto:** Falta de compliance e dificuldade em investigações

#### **Implementação**

**2.2.1 Criar Serviço de Auditoria**

```typescript
// src/services/auditService.ts
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export interface AuditLog {
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: any;
  success: boolean;
  errorMessage?: string;
}

export class AuditService {
  private static COLLECTION = "auditLogs";

  static async logAction(params: Omit<AuditLog, "timestamp">): Promise<void> {
    try {
      const auditLog: AuditLog = {
        ...params,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, this.COLLECTION), auditLog);
    } catch (error) {
      console.error("Erro ao registrar log de auditoria:", error);
      // Não falhar a operação principal por erro de auditoria
    }
  }

  static async logLogin(
    userId: string,
    userEmail: string,
    userRole: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      userRole,
      action: "LOGIN",
      resource: "AUTH",
      details: { success },
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
    });
  }

  static async logDataAccess(
    userId: string,
    userEmail: string,
    userRole: string,
    resource: string,
    resourceId?: string
  ): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      userRole,
      action: "READ",
      resource,
      resourceId,
      details: {},
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
    });
  }

  static async logDataModification(
    userId: string,
    userEmail: string,
    userRole: string,
    resource: string,
    resourceId: string,
    details: any
  ): Promise<void> {
    await this.logAction({
      userId,
      userEmail,
      userRole,
      action: "WRITE",
      resource,
      resourceId,
      details,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
    });
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "Não disponível";
    }
  }
}
```

**2.2.2 Integrar Auditoria nos Serviços**

```typescript
// src/components/funcionarios/data/funcionariosService.ts
import { AuditService } from "../../../services/auditService";

// Modificar função criar
async function criar(input: FuncionarioInput): Promise<string> {
  try {
    // ... validações existentes

    const ref = await addDoc(collection(db, COLLECTION), payload);

    // Registrar auditoria
    await AuditService.logDataModification(
      auth.currentUser?.uid || "unknown",
      auth.currentUser?.email || "unknown",
      userProfile?.role || "unknown",
      "funcionarios",
      ref.id,
      { action: "CREATE", data: input }
    );

    return ref.id;
  } catch (error) {
    // Registrar erro na auditoria
    await AuditService.logAction({
      userId: auth.currentUser?.uid || "unknown",
      userEmail: auth.currentUser?.email || "unknown",
      userRole: userProfile?.role || "unknown",
      action: "CREATE",
      resource: "funcionarios",
      details: { data: input },
      ipAddress: await AuditService["getClientIP"](),
      userAgent: navigator.userAgent,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
}
```

---

## 🟢 **FASE 3: MONITORAMENTO**

### **3.1 Sistema de Alertas de Segurança**

#### **Motivo da Implementação**

- **Problema:** Falta de notificações sobre eventos de segurança
- **Risco:** Incidentes podem passar despercebidos
- **Impacto:** Tempo de resposta lento a ameaças

#### **Implementação**

**3.1.1 Criar Firebase Function para Alertas**

```typescript
// functions/src/securityAlerts.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const securityAlert = functions.firestore
  .document("auditLogs/{logId}")
  .onCreate(async (snap, context) => {
    const logData = snap.data();

    // Verificar eventos de segurança críticos
    const criticalEvents = [
      "LOGIN_FAILED",
      "RATE_LIMIT_EXCEEDED",
      "UNAUTHORIZED_ACCESS",
      "SUSPICIOUS_ACTIVITY",
    ];

    if (criticalEvents.includes(logData.action)) {
      await sendSecurityAlert(logData);
    }

    // Verificar padrões suspeitos
    await checkSuspiciousPatterns(logData);
  });

async function sendSecurityAlert(logData: any) {
  const alertData = {
    type: "SECURITY_ALERT",
    severity: "HIGH",
    message: `Evento de segurança detectado: ${logData.action}`,
    details: logData,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Salvar alerta no Firestore
  await admin.firestore().collection("securityAlerts").add(alertData);

  // Enviar notificação para administradores
  await notifyAdmins(alertData);
}

async function checkSuspiciousPatterns(logData: any) {
  // Verificar múltiplas tentativas de login
  const recentLogins = await admin
    .firestore()
    .collection("auditLogs")
    .where("userId", "==", logData.userId)
    .where("action", "==", "LOGIN")
    .where("success", "==", false)
    .where("timestamp", ">", new Date(Date.now() - 15 * 60 * 1000)) // 15 minutos
    .get();

  if (recentLogins.size >= 5) {
    await sendSecurityAlert({
      ...logData,
      action: "SUSPICIOUS_LOGIN_ATTEMPTS",
      details: { failedAttempts: recentLogins.size },
    });
  }
}

async function notifyAdmins(alertData: any) {
  // Buscar administradores
  const admins = await admin
    .firestore()
    .collection("users")
    .where("role", "==", "admin")
    .get();

  // Enviar notificação para cada admin
  for (const adminDoc of admins.docs) {
    await admin.firestore().collection("notifications").add({
      userId: adminDoc.id,
      type: "SECURITY_ALERT",
      title: "Alerta de Segurança",
      message: alertData.message,
      details: alertData,
      read: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
```

### **3.2 Dashboard de Segurança**

#### **Motivo da Implementação**

- **Problema:** Falta de visibilidade sobre eventos de segurança
- **Risco:** Incidentes podem passar despercebidos
- **Impacto:** Falta de controle e monitoramento

#### **Implementação**

**3.2.1 Criar Componente de Dashboard de Segurança**

```typescript
// src/components/seguranca/SecurityDashboard.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: any;
  details: any;
}

export const SecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadSecurityEvents();
    }
  }, [userProfile]);

  const loadSecurityEvents = async () => {
    try {
      const q = query(
        collection(db, 'securityAlerts'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityEvent[];

      setEvents(eventsData);
    } catch (error) {
      console.error('Erro ao carregar eventos de segurança:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Acesso Negado</h2>
        <p>Você não tem permissão para acessar o dashboard de segurança.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard de Segurança</h2>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className={`p-4 border rounded-lg ${
              event.severity === 'HIGH' ? 'border-red-500 bg-red-50' :
              event.severity === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.message}</h3>
                  <p className="text-sm text-gray-600">
                    {event.timestamp?.toDate?.()?.toLocaleString() || 'Data não disponível'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                  event.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **FASE 1 - Proteções Críticas (Semana 1)**

- [ ] **Rate Limiting**
  - [ ] Instalar dependência `express-rate-limit`
  - [ ] Criar middleware de rate limiting
  - [ ] Integrar no AuthContext
  - [ ] Implementar funções de rate limit no Firestore
  - [ ] Testar tentativas de login

- [ ] **Content Security Policy**
  - [ ] Configurar CSP no Vite
  - [ ] Adicionar meta tag CSP no HTML
  - [ ] Criar utilitário de sanitização
  - [ ] Testar proteção contra XSS

- [ ] **Source Maps**
  - [ ] Desabilitar source maps em produção
  - [ ] Configurar Firebase Hosting
  - [ ] Verificar se arquivos .map não são servidos

- [ ] **Captura de IP**
  - [ ] Criar Firebase Function para captura de IP
  - [ ] Atualizar SessionService
  - [ ] Testar captura de IP

### **FASE 2 - Validações Avançadas (Semana 2)**

- [ ] **Validação Server-Side**
  - [ ] Atualizar regras do Firestore com validações
  - [ ] Implementar funções de validação
  - [ ] Testar validações no servidor

- [ ] **Sistema de Auditoria**
  - [ ] Criar serviço de auditoria
  - [ ] Integrar auditoria nos serviços existentes
  - [ ] Testar logs de auditoria

### **FASE 3 - Monitoramento (Semana 3)**

- [ ] **Sistema de Alertas**
  - [ ] Criar Firebase Function para alertas
  - [ ] Implementar detecção de padrões suspeitos
  - [ ] Configurar notificações para administradores

- [ ] **Dashboard de Segurança**
  - [ ] Criar componente de dashboard
  - [ ] Implementar visualização de eventos
  - [ ] Testar dashboard

---

## 🧪 **TESTES DE SEGURANÇA**

### **Testes Automatizados**

```typescript
// src/tests/security.test.ts
import { describe, it, expect } from "vitest";
import { SanitizationUtils } from "../utils/sanitization";
import { RateLimitService } from "../services/rateLimitService";

describe("Security Tests", () => {
  describe("Sanitization", () => {
    it("should sanitize HTML input", () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = SanitizationUtils.sanitizeHTML(input);
      expect(sanitized).not.toContain("<script>");
    });

    it("should sanitize URLs", () => {
      const maliciousUrl = 'javascript:alert("xss")';
      const sanitized = SanitizationUtils.sanitizeURL(maliciousUrl);
      expect(sanitized).toBe("");
    });
  });

  describe("Rate Limiting", () => {
    it("should limit login attempts", async () => {
      const key = "test:login";
      await RateLimitService.resetRateLimit(key);

      for (let i = 0; i < 5; i++) {
        await RateLimitService.incrementRateLimit(key);
      }

      const attempts = await RateLimitService.checkRateLimit(key);
      expect(attempts).toBe(5);
    });
  });
});
```

### **Testes Manuais**

1. **Teste de Rate Limiting**
   - Tentar login 6 vezes com credenciais incorretas
   - Verificar se o sistema bloqueia após 5 tentativas

2. **Teste de XSS**
   - Inserir `<script>alert('xss')</script>` em campos de texto
   - Verificar se o script não é executado

3. **Teste de Validação Server-Side**
   - Tentar inserir dados inválidos via console do navegador
   - Verificar se o Firestore rejeita os dados

4. **Teste de Auditoria**
   - Realizar ações no sistema
   - Verificar se os logs são criados no Firestore

---

## 🚀 **DEPLOY E MONITORAMENTO**

### **Deploy Seguro**

```bash
# 1. Build de produção
npm run build

# 2. Verificar se source maps não estão incluídos
ls -la dist/ | grep .map

# 3. Deploy no Firebase
npm run deploy

# 4. Verificar headers de segurança
curl -I https://your-app.web.app
```

### **Monitoramento Contínuo**

1. **Logs do Firebase Functions**
2. **Logs do Firestore**
3. **Alertas de segurança**
4. **Dashboard de segurança**

---

## 📞 **SUPORTE E MANUTENÇÃO**

### **Contatos de Emergência**

- **Desenvolvedor Principal:** [Seu Nome]
- **Administrador de Sistema:** [Nome do Admin]
- **Segurança:** [Contato de Segurança]

### **Procedimentos de Emergência**

1. **Incidente de Segurança Detectado**
   - Isolar o sistema se necessário
   - Notificar administradores
   - Investigar logs de auditoria
   - Implementar correções

2. **Falha de Sistema**
   - Verificar logs do Firebase
   - Reverter para versão estável
   - Investigar causa raiz

---

**📅 Última Atualização:** Janeiro 2025  
**🔄 Status:** ⚠️ **Aguardando Implementação**  
**🎯 Objetivo:** ✅ **Sistema Seguro para Produção**

---

## ⚠️ **AVISOS IMPORTANTES**

### **⚠️ Antes de Implementar**

1. **Backup Completo**
   - Faça backup de todo o código atual
   - Faça backup das regras do Firestore
   - Documente a configuração atual do Firebase

2. **Ambiente de Teste**
   - Implemente primeiro em ambiente de desenvolvimento
   - Teste todas as funcionalidades após cada mudança
   - Use dados fictícios para testes

3. **Rollback Plan**
   - Mantenha versões anteriores do código
   - Documente como reverter cada implementação
   - Tenha um plano de contingência

### **🔧 Considerações Técnicas**

1. **Performance**
   - Rate limiting pode impactar performance
   - Auditoria gera mais operações no Firestore
   - Monitore custos do Firebase após implementação

2. **Compatibilidade**
   - Verifique compatibilidade com navegadores antigos
   - Teste em diferentes dispositivos
   - Valide funcionamento em redes corporativas

3. **Dependências**
   - Algumas implementações requerem Firebase Functions
   - Verifique limites de uso do Firebase
   - Considere custos adicionais

### **📋 Checklist Pré-Implementação**

- [ ] **Ambiente Preparado**
  - [ ] Backup completo realizado
  - [ ] Ambiente de teste configurado
  - [ ] Dados de teste preparados
  - [ ] Equipe notificada sobre mudanças

- [ ] **Configuração Firebase**
  - [ ] Firebase Functions habilitado
  - [ ] Regras de segurança documentadas
  - [ ] Limites de uso verificados
  - [ ] Custos estimados calculados

- [ ] **Testes Preparados**
  - [ ] Scripts de teste criados
  - [ ] Cenários de teste definidos
  - [ ] Métricas de sucesso estabelecidas
  - [ ] Critérios de aceitação definidos

### **🚨 Riscos de Implementação**

| Risco                     | Probabilidade | Impacto | Mitigação              |
| ------------------------- | ------------- | ------- | ---------------------- |
| Quebra de funcionalidades | Média         | Alto    | Testes extensivos      |
| Performance degradada     | Baixa         | Médio   | Monitoramento contínuo |
| Aumento de custos         | Alta          | Baixo   | Estimativas prévias    |
| Complexidade aumentada    | Média         | Médio   | Documentação detalhada |

### **📊 Métricas de Sucesso**

- **Segurança:** Zero vulnerabilidades críticas detectadas
- **Performance:** Tempo de resposta < 2 segundos
- **Disponibilidade:** Uptime > 99.5%
- **Usabilidade:** Zero reclamações de usuários
- **Custos:** Aumento < 20% nos custos do Firebase

### **🔄 Processo de Validação**

1. **Validação Técnica**
   - Testes automatizados passando
   - Testes manuais realizados
   - Performance validada
   - Segurança verificada

2. **Validação de Negócio**
   - Funcionalidades críticas funcionando
   - Usuários conseguem realizar tarefas
   - Relatórios gerados corretamente
   - Dados integridade mantida

3. **Validação de Segurança**
   - Testes de penetração realizados
   - Vulnerabilidades corrigidas
   - Logs de auditoria funcionando
   - Alertas de segurança ativos

### **📞 Suporte Durante Implementação**

- **Canal de Comunicação:** [Slack/Discord/Teams]
- **Horário de Suporte:** [Definir horários]
- **Escalação:** [Definir processo]
- **Documentação:** [Link para documentação]

---

## 📚 **REFERÊNCIAS E RECURSOS**

### **Documentação Oficial**

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Express Rate Limiting](https://www.npmjs.com/package/express-rate-limit)

### **Ferramentas Recomendadas**

- [OWASP ZAP](https://owasp.org/www-project-zap/) - Testes de segurança
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoria de performance
- [Security Headers](https://securityheaders.com/) - Verificação de headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - Análise de segurança

### **Comunidades e Fóruns**

- [Firebase Community](https://firebase.google.com/community)
- [OWASP Community](https://owasp.org/community/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
- [GitHub Security Advisories](https://github.com/advisories)

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Revisar e Aprovar** este plano com a equipe
2. **Preparar ambiente** de desenvolvimento
3. **Iniciar Fase 1** com implementações críticas
4. **Monitorar progresso** e ajustar conforme necessário
5. **Validar cada fase** antes de prosseguir
6. **Documentar lições aprendidas** durante implementação

---

**🔐 Segurança é um processo contínuo, não um destino final.**
