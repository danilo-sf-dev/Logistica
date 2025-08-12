# 🔌 API e Estrutura de Dados - SGL

## 📋 Visão Geral

Este documento descreve a estrutura de dados e APIs do Sistema de Gestão de Logística (SGL), baseado no Firebase Firestore.

## 🏗️ Arquitetura da API

### Firebase Services Utilizados

- **Firestore**: Banco de dados NoSQL
- **Authentication**: Autenticação de usuários
- **Hosting**: Hospedagem da aplicação
- **Cloud Messaging**: Notificações push
- **Storage**: Armazenamento de arquivos (preparado)

### Estrutura de Coleções

```
firestore/
├── users/              # Usuários do sistema
├── funcionarios/       # Funcionários (antigo motoristas)
├── veiculos/          # Veículos da frota
├── rotas/             # Rotas de entrega
├── folgas/            # Solicitações de folga
├── cidades/           # Cidades atendidas
├── vendedores/        # Vendedores
└── configuracoes/     # Configurações do sistema
```

## 📊 Estrutura de Dados

### 👥 Users Collection

```typescript
interface User {
  uid: string; // ID único do Firebase Auth
  email: string; // Email do usuário
  displayName: string | null; // Nome de exibição
  photoURL: string | null; // URL da foto de perfil
  role: "admin" | "gerente" | "dispatcher" | "user";
  telefone?: string; // Telefone do usuário
  cargo?: string; // Cargo/função
  createdAt: Timestamp; // Data de criação
  lastLogin: Timestamp; // Último login
  provider: string; // Provedor de autenticação
}
```

**Exemplo:**

```json
{
  "uid": "abc123def456",
  "email": "admin@empresa.com",
  "displayName": "João Silva",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "role": "admin",
  "telefone": "(73) 99999-9999",
  "cargo": "Gerente de Logística",
  "createdAt": "2025-01-15T10:30:00Z",
  "lastLogin": "2025-01-20T14:45:00Z",
  "provider": "google.com"
}
```

### 👨‍💼 Funcionarios Collection

