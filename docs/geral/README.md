# 📚 Documentação do SGL - Sistema de Gestão de Logística

## 📋 Visão Geral

Esta pasta contém toda a documentação do projeto SGL, organizada por público-alvo e propósito. O sistema é uma aplicação web completa para gestão de logística empresarial, desenvolvida com React, TypeScript e Firebase.

## 📁 Estrutura da Documentação

### 🚀 **Para Usuários Finais**

- **[GUIA_USUARIO.md](./GUIA_USUARIO.md)** - Guia completo de uso do sistema
- **[INSTRUCOES_RAPIDAS.md](./INSTRUCOES_RAPIDAS.md)** - Instruções rápidas para começar

### 👨‍💻 **Para Desenvolvedores**

- **[ARQUITETURA.md](./ARQUITETURA.md)** - Documentação técnica e arquitetura
- **[API.md](./API.md)** - Documentação da API e estrutura de dados
- **[CONTRIBUICAO.md](./CONTRIBUICAO.md)** - Guia para contribuir com o projeto
- **[INSTALACAO_DEV.md](./INSTALACAO_DEV.md)** - Guia de instalação para desenvolvedores

### 📊 **Para Gestores**

- **[RESUMO_PROJETO.md](./RESUMO_PROJETO.md)** - Resumo executivo e status do projeto
- **[ROADMAP.md](./ROADMAP.md)** - Planejamento futuro e melhorias

### 🔧 **Para Administradores**

- **[REGRAS_SEGURANCA_FIREBASE.md](./REGRAS_SEGURANCA_FIREBASE.md)** - Configurações de segurança
- **[SISTEMA_NOTIFICACOES.md](./SISTEMA_NOTIFICACOES.md)** - Sistema de notificações
- **[NOTIFICACOES_EMAIL.md](./NOTIFICACOES_EMAIL.md)** - Configuração de notificações por email
- **[IMPORTACAO_DADOS.md](./IMPORTACAO_DADOS.md)** - Guia de importação de dados

### 📝 **Histórico e Controle**

- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de mudanças e versões

## 🎯 **Como Usar Esta Documentação**

### 👤 **Usuário Final**

1. Comece com **[INSTRUCOES_RAPIDAS.md](./INSTRUCOES_RAPIDAS.md)**
2. Para uso avançado, consulte **[GUIA_USUARIO.md](./GUIA_USUARIO.md)**

### 👨‍💻 **Desenvolvedor**

1. Leia **[ARQUITETURA.md](./ARQUITETURA.md)** para entender a estrutura
2. Consulte **[API.md](./API.md)** para detalhes técnicos
3. Siga **[CONTRIBUICAO.md](./CONTRIBUICAO.md)** para contribuir
4. Use **[INSTALACAO_DEV.md](./INSTALACAO_DEV.md)** para configuração

### 📈 **Gestor/Stakeholder**

1. Veja **[RESUMO_PROJETO.md](./RESUMO_PROJETO.md)** para status atual
2. Consulte **[ROADMAP.md](./ROADMAP.md)** para planejamento futuro

### 🔧 **Administrador de Sistema**

1. Configure segurança com **[REGRAS_SEGURANCA_FIREBASE.md](./REGRAS_SEGURANCA_FIREBASE.md)**
2. Configure notificações com **[SISTEMA_NOTIFICACOES.md](./SISTEMA_NOTIFICACOES.md)**
3. Importe dados com **[IMPORTACAO_DADOS.md](./IMPORTACAO_DADOS.md)**

## 🆕 **Novas Funcionalidades Implementadas (v1.2.0+)**

### 📊 **Sistema de Relatórios Avançado**

- **Relatórios Detalhados**: Listas completas com todos os dados de cada entidade
- **Exportação Excel**: Arquivos XLSX com formatação profissional
- **Exportação PDF**: Documentos formatados para impressão
- **Gráficos Interativos**: Visualizações dinâmicas com Recharts
- **Filtros Avançados**: Busca e filtragem por múltiplos critérios
- **Arquitetura Modular**: Serviços especializados por entidade
- **Ordenação Inteligente**: Dados sempre do mais recente para o mais antigo
- **Filtros de Período**: Aplicados apenas em entidades temporais (Rotas, Folgas)
- **Interface Informativa**: Explicação clara sobre comportamento dos relatórios

### 🔔 **Sistema de Notificações Completo**

- **NotificationService**: Serviço centralizado de notificações
- **NotificationBell**: Sino de notificações no header
- **Configurações de Notificação**: Interface para gerenciar preferências
- **Notificações em Tempo Real**: Toast notifications para eventos
- **Filtro por Preferências**: Só envia se usuário habilitou
- **Salvamento no Firestore**: Notificações persistentes
- **Tipos de Notificação**: funcionário, rota, folga, veículo

### 🔐 **Sistema de Segurança Avançado**

