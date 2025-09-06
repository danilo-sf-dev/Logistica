# 📚 Documentação do SGL - Sistema de Gestão de Logística

## 📋 Visão Geral

Esta pasta contém toda a documentação do projeto SGL, organizada por público-alvo e propósito. O sistema é uma aplicação web completa para gestão de logística empresarial, desenvolvida com React, TypeScript e Firebase.

## 📁 Estrutura da Documentação

### 🎯 **Navegação Rápida por Público-Alvo**

#### 👤 **Para Usuários Finais**

- **[📁 usuarios/](./usuarios/)** - Guias e manuais para usuários do sistema
  - [Guia do Usuário](./usuarios/GUIA_USUARIO.md) - Manual completo de uso
  - [Gestão de Usuários](./usuarios/GUIA_GESTAO_USUARIOS.md) - Guia de gestão de usuários
  - [Importação de Dados](./usuarios/IMPORTACAO_DADOS.md) - Como importar dados

#### 👨‍💻 **Para Desenvolvedores**

- **[📁 desenvolvimento/](./desenvolvimento/)** - Documentação técnica
  - [Arquitetura](./desenvolvimento/ARQUITETURA.md) - Estrutura técnica do sistema
  - [API](./desenvolvimento/API.md) - Documentação da API e dados
  - [Instalação Dev](./desenvolvimento/INSTALACAO_DEV.md) - Setup do ambiente
  - [Migração Vite](./desenvolvimento/MIGRACAO_VITE.md) - Migração para Vite
  - [CORS Google SignIn](./desenvolvimento/CORS_GOOGLE_SIGNIN_FIX.md) - Correções técnicas

#### 🔐 **Para Administradores de Segurança**

- **[📁 seguranca/](./seguranca/)** - Documentação de segurança
  - [Regras Firebase](./seguranca/REGRAS_SEGURANCA_FIREBASE.md) - Regras de segurança
  - [Plano de Segurança](./seguranca/PLANO_SEGURANCA_PRODUCAO.md) - Plano de produção
  - [Sistema de Permissões](./seguranca/SISTEMA_PERMISSOES_PERFIS.md) - Controle de acesso
  - [Implementação Permissões](./seguranca/IMPLEMENTACAO_PERMISSOES_PERFIS.md) - Detalhes técnicos

#### 🔔 **Para Gestores de Notificações**

- **[📁 notificacoes/](./notificacoes/)** - Sistema de notificações
  - [Sistema de Notificações](./notificacoes/SISTEMA_NOTIFICACOES.md) - Funcionalidades
  - [Notificações Email](./notificacoes/NOTIFICACOES_EMAIL.md) - Configuração de email

#### 🚀 **Para Administradores de Deploy**

- **[📁 deploy/](./deploy/)** - Deploy e infraestrutura
  - [Resumo Firebase](./deploy/RESUMO_EXECUTIVO_FIREBASE.md) - Resumo executivo
  - [Atualização Firebase Rules](./deploy/ATUALIZACAO_FIREBASE_RULES.md) - Atualizações

#### 🛠️ **Para Desenvolvedores de Implementações**

- **[📁 implementacoes/](./implementacoes/)** - Implementações específicas
  - [Componentização Datas](./implementacoes/IMPLEMENTACAO_COMPONENTIZACAO_DATAS.md)
  - [Componentização Moeda](./implementacoes/IMPLEMENTACAO_COMPONENTIZACAO_MOEDA.md)
  - [Importação Excel Datas](./implementacoes/IMPLEMENTACAO_IMPORTACAO_EXCEL_DATAS.md)
  - [Loading Button](./implementacoes/LOADING_BUTTON_IMPLEMENTATION.md)
  - [Responsividade Mobile](./implementacoes/RESPONSIVIDADE_MOBILE.md)

#### 📊 **Para Gestores e Stakeholders**

- **[📁 geral/](./geral/)** - Documentação geral e controle
  - [README Principal](./geral/README.md) - Visão geral detalhada
  - [Resumo do Projeto](./geral/RESUMO_PROJETO.md) - Status e resumo executivo
  - [Changelog](./geral/CHANGELOG.md) - Histórico de mudanças
  - [Roadmap](./geral/ROADMAP.md) - Planejamento futuro

---

## 🎯 **Como Usar Esta Documentação**

### 👤 **Usuário Final**

1. Comece com **[usuarios/GUIA_USUARIO.md](./usuarios/GUIA_USUARIO.md)**
2. Para gestão de usuários, consulte **[usuarios/GUIA_GESTAO_USUARIOS.md](./usuarios/GUIA_GESTAO_USUARIOS.md)**
3. Para importação de dados, veja **[usuarios/IMPORTACAO_DADOS.md](./usuarios/IMPORTACAO_DADOS.md)**

