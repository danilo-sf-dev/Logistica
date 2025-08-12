# 👨‍💻 Guia de Contribuição - SGL

## 🎯 Visão Geral

Este guia é destinado a desenvolvedores que desejam contribuir com o projeto SGL (Sistema de Gestão de Logística).

## 🚀 Primeiros Passos

### 1. Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/logistica.git
cd logistica

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Execute o projeto
npm start
```

### 2. Estrutura do Projeto

```
src/
├── components/          # Componentes React organizados por módulo
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── funcionarios/   # Gestão de funcionários
│   ├── veiculos/       # Gestão de veículos
│   ├── rotas/          # Gestão de rotas
│   ├── folgas/         # Gestão de folgas
│   ├── cidades/        # Gestão de cidades
│   ├── vendedores/     # Gestão de vendedores
│   ├── relatorios/     # Relatórios e analytics
│   ├── configuracoes/  # Configurações do sistema
│   └── layout/         # Layout e navegação
├── contexts/           # Contextos React
├── firebase/           # Configuração Firebase
├── utils/              # Utilitários e helpers
└── types/              # Definições de tipos TypeScript
```

## 🏗️ Arquitetura

### Padrão Modular

Cada módulo segue a estrutura:

```
modulo/
├── data/               # Serviços de dados
│   └── moduloService.ts
├── state/              # Hooks de estado
│   └── useModulo.ts
├── ui/                 # Componentes de interface
│   ├── ModuloFormModal.tsx
│   ├── ModuloTable.tsx
│   └── ModuloFilters.tsx
├── pages/              # Páginas do módulo
│   └── ModuloListPage.tsx
├── types.ts            # Tipos TypeScript
└── index.tsx           # Export principal
```

### Tecnologias Utilizadas

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Firebase**: Backend como serviço
- **React Router**: Roteamento
- **Recharts**: Gráficos
- **Lucide React**: Ícones

## 📝 Convenções de Código

### Nomenclatura

```typescript
// Componentes: PascalCase
const UserProfile: React.FC<UserProfileProps> = () => {};

// Hooks: camelCase com prefixo 'use'
const useUserData = () => {};

// Serviços: camelCase com sufixo 'Service'
const userService = {};

// Tipos: PascalCase
interface UserData {
  id: string;
  name: string;
}

// Constantes: UPPER_SNAKE_CASE
const API_ENDPOINTS = {
  USERS: "/users",
  VEHICLES: "/vehicles",
};
```

### Estrutura de Componentes

```typescript
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ComponentProps } from "./types";

interface ComponentProps {
  // Props do componente
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Estados
  const [state, setState] = useState<StateType>(initialValue);

  // Hooks customizados
  const { data, loading, error } = useCustomHook();

  // Handlers
  const handleAction = () => {
    // Lógica do handler
  };

  // Renderização condicional
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="component-container">
      {/* JSX do componente */}
    </div>
  );
};
```

### Estilização com Tailwind

```typescript
// Classes organizadas por categoria
<div className="
  // Layout
  flex items-center justify-between
  // Espaçamento
  p-4 space-y-2
  // Cores
  bg-white text-gray-900
  // Bordas
  border border-gray-200 rounded-lg
  // Estados
  hover:bg-gray-50 focus:ring-2 focus:ring-primary-500
">
```

## 🔧 Desenvolvimento

### Comandos Úteis

```bash
# Executar em desenvolvimento
npm start

# Build de produção
npm run build

# Executar testes
npm test

# Linting
npm run lint

# Formatação
npm run format

# Verificar formatação
npm run format:check

# Corrigir warnings
npm run lint:fix
```

### Configuração do Firebase

1. **Crie um projeto** no Firebase Console
2. **Habilite** Authentication (Google)
3. **Configure** Firestore Database
4. **Adicione** aplicação web
5. **Copie** as credenciais para `.env`

### Estrutura de Dados

#### Firestore Collections

```typescript
// users
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "gerente" | "dispatcher" | "user";
  telefone?: string;
  cargo?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// funcionarios (antigo motoristas)
interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  telefone: string;
  email?: string;
  endereco: string;
  cidade: string;
  status: "trabalhando" | "disponivel" | "folga" | "ferias";
  funcao: "motorista" | "ajudante" | "outro";
  dataAdmissao?: string;
  salario?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🧪 Testes

### Estrutura de Testes

```typescript
// __tests__/Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    // Assertions
  });
});
```

### Testes de Integração

```typescript
// Testes com Firebase Emulator
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";

beforeAll(async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: "test-project",
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  });
});
```

## 📦 Deploy

### Firebase Hosting

```bash
# Build do projeto
npm run build

# Deploy
npm run deploy

# Ou manualmente
firebase deploy
```

### Configuração de Domínio

1. **Firebase Console** → Hosting
2. **Adicionar domínio** personalizado
3. **Configurar DNS** conforme instruções

## 🐛 Debugging

### Ferramentas Recomendadas

- **React Developer Tools**: Extensão do navegador
- **Firebase Console**: Para debug do backend
- **Chrome DevTools**: Para debug geral

### Logs Estruturados

```typescript
// Utilitário de logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
};
```

## 🔒 Segurança

### Boas Práticas

1. **Validação de dados** no frontend e backend
2. **Regras do Firestore** configuradas adequadamente
3. **Autenticação** obrigatória para rotas protegidas
4. **Sanitização** de inputs do usuário
5. **Rate limiting** para APIs

### Regras do Firestore

```javascript
// firestore.rules
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
  }
}
```

## 📚 Recursos Adicionais

### Documentação

- **[Arquitetura](./ARQUITETURA.md)**: Documentação técnica detalhada
- **[API](./API.md)**: Documentação da API
- **[Guia do Usuário](./GUIA_USUARIO.md)**: Manual do usuário final

### Links Úteis

- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Recharts**: https://recharts.org/

## 🤝 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/logistica.git
cd logistica

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/logistica.git
```

### 2. Criar Branch

```bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Ou para correção de bug
git checkout -b fix/correcao-bug
```

### 3. Desenvolver

```bash
# Faça suas alterações
# Execute os testes
npm test

# Verifique a formatação
npm run format:check

# Corrija problemas de linting
npm run lint:fix
```

### 4. Commit e Push

```bash
# Adicione suas alterações
git add .

# Faça commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade de exportação"

# Push para sua branch
git push origin feature/nova-funcionalidade
```

### 5. Pull Request

1. **Crie um PR** no GitHub
2. **Descreva** suas alterações
3. **Referencie** issues relacionadas
4. **Aguarde** review

### Convenções de Commit

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 📞 Suporte

### Para Dúvidas

- **Issues**: Abra uma issue no GitHub
- **Discussions**: Use as discussions do repositório
- **Email**: contato@empresa.com

### Para Bugs

1. **Verifique** se já existe uma issue
2. **Crie** uma nova issue com:
   - Descrição do bug
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do ambiente

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
