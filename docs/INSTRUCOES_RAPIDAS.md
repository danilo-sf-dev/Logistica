# 🚀 SGL - Instruções Rápidas de Uso

## 🌐 Acesse o Sistema

**URL:** https://logistica-c7afc.web.app  
**Status:** ✅ **FUNCIONANDO PERFEITAMENTE**

## 🔐 Primeiro Acesso

### 1. Login

- Clique em **"Entrar com Google"**
- Use sua conta Google
- Autorize o acesso
- ✅ **Login testado e funcionando**

### 2. Configure um Admin

1. Faça login pela primeira vez
2. Vá em **Firebase Console** → **Firestore Database**
3. Encontre o documento do usuário na coleção `users`
4. Altere o campo `role` para `"admin"`

## 📊 Módulos Principais

### 🏠 Dashboard

- **KPIs**: Motoristas ativos, veículos, rotas, folgas
- **Gráficos**: Atividades recentes, tendências
- **Visão geral**: Status geral da operação

### 👥 Motoristas

- **Adicionar**: Nome, CPF, CNH, telefone, status
- **Editar**: Informações do motorista
- **Excluir**: Remover motorista
- **Filtrar**: Buscar por nome ou status
- **Exportar**: Excel e PDF

### 🚛 Veículos

- **Adicionar**: Placa, modelo, ano, status
- **Editar**: Informações do veículo
- **Excluir**: Remover veículo
- **Filtrar**: Buscar por placa ou status
- **Exportar**: Excel e PDF

### 🗺️ Rotas

- **Adicionar**: Origem, destino, motorista, veículo
- **Editar**: Detalhes da rota
- **Excluir**: Remover rota
- **Otimização**: Preparado para Google Maps
- **Exportar**: Excel e PDF

### 📅 Folgas

- **Solicitar**: Motorista, data, tipo
- **Aprovar/Rejeitar**: Gestão de solicitações
- **Histórico**: Folgas anteriores
- **Exportar**: Excel e PDF

### 🏙️ Cidades

- **Adicionar**: Nome, estado, região
- **Editar**: Informações da cidade
- **Excluir**: Remover cidade
- **Exportar**: Excel e PDF

### 👨‍💼 Vendedores

- **Adicionar**: Nome, email, telefone, região
- **Editar**: Informações do vendedor
- **Excluir**: Remover vendedor
- **Exportar**: Excel e PDF

### 📈 Relatórios

- **Dashboard**: Resumo geral
- **Detalhado**: Relatórios específicos
- **Exportar**: Download de dados
- **Gráficos**: Visualizações interativas

### ✅ Validações

- **Campos obrigatórios**: Marcados com asterisco (\*)
- **Feedback visual**: Bordas vermelhas em campos com erro
- **Mensagens específicas**: Erro detalhado abaixo do campo
- **Entidades inativas**: Não podem ser editadas
- **Formato de dados**: CPF, celular, CEP, email validados

## 🆕 **Novas Funcionalidades**

### 📊 **Relatórios Detalhados**

#### Funcionários Detalhado

- Dados completos: Nome, CPF, CNH, telefone, email, endereço
- Informações profissionais: Função, data de admissão, salário
- Status atual: Trabalhando, Disponível, Folga, Férias

#### Veículos Detalhado

- Dados técnicos: Placa, modelo, marca, ano, capacidade
- Status operacional: Disponível, Em Uso, Manutenção, Inativo
- Manutenção: Última e próxima manutenção

#### Rotas Detalhado

- Informações da rota: Origem, destino, funcionário, veículo
- Datas: Partida e chegada
- Status: Agendada, Em Andamento, Concluída, Cancelada

#### Folgas Detalhado

- Dados da solicitação: Funcionário, datas, tipo, motivo
- Status: Pendente, Aprovada, Rejeitada
- Observações: Comentários e justificativas

#### Cidades Detalhado

- Dados geográficos: Nome, estado, região
- Informações operacionais: Distância, peso mínimo
- Vínculos: Rotas associadas

#### Vendedores Detalhado

- Dados pessoais: Nome, CPF, email, telefone
- Informações comerciais: Código sistema, unidade de negócio
- Cobertura: Estado, região, cidades atendidas

### 📤 **Exportação Avançada**

#### Formatos Disponíveis

- **Excel (XLSX)**: Planilha para análise de dados
- **PDF**: Documento formatado para impressão

