# 👥 Guia de Gestão de Usuários - Sistema de Gestão de Logística

## 📋 **Visão Geral**

A funcionalidade de **Gestão de Usuários** permite que administradores e gerentes gerenciem os perfis, permissões e acesso de todos os usuários do sistema. Esta ferramenta é essencial para manter a segurança e organização da equipe, garantindo que cada pessoa tenha exatamente as permissões necessárias para realizar seu trabalho.

---

## 🎯 **Quem Pode Usar Esta Funcionalidade**

### **Acesso por Perfil:**

- ✅ **Administrador Senior**: Acesso total - pode gerenciar todos os usuários
- ✅ **Administrador**: Pode gerenciar usuários até o nível de Gerente
- ✅ **Gerente**: Pode gerenciar usuários até o nível de Funcionário e Usuário
- ❌ **Funcionário**: Não tem acesso a esta funcionalidade
- ❌ **Usuário**: Não tem acesso a esta funcionalidade

---

## 🚀 **Como Acessar a Gestão de Usuários**

1. **Faça login** no sistema com um perfil que tenha permissão
2. **Clique** no menu "Configurações" no canto superior direito
3. **Selecione** a aba "Gestão de Usuários"
4. A tela de gestão será exibida automaticamente

---

## 📊 **Tela Principal - Lista de Usuários**

### **Informações Exibidas:**

A tela principal mostra uma tabela com todos os usuários do sistema, contendo:

- **👤 Usuário**: Nome, email e cargo (se informado)
- **🛡️ Perfil**: Nível de acesso atual (Administrador, Gerente, etc.)
- **📊 Status**: Se está ativo ou com perfil temporário
- **🕒 Último Login**: Data do último acesso ao sistema
- **⚙️ Ações**: Botão para editar o usuário

### **Funcionalidades da Lista:**

- **Ordenação**: Clique nos cabeçalhos das colunas para ordenar
- **Paginação**: Navegue entre páginas quando há muitos usuários
- **Filtros**: Use a barra de filtros para encontrar usuários específicos

---

## 🔍 **Sistema de Filtros**

### **Como Usar os Filtros:**

1. **Clique** no botão "Filtros" na parte superior
2. **Preencha** os campos desejados:
   - **Buscar**: Digite nome, email ou cargo
   - **Perfil**: Selecione um perfil específico
   - **Status**: Escolha entre "Todos", "Ativos" ou "Temporários"
3. **Clique** fora da área de filtros para aplicar
4. **Use** "Limpar Filtros" para remover todos os filtros

### **Dicas de Uso:**

- Use a busca para encontrar rapidamente um usuário específico
- Filtre por perfil para ver apenas usuários de um determinado nível
- Filtre por status para identificar usuários com perfil temporário

---

## ✏️ **Alterando o Perfil de um Usuário**

### **Passo a Passo:**

1. **Localize** o usuário na lista
2. **Clique** no ícone de edição (lápis) na coluna "Ações"
3. **Preencha** o formulário de alteração:

#### **Informações do Usuário:**

- O sistema mostra o perfil atual e último login
- Se houver perfil temporário ativo, será exibido com detalhes

#### **Novo Perfil:**

- **Selecione** o novo perfil desejado
- **Importante**: Só aparecem perfis que você tem permissão para atribuir

#### **Tipo de Alteração:**

- **Permanente**: A alteração é definitiva
- **Temporário**: A alteração tem data de início e fim

#### **Período Temporário** (se selecionado):

- **Data Início**: Quando o novo perfil começa a valer
- **Data Fim**: Quando o perfil volta ao anterior
- **Limite**: Máximo de 1 ano para períodos temporários

#### **Motivo da Alteração:**

- **Obrigatório**: Mínimo de 10 caracteres, máximo de 100
- **Importante**: Este motivo fica registrado no histórico

4. **Clique** em "Confirmar Alteração"

### **Validações do Sistema:**

- ✅ O novo perfil deve ser diferente do atual
- ✅ Motivo é obrigatório e deve ter pelo menos 10 caracteres
- ✅ Para alterações temporárias, as datas são obrigatórias
- ✅ Data de início deve ser futura
- ✅ Período não pode exceder 1 ano

---

## 📈 **Histórico de Alterações**

### **O que é Mostrado:**

A parte inferior da tela exibe o histórico de todas as alterações de perfil:

- **📅 Data**: Quando a alteração foi feita
- **👤 Usuário**: Quem teve o perfil alterado
- **🔄 De → Para**: Perfil anterior e novo perfil
- **📊 Tipo**: Se foi permanente ou temporário
- **📝 Motivo**: Razão da alteração

### **Funcionalidades do Histórico:**

- **Ordenação**: Clique nos cabeçalhos para ordenar
- **Limitação**: Mostra as 10 alterações mais recentes
- **Auditoria**: Todas as alterações ficam registradas permanentemente

---

## 🛡️ **Hierarquia de Perfis e Permissões**

### **Níveis de Acesso (do maior para o menor):**