- **Regras de Segurança Firestore**: Implementadas e ativas
- **Controle de Acesso por Role**: admin, gerente, dispatcher, user
- **Proteção de Dados**: Leitura/escrita controlada por permissões
- **Modo Teste Desabilitado**: Sistema em produção segura
- **SessionService**: Captura real de IP e informações de dispositivo

### 🔧 **Melhorias Técnicas**

- **Migração para TypeScript**: Código tipado e mais seguro
- **Build Tool Vite**: Desenvolvimento mais rápido
- **Formatação Brasileira**: Datas no formato DD/MM/YYYY
- **Layout Minimalista**: Interface em preto e branco
- **Nomenclatura de Arquivos**: Padrão entity_dd-MM-YYYY.xlsx
- **Tipos Separados**: Arquivos de tipos independentes por pacote
- **Padrões de Código**: Eliminação de if/else com arrays de detectores

### 🚛 **Reestruturação da Tabela de Veículos (v1.2.2)**

- **Colunas Separadas**: Ano, Carroceria e Baú agora são colunas independentes
- **Campo Motorista Removido**: Não mais exibido na visualização (mantido no banco)
- **Ordenação Individual**: Todas as colunas são ordenáveis
- **Estrutura Otimizada**: Layout mais limpo e organizado

### 🔒 **Campos de Edição Inteligentes (v1.2.2)**

- **CPF**: Desabilitado na edição de funcionários e vendedores
- **Placa**: Desabilitada na edição de veículos
- **Funcionário**: Desabilitado na edição de folgas
- **Email**: Desabilitado na configuração de perfil
- **Validação de Unicidade**: Implementada para todos os campos únicos

### 📈 **Funcionalidades de Exportação**

- **Funcionários**: Relatório completo com dados pessoais e profissionais
- **Veículos**: Informações técnicas e status da frota
- **Rotas**: Detalhes de rotas e associações
- **Folgas**: Histórico de solicitações e aprovações
- **Cidades**: Dados geográficos e regionais
- **Vendedores**: Informações comerciais e contatos

## 🛠️ **Stack Tecnológica Atualizada**

### Frontend

- **React 18**: Biblioteca principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework de estilos
- **React Router**: Roteamento
- **Vite**: Build tool

### UI/UX

- **Headless UI**: Componentes acessíveis
- **Heroicons**: Ícones
- **Lucide React**: Ícones adicionais
- **Recharts**: Gráficos interativos

### Backend/Serviços

- **Firebase**: Backend como serviço
  - **Firestore**: Banco de dados
  - **Authentication**: Autenticação
  - **Hosting**: Hospedagem
  - **Cloud Messaging**: Notificações push

### Utilitários

- **ExcelJS**: Exportação Excel
- **jsPDF**: Exportação PDF
- **file-saver**: Download de arquivos
- **React Hot Toast**: Notificações toast

## 📊 **Estrutura do Projeto Atualizada**

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
│   ├── relatorios/     # Sistema de relatórios
│   ├── configuracao/   # Configurações
│   ├── import/         # Sistema de importação
│   └── common/         # Componentes comuns
├── contexts/           # Contextos React
├── firebase/           # Configuração Firebase
├── hooks/              # Custom hooks
├── services/           # Serviços
├── types/              # Tipos TypeScript
├── utils/              # Utilitários
└── App.tsx             # Componente principal
```

## 🔗 **Links Úteis**

- **Sistema Online**: https://your-project.web.app
- **Firebase Console**: https://console.firebase.google.com/project/your-project
- **Repositório**: [GitHub](https://github.com/seu-usuario/logistica)
- **Documentação Firebase**: https://firebase.google.com/docs

## 📝 **Última Atualização**

**Data**: Janeiro 2025  
**Versão**: 1.2.0  
**Status**: ✅ Sistema em produção com novas funcionalidades

### 🎯 **Principais Mudanças na v1.2.0**

1. **Migração para TypeScript**: Código mais seguro e tipado
2. **Sistema de Relatórios**: Exportação Excel e PDF
3. **Notificações Avançadas**: Sistema completo de notificações
4. **Segurança Reforçada**: Controle de acesso por roles
5. **Build Tool Vite**: Desenvolvimento mais rápido
6. **Formatação Brasileira**: Datas e formatos locais
7. **Arquitetura Modular**: Melhor organização do código

## 🚀 **Próximos Passos**

Para começar a usar o sistema:

1. **Usuários**: Leia **[INSTRUCOES_RAPIDAS.md](./INSTRUCOES_RAPIDAS.md)**
2. **Desenvolvedores**: Siga **[INSTALACAO_DEV.md](./INSTALACAO_DEV.md)**
3. **Administradores**: Configure com **[REGRAS_SEGURANCA_FIREBASE.md](./REGRAS_SEGURANCA_FIREBASE.md)**

---

**📚 Documentação completa e atualizada para o SGL v1.2.0**
