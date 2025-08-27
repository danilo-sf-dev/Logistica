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

- **KPIs**: Funcionários ativos, veículos, rotas, folgas
- **Gráficos**: Atividades recentes, tendências
- **Visão geral**: Status geral da operação
- **Notificações**: Sino de notificações no header

### 👥 Funcionários

- **Adicionar**: Nome, CPF, CNH, telefone, status, função
- **Editar**: Informações do funcionário
- **Excluir**: Remover funcionário
- **Filtrar**: Buscar por nome ou status
- **Exportar**: Excel e PDF com formatação brasileira

### 🚛 Veículos

- **Adicionar**: Placa, modelo, ano, status, capacidade
- **Editar**: Informações do veículo
- **Excluir**: Remover veículo
- **Filtrar**: Buscar por placa ou status
- **Exportar**: Excel e PDF com dados técnicos

### 🗺️ Rotas

- **Adicionar**: Origem, destino, funcionário, veículo
- **Editar**: Detalhes da rota
- **Excluir**: Remover rota
- **Otimização**: Preparado para Google Maps
- **Exportar**: Excel e PDF com detalhes completos

### 📅 Folgas

- **Solicitar**: Funcionário, data, tipo, motivo
- **Aprovar/Rejeitar**: Gestão de solicitações
- **Histórico**: Folgas anteriores
- **Notificações**: Alertas automáticos
- **Exportar**: Excel e PDF com histórico

### 🏙️ Cidades

- **Adicionar**: Nome, estado, região, unidade de negócio
- **Editar**: Informações da cidade
- **Excluir**: Remover cidade
- **Exportar**: Excel e PDF com dados geográficos

### 👨‍💼 Vendedores

- **Adicionar**: Nome, email, telefone, região, unidade
- **Editar**: Informações do vendedor
- **Excluir**: Remover vendedor
- **Exportar**: Excel e PDF com dados comerciais

### 📈 Relatórios

- **Dashboard**: Resumo geral com 4 cards
- **Detalhado**: Relatórios específicos por entidade
- **Exportar**: Download em Excel ou PDF
- **Gráficos**: Visualizações interativas
- **Formatação**: Brasileira (datas DD/MM/YYYY)

### ⚙️ Configurações

- **Perfil**: Dados pessoais e contato
- **Notificações**: Preferências por tipo
- **Sistema**: Configurações gerais
- **Segurança**: Informações de sessão

### 📤 Importação

- **Dados em Lote**: Importação de múltiplos registros
- **Validação**: Verificação automática de dados
- **Formatos**: Excel, CSV
- **Relatórios**: Status da importação

### ✅ Validações

- **Campos obrigatórios**: Marcados com asterisco (\*)
- **Feedback visual**: Bordas vermelhas em campos com erro
- **Mensagens específicas**: Erro detalhado abaixo do campo
- **Entidades inativas**: Não podem ser editadas
- **Formato de dados**: CPF, celular, CEP, email validados
- **Tipagem**: Verificação automática de tipos

## 🆕 **Novas Funcionalidades (v1.2.0)**

### 📊 **Sistema de Relatórios Avançado**

#### Relatórios Detalhados

- **Funcionários**: Dados completos pessoais e profissionais
- **Veículos**: Informações técnicas e status da frota
- **Rotas**: Detalhes de rotas e associações
- **Folgas**: Histórico de solicitações e aprovações
- **Cidades**: Dados geográficos e regionais
- **Vendedores**: Informações comerciais e contatos

#### Exportação Avançada

- **Excel (XLSX)**: Planilha com formatação profissional
- **PDF**: Documento formatado para impressão
- **Modal de Escolha**: Interface para selecionar formato
- **Formatação Brasileira**: Datas DD/MM/YYYY, CPF, telefone
- **Nomenclatura**: `entity_dd-MM-YYYY.xlsx`

### 🔔 **Sistema de Notificações**

#### NotificationBell

- **Sino no Header**: Contador de notificações não lidas
- **Dropdown**: Lista de notificações recentes
- **Marcar como Lida**: Clique para marcar
- **Tipos**: funcionário, rota, folga, veículo

#### Configurações de Notificação

- **Preferências**: Escolher tipos de notificação
- **Email**: Configurar notificações por email
- **Push**: Configurar notificações push
- **Salvar**: Configurações persistentes

### 🔐 **Sistema de Segurança**

#### Controle de Acesso

- **Roles**: admin, gerente, dispatcher, user
- **Permissões**: Diferentes níveis de acesso
- **Proteção**: Dados protegidos por role
- **Auditoria**: Log de operações

#### Informações de Sessão

- **IP Real**: Captura do endereço IP
- **Dispositivo**: Informações do dispositivo
- **Browser**: Navegador utilizado
- **Sistema**: Sistema operacional

### 🔧 **Melhorias Técnicas**

#### TypeScript

- **Código Tipado**: Verificação estática de tipos
- **IntelliSense**: Autocompletar mais preciso
- **Segurança**: Menos erros em runtime
- **Manutenibilidade**: Código mais fácil de manter

#### Vite

- **Desenvolvimento Rápido**: Hot reload otimizado
- **Build Eficiente**: Bundle menor e mais rápido
- **Configuração Simples**: Menos configuração necessária
- **Porta Padrão**: http://localhost:3000

## 🎯 **Como Usar**

### 1. **Acesse o Sistema**

- URL: https://your-project.web.app
- Login com Google
- Configure admin (primeira vez)

### 2. **Configure Dados Iniciais**

- Adicione funcionários
- Cadastre veículos
- Configure cidades
- Adicione vendedores

### 3. **Gerencie Operações**

- Crie rotas
- Gerencie folgas
- Monitore dashboard
- Analise relatórios

### 4. **Exporte Dados**

- Acesse módulo "Relatórios"
- Clique em "Relatórios Detalhados"
- Escolha o tipo de relatório
- Selecione formato (Excel ou PDF)
- Baixe automaticamente

### 5. **Configure Notificações**

- Clique no sino de notificações
- Acesse configurações
- Escolha preferências
- Salve configurações

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # Verificar código com ESLint
npm run format           # Formatar código com Prettier

# Deploy
npm run deploy           # Deploy no Firebase
```

## 📱 **Compatibilidade**

### Navegadores

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos

- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iPhone, Android)

## 🐛 **Troubleshooting**

### Problemas Comuns

#### Erro de Login

- Verificar conexão com internet
- Limpar cache do navegador
- Tentar login novamente

#### Erro de Exportação

- Verificar se há dados para exportar
- Aguardar processamento completo
- Verificar se o navegador permite downloads

#### Erro de Notificações

- Verificar configurações de notificação
- Habilitar notificações no navegador
- Verificar permissões

### Suporte

- **Email**: suporte@empresa.com
- **Telefone**: (11) 99999-9999
- **Documentação**: Pasta `docs/`

## 🎉 **Status do Sistema**

### ✅ Funcionando

- [x] Login com Google
- [x] Todos os módulos
- [x] Dashboard com KPIs
- [x] Sistema de notificações
- [x] Exportação Excel/PDF
- [x] Controle de segurança
- [x] Interface responsiva
- [x] Formatação brasileira

### 🚀 Próximas Melhorias

- [ ] Integração com Google Maps
- [ ] App mobile
- [ ] Integração com ERP
- [ ] Relatórios customizáveis

---

**🚀 Sistema pronto para uso! Acesse e comece a gerenciar sua logística.**
