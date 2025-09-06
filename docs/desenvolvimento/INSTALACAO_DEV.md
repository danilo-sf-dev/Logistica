# 🚀 Guia de Instalação para Desenvolvedores

## 📋 Visão Geral

Este documento contém todas as instruções necessárias para configurar o **Sistema de Gestão de Logística (SGL)** em uma nova máquina de desenvolvimento. Inclui as modificações recentes realizadas no sistema de relatórios, migração para TypeScript, uso do Vite e todas as dependências necessárias.

## 🎯 Modificações Recentes Implementadas (v1.2.2+)

### ✅ **Sistema de Gestão de Usuários Completo**

- **Interface de Gestão**: Tela dedicada para gerenciar perfis e permissões
- **Perfis Temporários**: Promoções com data de início e fim
- **Auditoria Completa**: Histórico de todas as alterações de perfil
- **Validação de Segurança**: Prevenção de escalação de privilégios
- **Hierarquia de Roles**: admin_senior, admin, gerente, dispatcher, user

### ✅ **Sistema de Importação de Dados**

- **Importação Excel**: Upload de arquivos XLSX com validação
- **Templates Automáticos**: Geração de planilhas modelo
- **Validação de Dados**: Verificação de campos obrigatórios e formatos
- **Relatórios de Importação**: Log detalhado de sucessos e falhas
- **Suporte a Múltiplas Entidades**: Funcionários, veículos, cidades, vendedores

### ✅ **Migração para TypeScript (100%)**

- **Código Tipado**: Todo o projeto migrado para TypeScript
- **Segurança de Tipos**: Verificação estática de tipos
- **Melhor IntelliSense**: Autocompletar mais preciso
- **Arquivos**: Todos os arquivos `.js` convertidos para `.ts`/`.tsx`

### ✅ **Build Tool Vite**

- **Desenvolvimento Mais Rápido**: Hot reload otimizado
- **Build Otimizado**: Bundle menor e mais eficiente
- **Configuração Simplificada**: Menos configuração necessária
- **Porta Padrão**: http://localhost:3000

### ✅ **Sistema de Relatórios Atualizado**

#### **1. Separação de Dados: Funcionários vs Motoristas**

- **Problema Resolvido**: O relatório "Total Funcionários" estava mostrando apenas motoristas (8) em vez de todos os funcionários (18)
- **Solução**: Criados métodos separados para buscar todos os funcionários vs apenas motoristas
- **Arquivos Modificados**:
  - `src/components/relatorios/data/relatoriosService.ts`
  - `src/components/relatorios/state/useRelatorios.ts`
  - `src/components/relatorios/ui/ResumoCards.tsx`
  - `src/components/relatorios/pages/RelatoriosPage.tsx`

#### **2. Interface de Relatórios Melhorada**

- **Card Adicionado**: Novo card "Total Motoristas" entre "Total Funcionários" e "Total Veículos"
- **Ícones Removidos**: Removidos ícones de download dos cards de gráfico (mantidos apenas na seção "Relatórios Detalhados")
- **Layout Otimizado**: Grid responsivo ajustado para 4 cards de resumo

#### **3. Sistema de Exportação Avançado**

- **Excel (XLSX)**: Exportação com formatação profissional
- **PDF**: Documentos formatados para impressão
- **Formatação Brasileira**: Datas DD/MM/YYYY, CPF, telefone
- **Arquitetura Modular**: Serviços especializados por entidade

### ✅ **Sistema de Notificações Completo**

- **NotificationService**: Serviço centralizado
- **NotificationBell**: Sino de notificações no header
- **Configurações**: Interface para gerenciar preferências
- **Tempo Real**: Toast notifications para eventos
- **Persistência**: Salvamento no Firestore

### ✅ **Sistema de Segurança Avançado**

- **Regras Firestore**: Implementadas e ativas
- **Controle de Acesso**: Roles admin, gerente, dispatcher, user
- **Proteção de Dados**: Leitura/escrita controlada
- **SessionService**: Captura de IP e informações de dispositivo

### ✅ **Correção de Erros de Console**