| Perfil                   | Nome Amigável    | Pode Gerenciar            |
| ------------------------ | ---------------- | ------------------------- |
| **Administrador Senior** | Administrador Sr | Todos os perfis           |
| **Administrador**        | Administrador    | Até Gerente               |
| **Gerente**              | Gerente          | Até Funcionário e Usuário |
| **Funcionário**          | Funcionário      | Nenhum                    |
| **Usuário**              | Usuário          | Nenhum                    |

### **Regras Importantes:**

- **Não é possível** promover alguém para um nível igual ou superior ao seu
- **Administradores** não podem promover para "Administrador" ou "Administrador Senior"
- **Gerentes** não podem promover para "Gerente", "Administrador" ou "Administrador Senior"

---

## ⚠️ **Perfis Temporários**

### **Como Funcionam:**

- **Ativação**: O usuário recebe o novo perfil na data de início
- **Expiração**: Automaticamente volta ao perfil original na data de fim
- **Indicação**: Usuários com perfil temporário aparecem com status "Temporário"
- **Detalhes**: Ao editar, você vê informações sobre o perfil temporário ativo

### **Casos de Uso:**

- **Substituições temporárias** de gerentes
- **Projetos específicos** que requerem permissões especiais
- **Treinamentos** com acesso limitado no tempo

---

## 🔒 **Segurança e Auditoria**

### **Registros Automáticos:**

- **Quem alterou**: Sistema registra quem fez a alteração
- **Quando alterou**: Data e hora exatas
- **O que alterou**: Perfil anterior e novo
- **Por que alterou**: Motivo fornecido

### **Princípios de Segurança:**

- **Menor Privilégio**: Usuários recebem apenas as permissões necessárias
- **Separação de Responsabilidades**: Operadores não podem alterar configurações
- **Auditoria Completa**: Todas as mudanças são registradas permanentemente

---

## 🚨 **Situações Especiais**

### **Usuário com Perfil Temporário Ativo:**

- **Indicação visual**: Aparece com status "Temporário" na lista
- **Informações detalhadas**: Ao editar, mostra o perfil base e data de expiração
- **Nova alteração**: Pode ser feita normalmente, substituindo a anterior

### **Usuário Nunca Logou:**

- **Último Login**: Aparece como "Nunca"
- **Status**: Considerado ativo, mas sem histórico de acesso

### **Erro de Permissão:**

- **Mensagem clara**: Sistema informa exatamente o que não é permitido
- **Sugestões**: Pode sugerir alternativas quando possível

---

## 📱 **Interface Responsiva**

### **Dispositivos Móveis:**

- **Tabela adaptável**: Colunas se ajustam automaticamente
- **Botões maiores**: Fáceis de tocar em telas pequenas
- **Modais otimizados**: Formulários se adaptam ao tamanho da tela

### **Navegação:**

- **Paginação simplificada**: Botões "Anterior" e "Próxima" em mobile
- **Filtros colapsáveis**: Economizam espaço na tela
- **Informações essenciais**: Priorizadas em telas pequenas

---

## ❓ **Perguntas Frequentes**

### **P: Posso alterar meu próprio perfil?**

**R:** Não, por segurança, você não pode alterar seu próprio perfil. Peça para outro administrador fazer a alteração.

### **P: O que acontece se um perfil temporário expirar?**

**R:** O sistema automaticamente reverte o usuário para o perfil original. Uma notificação é enviada.

### **P: Posso ver quem alterou o perfil de um usuário?**

**R:** Sim, no histórico de alterações você vê todas as mudanças e quem as fez.

### **P: Quantos usuários posso gerenciar?**

**R:** Não há limite de usuários. O sistema suporta milhares de usuários.

### **P: Posso desfazer uma alteração?**

**R:** Não diretamente, mas você pode fazer uma nova alteração para reverter o perfil.

### **P: O que acontece se eu tentar promover alguém para um nível que não posso?**

**R:** O sistema não permitirá a alteração e mostrará uma mensagem explicativa.

---

## 🎯 **Dicas para Uso Eficiente**

### **Organização:**

- **Use filtros** para encontrar usuários rapidamente
- **Ordene por perfil** para ter uma visão hierárquica
- **Verifique o histórico** regularmente para auditoria

### **Segurança:**

- **Sempre informe o motivo** das alterações
- **Use perfis temporários** para situações específicas
- **Monitore o histórico** de alterações

### **Comunicação:**

- **Informe o usuário** sobre mudanças de perfil
- **Explique as novas permissões** que ele terá
- **Documente motivos** claros para auditoria

---

## 📞 **Suporte**

Se você encontrar problemas ou tiver dúvidas sobre a gestão de usuários:

1. **Verifique** se você tem permissão para a funcionalidade
2. **Consulte** este guia para procedimentos
3. **Entre em contato** com o administrador do sistema
4. **Reporte** problemas técnicos para a equipe de TI

---

_Este guia foi criado para ajudar você a usar a funcionalidade de Gestão de Usuários de forma eficiente e segura. Mantenha sempre as melhores práticas de segurança e auditoria._
