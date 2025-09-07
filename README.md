# SGL - Sistema de Gestão de Logística

Sistema web completo para gestão de logística, desenvolvido com React, TypeScript e Firebase.

## 🚀 **STATUS: ✅ FUNCIONANDO PERFEITAMENTE!**

**🌐 URL do Sistema:** https://logistica-c7afc.web.app  
**🔐 Login:** Funcionando com Google Authentication  
**📊 Dashboard:** Totalmente operacional  
**🚛 Módulos:** Todos funcionando  
**📤 Exportação:** Excel e PDF funcionando

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com KPIs e gráficos interativos
- **Gestão de Funcionários**: CRUD completo com dados pessoais e profissionais
- **Gestão de Veículos**: Controle de frota com informações técnicas
- **Rotas**: Otimização e gestão de rotas de entrega
- **Folgas**: Controle de folgas dos funcionários
- **Cidades**: Cadastro de cidades e regiões
- **Vendedores**: Gestão de vendedores e contatos
- **Relatórios**: Sistema avançado de relatórios e analytics
- **Autenticação**: Login com Google e Email/Senha
- **Notificações**: Sistema de notificações em tempo real
- **Configurações**: Perfil, notificações, sistema e segurança
- **Segurança**: Informações de sessão e controle de acesso

## 🆕 **Funcionalidades Implementadas (v1.2.2+)**

### 🔐 **Sistema de Segurança e Permissões**

- **Regras de Segurança Firestore**: Implementadas e ativas
- **Controle de Acesso por Role**: admin_senior, admin, gerente, dispatcher, user
- **Sistema de Gestão de Usuários**: Interface completa para gerenciar perfis
- **Perfis Temporários**: Promoções com data de início e fim
- **Auditoria Completa**: Histórico de todas as alterações de perfil
- **Validação de Permissões**: Sistema robusto de validação de acesso

### 🔔 **Sistema de Notificações Completo**

- **NotificationService**: Serviço centralizado de notificações
- **NotificationBell**: Sino de notificações no header
- **Configurações de Notificação**: Interface para gerenciar preferências
- **Notificações em Tempo Real**: Toast notifications para eventos
- **Filtro por Preferências**: Só envia se usuário habilitou
- **Salvamento no Firestore**: Notificações persistentes
- **Tipos de Notificação**: funcionário, rota, folga, veículo

### 📊 **Sistema de Relatórios Avançado**

- **Relatórios Detalhados**: Listas completas com todos os dados de cada entidade
- **Exportação Excel (XLSX)**: Arquivos com formatação profissional
- **Exportação PDF**: Documentos formatados para impressão
- **Modal de Exportação**: Interface para escolher formato (PDF/Excel)
- **Arquitetura Modular**: Serviços especializados por entidade
- **Filtros Inteligentes**: Aplicados apenas em entidades temporais
- **Ordenação Padrão**: Dados sempre do mais recente para o mais antigo

### 📥 **Sistema de Importação de Dados**

- **Importação Excel**: Upload de arquivos XLSX com validação
- **Templates Automáticos**: Geração de planilhas modelo
- **Validação de Dados**: Verificação de campos obrigatórios e formatos
- **Relatórios de Importação**: Log detalhado de sucessos e falhas
- **Suporte a Múltiplas Entidades**: Funcionários, veículos, cidades, vendedores

### 🔧 **Melhorias Técnicas**

- **Migração para TypeScript**: Código 100% tipado e mais seguro
- **Build Tool Vite**: Desenvolvimento mais rápido e build otimizado
- **Formatação Brasileira**: Datas DD/MM/YYYY, CPF, telefone
- **Layout Responsivo**: Interface adaptável para mobile, tablet e desktop
- **Nomenclatura Padrão**: Arquivos nomeados como `entity_dd-MM-YYYY.xlsx`
- **SessionService**: Captura real de IP e informações de dispositivo
- **Validação de Unicidade**: CPF, CNH, placa de veículos

