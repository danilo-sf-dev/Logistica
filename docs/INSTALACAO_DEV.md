# 🚀 Guia de Instalação para Desenvolvedores

## 📋 Visão Geral

Este documento contém todas as instruções necessárias para configurar o **Sistema de Gestão de Logística (SGL)** em uma nova máquina de desenvolvimento. Inclui as modificações recentes realizadas no sistema de relatórios e todas as dependências necessárias.

## 🎯 Modificações Recentes Implementadas

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

#### **3. Correção de Erros de Console**

- **Problema**: `b.createdAt.getTime is not a function` em notificações
- **Solução**: Conversão adequada de timestamps do Firestore para objetos Date
- **Arquivo Modificado**: `src/services/notificationService.ts`

#### **4. Melhoria na Exibição de Funções**

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

# Ou para Fedora
sudo dnf install nodejs npm
```

#### **2. Instalar Git**

**Windows:**

```bash
# Baixar do site oficial
# https://git-scm.com/download/win

# Ou usar Chocolatey
choco install git

# Ou usar Scoop
scoop install git
```

**macOS:**

```bash
# Usar Homebrew
brew install git

# Ou baixar do site oficial
# https://git-scm.com/download/mac
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install git
```

**Linux (CentOS/RHEL/Fedora):**

```bash
sudo yum install git
# Ou para Fedora
sudo dnf install git
```

#### **3. Instalar Firebase CLI**

```bash
# Instalar globalmente via npm
npm install -g firebase-tools

# Verificar instalação
firebase --version
```

**Alternativas de instalação:**

**Windows:**

```bash
# Usar Chocolatey
choco install firebase-cli

# Ou usar Scoop
scoop install firebase
```

**macOS:**

```bash
# Usar Homebrew
brew install firebase-cli
```

#### **4. Instalar Vite (se necessário)**

```bash
# Instalar Vite globalmente (opcional)
npm install -g create-vite

# Ou usar npx (recomendado)
npx create-vite@latest
```

#### **5. Instalar Editor de Código (Recomendado)**

**Visual Studio Code:**

```bash
# Windows (Chocolatey)
choco install vscode

# macOS (Homebrew)
brew install --cask visual-studio-code

# Linux (Ubuntu/Debian)
sudo snap install code --classic
```

### **Verificar Instalações**

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

## 📥 Instalação Passo a Passo

### **1. Clonar o Repositório**

```bash
# Navegar para o diretório desejado
cd /caminho/para/seu/projeto

# Clonar o repositório
git clone https://github.com/seu-usuario/sistema-gestao-logistica.git

# Entrar no diretório do projeto
cd sistema-gestao-logistica
```

### **2. Instalar Dependências**

```bash
# Instalar todas as dependências do projeto
npm install

# Verificar se a instalação foi bem-sucedida
npm list --depth=0
```

**Alternativas usando outros gerenciadores de pacotes:**

```bash
# Usando Yarn
yarn install

# Usando pnpm
pnpm install

# Usando Bun
bun install
```

**Instalar gerenciadores alternativos:**

```bash
# Instalar Yarn
npm install -g yarn

# Instalar pnpm
npm install -g pnpm

# Instalar Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash
```

**⚠️ Possíveis Problemas e Soluções:**

```bash
# Se houver erro de permissão no Windows
npm install --no-optional

# Se houver conflito de versões
npm install --force

# Se houver problema com cache
npm cache clean --force
npm install
```

### **3. Configurar Firebase**

#### **3.1 Configuração Inicial do Firebase CLI**

```bash
# Fazer login no Firebase
firebase login

# Verificar se o login foi bem-sucedido
firebase projects:list

# Inicializar Firebase no projeto (se necessário)
firebase init

# Selecionar:
# - Firestore
# - Hosting
# - Emulators (opcional)
```

#### **3.2 Obter Credenciais do Firebase**

1. Acesse: https://console.firebase.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá em "Configurações do Projeto" > "Configurações do SDK"
4. Copie as credenciais do `firebaseConfig`

#### **3.2 Configurar o Projeto**

```bash
# Executar script de configuração do Firebase
npm run setup-firebase
```

**Ou configurar manualmente:**

```bash
# Editar o arquivo de configuração
code src/firebase/config.ts
```

**Conteúdo do arquivo `src/firebase/config.ts`:**

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### **4. Configurar Firestore**

#### **4.1 Regras de Segurança**

```bash
# Copiar regras de segurança
cp docs/firestore.rules firestore.rules

# Deploy das regras
firebase deploy --only firestore:rules
```

#### **4.2 Índices do Firestore**

```bash
# Copiar índices
cp docs/firestore.indexes.json firestore.indexes.json

# Deploy dos índices
firebase deploy --only firestore:indexes
```

### **5. Configurar Variáveis de Ambiente**

```bash
# Criar arquivo .env na raiz do projeto
touch .env
```

**Conteúdo do arquivo `.env`:**

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

# Configurações da Aplicação
REACT_APP_NAME="Sistema de Gestão de Logística"
REACT_APP_VERSION="1.0.0"
```

## 🚀 Executando o Projeto

