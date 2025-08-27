# 🤝 Guia de Contribuição - SGL

## 📋 Visão Geral

Este documento fornece diretrizes para contribuir com o desenvolvimento do Sistema de Gestão de Logística (SGL).

## 🎯 Como Contribuir

### 📝 **Tipos de Contribuição**

1. **🐛 Reportar Bugs**
2. **💡 Sugerir Melhorias**
3. **📚 Melhorar Documentação**
4. **🔧 Implementar Funcionalidades**
5. **🧪 Adicionar Testes**

### 🚀 **Primeiros Passos**

1. **Fork** o repositório
2. **Clone** o fork localmente
3. **Instale** as dependências
4. **Configure** o ambiente de desenvolvimento
5. **Crie** uma branch para sua contribuição

## 🛠️ Ambiente de Desenvolvimento

### 📋 **Pré-requisitos**

- **Node.js**: 18.x ou superior
- **npm**: 9.x ou superior
- **Git**: 2.x ou superior
- **Firebase CLI**: Última versão

### 🔧 **Configuração Inicial**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/logistica.git
cd logistica

# Instale as dependências
npm install

# Configure o Firebase
npm run setup-firebase

# Inicie o servidor de desenvolvimento
npm start
```

### 🔑 **Configuração Firebase**

1. **Crie** um projeto no Firebase Console
2. **Configure** Authentication (Google)
3. **Configure** Firestore Database
4. **Configure** Hosting
5. **Copie** as credenciais para `.env`

```env
# .env
VITE_FIREBASE_API_KEY=AIzaSyC_ExAmPlE_KeY_1234567890abcdef
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-exemplo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-exemplo
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-exemplo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF12345
VITE_VAPID_PUBLIC_KEY=BLh_ExAmPlE_VaPiD_KeY_1234567890abcdef
```

## 📁 **Estrutura do Projeto**

### 🏗️ **Arquitetura**

```
src/
├── components/           # Componentes React
│   ├── auth/            # Autenticação
│   ├── cidades/         # Gestão de cidades
│   ├── common/          # Componentes comuns
│   ├── dashboard/       # Dashboard
│   ├── folgas/          # Gestão de folgas
│   ├── funcionarios/    # Gestão de funcionários
│   ├── layout/          # Layout da aplicação
│   ├── relatorios/      # 🆕 Sistema de relatórios
│   ├── rotas/           # Gestão de rotas
│   ├── veiculos/        # Gestão de veículos
│   └── vendedores/      # Gestão de vendedores
├── contexts/            # Contextos React
├── firebase/            # Configuração Firebase
├── hooks/               # Custom hooks
├── types/               # Tipos TypeScript
└── utils/               # Utilitários
```

### 🆕 **Novas Funcionalidades (v1.1.0)**

#### 📊 **Sistema de Relatórios**

```
src/components/relatorios/
├── export/              # 🆕 Sistema de exportação
│   ├── BaseExportService.ts
│   ├── BaseTableExportService.ts
│   ├── FuncionariosExportService.ts
│   ├── VeiculosExportService.ts
│   ├── RotasExportService.ts
│   ├── FolgasExportService.ts
│   ├── CidadesExportService.ts
│   ├── VendedoresExportService.ts
│   └── index.ts
├── ui/
│   ├── ExportModal.tsx          # 🆕 Modal de exportação
│   ├── RelatoriosDetalhados.tsx # 🆕 Relatórios detalhados
│   └── ...
└── ...
```

#### 🔧 **Melhorias Técnicas**

- **Formatação Brasileira**: Datas DD/MM/YYYY
- **Layout Minimalista**: Interface preto e branco
- **Tipos Separados**: Arquivos de tipos independentes
- **Nomenclatura Padrão**: entity_dd-MM-YYYY.xlsx

## 📝 **Padrões de Código**

### 🎨 **Convenções**

#### **Nomenclatura**

```typescript
// Arquivos e pastas
camelCase.tsx          // Componentes
PascalCase.tsx         // Componentes principais
kebab-case.ts          // Utilitários

