# 👤 Guia Completo do Usuário - SGL

## 🌐 Acesso ao Sistema

**URL:** https://logistica-c7afc.web.app  
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
2. Acesse o **Firebase Console**: https://console.firebase.google.com/project/your-project-id
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

- **👥 Total Funcionários**: Total de funcionários cadastrados
- **🚛 Total Motoristas**: Motoristas ativos no sistema
- **🚚 Total Veículos**: Total de veículos da frota
- **📅 Folgas Pendentes**: Solicitações de folga aguardando aprovação

### Gráficos Interativos

- **Status dos Funcionários**: Distribuição por status (Trabalhando, Disponível, Folga, Férias)
- **Status dos Veículos**: Distribuição por status (Disponível, Em Uso, Manutenção, Inativo)
- **Atividades Recentes**: Últimas 10 atividades do sistema (últimos 15 dias)

### 🔔 Notificações

- **Sino de Notificações**: Localizado no header da aplicação
- **Contador**: Mostra número de notificações não lidas
- **Dropdown**: Lista de notificações recentes
- **Marcar como Lida**: Clique na notificação para marcar

---

## 👥 Gestão de Funcionários

### Adicionar Novo Funcionário

1. **Acesse** o módulo "Funcionários"
2. **Clique** em "Novo Funcionário"
3. **Preencha** os campos obrigatórios:
   - Nome completo
   - CPF (formato: 000.000.000-00)
   - CNH (número da carteira - opcional)
   - Celular (formato: (73) 99999-9999)
   - Email (opcional)
   - Endereço completo
   - Cidade
   - Função (Motorista, Ajudante, Outro)
   - Data de Admissão
   - Salário (opcional)
   - Unidade de Negócio (Frigorífico, Ovos)
4. **Clique** em "Cadastrar"

### Editar Funcionário

1. **Localize** o funcionário na lista
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
- **Filtrar por função**: Use o dropdown de função
- **Ordenar**: Clique nos cabeçalhos das colunas

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Funcionários Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 🚛 Gestão de Veículos

### Adicionar Novo Veículo

1. **Acesse** o módulo "Veículos"
2. **Clique** em "Novo Veículo"
3. **Preencha** os campos obrigatórios:
   - Placa (formato: ABC-1234)
   - Modelo
   - Marca
   - Ano
   - Capacidade (em toneladas)
   - Status (Disponível, Em Uso, Manutenção, Inativo)
   - Unidade de Negócio (Frigorífico, Ovos)
   - Funcionário responsável (opcional)
4. **Clique** em "Cadastrar"

### Gerenciar Manutenção

- **Última Manutenção**: Data da última manutenção
- **Próxima Manutenção**: Data programada para próxima manutenção
- **Status de Manutenção**: Controle automático baseado nas datas

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Veículos Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 🗺️ Gestão de Rotas

### Criar Nova Rota

1. **Acesse** o módulo "Rotas"
2. **Clique** em "Nova Rota"
3. **Preencha** os campos obrigatórios:
   - Origem (cidade)
   - Destino (cidade)
   - Funcionário responsável
   - Veículo
   - Data de Partida
   - Data de Chegada
   - Status (Agendada, Em Andamento, Concluída, Cancelada)
   - Unidade de Negócio (Frigorífico, Ovos)
   - Observações (opcional)
4. **Clique** em "Cadastrar"

### Acompanhar Status

**Status disponíveis:**

- **Agendada**: Rota programada
- **Em Andamento**: Rota em execução
- **Concluída**: Rota finalizada
- **Cancelada**: Rota cancelada

### Otimização de Rotas

- **Preparado para Google Maps**: Integração futura
- **Cálculo de Distâncias**: Automático
- **Tempo Estimado**: Baseado em distância

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Rotas Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 📅 Gestão de Folgas

### Solicitar Folga

1. **Acesse** o módulo "Folgas"
2. **Clique** em "Nova Folga"
3. **Preencha** os campos obrigatórios:
   - Funcionário
   - Tipo (Folga, Férias, Licença)
   - Data de Início
   - Data de Fim
   - Motivo
   - Observações (opcional)
4. **Clique** em "Solicitar"

### Aprovar/Rejeitar Folgas

**Para usuários com permissão de aprovação:**

1. **Localize** a solicitação na lista
2. **Clique** no ícone de aprovação (✓) ou rejeição (✗)
3. **Adicione** observações (opcional)
4. **Confirme** a ação

### Histórico de Folgas

- **Todas as solicitações**: Histórico completo
- **Status**: Pendente, Aprovada, Rejeitada
- **Filtros**: Por funcionário, período, status

### Notificações Automáticas