### 👨‍💻 **Desenvolvedor**

1. Leia **[desenvolvimento/ARQUITETURA.md](./desenvolvimento/ARQUITETURA.md)** para entender a estrutura
2. Consulte **[desenvolvimento/API.md](./desenvolvimento/API.md)** para detalhes técnicos
3. Siga **[desenvolvimento/INSTALACAO_DEV.md](./desenvolvimento/INSTALACAO_DEV.md)** para configuração

### 📈 **Gestor/Stakeholder**

1. Veja **[geral/RESUMO_PROJETO.md](./geral/RESUMO_PROJETO.md)** para status atual
2. Consulte **[geral/ROADMAP.md](./geral/ROADMAP.md)** para planejamento futuro

### 🔧 **Administrador de Sistema**

1. Configure segurança com **[seguranca/REGRAS_SEGURANCA_FIREBASE.md](./seguranca/REGRAS_SEGURANCA_FIREBASE.md)**
2. Configure notificações com **[notificacoes/SISTEMA_NOTIFICACOES.md](./notificacoes/SISTEMA_NOTIFICACOES.md)**
3. Importe dados com **[usuarios/IMPORTACAO_DADOS.md](./usuarios/IMPORTACAO_DADOS.md)**

---

## 🆕 **Funcionalidades Principais (v1.2.3)**

### 📊 **Sistema de Relatórios Avançado**

- **Relatórios Detalhados**: Listas completas com todos os dados
- **Exportação Excel/PDF**: Arquivos formatados profissionalmente
- **Gráficos Interativos**: Visualizações dinâmicas
- **Filtros Avançados**: Busca e filtragem inteligente

### 🔔 **Sistema de Notificações Completo**

- **NotificationService**: Serviço centralizado
- **NotificationBell**: Interface de notificações
- **Configurações Personalizadas**: Preferências por usuário
- **Notificações em Tempo Real**: Toast notifications

### 🔐 **Sistema de Segurança Avançado**

- **Regras Firestore**: Implementadas e ativas
- **Controle por Role**: Hierarquia de permissões
- **Gestão de Usuários**: Interface completa
- **Auditoria Completa**: Histórico de alterações

### 🚛 **Gestão Logística Completa**

- **Funcionários**: Cadastro e controle de status
- **Veículos**: Gestão da frota
- **Rotas**: Planejamento e acompanhamento
- **Folgas**: Controle de ausências
- **Cidades**: Cadastro geográfico
- **Vendedores**: Gestão comercial

---

## 🛠️ **Stack Tecnológica**

### Frontend

- **React 18** + **TypeScript** (100% tipado)
- **Vite** (build tool otimizado)
- **Tailwind CSS** (estilização)
- **React Router v6** (roteamento)

### Backend

- **Firebase** (Backend as a Service)
  - **Firestore** (banco de dados NoSQL)
  - **Authentication** (autenticação)
  - **Hosting** (hospedagem)
  - **Cloud Messaging** (notificações)

### Utilitários

- **ExcelJS** + **jsPDF** (exportação)
- **React Hot Toast** (notificações)
- **Headless UI** + **Heroicons** (componentes)

---

## 🔗 **Links Úteis**

- **Sistema Online**: https://logistica-c7afc.web.app
- **Firebase Console**: https://console.firebase.google.com/project/logistica-c7afc
- **Documentação Firebase**: https://firebase.google.com/docs

---

## 📝 **Última Atualização**

**Data**: Janeiro 2025  
**Versão**: 1.2.3  
**Status**: ✅ **Sistema em produção com funcionalidades completas**

### 🎯 **Principais Mudanças na v1.2.3**

1. **Reorganização da Documentação**: Estrutura organizacional por categorias
2. **Sistema de Gestão de Usuários**: Interface completa implementada
3. **Sistema de Importação**: Importação em lote de dados
4. **Relatórios Avançados**: Exportação Excel e PDF
5. **Notificações Avançadas**: Sistema completo de notificações
6. **Segurança Reforçada**: Controle de acesso hierárquico

---

## 🚀 **Próximos Passos**

Para começar a usar o sistema:

1. **Usuários**: Leia **[usuarios/GUIA_USUARIO.md](./usuarios/GUIA_USUARIO.md)**
2. **Desenvolvedores**: Siga **[desenvolvimento/INSTALACAO_DEV.md](./desenvolvimento/INSTALACAO_DEV.md)**
3. **Administradores**: Configure com **[seguranca/REGRAS_SEGURANCA_FIREBASE.md](./seguranca/REGRAS_SEGURANCA_FIREBASE.md)**

---

**📚 Documentação completa e organizada para o SGL v1.2.3**
