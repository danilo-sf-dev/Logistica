# Documentação Técnica - Sistema de Gestão de Logística (SGL)

## 📋 Visão Geral

O SGL é um sistema web completo desenvolvido em React com Firebase, projetado para gerenciar operações logísticas de empresas do setor de Frigorífico e Ovos. O sistema oferece uma interface moderna, responsiva e intuitiva para gestão de motoristas, veículos, rotas e folgas.

## 🏗️ Arquitetura

### Frontend

- **Framework**: React 18 com Hooks
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Context API + useState/useEffect
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast

### Backend (Firebase)

- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Firestore (NoSQL)
- **Hospedagem**: Firebase Hosting
- **Funções**: Cloud Functions (preparado)
- **Notificações**: Firebase Cloud Messaging
- **Storage**: Firebase Storage (preparado)

## 📁 Estrutura de Dados

### Coleções do Firestore

#### users

```javascript
{
  uid: "string",
  email: "string",
  displayName: "string",
  role: "admin" | "gerente" | "dispatcher" | "user",
  telefone: "string",
  cargo: "string",
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

#### motoristas

```javascript
{
  nome: "string",
  cpf: "string",
  cnh: "string",
  telefone: "string",
  email: "string",
  endereco: "string",
  cidade: "string",
  status: "trabalhando" | "disponivel" | "folga" | "ferias",
  unidadeNegocio: "frigorifico" | "ovos",
  dataAdmissao: "string",
  salario: "number",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### veiculos

```javascript
{
  placa: "string",
  modelo: "string",
  marca: "string",
  ano: "number",
  capacidade: "number",
  status: "disponivel" | "em_uso" | "manutencao" | "inativo",
  unidadeNegocio: "frigorifico" | "ovos",
  ultimaManutencao: "string",
  proximaManutencao: "string",
  motorista: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### rotas

```javascript
{
  origem: "string",
  destino: "string",
  motorista: "string",
  veiculo: "string",
  dataPartida: "string",
  dataChegada: "string",
  status: "agendada" | "em_andamento" | "concluida" | "cancelada",
  unidadeNegocio: "frigorifico" | "ovos",
  observacoes: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### folgas

```javascript
{
  motorista: "string",
  dataInicio: "string",
  dataFim: "string",
  tipo: "folga" | "ferias" | "licenca",
  status: "pendente" | "aprovada" | "rejeitada",
  observacoes: "string",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### cidades

```javascript
{
  nome: "string",
  estado: "string",
  regiao: "string",
  distancia: "number",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

#### vendedores

```javascript
{
  nome: "string",
  email: "string",
  telefone: "string",
  regiao: "string",
  unidadeNegocio: "frigorifico" | "ovos",
  status: "ativo" | "inativo",
  dataCriacao: Timestamp,
  dataAtualizacao: Timestamp
}
```

## 🔐 Sistema de Permissões

### Roles (Funções)

- **admin**: Acesso total ao sistema
- **gerente**: Pode gerenciar motoristas, veículos, rotas e folgas
- **dispatcher**: Pode criar e gerenciar rotas
- **user**: Acesso apenas de leitura

### Regras de Segurança

```javascript
// Usuários podem ler/escrever seus próprios dados
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Administradores podem acessar todos os dados
match /{document=**} {
  allow read, write: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## 🎨 Componentes React

### Estrutura de Componentes

```
src/components/
├── auth/
│   └── Login.js              # Tela de login
├── dashboard/
│   └── Dashboard.js          # Dashboard principal
├── motoristas/
│   └── Motoristas.js         # Gestão de motoristas
├── veiculos/
│   └── Veiculos.js           # Gestão de veículos
├── rotas/
│   └── Rotas.js              # Gestão de rotas
├── folgas/
│   └── Folgas.js             # Gestão de folgas
├── cidades/
│   └── Cidades.js            # Gestão de cidades
├── vendedores/
│   └── Vendedores.js         # Gestão de vendedores
├── relatorios/
│   └── Relatorios.js         # Relatórios e análises
├── configuracoes/
│   └── Configuracoes.js      # Configurações do sistema
└── layout/
    └── Layout.js             # Layout principal
```

### Contextos

- **AuthContext**: Gerencia autenticação e perfil do usuário
- **NotificationContext**: Gerencia notificações do sistema

## 📊 Dashboard e Relatórios

### KPIs Principais

- Total de motoristas
- Total de veículos
- Rotas ativas
- Folgas pendentes

### Gráficos

- Status dos motoristas (Pizza)
- Status dos veículos (Pizza)
- Status das rotas (Barras)
- Status das folgas (Barras)

### Relatórios Disponíveis

- Motoristas detalhado
- Veículos detalhado
- Rotas detalhado
- Folgas detalhado

## 🔧 Configuração e Deploy

### Variáveis de Ambiente

```bash
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=seu-app-id
```

### Scripts Disponíveis

```bash
npm run setup      # Configuração inicial do Firebase
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Build para produção
npm run deploy     # Deploy no Firebase Hosting
```

## 🚀 Funcionalidades Avançadas

### Notificações Push

- Configurado com Firebase Cloud Messaging
- Notificações em tempo real
- Permissões automáticas

### Otimização de Rotas (Preparado)

- Integração com Google Maps API
- Cálculo de rotas otimizadas
- Visualização de mapas

### Responsividade

- Design mobile-first
- Interface adaptativa
- Componentes responsivos

## 🔍 Monitoramento e Analytics

### Firebase Analytics (Preparado)

```javascript
// Configuração básica
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics(app);

// Exemplo de evento
logEvent(analytics, "login", {
  method: "email",
});
```

### Performance Monitoring

- Métricas de carregamento
- Tempo de resposta
- Uso de recursos

## 🛡️ Segurança

### Autenticação

- Firebase Authentication
- Tokens JWT
- Refresh automático

### Validação de Dados

- Validação no frontend
- Sanitização de inputs
- Regras do Firestore

### CORS e CSP

- Configuração de segurança
- Headers de proteção
- Políticas de conteúdo

## 📱 PWA (Progressive Web App)

### Características

- Instalável
- Offline capability (preparado)
- Push notifications
- App-like experience

### Service Worker

```javascript
// Preparado para cache offline
const CACHE_NAME = "sgl-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];
```

## 🔄 Integrações Futuras

### APIs Externas

- Google Maps Platform
- WhatsApp Business API
- Sistemas ERP
- APIs de rastreamento

### Funcionalidades Planejadas

- App mobile (React Native)
- Machine Learning para otimização
- Integração com IoT
- Relatórios avançados

## 🐛 Debugging e Logs

### Console Logs

```javascript
// Logs estruturados
console.log("[SGL]", "Ação do usuário:", {
  userId: user.uid,
  action: "create_motorista",
  timestamp: new Date(),
});
```

### Error Handling

```javascript
// Tratamento de erros centralizado
try {
  // Operação
} catch (error) {
  console.error("[SGL Error]", error);
  showNotification("Erro na operação", "error");
}
```

## 📈 Performance

### Otimizações

- Lazy loading de componentes
- Memoização com React.memo
- Code splitting
- Bundle optimization

### Métricas

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

## 🔧 Manutenção

### Backup

- Backup automático do Firestore
- Versionamento de dados
- Recuperação de desastres

### Updates

- Atualizações automáticas
- Versionamento semântico
- Rollback capability

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025  
**Desenvolvedor**: João Victor Silva Ferreira
