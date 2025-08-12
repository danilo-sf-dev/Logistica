# 👤 Guia Completo do Usuário - SGL

## 🌐 Acesso ao Sistema

**URL:** https://your-project.web.app  
**Status:** ✅ **SISTEMA OPERACIONAL**

---

## 🔐 Primeiro Acesso e Autenticação

### 1. Login Inicial

1. **Acesse o sistema** pela URL fornecida
2. **Clique em "Entrar com Google"**
3. **Use sua conta Google** corporativa
4. **Autorize o acesso** quando solicitado
5. **Aguarde o redirecionamento** para o dashboard

### 2. Configuração de Permissões

**Para usuários que precisam de acesso administrativo:**

1. Faça login pela primeira vez
2. Acesse o **Firebase Console**: https://console.firebase.google.com/project/your-project
3. Vá em **Firestore Database**
4. Encontre a coleção `users`
5. Localize seu documento de usuário
6. Altere o campo `role` para `"admin"`

**Níveis de Acesso:**

- **admin**: Acesso total ao sistema
- **gerente**: Gestão de equipes e relatórios
- **dispatcher**: Gestão de rotas e veículos
- **user**: Acesso básico de visualização

---

## 📊 Dashboard - Visão Geral

### KPIs Principais

O dashboard exibe os seguintes indicadores em tempo real:

- **👥 Funcionários**: Total de funcionários cadastrados
- **🚛 Motoristas**: Motoristas ativos no sistema
- **👨‍💼 Vendedores**: Vendedores cadastrados
- **🏙️ Cidades**: Cidades atendidas
- **🚚 Veículos**: Total de veículos
- **🗺️ Rotas Ativas**: Rotas em andamento

### Gráficos Interativos

- **Status dos Motoristas**: Distribuição por status (Trabalhando, Disponível, Folga, Férias)
- **Status dos Veículos**: Distribuição por status (Disponível, Em Uso, Manutenção, Inativo)
- **Atividades Recentes**: Últimas 10 atividades do sistema (últimos 15 dias)

---

## 👥 Gestão de Motoristas

### Adicionar Novo Motorista

1. **Acesse** o módulo "Funcionários"
2. **Clique** em "Novo Funcionário"
3. **Preencha** os campos obrigatórios:
   - Nome completo
   - CPF (formato: 000.000.000-00)
   - CNH (número da carteira)
   - Celular (formato: (73) 99999-9999)
   - Email (opcional)
   - Endereço completo
   - Cidade
   - Função (Motorista, Ajudante, Outro)
   - Data de Admissão
   - Salário (opcional)
4. **Clique** em "Cadastrar"

### Editar Motorista

1. **Localize** o motorista na lista
2. **Clique** no ícone de edição (lápis)
3. **Modifique** os campos necessários
4. **Salve** as alterações

### Gerenciar Status

**Status disponíveis:**

- **Trabalhando**: Em rota ativa
- **Disponível**: Pronto para nova rota
- **Folga**: Em período de folga
- **Férias**: Em período de férias

### Filtros e Busca

- **Buscar por nome**: Digite o nome no campo de busca
- **Filtrar por status**: Use o dropdown de status
- **Ordenar**: Clique nos cabeçalhos das colunas

---

## 🚛 Gestão de Veículos

### Adicionar Novo Veículo

1. **Acesse** o módulo "Veículos"
2. **Clique** em "Novo Veículo"
3. **Preencha** os campos:
   - **Placa**: Formato Mercosul (ex: ABC1234)
   - **Modelo**: Nome do modelo
   - **Marca**: Fabricante
   - **Ano**: Ano de fabricação
   - **Capacidade**: Em kg
   - **Status**: Disponível, Em Uso, Manutenção, Inativo
   - **Tipo de Carroceria**: Truck, Toco, Bitruck, etc.
   - **Tipo de Baú**: Frigorífico, Carga Seca, etc.
   - **Unidade de Negócio**: Frigorífico, Ovos, Ambos
4. **Clique** em "Cadastrar"

### Manutenção de Veículos

**Para registrar manutenção:**

1. **Edite** o veículo
2. **Atualize** o status para "Manutenção"
3. **Preencha** as datas:
   - Última Manutenção
   - Próxima Manutenção
4. **Adicione** observações se necessário

---

## 🗺️ Gestão de Rotas

### Criar Nova Rota

1. **Acesse** o módulo "Rotas"
2. **Clique** em "Nova Rota"
3. **Preencha** os dados:
   - **Nome da Rota**: Identificação da rota
   - **Data da Rota**: Data de execução
   - **Peso Mínimo**: Em kg
   - **Dias da Semana**: Selecione os dias de operação
4. **Clique** em "Criar"

### Vincular Cidades

**Para vincular cidades a uma rota:**

1. **Acesse** o módulo "Cidades"
2. **Edite** a cidade desejada
3. **Selecione** a rota no dropdown
4. **Salve** as alterações

### Status das Rotas

- **Agendada**: Rota programada
- **Em Andamento**: Rota sendo executada
- **Concluída**: Rota finalizada
- **Cancelada**: Rota cancelada

---

## 📅 Gestão de Folgas

### Solicitar Folga