```typescript
interface Funcionario {
  id: string; // ID único do documento
  nome: string; // Nome completo
  cpf: string; // CPF (formato: 000.000.000-00)
  cnh: string; // Número da CNH
  telefone: string; // Telefone (formato: (73) 99999-9999)
  email?: string; // Email (opcional)
  endereco: string; // Endereço completo
  cidade: string; // Cidade
  status: "trabalhando" | "disponivel" | "folga" | "ferias";
  funcao: "motorista" | "ajudante" | "outro";
  dataAdmissao?: string; // Data de admissão (YYYY-MM-DD)
  salario?: number; // Salário (opcional)
  unidadeNegocio?: "frigorifico" | "ovos" | "ambos";
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "func_001",
  "nome": "Maria Santos",
  "cpf": "123.456.789-00",
  "cnh": "12345678901",
  "telefone": "(73) 99999-9999",
  "email": "maria@empresa.com",
  "endereco": "Rua das Flores, 123, Centro",
  "cidade": "Ilhéus",
  "status": "disponivel",
  "funcao": "motorista",
  "dataAdmissao": "2024-01-15",
  "salario": 2500.0,
  "unidadeNegocio": "frigorifico",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🚛 Veiculos Collection

```typescript
interface Veiculo {
  id: string; // ID único do documento
  placa: string; // Placa (formato Mercosul: ABC1234)
  modelo: string; // Modelo do veículo
  marca: string; // Marca/fabricante
  ano: number; // Ano de fabricação
  capacidade: number; // Capacidade em kg
  status: "disponivel" | "em_uso" | "manutencao" | "inativo";
  tipoCarroceria: string; // Tipo de carroceria
  tipoBau: string; // Tipo de baú
  unidadeNegocio: "frigorifico" | "ovos" | "ambos";
  ultimaManutencao?: string; // Data da última manutenção
  proximaManutencao?: string; // Data da próxima manutenção
  motorista?: string; // ID do motorista responsável
  observacoes?: string; // Observações adicionais
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "veic_001",
  "placa": "ABC1234",
  "modelo": "Truck 2428",
  "marca": "Volkswagen",
  "ano": 2020,
  "capacidade": 5000,
  "status": "disponivel",
  "tipoCarroceria": "Truck",
  "tipoBau": "Frigorífico",
  "unidadeNegocio": "frigorifico",
  "ultimaManutencao": "2024-12-15",
  "proximaManutencao": "2025-03-15",
  "motorista": "func_001",
  "observacoes": "Veículo em excelente estado",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🗺️ Rotas Collection

```typescript
interface Rota {
  id: string; // ID único do documento
  nome: string; // Nome da rota
  dataRota: string; // Data da rota (YYYY-MM-DD)
  pesoMinimo: number; // Peso mínimo em kg
  diasSemana: string[]; // Dias da semana de operação
  status: "agendada" | "em_andamento" | "concluida" | "cancelada";
  motorista?: string; // ID do motorista
  veiculo?: string; // ID do veículo
  cidades: string[]; // IDs das cidades da rota
  observacoes?: string; // Observações
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "rota_001",
  "nome": "Rota Sul da Bahia",
  "dataRota": "2025-01-25",
  "pesoMinimo": 2000,
  "diasSemana": ["segunda", "terca", "quarta", "quinta", "sexta"],
  "status": "agendada",
  "motorista": "func_001",
  "veiculo": "veic_001",
  "cidades": ["cidade_001", "cidade_002", "cidade_003"],
  "observacoes": "Rota para entrega de produtos refrigerados",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 📅 Folgas Collection

```typescript
interface Folga {
  id: string; // ID único do documento
  funcionarioId: string; // ID do funcionário
  tipo:
    | "folga"
    | "ferias"
    | "licenca_medica"
    | "atestado"
    | "banco_horas"
    | "compensacao"
    | "suspensao"
    | "afastamento"
    | "maternidade"
    | "paternidade"
    | "luto"
    | "casamento"
    | "doacao_sangue"
    | "servico_militar"
    | "capacitacao"
    | "outros";
  dataInicio: string; // Data de início (YYYY-MM-DD)
  dataFim: string; // Data de fim (YYYY-MM-DD)
  status: "pendente" | "aprovada" | "rejeitada";
  observacoes?: string; // Observações do funcionário
  comentariosGestor?: string; // Comentários do gestor
  aprovadoPor?: string; // ID do gestor que aprovou
  dataAprovacao?: Timestamp; // Data de aprovação
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "folga_001",
  "funcionarioId": "func_001",
  "tipo": "ferias",
  "dataInicio": "2025-02-01",
  "dataFim": "2025-02-15",
  "status": "pendente",
  "observacoes": "Férias programadas",
  "comentariosGestor": null,
  "aprovadoPor": null,
  "dataAprovacao": null,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 🏙️ Cidades Collection

```typescript
interface Cidade {
  id: string; // ID único do documento
  nome: string; // Nome da cidade
  estado: string; // Estado (UF)
  regiao: string; // Região (preenchida automaticamente)
  distancia?: number; // Distância em km
  pesoMinimo?: number; // Peso mínimo em kg
  rotaId?: string; // ID da rota vinculada
  observacoes?: string; // Observações
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "cidade_001",
  "nome": "Ilhéus",
  "estado": "BA",
  "regiao": "Sul da Bahia",
  "distancia": 0,
  "pesoMinimo": 1000,
  "rotaId": "rota_001",
  "observacoes": "Cidade sede da empresa",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

### 👨‍💼 Vendedores Collection

```typescript
interface Vendedor {
  id: string; // ID único do documento
  nome: string; // Nome completo
  cpf: string; // CPF (formato: 000.000.000-00)
  codigoVendSistema?: string; // Código interno do vendedor
  email?: string; // Email
  telefone?: string; // Telefone (formato: (73) 99999-9999)
  estado: string; // Estado de atuação
  regiao: string; // Região de atuação
  cidades: string[]; // IDs das cidades atendidas
  observacoes?: string; // Observações
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Data de atualização
}
```

**Exemplo:**

```json
{
  "id": "vend_001",
  "nome": "Carlos Oliveira",
  "cpf": "987.654.321-00",
  "codigoVendSistema": "VEND001",
  "email": "carlos@empresa.com",
  "telefone": "(73) 88888-8888",
  "estado": "BA",
  "regiao": "Sul da Bahia",
  "cidades": ["cidade_001", "cidade_002"],
  "observacoes": "Vendedor experiente na região",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-20T14:45:00Z"
}
```

## 🔌 Operações da API

### Autenticação

```typescript
// Login com Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Login com email/senha
const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
const signOut = async () => {
  return signOut(auth);
};
```

### Operações CRUD

#### Funcionários

```typescript
// Buscar todos os funcionários
const getFuncionarios = async () => {
  const snapshot = await getDocs(collection(db, "funcionarios"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Buscar funcionário por ID
const getFuncionario = async (id: string) => {
  const doc = await getDoc(doc(db, "funcionarios", id));
  return doc.exists() ? { id: doc.id, ...doc.data() } : null;
};

// Criar funcionário
const createFuncionario = async (
  data: Omit<Funcionario, "id" | "createdAt" | "updatedAt">
) => {
  const now = serverTimestamp();
  return addDoc(collection(db, "funcionarios"), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
};

// Atualizar funcionário
const updateFuncionario = async (id: string, data: Partial<Funcionario>) => {
  return updateDoc(doc(db, "funcionarios", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Deletar funcionário
const deleteFuncionario = async (id: string) => {
  return deleteDoc(doc(db, "funcionarios", id));
};
```

#### Veículos

```typescript
// Buscar todos os veículos
const getVeiculos = async () => {
  const snapshot = await getDocs(collection(db, "veiculos"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Buscar veículos por status
const getVeiculosByStatus = async (status: Veiculo["status"]) => {
  const q = query(collection(db, "veiculos"), where("status", "==", status));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
```

### Queries Avançadas

#### Dashboard Stats

```typescript
// Buscar estatísticas do dashboard
const getDashboardStats = async () => {
  const [
    funcionariosSnapshot,
    veiculosSnapshot,
    rotasSnapshot,
    folgasSnapshot,
    cidadesSnapshot,
    vendedoresSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "funcionarios")),
    getDocs(collection(db, "veiculos")),
    getDocs(collection(db, "rotas")),
    getDocs(collection(db, "folgas")),
    getDocs(collection(db, "cidades")),
    getDocs(collection(db, "vendedores")),
  ]);

  return {
    funcionarios: funcionariosSnapshot.size,
    veiculos: veiculosSnapshot.size,
    rotas: rotasSnapshot.size,
    folgas: folgasSnapshot.size,
    cidades: cidadesSnapshot.size,
    vendedores: vendedoresSnapshot.size,
  };
};
```

#### Atividades Recentes

```typescript
// Buscar atividades recentes
const getAtividadesRecentes = async (limit: number = 10) => {
  const atividades: AtividadeRecente[] = [];

  // Buscar dados de diferentes coleções
  const [funcionarios, veiculos, rotas, folgas, cidades, vendedores] =
    await Promise.all([
      getDocs(collection(db, "funcionarios")),
      getDocs(collection(db, "veiculos")),
      getDocs(collection(db, "rotas")),
      getDocs(collection(db, "folgas")),
      getDocs(collection(db, "cidades")),
      getDocs(collection(db, "vendedores")),
    ]);

  // Processar e combinar dados
  // ... lógica de processamento

  // Ordenar por data e limitar
  return atividades
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};
```

## 🔒 Regras de Segurança

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Funcionários: apenas admins podem escrever
    match /funcionarios/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Veículos: apenas admins podem escrever
    match /veiculos/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Rotas: admins e dispatchers podem escrever
    match /rotas/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'dispatcher'];
    }

    // Folgas: usuários podem criar, admins podem aprovar
    match /folgas/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.funcionarioId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## 📊 Índices

### Índices Compostos

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "funcionarios",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "nome", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "veiculos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "placa", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "folgas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dataInicio", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 🚀 Performance

### Otimizações

1. **Índices**: Criados para queries frequentes
2. **Paginação**: Implementada para listas grandes
3. **Cache**: Dados em cache no cliente
4. **Lazy Loading**: Carregamento sob demanda
5. **Offline**: Suporte a operações offline

### Limites

- **Documento**: Máximo 1MB
- **Coleção**: Sem limite prático
- **Query**: Máximo 1MB de resultados
- **Rate Limiting**: 10.000 writes/segundo por projeto

## 🔧 Utilitários

### Validação de Dados

```typescript
// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;

  // Lógica de validação do CPF
  // ...

  return true;
};

// Validação de placa
export const validatePlaca = (placa: string): boolean => {
  const pattern = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
  return pattern.test(placa);
};
```

### Formatação

```typescript
// Formatação de CPF
export const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Formatação de telefone
export const formatTelefone = (telefone: string): string => {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
```

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