#### Como Exportar

1. Acesse o módulo "Relatórios"
2. Clique em "Relatórios Detalhados"
3. Escolha o tipo de relatório
4. Clique no botão de download
5. Selecione o formato (Excel ou PDF)
6. Baixe o arquivo automaticamente

#### Nomenclatura dos Arquivos

- **Padrão**: `entity_dd-MM-YYYY.xlsx` (ex: `funcionarios_16-01-2025.xlsx`)
- **Formato de data**: DD/MM/YYYY (padrão brasileiro)

## 🔧 Configurações

### 👤 Perfil do Usuário

- **Editar**: Nome, email, foto
- **Alterar senha**: (se usar email/senha)
- **Preferências**: Configurações pessoais

### ⚙️ Sistema

- **Tema**: Claro/Escuro
- **Notificações**: Configurar alertas
- **Idioma**: Português (padrão)

## 📱 Recursos Avançados

### 🔔 Notificações

- **Push**: Notificações em tempo real
- **Email**: Alertas por email
- **SMS**: Notificações por SMS (futuro)

### 📊 Analytics

- **Gráficos interativos**: Status de funcionários, veículos, rotas
- **KPIs em tempo real**: Métricas atualizadas
- **Relatórios customizáveis**: Períodos e filtros

### 🔍 Busca Avançada

- **Filtros múltiplos**: Por nome, status, data, região
- **Ordenação**: Por qualquer coluna
- **Busca por texto**: Em todos os campos

## 🚀 Atalhos Rápidos

### 📋 **Operações Comuns**

1. **Adicionar Funcionário**
   - Módulo: Funcionários → Novo Funcionário
   - Campos: Nome, CPF, CNH, telefone, status

2. **Criar Rota**
   - Módulo: Rotas → Nova Rota
   - Campos: Origem, destino, funcionário, veículo

3. **Solicitar Folga**
   - Módulo: Folgas → Nova Folga
   - Campos: Funcionário, datas, tipo, motivo

4. **Exportar Relatório**
   - Módulo: Relatórios → Relatórios Detalhados
   - Escolha: Tipo de relatório → Formato → Download

### ⚡ **Dicas Rápidas**

- **Filtros**: Use os filtros para encontrar dados específicos
- **Exportação**: Todos os módulos têm exportação Excel/PDF
- **Gráficos**: Clique nos gráficos para ver detalhes
- **Notificações**: Configure alertas para eventos importantes
- **Responsivo**: Funciona em desktop, tablet e mobile

## 🆘 Suporte

### ❓ **Problemas Comuns**

**Login não funciona:**

- Verifique a conta Google
- Limpe o cache do navegador
- Tente modo incógnito

**Dados não carregam:**

- Verifique a conexão com a internet
- Recarregue a página (F5)
- Aguarde alguns segundos

**Erro na exportação:**

- Verifique se há dados para exportar
- Aguarde o processamento completo
- Verifique se o navegador permite downloads

### 📞 **Contato**

- **Email**: suporte@empresa.com
- **Telefone**: (73) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

## ✅ **Checklist de Uso**

### 🔐 **Primeiro Acesso**

- [ ] Login com Google
- [ ] Configurar permissões de admin
- [ ] Verificar acesso aos módulos

### 📊 **Funcionalidades Básicas**

- [ ] Adicionar funcionário
- [ ] Cadastrar veículo
- [ ] Criar rota
- [ ] Solicitar folga
- [ ] Adicionar cidade
- [ ] Cadastrar vendedor

### 📈 **Relatórios e Exportação**

- [ ] Visualizar dashboard
- [ ] Acessar relatórios detalhados
- [ ] Exportar relatório em Excel
- [ ] Exportar relatório em PDF
- [ ] Testar filtros e busca

### ⚙️ **Configurações**

- [ ] Editar perfil
- [ ] Configurar notificações
- [ ] Testar responsividade

---

**🌐 Sistema Online:** https://logistica-c7afc.web.app  
**🔐 Login:** ✅ Funcionando  
**📊 Dashboard:** ✅ Operacional  
**🚛 Módulos:** ✅ Todos funcionando  
**📱 Responsivo:** ✅ Qualquer dispositivo  
**📤 Exportação:** ✅ Excel e PDF funcionando

**Última atualização:** Janeiro 2025  
**Versão:** 1.1.0  
**Status:** ✅ Sistema operacional com novas funcionalidades