### 📈 **Funcionalidades de Exportação**

- **Funcionários**: Relatório completo com dados pessoais e profissionais
- **Veículos**: Informações técnicas e status da frota (estrutura otimizada)
- **Rotas**: Detalhes de rotas e associações
- **Folgas**: Histórico de solicitações e aprovações
- **Cidades**: Dados geográficos e regionais
- **Vendedores**: Informações comerciais e contatos

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Export**: ExcelJS, jsPDF, file-saver
- **UI Components**: Headless UI, Heroicons

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Google (para Firebase)

## 🔧 Instalação e Configuração

### 1. Clone e Instale as Dependências

```bash
# Instalar dependências
npm install
```

### 2. Configure as Variáveis de Ambiente

**IMPORTANTE:** Por segurança, as credenciais do Firebase devem estar em variáveis de ambiente.

1. **Crie o arquivo `.env`** com suas credenciais do Firebase:

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
VITE_APP_VERSION=1.2.0
VITE_APP_ENVIRONMENT=development
```

**⚠️ Segurança:** Nunca commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

### 3. Configure o Firebase

#### Opção A: Configuração Automática (Recomendado)

```bash
npm run setup-firebase
```

Siga as instruções do script para:

1. Habilitar autenticação Google no Firebase Console
2. Adicionar aplicação web
3. Configurar Firestore Database
4. Colear as credenciais automaticamente

#### Opção B: Configuração Manual

1. **Firebase Console**: https://console.firebase.google.com
2. **Criar Projeto**: "Logistica"
3. **Authentication**: Habilitar Google Sign-in
4. **Firestore Database**: Criar em modo teste
5. **Aplicação Web**: Adicionar e copiar credenciais
6. **Atualizar**: `src/firebase/config.ts` com suas credenciais

### 4. Execute o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

Acesse: http://localhost:3000

### 5. Comandos de Formatação e Linting

```bash
# Verificar e corrigir problemas do ESLint
npm run lint

# Formatar código com Prettier
npm run format

# Verificar formatação sem alterar
npm run format:check

# Corrigir todos os warnings do ESLint
npm run lint:fix
```

**Nota:** O projeto está configurado com ESLint e Prettier para manter a qualidade do código.

## 🚀 Deploy

### Deploy no Firebase Hosting

```bash
# Build do projeto
npm run build

# Deploy
npm run deploy
```

### Configuração de Domínio

1. Firebase Console → Hosting
2. Adicionar domínio personalizado
3. Configurar DNS

## 🔐 Autenticação

O sistema suporta dois métodos de login:

### Login com Google (Recomendado)

- Mais seguro e conveniente
- Informações automáticas do perfil
- Padrão empresarial

### Login com Email/Senha

- Método tradicional
- Útil como fallback

## 👥 Roles e Permissões

### **Hierarquia de Perfis (do maior para o menor)**

- **admin_senior**: Acesso total sem restrições - pode gerenciar todos os usuários
- **admin**: Acesso total com restrições de gestão de usuários - pode gerenciar até gerente
- **gerente**: Acesso operacional completo + gestão limitada de usuários - pode gerenciar até funcionário e usuário
- **dispatcher**: Usuário constante do sistema com CRUD limitado - não pode gerenciar usuários
- **user**: Apenas visualização e relatórios - não pode gerenciar usuários

### **Sistema de Gestão de Usuários**

- **Interface Completa**: Tela dedicada para gerenciar perfis e permissões
- **Perfis Temporários**: Promoções com data de início e fim
- **Auditoria**: Histórico completo de todas as alterações
- **Validação de Segurança**: Prevenção de escalação de privilégios

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── layout/         # Layout e navegação
│   ├── funcionarios/   # Gestão de funcionários
│   ├── veiculos/       # Gestão de veículos
│   ├── rotas/          # Gestão de rotas
│   ├── folgas/         # Controle de folgas
│   ├── cidades/        # Cadastro de cidades
│   ├── vendedores/     # Gestão de vendedores
│   ├── relatorios/     # Sistema de relatórios e exportação
│   ├── configuracoes/  # Configurações e gestão de usuários
│   ├── import/         # Sistema de importação de dados
│   └── common/         # Componentes comuns (LoadingButton, etc.)
├── contexts/           # Contextos React
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── firebase/           # Configuração Firebase
├── hooks/              # Custom hooks
├── services/           # Serviços
│   ├── userManagement/ # Serviços de gestão de usuários
│   ├── permissionService.ts
│   ├── notificationService.ts
│   └── sessionService.ts
├── types/              # Tipos TypeScript
│   ├── permissions.ts  # Tipos de permissões e roles
│   └── index.ts
├── utils/              # Utilitários
└── App.tsx             # Componente principal
```