1. **Acesse** o módulo "Folgas"
2. **Clique** em "Nova Solicitação"
3. **Selecione** o funcionário
4. **Escolha** o tipo:
   - Folga
   - Férias
   - Licença Médica
   - Atestado
   - Banco de Horas
   - Compensação
   - Suspensão
   - Afastamento
   - Maternidade
   - Paternidade
   - Luto
   - Casamento
   - Doação de Sangue
   - Serviço Militar
   - Capacitação
   - Outros
5. **Defina** as datas de início e fim
6. **Adicione** observações se necessário
7. **Clique** em "Solicitar"

### Aprovar/Rejeitar Solicitações

**Para gestores:**

1. **Visualize** as solicitações pendentes
2. **Clique** em "Aprovar" ou "Rejeitar"
3. **Adicione** comentários se necessário
4. **Confirme** a ação

---

## 🏙️ Gestão de Cidades

### Adicionar Nova Cidade

1. **Acesse** o módulo "Cidades"
2. **Clique** em "Nova Cidade"
3. **Preencha** os dados:
   - **Nome da Cidade**: Nome completo
   - **Estado**: Selecione o estado
   - **Região**: Preenchida automaticamente
   - **Distância**: Em km (opcional)
   - **Peso Mínimo**: Em kg (opcional)
   - **Rota**: Vincular a uma rota (opcional)
   - **Observações**: Informações adicionais
4. **Clique** em "Cadastrar"

### Vincular a Rotas

1. **Edite** a cidade
2. **Selecione** a rota no dropdown
3. **Salve** as alterações

---

## 👨‍💼 Gestão de Vendedores

### Adicionar Novo Vendedor

1. **Acesse** o módulo "Vendedores"
2. **Clique** em "Novo Vendedor"
3. **Preencha** os dados:
   - **Nome**: Nome completo
   - **CPF**: Formato 000.000.000-00
   - **Código Vend.Sistema**: Código interno
   - **Email**: Email corporativo
   - **Telefone**: Formato (73) 99999-9999
   - **Estado**: Estado de atuação
   - **Região**: Região de atuação
   - **Cidades**: Cidades atendidas
4. **Clique** em "Cadastrar"

---

## 📈 Relatórios e Analytics

### Dashboard Analítico

**Métricas disponíveis:**

- Total de funcionários por status
- Total de veículos por status
- Rotas criadas por período
- Folgas pendentes e aprovadas
- Atividades recentes do sistema

### Relatórios Detalhados

1. **Acesse** o módulo "Relatórios"
2. **Selecione** o período desejado
3. **Escolha** o tipo de relatório
4. **Visualize** os dados em gráficos
5. **Exporte** se necessário

### Exportação de Dados

**Formatos disponíveis:**

- PDF
- Excel (XLSX)
- CSV

---

## ⚙️ Configurações do Sistema

### Perfil do Usuário

1. **Acesse** "Configurações" → "Perfil"
2. **Edite** suas informações:
   - Nome
   - Email
   - Telefone
   - Cargo
3. **Salve** as alterações

### Notificações

**Configurar alertas:**

- **Email**: Notificações por email
- **Push**: Notificações em tempo real
- **Rotas**: Alertas de rotas
- **Folgas**: Alertas de folgas
- **Manutenção**: Alertas de manutenção

### Segurança

**Alterar senha** (se usar login com email/senha):

1. **Acesse** "Configurações" → "Segurança"
2. **Digite** a senha atual
3. **Digite** a nova senha
4. **Confirme** a nova senha
5. **Salve** as alterações

---

## 🔔 Recursos Avançados

### Notificações Push

**Para receber notificações:**

1. **Autorize** as notificações quando solicitado
2. **Configure** as preferências em "Configurações"
3. **Receba** alertas em tempo real

### Busca Avançada

**Filtros disponíveis:**

- Por nome
- Por status
- Por data
- Por região
- Por unidade de negócio

### Atalhos de Teclado

- **Ctrl + F**: Buscar na página atual
- **Ctrl + S**: Salvar formulário
- **Esc**: Cancelar ação
- **Enter**: Confirmar ação

---

## 🆘 Suporte e Ajuda

### Problemas Comuns

**Login não funciona:**

1. Verifique se está usando a conta Google correta
2. Limpe o cache do navegador
3. Tente em modo incógnito

**Dados não carregam:**

1. Verifique a conexão com a internet
2. Recarregue a página (F5)
3. Aguarde alguns segundos

**Erro ao salvar:**

1. Verifique se todos os campos obrigatórios estão preenchidos
2. Verifique o formato dos dados
3. Tente novamente

### Contato

**Para suporte técnico:**

- **Email**: suporte@empresa.com
- **Telefone**: (73) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- **Desktop**: Tela completa
- **Tablet**: Interface adaptada
- **Mobile**: Interface otimizada

### Navegadores Suportados

- **Chrome**: Versão 90+
- **Firefox**: Versão 88+
- **Safari**: Versão 14+
- **Edge**: Versão 90+

---

## 🔄 Atualizações

O sistema é atualizado automaticamente. Para verificar atualizações:

1. **Recarregue** a página (F5)
2. **Limpe** o cache se necessário
3. **Verifique** se há novas funcionalidades

---

**Última atualização:** Janeiro 2025  
**Versão do sistema:** 1.0.0  
**Status:** ✅ Sistema operacional