- **Problema**: `b.createdAt.getTime is not a function` em notificações
- **Solução**: Conversão adequada de timestamps do Firestore para objetos Date
- **Arquivo Modificado**: `src/services/notificationService.ts`

### ✅ **Melhoria na Exibição de Funções**

- **Problema**: "Cargo não informado" em atividades recentes
- **Solução**: Uso correto do campo `funcao` em vez de `cargo` para funcionários
- **Arquivo Modificado**: `src/components/dashboard/data/dashboardService.ts`

## 🛠️ Pré-requisitos

### **Sistema Operacional**

- **Windows 10/11** (testado)
- **macOS 10.15+** (compatível)
- **Linux Ubuntu 20.04+** (compatível)

### **Versões Mínimas**

- **Node.js**: 18.0.0 ou superior
- **npm**: 9.0.0 ou superior
- **Git**: 2.30.0 ou superior
- **Firebase CLI**: 12.0.0 ou superior

### **Instalação dos Pré-requisitos**

#### **1. Instalar Node.js e npm**

**Windows:**

```bash
# Baixar e instalar do site oficial
# https://nodejs.org/en/download/

# Ou usar Chocolatey
choco install nodejs

# Ou usar Scoop
scoop install nodejs
```

**macOS:**

```bash
# Usar Homebrew
brew install node

# Ou baixar do site oficial
# https://nodejs.org/en/download/
```

**Linux (Ubuntu/Debian):**

```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js e npm
sudo apt install nodejs npm

# Ou usar NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (CentOS/RHEL/Fedora):**

```bash
# Usar NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### **2. Verificar Instalação**

```bash
# Verificar Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar: 9.x.x ou superior

# Verificar Git
git --version
# Deve retornar: 2.30.x ou superior

# Verificar Firebase CLI
firebase --version
# Deve retornar: 12.x.x ou superior

# Verificar Vite (se instalado globalmente)
vite --version
```

#### **3. Instalar Firebase CLI**

```bash
# Instalar globalmente
npm install -g firebase-tools

# Verificar instalação
firebase --version
```

#### **4. Instalar Git**

**Windows:**

- Baixar de: https://git-scm.com/download/win

**macOS:**

```bash
brew install git
```

**Linux:**

```bash
sudo apt install git  # Ubuntu/Debian
sudo yum install git  # CentOS/RHEL
```

## 🚀 Configuração do Projeto

### **1. Clonar o Repositório**

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/logistica.git

# Entrar no diretório
cd logistica

# Verificar se está no branch correto
git branch
```

### **2. Instalar Dependências**

```bash
# Instalar todas as dependências
npm install

# Verificar se não há erros
npm run lint
```

**Comandos Alternativos (se houver problemas):**

```bash
# Se houver erro de permissão no Windows
npm install --no-optional

# Se houver conflito de versões
npm install --force

# Se houver problema com cache
npm cache clean --force
npm install
```

### **3. Configurar Variáveis de Ambiente**

**Criar arquivo `.env` na raiz do projeto:**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC_ExAmPlE_KeY_1234567890abcdef
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-exemplo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-exemplo
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-exemplo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF12345

# VAPID Key para notificações push (opcional)
VITE_VAPID_PUBLIC_KEY=BLh_ExAmPlE_VaPiD_KeY_1234567890abcdef

# App Configuration
VITE_APP_NAME=SGL - Sistema de Gestão de Logística
VITE_APP_VERSION=1.2.3
VITE_APP_ENVIRONMENT=development
```

**⚠️ Importante:**

- Nunca commite o arquivo `.env` no Git
- Use credenciais de desenvolvimento separadas
- O arquivo `.env` já está no `.gitignore`

### **4. Configurar Firebase**

#### **Opção A: Configuração Automática (Recomendado)**

```bash
# Executar script de configuração
npm run setup-firebase
```

Siga as instruções do script para:

1. Criar projeto no Firebase Console
2. Habilitar autenticação Google
3. Configurar Firestore Database
4. Adicionar aplicação web
5. Copiar credenciais automaticamente