## 🆕 **Sistema de Relatórios**

### 📊 **Relatórios Detalhados**

O sistema agora oferece relatórios detalhados para todas as entidades:

- **Funcionários Detalhado**: Dados completos pessoais e profissionais
- **Veículos Detalhado**: Informações técnicas e status da frota
- **Rotas Detalhado**: Detalhes de rotas e associações
- **Folgas Detalhado**: Histórico de solicitações e aprovações
- **Cidades Detalhado**: Dados geográficos e regionais
- **Vendedores Detalhado**: Informações comerciais e contatos

### 📤 **Exportação Avançada**

#### **Formatos Suportados**

- **Excel (XLSX)**: Planilha para análise de dados
- **PDF**: Documento formatado para impressão

#### **Características**

- **Formatação Brasileira**: Datas DD/MM/YYYY, CPF, telefone
- **Layout Minimalista**: Interface preto e branco
- **Nomenclatura Padrão**: `entity_dd-MM-YYYY.xlsx`
- **Arquitetura Modular**: Serviços especializados por entidade

#### **Como Exportar**

1. Acesse o módulo "Relatórios"
2. Clique em "Relatórios Detalhados"
3. Escolha o tipo de relatório
4. Clique no botão de download
5. Selecione o formato (Excel ou PDF)
6. Baixe o arquivo automaticamente

## 📱 Recursos Avançados

### Notificações Push

- Firebase Cloud Messaging
- Notificações em tempo real
- Suporte a múltiplos dispositivos

### Otimização de Rotas

- Integração com Google Maps API
- Algoritmos de otimização
- Visualização de rotas

### Analytics

- Relatórios detalhados
- Gráficos interativos
- Exportação de dados em Excel e PDF

## 🔧 Scripts Disponíveis

```bash
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm run test             # Executar testes
npm run setup            # Configuração inicial
npm run setup-firebase   # Configuração do Firebase
npm run deploy           # Deploy no Firebase
npm run lint             # Verificar código
npm run format           # Formatar código
```

## 🎯 Como Usar o Sistema

### 1. Acesse o Sistema

- **URL**: https://logistica-c7afc.web.app
- **Login**: Use sua conta Google (recomendado)

### 2. Configure um Usuário Admin

1. Faça login pela primeira vez
2. Vá em **Firebase Console → Firestore Database**
3. Encontre o documento do usuário na coleção `users`
4. Altere o campo `role` para `"admin"`

### 3. Comece a Usar

- **Dashboard**: Veja KPIs e gráficos
- **Funcionários**: Adicione funcionários da equipe
- **Veículos**: Cadastre a frota
- **Rotas**: Crie rotas de entrega
- **Relatórios**: Analise dados e exporte relatórios

### 4. Exporte Relatórios

- **Acesse**: Módulo "Relatórios"
- **Clique**: "Relatórios Detalhados"
- **Escolha**: Tipo de relatório
- **Selecione**: Formato (Excel ou PDF)
- **Baixe**: Arquivo automaticamente

## 📚 Documentação

A documentação completa do projeto está organizada na pasta [`docs/`](./docs/):