### **1. Modo de Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# O projeto estará disponível em: http://localhost:3000
```

### **2. Verificar Funcionamento**

1. Acesse: http://localhost:3000
2. Faça login com uma conta Google
3. Navegue para a seção "Relatórios"
4. Verifique se os cards mostram:
   - **Total Funcionários**: 18
   - **Total Motoristas**: 8
   - **Total Veículos**: 11
   - **Folgas Pendentes**: 0

### **3. Verificar Console**

```bash
# Abrir DevTools (F12)
# Verificar se não há erros no console
# Especialmente verificar se não há:
# - "b.createdAt.getTime is not a function"
# - "Cargo não informado"
```

## 🧪 Testes e Validação

### **1. Teste de Build**

```bash
# Verificar se o projeto compila corretamente
npm run build

# Verificar se não há erros de TypeScript
npx tsc --noEmit
```

### **2. Teste de Linting**

```bash
# Verificar qualidade do código
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix
```

### **3. Teste de Formatação**

```bash
# Verificar formatação do código
npm run format:check

# Formatar código automaticamente
npm run format
```

## 🔧 Comandos Úteis

### **Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Preview do build de produção
npm run preview

# Executar testes
npm run test
```

### **Build e Deploy**

```bash
# Build para produção
npm run build

# Deploy para Firebase
npm run deploy

# Build + Deploy em um comando
npm run build && firebase deploy
```

### **Manutenção**

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Atualizar dependências
npm update
```

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **1. Erro de Porta em Uso**

```bash
# Verificar processos na porta 3000
netstat -ano | findstr :3000

# Matar processo (Windows)
taskkill /PID <PID> /F

# Matar processo (Linux/Mac)
kill -9 <PID>
```

#### **2. Erro de Dependências**

```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **3. Erro de Firebase**

```bash
# Verificar configuração
firebase projects:list

# Fazer login novamente
firebase logout
firebase login
```

#### **4. Erro de TypeScript**

```bash
# Verificar tipos
npx tsc --noEmit

# Reinstalar tipos
npm install @types/node @types/react @types/react-dom
```

### **Logs de Debug**

```bash
# Ver logs detalhados do Vite
npm run dev -- --debug

# Ver logs do Firebase
firebase emulators:start --debug
```

## 📁 Estrutura do Projeto

```
sistema-gestao-logistica/
├── src/
│   ├── components/
│   │   ├── relatorios/          # 🆕 Sistema de relatórios atualizado
│   │   ├── dashboard/           # Dashboard com atividades recentes
│   │   ├── funcionarios/        # Gestão de funcionários
│   │   ├── veiculos/           # Gestão de veículos
│   │   ├── rotas/              # Gestão de rotas
│   │   ├── folgas/             # Gestão de folgas
│   │   ├── cidades/            # Gestão de cidades
│   │   ├── vendedores/         # Gestão de vendedores
│   │   └── configuracoes/      # Configurações do sistema
│   ├── services/
│   │   └── notificationService.ts  # 🆕 Notificações corrigidas
│   ├── contexts/               # Contextos React
│   ├── hooks/                  # Hooks customizados
│   ├── utils/                  # Utilitários
│   └── types/                  # Tipos TypeScript
├── docs/                       # Documentação
├── build/                      # Build de produção
└── public/                     # Arquivos públicos
```

## 🔄 Fluxo de Desenvolvimento

### **1. Nova Feature**

```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Desenvolver
# ... código ...

# Commit
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade
```

### **2. Correção de Bug**

```bash
# Criar branch
git checkout -b fix/correcao-bug

# Corrigir
# ... código ...

# Commit
git add .
git commit -m "fix: corrige bug específico"

# Push
git push origin fix/correcao-bug
```

### **3. Merge**

```bash
# Voltar para main
git checkout main

# Atualizar
git pull origin main

# Merge
git merge feature/nova-funcionalidade

# Push
git push origin main
```

## 📞 Suporte

### **Contatos**

- **Email**: dev@empresa.com
- **Slack**: #sgl-dev
- **Documentação**: Este arquivo

### **Recursos**

- **Firebase Console**: https://console.firebase.google.com/
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/

## ✅ Checklist de Instalação

### **Pré-requisitos**

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Git instalado
- [ ] Firebase CLI instalado
- [ ] Editor de código instalado (VS Code recomendado)

### **Configuração do Projeto**

- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Firebase CLI logado
- [ ] Firebase inicializado no projeto
- [ ] Firebase configurado
- [ ] Variáveis de ambiente configuradas

### **Validação**

- [ ] Projeto executando em http://localhost:3000
- [ ] Login funcionando
- [ ] Relatórios mostrando dados corretos
- [ ] Build funcionando
- [ ] Linting passando
- [ ] Testes passando

## 🎉 Conclusão

Após seguir todos os passos acima, você terá uma instância completa do **Sistema de Gestão de Logística** funcionando em sua máquina de desenvolvimento, incluindo todas as modificações recentes implementadas.

**Lembre-se**: Sempre mantenha suas dependências atualizadas e siga as boas práticas de desenvolvimento ao contribuir com o projeto.

---

**Última atualização**: $(date)
**Versão do documento**: 1.0.0
**Autor**: Equipe de Desenvolvimento SGL