- **Solicitação**: Notificação para aprovadores
- **Aprovação/Rejeição**: Notificação para solicitante
- **Lembrete**: Notificação de folgas próximas

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Folgas Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 🏙️ Gestão de Cidades

### Adicionar Nova Cidade

1. **Acesse** o módulo "Cidades"
2. **Clique** em "Nova Cidade"
3. **Preencha** os campos obrigatórios:
   - Nome da cidade
   - Estado
   - Região
   - Unidade de Negócio (Frigorífico, Ovos)
4. **Clique** em "Cadastrar"

### Organização Regional

- **Regiões**: Organização geográfica
- **Estados**: Controle por estado
- **Unidades**: Separação por negócio

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Cidades Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 👨‍💼 Gestão de Vendedores

### Adicionar Novo Vendedor

1. **Acesse** o módulo "Vendedores"
2. **Clique** em "Novo Vendedor"
3. **Preencha** os campos obrigatórios:
   - Nome completo
   - CPF (formato: 000.000.000-00)
   - Email
   - Telefone (formato: (73) 99999-9999)
   - Região
   - Unidade de Negócio (Frigorífico, Ovos)
   - Data de Admissão
   - Salário (opcional)
4. **Clique** em "Cadastrar"

### Gestão de Territórios

- **Regiões**: Atribuição por região
- **Cidades**: Cidades atendidas
- **Cobertura**: Área de atuação

### Exportação de Dados

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** "Vendedores Detalhado"
4. **Selecione** formato (Excel ou PDF)
5. **Baixe** o arquivo automaticamente

---

## 📊 Relatórios e Analytics

### Dashboard de Relatórios

O módulo de relatórios oferece:

- **4 Cards de Resumo**: Total Funcionários, Total Motoristas, Total Veículos, Folgas Pendentes
- **Gráficos Interativos**: Status dos funcionários e veículos
- **Relatórios Detalhados**: Exportação completa de dados

### Relatórios Detalhados

**ℹ️ Observação Importante:**

- **Relatórios Temporais**: Rotas e Folgas são filtrados pelo período selecionado (última semana, mês, etc.)
- **Relatórios Não-Temporais**: Veículos, Cidades, Vendedores e Funcionários mostram todos os dados cadastrados

**Tipos disponíveis:**

1. **Funcionários Detalhado**
   - Dados pessoais e profissionais
   - Status atual
   - Informações de contato
   - **Ordenação**: Do mais recente para o mais antigo

2. **Veículos Detalhado**
   - Informações técnicas (Marca, Modelo, Ano, Placa, Capacidade)
   - Carroceria e Tipo de Baú separados
   - Status da frota
   - Dados de manutenção
   - **Ordenação**: Do mais recente para o mais antigo

3. **Rotas Detalhado**
   - Detalhes de rotas
   - Associações funcionário/veículo
   - Status de execução
   - **Filtro**: Por período selecionado
   - **Ordenação**: Do mais recente para o mais antigo

4. **Folgas Detalhado**
   - Histórico de solicitações
   - Status de aprovação
   - Observações
   - **Filtro**: Por período selecionado
   - **Ordenação**: Do mais recente para o mais antigo

5. **Cidades Detalhado**
   - Dados geográficos
   - Organização regional
   - Vínculos com rotas
   - **Ordenação**: Do mais recente para o mais antigo

6. **Vendedores Detalhado**
   - Informações comerciais
   - Territórios de atuação
   - Dados de contato
   - **Ordenação**: Do mais recente para o mais antigo

### Exportação Avançada

#### Formatos Disponíveis

- **Excel (XLSX)**: Planilha com formatação profissional
- **PDF**: Documento formatado para impressão

#### Como Exportar

1. **Acesse** o módulo "Relatórios"
2. **Clique** em "Relatórios Detalhados"
3. **Escolha** o tipo de relatório
4. **Clique** no botão de download
5. **Selecione** o formato (Excel ou PDF)
6. **Baixe** o arquivo automaticamente

#### Características da Exportação

- **Formatação Brasileira**: Datas DD/MM/YYYY, CPF, telefone
- **Layout Profissional**: Cabeçalhos formatados
- **Nomenclatura Padrão**: `entity_dd-MM-YYYY.xlsx`
- **Dados Completos**: Todas as informações da entidade

---

## ⚙️ Configurações do Sistema

### Perfil do Usuário

1. **Acesse** o módulo "Configurações"
2. **Clique** em "Perfil"
3. **Edite** os dados pessoais:
   - Nome
   - Email
   - Telefone
   - Cargo
4. **Salve** as alterações

### Configurações de Notificação

1. **Acesse** o módulo "Configurações"
2. **Clique** em "Notificações"
3. **Configure** as preferências:
   - **Funcionários**: Notificações sobre funcionários
   - **Rotas**: Notificações sobre rotas
   - **Folgas**: Notificações sobre folgas
   - **Veículos**: Notificações sobre veículos
   - **Email**: Receber notificações por email
   - **Push**: Receber notificações push