// Variáveis e funções
const userName = '';    // camelCase
const getUserData = () => {}; // camelCase

// Constantes
const API_BASE_URL = ''; // UPPER_SNAKE_CASE

// Tipos e interfaces
interface UserData {}   // PascalCase
type UserStatus = '';   // PascalCase
```

#### **Estrutura de Componentes**

```typescript
// 1. Imports
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// 2. Types
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  title,
  onAction,
}) => {
  // 4. Hooks
  const { user } = useAuth();

  // 5. Handlers
  const handleClick = () => {
    onAction?.();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Ação</button>
    </div>
  );
};
```

#### **Estrutura de Pacotes**

```
package/
├── data/               # Serviços de dados
├── export/             # 🆕 Serviços de exportação
├── state/              # Hooks de estado
├── ui/                 # Componentes de interface
├── pages/              # Páginas
├── types.ts            # Tipos do pacote
├── index.ts            # Exportações
├── index.tsx           # Ponto de entrada
└── README.md           # Documentação
```

### 🔧 **Configurações**

#### **ESLint**

```json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### **Prettier**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 **Testes**

### 📋 **Estrutura de Testes**

```
src/
├── __tests__/          # Testes globais
├── components/
│   └── component/
│       ├── __tests__/  # Testes do componente
│       └── Component.test.tsx
└── utils/
    └── __tests__/      # Testes de utilitários
```

### 🧪 **Tipos de Testes**

