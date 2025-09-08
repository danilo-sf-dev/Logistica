# 🔐 Sistema de Permissões e Perfis - SGL

## 📋 **Visão Geral**

Este documento define o sistema de permissões e perfis do Sistema de Gestão de Logística (SGL), estabelecendo as regras de acesso, hierarquia de permissões e funcionalidades disponíveis para cada tipo de usuário.

---

## 👥 **Estrutura de Perfis**

### **Hierarquia de Perfis (Do Maior para o Menor)**

| Perfil Técnico | Nome Amigável        | Descrição                                                 |
| -------------- | -------------------- | --------------------------------------------------------- |
| `admin_senior` | **Administrador Sr** | Acesso total sem restrições                               |
| `admin`        | **Administrador**    | Acesso total com restrições de gestão de usuários         |
| `gerente`      | **Gerente**          | Acesso operacional completo + gestão limitada de usuários |
| `dispatcher`   | **Funcionário**      | Usuário constante do sistema com CRUD limitado            |
| `user`         | **Usuário**          | Acesso apenas de visualização e relatórios                |

---

## 🔒 **Regras de Permissões por Perfil**

### **1. Administrador Sr (admin_senior)**

- **✅ Acesso Total:**
  - Todas as funcionalidades do sistema
  - Todas as configurações
  - Gestão completa de usuários
  - Alteração de qualquer perfil (incluindo outros Admin Sr)

- **🎯 Responsabilidades:**
  - Supervisão geral do sistema
  - Gestão de outros administradores
  - Configurações críticas do sistema
  - Auditoria de segurança

### **2. Administrador (admin)**

- **✅ Pode fazer:**
  - CRUD completo em todas as entidades
  - Deletar/inativar registros
  - Exportar relatórios
  - Todas as configurações do sistema
  - Gestão de usuários até nível "Gerente"

- **❌ Não pode fazer:**
  - Promover usuários para "Administrador" ou "Administrador Sr"

- **🎯 Responsabilidades:**
  - Gestão operacional completa
  - Supervisão de gerentes
  - Configurações do sistema

### **3. Gerente (gerente)**

- **✅ Pode fazer:**
  - CRUD completo em todas as entidades
  - Deletar/inativar registros
  - Exportar relatórios
  - Todas as configurações do sistema
  - Gestão de usuários até nível "Funcionário" e "Usuário"

- **❌ Não pode fazer:**
  - Promover usuários para "Gerente", "Administrador" ou "Administrador Sr"

- **🎯 Responsabilidades:**
  - Gestão operacional da equipe
  - Supervisão de funcionários
  - Configurações operacionais

### **4. Funcionário (dispatcher)**

- **✅ Pode fazer:**
  - CRUD completo em todas as entidades (exceto deletar/inativar)
  - Exportar relatórios
  - Configurações pessoais (Perfil, Notificações)

- **❌ Não pode fazer:**
  - Deletar/inativar registros
  - Acessar configurações do sistema
  - Gestão de usuários

- **🎯 Responsabilidades:**
  - Operação diária do sistema
  - Criação e edição de rotas, folgas, etc.
  - Atualização de status e informações

### **5. Usuário (user)**

- **✅ Pode fazer:**
  - Visualizar todos os dados
  - Gerar relatórios para visualização na tela
  - Configurações pessoais (Perfil, Notificações)

- **❌ Não pode fazer:**
  - Qualquer operação de CRUD
  - Exportar relatórios
  - Acessar configurações do sistema
  - Gestão de usuários

- **🎯 Responsabilidades:**
  - Consulta de informações
  - Acompanhamento de operações

---

## 🏗️ **Matriz de Permissões Detalhada**

| Funcionalidade         | Admin Sr          | Admin             | Gerente           | Funcionário       | Usuário         |
| ---------------------- | ----------------- | ----------------- | ----------------- | ----------------- | --------------- |
| **Dashboard**          | ✅ Total          | ✅ Total          | ✅ Total          | ✅ Total          | ✅ Total        |
| **Funcionários**       | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Veículos**           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Rotas**              | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Folgas**             | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Cidades**            | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Vendedores**         | ✅ CRUD           | ✅ CRUD           | ✅ CRUD           | ✅ CRUD\*         | ✅ Leitura      |
| **Relatórios**         | ✅ Total + Export | ✅ Total + Export | ✅ Total + Export | ✅ Total + Export | ✅ Visualização |
| **Gestão de Usuários** | ✅ Total          | ✅ Limitada       | ✅ Limitada       | ❌                | ❌              |
| **Configurações**      | ✅ Total          | ✅ Total          | ✅ Total          | ✅ Pessoal        | ✅ Pessoal      |

**Legenda:**

- ✅ **CRUD**: Criar, Ler, Atualizar, Deletar
- ✅ **CRUD\***: Criar, Ler, Atualizar (sem deletar/inativar)
- ✅ **Total**: Acesso completo sem restrições
- ✅ **Limitada**: Acesso conforme regras hierárquicas
- ✅ **Pessoal**: Apenas configurações do próprio usuário

---

## 🔄 **Regras de Alteração de Perfis**

### **Hierarquia de Alteração**

```
Admin Senior → Pode alterar qualquer perfil
     ↓
   Admin → Pode alterar até "Gerente"
     ↓
  Gerente → Pode alterar até "Funcionário" e "Usuário"
     ↓
 Funcionário → Não pode alterar perfis
     ↓
    Usuário → Não pode alterar perfis
```

### **Regras Específicas**