#### **Opção B: Configuração Manual**

1. **Acessar Firebase Console**: https://console.firebase.google.com
2. **Criar Projeto**: "Logistica" ou nome desejado
3. **Habilitar Authentication**:
   - Método: Google
   - Domínios autorizados: localhost, seu domínio
4. **Criar Firestore Database**:
   - Modo: Teste (para desenvolvimento)
   - Região: us-central1 (padrão)
5. **Adicionar Aplicação Web**:
   - Nome: "SGL Web App"
   - Copiar credenciais
6. **Atualizar arquivo `.env`** com as credenciais

### **5. Configurar Regras de Segurança**

**Firestore Rules** (em `firestore.rules`):

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

### **6. Deploy das Regras**

```bash
# Fazer login no Firebase
firebase login

# Inicializar projeto (se necessário)
firebase init

# Deploy das regras
firebase deploy --only firestore:rules

# Deploy dos índices
firebase deploy --only firestore:indexes
```

## 🚀 Executando o Projeto

### **1. Modo Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

**Acesse:** http://localhost:3000

### **2. Build para Produção**

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

### **3. Deploy**

```bash
# Deploy no Firebase Hosting
npm run deploy
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # Verificar código com ESLint
npm run lint:fix         # Corrigir problemas do ESLint
npm run format           # Formatar código com Prettier
npm run format:check     # Verificar formatação

# Testes
npm run test             # Executar testes

# Configuração
npm run setup            # Configuração inicial
npm run setup-firebase   # Configuração do Firebase

# Deploy
npm run deploy           # Deploy no Firebase
```

## 🛠️ Configuração do IDE

### **VS Code (Recomendado)**

**Extensões Recomendadas:**

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "firebase.firebase-explorer",
    "ms-vscode.vscode-react-native"
  ]
}
```

**Configurações do Workspace** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### **Configuração do TypeScript**

**`tsconfig.json`** (já configurado):

```json
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

## 🔍 Debugging

### **1. Console do Navegador**

```javascript
// Verificar configuração do Firebase
console.log('Firebase Config:', import.meta.env.VITE_FIREBASE_API_KEY);

// Verificar autenticação
console.log('User:', auth.currentUser);

// Verificar dados do Firestore
console.log('Funcionários:', funcionarios);
```

### **2. React Developer Tools**

- Instalar extensão do Chrome/Firefox
- Inspecionar componentes e props
- Verificar estado dos hooks

### **3. Firebase Console**

- **Authentication**: Verificar usuários logados
- **Firestore**: Inspecionar dados
- **Hosting**: Verificar deploy
- **Functions**: Verificar logs (se aplicável)

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **1. Erro de Porta em Uso**

```bash
# Verificar processos na porta 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Matar processo
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### **2. Erro de Dependências**

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

#### **3. Erro de TypeScript**

```bash
# Verificar tipos
npx tsc --noEmit

# Corrigir problemas
npm run lint:fix
```

#### **4. Erro de Firebase**

```bash
# Verificar configuração
firebase projects:list

# Fazer login novamente
firebase logout
firebase login
```

#### **5. Erro de Build**

```bash
# Limpar build
rm -rf dist

# Rebuild
npm run build
```

## 📚 Recursos Adicionais

### **Documentação Oficial**

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Firebase**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### **Ferramentas Úteis**

- **Firebase CLI**: https://firebase.google.com/docs/cli
- **React Developer Tools**: https://react.dev/learn/react-developer-tools
- **TypeScript Playground**: https://www.typescriptlang.org/play

### **Comunidade**

- **Stack Overflow**: Tagged com [react], [typescript], [firebase]
- **GitHub Issues**: Reportar bugs e solicitar features
- **Discord**: Comunidade de desenvolvedores

## 🎯 Próximos Passos

1. **Configurar IDE** com as extensões recomendadas
2. **Executar projeto** em modo desenvolvimento
3. **Testar funcionalidades** principais
4. **Configurar Firebase** com suas credenciais
5. **Fazer primeiro deploy** para testar

---

**🚀 Sistema configurado e pronto para desenvolvimento!**