#### **Testes Unitários**

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### **Testes de Integração**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component Integration', () => {
  it('should handle user interaction', () => {
    const mockAction = jest.fn();
    render(<Component title="Test" onAction={mockAction} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### 🚀 **Executar Testes**

```bash
# Todos os testes
npm test

# Testes em modo watch
npm test -- --watch

# Testes com coverage
npm test -- --coverage

# Testes específicos
npm test -- Component.test.tsx
```

## 🆕 **Contribuindo com Novas Funcionalidades**

### 📊 **Sistema de Relatórios**

#### **Criando um Novo Serviço de Exportação**

```typescript
// src/components/relatorios/export/NovoExportService.ts
import { BaseExportService } from "./BaseExportService";
import type { ExportConfig } from "./BaseExportService";

export class NovoExportService extends BaseExportService {
  protected config: ExportConfig = {
    campos: ["campo1", "campo2", "campo3"],
    formatacao: {
      campo1: (valor) => this.formatValue("campo1", valor),
      campo2: (valor) => this.formatValue("campo2", valor),
    },
    ordenacao: ["campo1", "campo2"],
    titulo: "Novo Relatório",
  };

  protected formatValue(field: string, value: any): any {
    // Implementar formatação específica
    return super.formatValue(field, value);
  }
}
```

#### **Adicionando ao Factory**

```typescript
// src/components/relatorios/export/index.ts
export class ExportServiceFactory {
  static createService(tipo: string): BaseExportService {
    switch (tipo.toLowerCase()) {
      // ... casos existentes
      case "novo_tipo":
      case "novo_tipo_detalhado":
        return new NovoExportService();
      default:
        throw new Error(`Tipo de relatório não suportado: ${tipo}`);
    }
  }
}
```

### 🔧 **Melhorias Técnicas**

#### **Formatação Brasileira**

```typescript
// src/utils/formatters.ts
export const formatDateBR = (date: Date | string): string => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("pt-BR");
  }
  return date.toString();
};

export const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
```

#### **Nomenclatura de Arquivos**

```typescript
// src/utils/fileNaming.ts
export const generateFileName = (
  entity: string,
  date: Date = new Date()
): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${entity}_${day}-${month}-${year}.xlsx`;
};
```

## 🔄 **Fluxo de Desenvolvimento**

### 🌿 **Branches**

- **main**: Código em produção
- **develop**: Código em desenvolvimento
- **feature/nome-da-feature**: Novas funcionalidades
- **bugfix/nome-do-bug**: Correções de bugs
- **hotfix/nome-do-hotfix**: Correções urgentes

### 📝 **Commits**

```bash
# Padrão de commits
git commit -m "feat: adiciona sistema de exportação Excel"
git commit -m "fix: corrige formatação de datas brasileiras"
git commit -m "docs: atualiza documentação de relatórios"
git commit -m "test: adiciona testes para exportação"
git commit -m "refactor: reorganiza estrutura de exportação"
```

#### **Tipos de Commit**

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação
- **refactor**: Refatoração
- **test**: Testes
- **chore**: Tarefas de manutenção

### 🔄 **Pull Requests**

#### **Template de PR**

```markdown
## 📋 Descrição

Breve descrição das mudanças.

## 🎯 Tipo de Mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## 🧪 Testes

- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Testes manuais realizados

## 📸 Screenshots

Adicione screenshots se aplicável.

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Build passando
- [ ] Lint passando
```

## 🚀 **Deploy**

### 📦 **Build de Produção**

```bash
# Build
npm run build

# Deploy para Firebase
npm run deploy

# Verificar deploy
firebase hosting:channel:list
```

### 🔧 **Configuração de Ambiente**

```bash
# Variáveis de ambiente
cp .env.example .env
# Atualizar variáveis de REACT_APP_ para VITE_ no arquivo .env
```

# Configurar Firebase

firebase use production
firebase deploy --only hosting

````

## 📚 **Documentação**

### 📝 **Atualizando Documentação**

1. **README.md**: Visão geral do projeto
2. **docs/**: Documentação detalhada
3. **JSDoc**: Documentação de código
4. **CHANGELOG.md**: Histórico de mudanças

### 📖 **Padrões de Documentação**

```typescript
/**
 * Serviço para exportação de dados em Excel
 * @class ExcelExportService
 * @extends BaseExportService
 */
export class ExcelExportService extends BaseExportService {
  /**
   * Exporta dados para arquivo Excel
   * @param {any[]} dados - Dados a serem exportados
   * @param {string} nomeArquivo - Nome do arquivo
   * @returns {Promise<void>}
   */
  async exportToExcel(dados: any[], nomeArquivo: string): Promise<void> {
    // Implementação
  }
}
````

## 🐛 **Reportando Bugs**

### 📋 **Template de Bug Report**

```markdown
## 🐛 Descrição do Bug

Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## ✅ Comportamento Esperado

O que deveria acontecer.

## 📸 Screenshots

Adicione screenshots se aplicável.

## 💻 Ambiente

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 90]
- Versão: [ex: 1.1.0]

## 📋 Informações Adicionais

Qualquer informação adicional sobre o problema.
```

## 💡 **Sugerindo Melhorias**

### 📋 **Template de Feature Request**

```markdown
## 💡 Descrição da Melhoria

Descrição clara da funcionalidade desejada.

## 🎯 Problema que Resolve

Qual problema esta melhoria resolve.

## 💭 Solução Proposta

Como você gostaria que fosse implementada.

## 🔄 Alternativas Consideradas

Outras soluções que você considerou.

## 📋 Informações Adicionais

Qualquer informação adicional.
```

## 🤝 **Código de Conduta**

### 📋 **Diretrizes**

1. **Respeito**: Trate todos com respeito
2. **Inclusão**: Seja inclusivo e acolhedor
3. **Colaboração**: Trabalhe em equipe
4. **Qualidade**: Mantenha alta qualidade de código
5. **Documentação**: Documente suas mudanças

### 🚫 **Comportamentos Inaceitáveis**

- Linguagem ofensiva ou discriminatória
- Assédio ou bullying
- Spam ou propaganda
- Violação de privacidade
- Comportamento não profissional

## 📞 **Contato**

### 👥 **Equipe**

- **Tech Lead**: [Nome do Tech Lead]
- **Frontend**: [Nome do Frontend]
- **Backend**: [Nome do Backend]
- **QA**: [Nome do QA]

### 📧 **Canais**

- **Email**: desenvolvimento@empresa.com
- **Slack**: #sgl-desenvolvimento
- **GitHub**: Issues e Discussions
- **Jira**: Projeto SGL

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.1.0  
**Status:** ✅ Documentação atualizada com novas funcionalidades