### 🚀 **Para Usuários Finais**

- **[Guia do Usuário](./docs/GUIA_USUARIO.md)** - Manual completo de uso do sistema
- **[Instruções Rápidas](./docs/INSTRUCOES_RAPIDAS.md)** - Guia rápido para começar

### 👨‍💻 **Para Desenvolvedores**

- **[Arquitetura](./docs/ARQUITETURA.md)** - Documentação técnica e arquitetura
- **[API](./docs/API.md)** - Documentação da API e estrutura de dados
- **[Guia de Contribuição](./docs/CONTRIBUICAO.md)** - Como contribuir com o projeto

### 📊 **Para Gestores**

- **[Resumo do Projeto](./docs/RESUMO_PROJETO.md)** - Resumo executivo e status atual
- **[Roadmap](./docs/ROADMAP.md)** - Planejamento futuro e melhorias

### 📋 **Índice da Documentação**

- **[README da Documentação](./docs/README.md)** - Visão geral de toda a documentação

## 🐛 Troubleshooting

### Erro de Autenticação

- Verificar configuração do Firebase
- Confirmar domínios autorizados
- Verificar regras do Firestore

### Erro de Build

- Limpar cache: `npm run build -- --reset-cache`
- Verificar dependências: `npm install`

### Problemas de CORS

- Configurar domínios no Firebase Console
- Verificar configuração de hosting

### Erro na Exportação

- Verificar se há dados para exportar
- Aguardar processamento completo
- Verificar se o navegador permite downloads

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar documentação do Firebase
2. Consultar logs do console
3. Verificar configurações de segurança

## 📄 Licença

Este projeto é desenvolvido para uso interno da empresa.

## 🎉 Status do Projeto

### ✅ Concluído

- [x] Sistema base completo
- [x] Autenticação Google funcionando
- [x] Módulos principais operacionais
- [x] Dashboard com gráficos
- [x] CRUD completo para todas as entidades
- [x] Deploy no Firebase
- [x] Sistema online e funcionando
- [x] Login com Google testado e aprovado
- [x] Firestore Database configurado
- [x] Domínios autorizados configurados
- [x] **Sistema de exportação Excel e PDF**
- [x] **Relatórios detalhados implementados**
- [x] **Formatação brasileira de dados**
- [x] **Arquitetura modular de exportação**
- [x] **Sistema de notificações completo**
- [x] **Controle de acesso por roles**
- [x] **Sistema de gestão de usuários completo**
- [x] **Perfis temporários implementados**
- [x] **Sistema de auditoria completo**
- [x] **Migração para TypeScript 100%**
- [x] **Build tool Vite implementado**
- [x] **Sistema de importação de dados**
- [x] **Validação de unicidade de campos**
- [x] **Interface responsiva otimizada**

### 🔄 Próximas Melhorias

- [ ] Integração com Google Maps
- [ ] App mobile (React Native)
- [ ] Integração com sistemas ERP
- [ ] Relatórios customizáveis
- [ ] Machine Learning para otimização

## 🚀 Configuração Final Realizada

### Firebase Console

- ✅ Projeto "your-project" criado
- ✅ Google Authentication habilitado
- ✅ Firestore Database criado em modo teste
- ✅ Domínios autorizados configurados
- ✅ Aplicação web registrada

### Credenciais Configuradas

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};
```

### Deploy

- ✅ Build otimizado realizado
- ✅ Firebase Hosting configurado
- ✅ Sistema online em https://your-project.web.app

---

**🌐 Sistema Online:** https://logistica-c7afc.web.app  
**🔐 Login Testado:** ✅ Funcionando  
**📊 Dashboard Operacional:** ✅ Funcionando  
**📤 Exportação Excel/PDF:** ✅ Funcionando  
**🔔 Notificações:** ✅ Funcionando  
**🔐 Segurança:** ✅ Implementada  
**Desenvolvido com ❤️ para otimizar a logística empresarial**