4. **Salve** as configurações

### Configurações do Sistema

1. **Acesse** o módulo "Configurações"
2. **Clique** em "Sistema"
3. **Configure** as opções:
   - **Idioma**: Português (Brasil)
   - **Fuso Horário**: Configurável
   - **Tema**: Claro/Escuro (futuro)
4. **Salve** as configurações

### Segurança e Sessão

1. **Acesse** o módulo "Configurações"
2. **Clique** em "Segurança"
3. **Visualize** as informações:
   - **IP Real**: Endereço IP da sessão
   - **Dispositivo**: Informações do dispositivo
   - **Browser**: Navegador utilizado
   - **Sistema**: Sistema operacional
   - **Último Login**: Data e hora

---

## 📤 Sistema de Importação

### Importação em Lote

1. **Acesse** o módulo "Importação"
2. **Escolha** o tipo de dados:
   - Funcionários
   - Veículos
   - Cidades
   - Vendedores
3. **Selecione** o arquivo (Excel ou CSV)
4. **Configure** o mapeamento de colunas
5. **Valide** os dados
6. **Execute** a importação

### Validação de Dados

- **Verificação automática**: Formato de dados
- **Relatório de erros**: Dados inválidos
- **Confirmação**: Antes da importação

### Relatórios de Importação

- **Status**: Sucesso ou erro
- **Quantidade**: Registros importados
- **Detalhes**: Log da importação

---

## 🔔 Sistema de Notificações

### NotificationBell

**Localização**: Header da aplicação (canto superior direito)

**Funcionalidades**:

- **Contador**: Número de notificações não lidas
- **Dropdown**: Lista de notificações recentes
- **Marcar como Lida**: Clique na notificação
- **Configurações**: Link para configurações

### Tipos de Notificação

- **Funcionários**: Novos cadastros, alterações de status
- **Rotas**: Novas rotas, alterações de status
- **Folgas**: Solicitações, aprovações, rejeições
- **Veículos**: Manutenções, alterações de status

### Configurações de Notificação

**Acesse**: Configurações → Notificações

**Opções**:

- **Habilitar/Desabilitar** por tipo
- **Email**: Receber por email
- **Push**: Receber no navegador
- **Salvar**: Configurações persistentes

---

## 🎯 Dicas e Melhores Práticas

### Organização de Dados

- **Mantenha dados atualizados**: Status de funcionários e veículos
- **Use filtros**: Para encontrar informações rapidamente
- **Exporte regularmente**: Para backup e análise
- **Configure notificações**: Para acompanhar mudanças importantes

### Uso Eficiente

- **Filtros avançados**: Combine múltiplos critérios
- **Busca rápida**: Use o campo de busca
- **Ordenação**: Clique nos cabeçalhos das tabelas
- **Atalhos**: Use o teclado para navegação

### Relatórios

- **Exporte regularmente**: Para acompanhamento
- **Use diferentes formatos**: Excel para análise, PDF para apresentação
- **Mantenha histórico**: Para análise de tendências
- **Compartilhe dados**: Com equipes relevantes

---

## 🐛 Solução de Problemas

### Problemas Comuns

#### Erro de Login

- **Verificar**: Conexão com internet
- **Solução**: Limpar cache do navegador
- **Alternativa**: Tentar modo incógnito

#### Dados Não Carregam

- **Verificar**: Permissões de acesso
- **Solução**: Recarregar página (F5)
- **Alternativa**: Aguardar alguns segundos

#### Erro na Exportação

- **Verificar**: Dados disponíveis para exportar
- **Solução**: Aguardar processamento completo
- **Alternativa**: Verificar permissões de download

#### Notificações Não Aparecem

- **Verificar**: Configurações de notificação
- **Solução**: Habilitar notificações no navegador
- **Alternativa**: Verificar permissões

### Suporte Técnico

- **Email**: suporte@empresa.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h
- **Documentação**: Pasta `docs/`

---

## 📱 Compatibilidade

### Navegadores Suportados

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Dispositivos

- **Desktop**: Windows, macOS, Linux
- **Tablet**: iPad, Android
- **Mobile**: iPhone, Android

### Resolução

- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667

---

## 🎉 Conclusão

O SGL oferece uma solução completa para gestão logística com:

- **Interface intuitiva** e responsiva
- **Funcionalidades avançadas** de relatórios
- **Sistema de notificações** em tempo real
- **Controle de segurança** robusto
- **Exportação profissional** de dados
- **Suporte técnico** disponível

**🚀 Sistema pronto para otimizar sua operação logística!**
