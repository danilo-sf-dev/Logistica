# 👥 Gestão de Usuários - Manual do Usuário

## 🎯 **O que você vai aprender**

- Como acessar a gestão de usuários
- Como visualizar lista de usuários
- Como alterar perfis de usuários
- Como criar perfis temporários
- Como visualizar histórico de alterações
- Como gerenciar permissões e acesso
- Como usar filtros e buscas

---

## 📋 **Pré-requisitos**

- Ter feito login no sistema
- Ter permissão de gestão de usuários (admin, gerente)
- Entender os níveis de acesso do sistema
- Conhecer a hierarquia de permissões

---

## 🚀 **Passo a Passo Detalhado**

### 1. **Acessando a Gestão de Usuários**

#### **Passo 1.1: Abrir o Módulo**

1. **Clique no seu nome** no canto superior direito
2. **Selecione "Configurações"** no menu dropdown
3. **Clique na aba "Gestão de Usuários"**
4. **Aguarde o carregamento** da lista de usuários

#### **Passo 1.2: Entender a Tela Principal**

A tela de gestão de usuários contém:

- **Lista de usuários** (tabela com todos os usuários)
- **Filtros** (por perfil, status, busca)
- **Botões de ação** (alterar perfil, visualizar histórico)
- **Informações de perfil** (dados do usuário selecionado)

---

### 2. **Visualizando Lista de Usuários**

#### **Passo 2.1: Entender as Colunas**

**Informações exibidas**:

1. **Nome**: Nome completo do usuário
2. **Email**: Endereço de email
3. **Perfil Atual**: Nível de acesso atual
4. **Status**: Situação do usuário
5. **Último Login**: Data do último acesso
6. **Ações**: Botões para gerenciar

#### **Passo 2.2: Navegar pela Lista**

1. **Use a barra de rolagem** para ver todos os usuários
2. **Clique nas colunas** para ordenar
3. **Use os filtros** para encontrar usuários específicos
4. **Clique em um usuário** para ver detalhes

---

### 3. **Filtrando e Buscando Usuários**

#### **Passo 3.1: Busca por Nome/Email**

1. **Digite o nome ou email** no campo de busca
2. **A lista será filtrada** automaticamente
3. **Para limpar**: Apague o texto da busca

#### **Passo 3.2: Filtro por Perfil**

1. **Clique no dropdown "Perfil"**
2. **Selecione o perfil** desejado:
   - Admin Senior
   - Admin
   - Gerente
   - Dispatcher
   - Usuário
3. **A lista mostrará apenas** usuários com esse perfil
4. **Para limpar**: Selecione "Todos"

#### **Passo 3.3: Filtro por Status**

1. **Clique no dropdown "Status"**
2. **Selecione o status** desejado:
   - Ativo
   - Inativo
   - Temporário
3. **A lista mostrará apenas** usuários com esse status
4. **Para limpar**: Selecione "Todos"

---

### 4. **Alterando Perfil de Usuário**

#### **Passo 4.1: Selecionar Usuário**

1. **Localize o usuário** na lista
2. **Clique no usuário** para selecionar
3. **Verifique se os dados** aparecem na lateral
4. **Confirme se é o usuário** correto

#### **Passo 4.2: Alterar Perfil Permanente**

1. **Clique em "Alterar Perfil"**
2. **Selecione o novo perfil** no dropdown
3. **Digite o motivo** da alteração (mínimo 10 caracteres)
4. **Clique em "Confirmar"**
5. **Aguarde a confirmação** de sucesso
6. **O perfil será alterado** imediatamente

#### **Passo 4.3: Entender a Hierarquia**

**Níveis de acesso** (do maior para o menor):

1. **Admin Senior**: Acesso total sem restrições
2. **Admin**: Acesso total com restrições
3. **Gerente**: Acesso operacional + gestão limitada
4. **Dispatcher**: Usuário constante do sistema
5. **Usuário**: Apenas visualização e relatórios

**Regras de alteração**:

- **Admin Senior**: Pode alterar qualquer perfil
- **Admin**: Pode alterar até Gerente
- **Gerente**: Pode alterar até Usuário
- **Dispatcher/Usuário**: Não pode alterar perfis

---

### 5. **Criando Perfis Temporários**

#### **Passo 5.1: Iniciar Criação**

1. **Selecione o usuário** desejado
2. **Clique em "Perfil Temporário"**
3. **Aguarde o carregamento** do formulário
4. **Verifique se todos os campos** estão visíveis

#### **Passo 5.2: Preencher Dados do Perfil Temporário**

**Campos obrigatórios**:

1. **Perfil Temporário**:
   - Selecione o perfil temporário
   - Deve ser diferente do perfil atual
   - Deve respeitar a hierarquia

2. **Data de Início**:
   - Clique no campo de data
   - Selecione a data de início
   - Deve ser data futura
   - Formato: DD/MM/AAAA

3. **Data de Fim**:
   - Clique no campo de data
   - Selecione a data de fim
   - Deve ser posterior à data de início
   - Formato: DD/MM/AAAA

4. **Motivo**:
   - Digite o motivo do perfil temporário
   - Exemplo: "Substituição de gerente em férias"
   - Mínimo: 10 caracteres
   - Máximo: 500 caracteres

#### **Passo 5.3: Salvar Perfil Temporário**

1. **Revise todos os dados** preenchidos
2. **Verifique se não há erros** nos campos
3. **Clique em "Criar Perfil Temporário"**
4. **Aguarde a confirmação** de sucesso
5. **O perfil temporário será criado** e ativado na data de início

---

### 6. **Visualizando Histórico de Alterações**

#### **Passo 6.1: Acessar Histórico**

1. **Selecione o usuário** desejado
2. **Clique em "Histórico"**
3. **Aguarde o carregamento** do histórico
4. **Verifique se as alterações** estão listadas

#### **Passo 6.2: Entender as Informações**

**Dados do histórico**:

1. **Data**: Quando a alteração foi feita
2. **Usuário**: Quem fez a alteração
3. **Perfil Anterior**: Perfil antes da alteração
4. **Perfil Novo**: Perfil após a alteração
5. **Tipo**: Permanente ou Temporário
6. **Motivo**: Justificativa da alteração
7. **Status**: Aprovada, Pendente, Rejeitada

#### **Passo 6.3: Filtrar Histórico**

1. **Use o campo de busca** para encontrar alterações específicas
2. **Clique nas colunas** para ordenar
3. **Use os filtros** para encontrar períodos específicos
4. **Exporte o histórico** se necessário

---

### 7. **Gerenciando Permissões e Acesso**

#### **Passo 7.1: Entender as Permissões**

**Matriz de permissões**:

| Módulo          | Admin Senior | Admin | Gerente | Dispatcher | Usuário |
| --------------- | ------------ | ----- | ------- | ---------- | ------- |
| Funcionários    | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Veículos        | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Rotas           | ✅ RW        | ✅ RW | ✅ RW   | ✅ RW      | ✅ R    |
| Folgas          | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Cidades         | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Vendedores      | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Relatórios      | ✅ RW        | ✅ RW | ✅ RW   | ✅ RW      | ✅ R    |
| Configurações   | ✅ RW        | ✅ RW | ✅ RW   | ✅ R       | ✅ R    |
| Gestão Usuários | ✅ RW        | ✅ RW | ✅ RW   | ❌         | ❌      |

**Legenda**: ✅ RW = Leitura e Escrita, ✅ R = Apenas Leitura, ❌ = Sem Acesso

#### **Passo 7.2: Verificar Permissões**

1. **Selecione o usuário** desejado
2. **Verifique o perfil atual** na lista
3. **Consulte a matriz** de permissões
4. **Confirme se o usuário** tem acesso necessário

---

### 8. **Usando Filtros e Buscas Avançadas**

#### **Passo 8.1: Busca Combinada**

