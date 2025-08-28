# Documentação Técnica - Sistema de Gestão de Logística (SGL)

## 📋 Visão Geral

O SGL é um sistema web completo desenvolvido em React com TypeScript e Firebase, projetado para gerenciar operações logísticas de empresas do setor de Frigorífico e Ovos. O sistema oferece uma interface moderna, responsiva e intuitiva para gestão de funcionários, veículos, rotas e folgas.

## 🏗️ Arquitetura

### Frontend

- **Framework**: React 18 com Hooks
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Context API + useState/useEffect
- **UI Components**: Headless UI, Heroicons
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast
- **Exportação**: ExcelJS, jsPDF, file-saver
- **Code Quality**: ESLint, Prettier

### Backend (Firebase)

- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Firestore (NoSQL)
- **Hospedagem**: Firebase Hosting
- **Funções**: Cloud Functions (preparado)
- **Notificações**: Firebase Cloud Messaging
- **Storage**: Firebase Storage (preparado)

## 📁 Estrutura de Dados

### Coleções do Firestore

#### users

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "gerente" | "dispatcher" | "user";
  telefone?: string;
  cargo?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  sessionInfo?: {
    ip: string;
    userAgent: string;
    device: string;
    browser: string;
    os: string;
  };
}
```

#### funcionarios

```typescript
interface Funcionario {
  id?: string;
  nome: string;
  cpf: string;
  cnh?: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  status: "trabalhando" | "disponivel" | "folga" | "ferias";
  unidadeNegocio: "frigorifico" | "ovos";
  dataAdmissao: string;
  salario: number;
  funcao: string;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### veiculos

```typescript
interface Veiculo {
  id?: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  capacidade: number;
  status: "disponivel" | "em_uso" | "manutencao" | "inativo";
  unidadeNegocio: "frigorifico" | "ovos";
  ultimaManutencao?: string;
  proximaManutencao?: string;
  funcionario?: string;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### rotas

```typescript
interface Rota {
  id?: string;
  origem: string;
  destino: string;
  funcionario: string;
  veiculo: string;
  dataPartida: string;
  dataChegada: string;
  status: "agendada" | "em_andamento" | "concluida" | "cancelada";
  unidadeNegocio: "frigorifico" | "ovos";
  observacoes?: string;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### folgas

```typescript
interface Folga {
  id?: string;
  funcionarioId: string;
  funcionarioNome: string;
  tipo: "folga" | "ferias" | "licenca";
  dataInicio: string;
  dataFim: string;
  motivo: string;
  status: "pendente" | "aprovada" | "rejeitada";
  aprovadoPor?: string;
  observacoes?: string;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### cidades

```typescript
interface Cidade {
  id?: string;
  nome: string;
  estado: string;
  regiao: string;
  unidadeNegocio: "frigorifico" | "ovos";
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### vendedores

```typescript
interface Vendedor {
  id?: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  regiao: string;
  unidadeNegocio: "frigorifico" | "ovos";
  dataAdmissao: string;
  salario: number;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
}
```

#### notifications

```typescript
interface Notification {
  id?: string;
  userId: string;
  type: "funcionario" | "rota" | "folga" | "veiculo";
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Timestamp;
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticação
│   │   ├── Login.tsx
│   │   └── SignupModal.tsx
│   ├── dashboard/      # Dashboard principal
│   │   ├── Dashboard.tsx
│   │   ├── data/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── layout/         # Layout e navegação
│   │   ├── Layout.tsx
│   │   ├── config/
│   │   ├── state/
│   │   └── ui/
│   ├── funcionarios/   # Gestão de funcionários
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── veiculos/       # Gestão de veículos
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── rotas/          # Gestão de rotas
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── folgas/         # Controle de folgas
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── cidades/        # Cadastro de cidades
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── vendedores/     # Gestão de vendedores
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── relatorios/     # Sistema de relatórios
│   │   ├── data/
│   │   ├── export/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── configuracao/   # Configurações
│   │   ├── config/
│   │   ├── state/
│   │   ├── ui/
│   │   └── pages/
│   ├── import/         # Sistema de importação
│   │   ├── data/
│   │   ├── types/
│   │   └── ui/
│   └── common/         # Componentes comuns
│       ├── ErrorBoundary/
│       ├── ErrorPages/
│       ├── modals/
│       └── NotificationBell.tsx
├── contexts/           # Contextos React
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── firebase/           # Configuração Firebase
│   └── config.ts
├── hooks/              # Custom hooks
│   ├── useErrorHandler.ts
│   └── useResizeObserver.ts
├── services/           # Serviços
│   ├── notificationService.ts
│   └── sessionService.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários
│   ├── constants.ts
│   ├── masks.ts
│   └── resizeObserverFix.ts
├── index.css           # Estilos globais
├── index.tsx           # Ponto de entrada
└── App.tsx             # Componente principal
```

## 🔧 Configuração do Build

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
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
});
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🔐 Sistema de Segurança

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar se usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Função para verificar role do usuário
    function hasRole(role) {
      return isAuthenticated() &&
             request.auth.token.role == role;
    }

    // Função para verificar se é admin
    function isAdmin() {
      return hasRole('admin');
    }

    // Regras para usuários
    match /users/{userId} {
      allow read: if isAuthenticated() &&
                     (request.auth.uid == userId || isAdmin());
      allow write: if isAuthenticated() &&
                      (request.auth.uid == userId || isAdmin());
    }

