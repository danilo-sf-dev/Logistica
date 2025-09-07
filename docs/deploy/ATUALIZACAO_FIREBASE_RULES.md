# 🔥 Atualização das Regras do Firebase - Sistema de Permissões

## 📋 **Visão Geral**

Este documento descreve as mudanças implementadas nas regras de segurança do Firestore para implementar o sistema de permissões hierárquico do SGL.

---

## 🔄 **Principais Mudanças Implementadas**

### **1. Sistema de 5 Níveis Hierárquicos**

**Antes**: Apenas `admin` e `gerente` com permissões básicas
**Depois**: Sistema completo com 5 níveis:

- **`admin_senior`** - Administrador Senior (acesso total)
- **`admin`** - Administrador (acesso total com restrições)
- **`gerente`** - Gerente (acesso operacional + gestão limitada)
- **`dispatcher`** - Funcionário (CRUD limitado, sem deletar)
- **`user`** - Usuário (apenas leitura)

### **2. Funções Auxiliares de Permissão**

```javascript
// Funções implementadas:
function isAuthenticated()           // Verifica se usuário está logado
function getUserRole()              // Obtém role do usuário atual
function hasRole(role)             // Verifica role específico
function isAdminSenior()           // Verifica se é admin senior
function isAdmin()                 // Verifica se é admin ou superior
function isGerente()               // Verifica se é gerente ou superior
function isDispatcher()            // Verifica se é dispatcher ou superior
function canDeleteRecords()        // Verifica se pode deletar registros
function canExportReports()        // Verifica se pode exportar relatórios
function canManageUsers()          // Verifica se pode gerenciar usuários
function canAccessSystemConfig()   // Verifica acesso a configs do sistema
function canAccessSecurityConfig() // Verifica acesso a configs de segurança
```

### **3. Regras Granulares por Entidade**

#### **Funcionários e Veículos**

- **Leitura**: Todos os usuários autenticados
- **Criação/Edição**: Gerente ou superior
- **Exclusão**: Admin ou Gerente

#### **Rotas e Folgas**

- **Leitura**: Todos os usuários autenticados
- **Criação/Edição**: Funcionário (dispatcher) ou superior
- **Exclusão**: Admin ou Gerente

#### **Cidades e Vendedores**

- **Leitura**: Todos os usuários autenticados
- **Criação/Edição**: Gerente ou superior
- **Exclusão**: Admin ou Gerente

### **4. Novas Coleções Suportadas**

- **`role_changes`** - Histórico de mudanças de perfil
- **`notifications`** - Sistema de notificações
- **`reports`** - Relatórios e exportações
- **`system_config`** - Configurações do sistema
- **`security_config`** - Configurações de segurança
- **`audit_logs`** - Logs de auditoria

---

## 🧪 **Como Testar as Novas Regras**

### **1. Teste de Autenticação**

```bash
# Usuário não autenticado
curl -X GET "https://firestore.googleapis.com/v1/projects/SEU_PROJETO/databases/(default)/documents/funcionarios"
# Deve retornar erro de permissão
```

### **2. Teste de Roles**

```bash
# Usuário com role 'user' tentando criar funcionário
# Deve ser negado

# Usuário com role 'dispatcher' tentando deletar rota
# Deve ser negado

# Usuário com role 'gerente' criando funcionário
# Deve ser permitido
```

### **3. Teste de Hierarquia**

```bash
# Admin tentando promover usuário para admin_senior
# Deve ser permitido

# Gerente tentando promover usuário para admin
# Deve ser negado

# Funcionário tentando alterar perfil de outro usuário
# Deve ser negado
```

---

## 🚨 **Pontos de Atenção**

### **1. Migração de Usuários Existentes**

**IMPORTANTE**: Usuários existentes precisam ter o campo `role` definido:

```typescript
// Estrutura necessária para usuários existentes
{
  uid: "user123",
  email: "user@example.com",
  role: "user", // ← Este campo é OBRIGATÓRIO
  // ... outros campos
}
```

### **2. Regra de Fallback Removida**