1. **Use o campo de busca** para nome/email
2. **Aplique filtro por perfil** se necessário
3. **Aplique filtro por status** se necessário
4. **A lista será filtrada** com todos os critérios

#### **Passo 8.2: Ordenação**

1. **Clique na coluna "Nome"** para ordenar por nome
2. **Clique na coluna "Perfil"** para ordenar por perfil
3. **Clique na coluna "Último Login"** para ordenar por data
4. **Clique novamente** para inverter a ordem

---

### 9. **Gerenciando Informações Específicas**

#### **Passo 9.1: Informações do Usuário**

**Para visualizar detalhes**:

1. Selecione o usuário
2. Verifique os dados na lateral
3. Confirme se informações estão corretas

**Para alterar perfil**:

1. Selecione o usuário
2. Clique em "Alterar Perfil"
3. Escolha novo perfil
4. Digite motivo
5. Confirme alteração

#### **Passo 9.2: Informações de Acesso**

**Para verificar último login**:

1. Selecione o usuário
2. Verifique coluna "Último Login"
3. Confirme se acesso é recente

**Para verificar status**:

1. Selecione o usuário
2. Verifique coluna "Status"
3. Confirme se usuário está ativo

---

## ⚠️ **Dicas Importantes**

### 🔒 **Segurança e Validação**

- **Apenas usuários autorizados**: Podem gerenciar usuários
- **Hierarquia deve ser respeitada**: Não promova além do permitido
- **Motivo é obrigatório**: Para auditoria e controle
- **Alterações são registradas**: Histórico completo é mantido

### 💡 **Uso Eficiente**

- **Use filtros**: Para encontrar usuários rapidamente
- **Verifique permissões**: Antes de alterar perfis
- **Monitore histórico**: Para auditoria e controle
- **Comunique alterações**: Para usuários afetados

### 🔄 **Manutenção Regular**

- **Revise perfis mensalmente**: Para manter atualizado
- **Monitore acessos**: Para detectar atividade suspeita
- **Atualize permissões**: Conforme mudanças organizacionais
- **Mantenha histórico**: Para auditoria e controle

---

## 🐛 **Problemas Comuns**

### ❌ **"Não posso alterar perfil"**

**Problema**: Sistema não permite alterar perfil de usuário
**Soluções**:

1. Verifique se tem permissão de gestão de usuários
2. Verifique se usuário pode ser alterado (hierarquia)
3. Entre em contato com administrador
4. Verifique se usuário está ativo

### ❌ **"Perfil temporário não funciona"**

**Problema**: Perfil temporário não é ativado
**Soluções**:

1. Verifique se data de início é futura
2. Verifique se data de fim é posterior ao início
3. Aguarde a data de início
4. Verifique se perfil temporário foi criado

### ❌ **"Histórico não aparece"**

**Problema**: Histórico de alterações não carrega
**Soluções**:

1. Aguarde alguns segundos
2. Atualize a página (F5)
3. Verifique se usuário tem alterações
4. Verifique se tem permissão para ver histórico

### ❌ **"Usuário não aparece na lista"**

**Problema**: Usuário não está na lista
**Soluções**:

1. Verifique se usuário está cadastrado
2. Verifique se filtros não estão muito restritivos
3. Limpe filtros e busque novamente
4. Verifique se usuário está ativo

---

## 🔄 **Próximos Passos**

Após dominar a gestão de usuários:

1. **Leia o [Manual de Configurações](./12_CONFIGURACOES.md)** para configurações pessoais
2. **Configure [Notificações](./14_NOTIFICACOES.md)** para alertas
3. **Use [Relatórios](./10_RELATORIOS.md)** para acompanhar dados
4. **Monitore [Segurança](./12_CONFIGURACOES.md)** regularmente

---

## 📞 **Suporte**

### 🆘 **Precisa de Ajuda?**

- **Email**: suporte@empresa.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

**👥 Manual de Gestão de Usuários - SGL v1.2.3**

_Última atualização: Janeiro 2025_