    // Regras para funcionários
    match /funcionarios/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || hasRole('gerente');
    }

    // Regras para veículos
    match /veiculos/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || hasRole('gerente');
    }

    // Regras para rotas
    match /rotas/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || hasRole('dispatcher');
    }

    // Regras para folgas
    match /folgas/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() &&
                      (request.auth.uid == resource.data.funcionarioId ||
                       isAdmin() || hasRole('gerente'));
    }

    // Regras para cidades
    match /cidades/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Regras para vendedores
    match /vendedores/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || hasRole('gerente');
    }

    // Regras para notificações
    match /notifications/{docId} {
      allow read: if isAuthenticated() &&
                     request.auth.uid == resource.data.userId;
      allow write: if isAuthenticated() &&
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🔔 Sistema de Notificações

### NotificationService

```typescript
// services/notificationService.ts
export class NotificationService {
  static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const notification: Notification = {
      userId,
      type,
      title,
      message,
      read: false,
      data,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "notifications"), notification);
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });
  }
}
```

## 📊 Sistema de Relatórios

### Arquitetura de Exportação

```typescript
// Base Export Service
export abstract class BaseExportService {
  protected abstract getData(): Promise<any[]>;
  protected abstract getHeaders(): string[];
  protected abstract getFileName(): string;

  async exportToExcel(): Promise<void> {
    const data = await this.getData();
    const headers = this.getHeaders();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório");

    // Adicionar cabeçalhos
    worksheet.addRow(headers);

    // Adicionar dados
    data.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    // Formatação
    this.formatWorksheet(worksheet);

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${this.getFileName()}.xlsx`);
  }

  async exportToPDF(): Promise<void> {
    const data = await this.getData();
    const headers = this.getHeaders();

    const doc = new jsPDF();

    // Adicionar título
    doc.setFontSize(16);
    doc.text(this.getFileName(), 14, 20);

    // Adicionar tabela
    autoTable(doc, {
      head: [headers],
      body: data.map((row) => Object.values(row)),
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });

    // Download
    doc.save(`${this.getFileName()}.pdf`);
  }

  private formatWorksheet(worksheet: ExcelJS.Worksheet): void {
    // Formatação brasileira
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 20;

    // Estilo do cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };
  }
}
```

### Serviços Especializados

```typescript
// FuncionariosExportService
export class FuncionariosExportService extends BaseExportService {
  protected async getData(): Promise<any[]> {
    const snapshot = await getDocs(collection(db, "funcionarios"));
    return snapshot.docs.map((doc) => ({
      Nome: doc.data().nome,
      CPF: doc.data().cpf,
      Telefone: doc.data().telefone,
      Email: doc.data().email,
      Cidade: doc.data().cidade,
      Status: doc.data().status,
      "Data Admissão": doc.data().dataAdmissao,
      Salário: `R$ ${doc.data().salario.toFixed(2)}`,
      Função: doc.data().funcao,
    }));
  }

  protected getHeaders(): string[] {
    return [
      "Nome",
      "CPF",
      "Telefone",
      "Email",
      "Cidade",
      "Status",
      "Data Admissão",
      "Salário",
      "Função",
    ];
  }

  protected getFileName(): string {
    const date = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
    return `funcionarios_${date}`;
  }
}
```

## 🔄 Gerenciamento de Estado

### Context API

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Buscar dados adicionais do usuário
        getUserData(user.uid).then(setUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🎨 Sistema de Design

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

## 🚀 Deploy e Infraestrutura

### Firebase Configuration

```typescript
// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Firebase Hosting Configuration

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

## 📱 Responsividade

### Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Componentes Responsivos

```typescript
// Exemplo de componente responsivo
const ResponsiveTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Conteúdo da tabela */}
      </table>
    </div>
  );
};
```

## 🔧 Performance

### Code Splitting

```typescript
// Lazy loading de componentes
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Funcionarios = lazy(() => import('./components/funcionarios/Funcionarios'));
const Veiculos = lazy(() => import('./components/veiculos/Veiculos'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Memoização

```typescript
// React.memo para componentes
const FuncionarioCard = React.memo<FuncionarioCardProps>(({ funcionario }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Conteúdo do card */}
    </div>
  );
});

// useMemo para cálculos pesados
const filteredFuncionarios = useMemo(() => {
  return funcionarios.filter(f => f.status === 'disponivel');
}, [funcionarios]);
```

## 🧪 Testes

### Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Dashboard.test.tsx
│   │   ├── Funcionarios.test.tsx
│   │   └── Veiculos.test.tsx
│   ├── services/
│   │   ├── notificationService.test.ts
│   │   └── sessionService.test.ts
│   └── utils/
│       └── masks.test.ts
```

### Exemplo de Teste

```typescript
// __tests__/components/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

describe('Dashboard', () => {
  it('should render dashboard with KPIs', () => {
    render(<Dashboard />);

    expect(screen.getByText('Total Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Total Veículos')).toBeInTheDocument();
    expect(screen.getByText('Rotas Ativas')).toBeInTheDocument();
  });
});
```

---

**📚 Esta documentação técnica fornece uma visão completa da arquitetura do SGL, incluindo todas as funcionalidades implementadas e as melhores práticas utilizadas no desenvolvimento.**