**Antes**: Regra genérica `match /{document=**}` que dava acesso total a admins
**Depois**: Cada coleção tem regras específicas e granulares

### **3. Validação de Role**

As regras agora validam o campo `role` em todas as operações. Se um usuário não tiver este campo, **todas as operações serão negadas**.

---

## 🔧 **Implementação Gradual**

### **Fase 1: Deploy das Regras (Recomendado)**

1. **Backup** das regras atuais
2. **Deploy** das novas regras em ambiente de teste
3. **Validação** com usuários de teste
4. **Deploy** em produção

### **Fase 2: Migração de Dados**

1. **Verificar** usuários existentes
2. **Adicionar** campo `role` onde necessário
3. **Validar** permissões funcionando

### **Fase 3: Teste em Produção**

1. **Monitorar** logs de acesso negado
2. **Ajustar** permissões se necessário
3. **Treinar** usuários sobre novas funcionalidades

---

## 📊 **Matriz de Permissões por Role**

| Funcionalidade         | Admin Sr | Admin       | Gerente     | Funcionário | Usuário    |
| ---------------------- | -------- | ----------- | ----------- | ----------- | ---------- |
| **Dashboard**          | ✅ Total | ✅ Total    | ✅ Total    | ✅ Total    | ✅ Total   |
| **Funcionários**       | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ❌          | ✅ Leitura |
| **Veículos**           | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ❌          | ✅ Leitura |
| **Rotas**              | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ✅ CRUD\*   | ✅ Leitura |
| **Folgas**             | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ✅ CRUD\*   | ✅ Leitura |
| **Cidades**            | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ❌          | ✅ Leitura |
| **Vendedores**         | ✅ CRUD  | ✅ CRUD     | ✅ CRUD     | ❌          | ✅ Leitura |
| **Gestão de Usuários** | ✅ Total | ✅ Limitada | ✅ Limitada | ❌          | ❌         |
| **Configurações**      | ✅ Total | ✅ Total    | ✅ Total    | ✅ Pessoal  | ✅ Pessoal |

**Legenda:**

- ✅ **CRUD**: Criar, Ler, Atualizar, Deletar
- ✅ **CRUD\***: Criar, Ler, Atualizar (sem deletar)
- ✅ **Total**: Acesso completo
- ✅ **Limitada**: Acesso conforme hierarquia
- ✅ **Pessoal**: Apenas configurações próprias

---

## 🚀 **Próximos Passos**

### **1. Deploy das Regras**

```bash
# Deploy das novas regras
firebase deploy --only firestore:rules
```

### **2. Validação**

- [ ] Testar com usuários de diferentes roles
- [ ] Verificar permissões de leitura/escrita
- [ ] Validar hierarquia de alteração de perfis

### **3. Implementação da Interface**

- [ ] Criar componente de gestão de usuários
- [ ] Implementar validações de permissão
- [ ] Adicionar aba em configurações

---

## 📚 **Documentação Relacionada**

- **[SISTEMA_PERMISSOES_PERFIS.md](./SISTEMA_PERMISSOES_PERFIS.md)** - Conceitos do sistema
- **[IMPLEMENTACAO_PERMISSOES_PERFIS.md](./IMPLEMENTACAO_PERMISSOES_PERFIS.md)** - Implementação técnica
- **[DISCUSSAO_SISTEMA_PERMISSOES.md](./DISCUSSAO_SISTEMA_PERMISSOES.md)** - Contexto da discussão

---

## 🎯 **Conclusão**

As novas regras do Firebase implementam:

- **🔐 Segurança Hierárquica**: Sistema de 5 níveis com permissões granulares
- **🛡️ Validação Robusta**: Funções auxiliares para verificação de permissões
- **📊 Controle Granular**: Permissões específicas por entidade e operação
- **🔄 Auditoria**: Suporte para logs e histórico de mudanças
- **⚡ Performance**: Regras otimizadas e bem estruturadas

O sistema está pronto para a implementação da interface de gestão de usuários e oferece uma base sólida para o controle de acesso empresarial.

---

**Data da Atualização**: Janeiro 2025  
**Versão das Regras**: 2.0  
**Status**: Implementado e Pronto para Teste