1. **Admin Senior** pode alterar qualquer perfil sem restrições
2. **Admin** pode promover até "Gerente", mas não para "Admin" ou "Admin Senior"
3. **Gerente** pode promover até "Funcionário" e "Usuário"
4. **Funcionário** e **Usuário** não podem alterar perfis de ninguém

---

## 📱 **Interface de Usuário por Perfil**

### **Aba "Gestão de Usuários" - Visibilidade**

- ✅ **Admin Senior**: Vê e pode alterar todos os perfis
- ✅ **Admin**: Vê e pode alterar até "Gerente"
- ✅ **Gerente**: Vê e pode alterar até "Funcionário" e "Usuário"
- ❌ **Funcionário**: Não vê a aba
- ❌ **Usuário**: Não vê a aba

### **Configurações - Acesso por Perfil**

| Aba                    | Admin Sr | Admin | Gerente | Funcionário | Usuário |
| ---------------------- | -------- | ----- | ------- | ----------- | ------- |
| **Perfil**             | ✅       | ✅    | ✅      | ✅          | ✅      |
| **Notificações**       | ✅       | ✅    | ✅      | ✅          | ✅      |
| **Sistema**            | ✅       | ✅    | ✅      | ❌          | ❌      |
| **Segurança**          | ✅       | ✅    | ✅      | ❌          | ❌      |
| **Gestão de Usuários** | ✅       | ✅    | ✅      | ❌          | ❌      |

---

## 🎯 **Princípios de Segurança**

### **1. Princípio do Menor Privilégio**

- Cada usuário recebe apenas as permissões necessárias para sua função
- Acesso é concedido de forma incremental conforme a hierarquia

### **2. Separação de Responsabilidades**

- Usuários operacionais não podem alterar configurações do sistema
- Apenas perfis administrativos podem gerenciar usuários

### **3. Auditoria Completa**

- Todas as alterações de perfil são registradas
- Histórico de mudanças é mantido para compliance
- Logs incluem quem fez a mudança, quando e motivo

### **4. Prevenção de Escalação de Privilégios**

- Usuários não podem se promover para níveis superiores
- Mudanças críticas requerem permissão adequada
- Validação automática de permissões antes de qualquer alteração

---

## 📋 **Funcionalidades por Perfil**

### **Admin Senior e Admin**

- **Gestão Completa**: Todas as funcionalidades do sistema
- **Configurações**: Acesso total às configurações
- **Relatórios**: Exportação completa de dados
- **Segurança**: Configurações de segurança do sistema

### **Gerente**

- **Operacional**: CRUD completo em todas as entidades
- **Gestão de Equipe**: Supervisão de funcionários
- **Configurações**: Configurações operacionais
- **Relatórios**: Exportação de dados operacionais

### **Funcionário**

- **Operacional**: CRUD limitado (sem deletar)
- **Relatórios**: Exportação de dados
- **Pessoal**: Configurações pessoais
- **Frequência**: Uso constante do sistema

### **Usuário**

- **Consulta**: Apenas visualização de dados
- **Relatórios**: Visualização na tela
- **Pessoal**: Configurações pessoais
- **Frequência**: Uso esporádico para consultas

---

## 🔄 **Sistema de Períodos Temporários**

### **Funcionalidade**

- Permite promoções temporárias sem alterar o perfil base
- **Retorno automático** ao perfil anterior após o período
- Aplicável apenas para perfis "Funcionário" e "Usuário"
- **Verificação automática** a cada 5 minutos quando usuário está logado

### **Sistema de Reversão Automática**

#### **Como Funciona**

1. **Verificação Contínua**: Sistema verifica perfis temporários a cada 5 minutos
2. **Comparação Inteligente**: Compara data de expiração com data atual
3. **Reversão Automática**: Retorna ao `baseRole` quando período expira
4. **Auditoria Completa**: Registra todas as reversões no histórico

#### **Exemplo de Uso**

```
Usuário "João" (Role: user)
Promovido temporariamente para "Funcionário"
Período: 15/01/2025 a 15/02/2025
Motivo: Substituição de funcionário em férias

Resultado:
- 15/01 a 15/02: João tem perfil "Funcionário"
- 16/02 em diante: João volta AUTOMATICAMENTE para "Usuário"
- Sistema registra a reversão no histórico de auditoria
```

#### **Função de Emergência**

Para casos urgentes, disponível no console:

```javascript
executeManualRoleRevert(); // Reverte todos os perfis expirados imediatamente
```

---

## 📚 **Documentação Relacionada**

Para implementação técnica, regras do Firebase e fluxo de implementação, consulte:

- **[IMPLEMENTACAO_PERMISSOES_PERFIS.md](./IMPLEMENTACAO_PERMISSOES_PERFIS.md)** - Documentação técnica completa

---

## 🎯 **Conclusão**

Este sistema de permissões garante:

- **Segurança**: Controle granular de acesso
- **Eficiência**: Usuários têm acesso adequado às suas necessidades
- **Auditoria**: Rastreamento completo de mudanças
- **Flexibilidade**: Períodos temporários para necessidades operacionais
- **Automatização**: Reversão automática de perfis temporários expirados
- **Escalabilidade**: Estrutura hierárquica clara e extensível

O sistema está projetado para atender às necessidades operacionais diárias enquanto mantém a segurança e controle necessários para um ambiente empresarial. A **reversão automática** garante que perfis temporários nunca fiquem ativos além do período autorizado, mantendo a integridade do sistema de permissões.
