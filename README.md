# SGL - Sistema de Gestão de Logística

Sistema web completo para gestão de logística, desenvolvido com React e Firebase.

## 🚀 **STATUS: ✅ FUNCIONANDO PERFEITAMENTE!**

**🌐 URL do Sistema:** https://logistica-c7afc.web.app  
**🔐 Login:** Funcionando com Google Authentication  
**📊 Dashboard:** Totalmente operacional  
**🚛 Módulos:** Todos funcionando

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com KPIs e gráficos
- **Gestão de Motoristas**: CRUD completo de motoristas
- **Gestão de Veículos**: Controle de frota
- **Rotas**: Otimização e gestão de rotas
- **Folgas**: Controle de folgas dos motoristas
- **Cidades**: Cadastro de cidades
- **Vendedores**: Gestão de vendedores
- **Relatórios**: Relatórios detalhados e analytics
- **Autenticação**: Login com Google e Email/Senha
- **Notificações**: Sistema de notificações em tempo real

## 🛠️ Tecnologias

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta Google (para Firebase)

## 🔧 Instalação e Configuração

### 1. Clone e Instale as Dependências

```bash
# Instalar dependências
npm install
```

### 2. Configure as Variáveis de Ambiente

**IMPORTANTE:** Por segurança, as credenciais do Firebase devem estar em variáveis de ambiente.

1. **Copie o arquivo de exemplo:**

```bash
cp env.example .env
```

2. **Edite o arquivo `.env`** com suas credenciais do Firebase:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
REACT_APP_FIREBASE_APP_ID=seu-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

**⚠️ Segurança:** Nunca commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

### 3. Configure o Firebase

#### Opção A: Configuração Automática (Recomendado)

```bash
npm run setup-firebase
```

Siga as instruções do script para:

1. Habilitar autenticação Google no Firebase Console
2. Adicionar aplicação web
3. Configurar Firestore Database
4. Colear as credenciais automaticamente

#### Opção B: Configuração Manual

1. **Firebase Console**: https://console.firebase.google.com
2. **Criar Projeto**: "Logistica"
3. **Authentication**: Habilitar Google Sign-in
4. **Firestore Database**: Criar em modo teste
5. **Aplicação Web**: Adicionar e copiar credenciais
6. **Atualizar**: `src/firebase/config.js` com suas credenciais

### 4. Execute o Projeto

```bash
npm start
```

Acesse: http://localhost:3000

### 5. Comandos de Formatação e Linting

```bash
# Verificar e corrigir problemas do ESLint
npm run lint

# Formatar código com Prettier
npm run format

# Verificar formatação sem alterar
npm run format:check

# Corrigir todos os warnings do ESLint
npm run lint:fix
```

**Nota:** O projeto está configurado com ESLint e Prettier para manter a qualidade do código.

## 🚀 Deploy

### Deploy no Firebase Hosting

```bash
# Build do projeto
npm run build

# Deploy
npm run deploy
```

### Configuração de Domínio

1. Firebase Console → Hosting
2. Adicionar domínio personalizado
3. Configurar DNS

## 🔐 Autenticação

O sistema suporta dois métodos de login:

### Login com Google (Recomendado)

- Mais seguro e conveniente
- Informações automáticas do perfil
- Padrão empresarial

### Login com Email/Senha

- Método tradicional
- Útil como fallback

## 👥 Roles e Permissões

- **admin**: Acesso total ao sistema
- **gerente**: Gestão de operações
- **dispatcher**: Controle de rotas
- **user**: Visualização básica

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── layout/         # Layout e navegação
│   ├── motoristas/     # Gestão de motoristas
│   ├── veiculos/       # Gestão de veículos
│   ├── rotas/          # Gestão de rotas
│   ├── folgas/         # Controle de folgas
│   ├── cidades/        # Cadastro de cidades
│   ├── vendedores/     # Gestão de vendedores
│   ├── relatorios/     # Relatórios
│   └── configuracao/   # Configurações
├── contexts/           # Contextos React
├── firebase/           # Configuração Firebase
├── hooks/              # Custom hooks
├── utils/              # Utilitários
└── App.js              # Componente principal
```

## 📱 Recursos Avançados

### Notificações Push

- Firebase Cloud Messaging
- Notificações em tempo real
- Suporte a múltiplos dispositivos

### Otimização de Rotas

- Integração com Google Maps API
- Algoritmos de otimização
- Visualização de rotas

### Analytics

- Relatórios detalhados
- Gráficos interativos
- Exportação de dados

## 🔧 Scripts Disponíveis

```bash
npm start              # Iniciar servidor de desenvolvimento
npm run build          # Build para produção
npm run test           # Executar testes
npm run setup          # Configuração inicial
npm run setup-firebase # Configuração do Firebase
npm run deploy         # Deploy no Firebase
```

## 🎯 Como Usar o Sistema

### 1. Acesse o Sistema

- **URL**: https://logistica-c7afc.web.app
- **Login**: Use sua conta Google (recomendado)

### 2. Configure um Usuário Admin

1. Faça login pela primeira vez
2. Vá em **Firebase Console → Firestore Database**
3. Encontre o documento do usuário na coleção `users`
4. Altere o campo `role` para `"admin"`

### 3. Comece a Usar

- **Dashboard**: Veja KPIs e gráficos
- **Motoristas**: Adicione motoristas da equipe
- **Veículos**: Cadastre a frota
- **Rotas**: Crie rotas de entrega
- **Relatórios**: Analise dados

## 🐛 Troubleshooting

### Erro de Autenticação

- Verificar configuração do Firebase
- Confirmar domínios autorizados
- Verificar regras do Firestore

### Erro de Build

- Limpar cache: `npm run build -- --reset-cache`
- Verificar dependências: `npm install`

### Problemas de CORS

- Configurar domínios no Firebase Console
- Verificar configuração de hosting

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar documentação do Firebase
2. Consultar logs do console
3. Verificar configurações de segurança

## 📄 Licença

Este projeto é desenvolvido para uso interno da empresa.

## 🎉 Status do Projeto

### ✅ Concluído

- [x] Sistema base completo
- [x] Autenticação Google funcionando
- [x] Módulos principais operacionais
- [x] Dashboard com gráficos
- [x] CRUD completo para todas as entidades
- [x] Deploy no Firebase
- [x] Sistema online e funcionando
- [x] Login com Google testado e aprovado
- [x] Firestore Database configurado
- [x] Domínios autorizados configurados

### 🔄 Próximas Melhorias

- [ ] Integração com Google Maps
- [ ] App mobile (React Native)
- [ ] Integração com sistemas ERP
- [ ] Relatórios avançados
- [ ] Machine Learning para otimização

## 🚀 Configuração Final Realizada

### Firebase Console

- ✅ Projeto "logistica-c7afc" criado
- ✅ Google Authentication habilitado
- ✅ Firestore Database criado em modo teste
- ✅ Domínios autorizados configurados
- ✅ Aplicação web registrada

### Credenciais Configuradas

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCPDNlWXv_M7NlAX0kphleDCxug7eJ3TcQ",
  authDomain: "logistica-c7afc.firebaseapp.com",
  projectId: "logistica-c7afc",
  storageBucket: "logistica-c7afc.firebasestorage.app",
  messagingSenderId: "744598379245",
  appId: "1:744598379245:web:7432cd7d659f8ee7774ae4",
  measurementId: "G-98ZBQM67V5",
};
```

### Deploy

- ✅ Build otimizado realizado
- ✅ Firebase Hosting configurado
- ✅ Sistema online em https://logistica-c7afc.web.app

---

**🌐 Sistema Online:** https://logistica-c7afc.web.app  
**🔐 Login Testado:** ✅ Funcionando  
**📊 Dashboard Operacional:** ✅ Funcionando  
**Desenvolvido com ❤️ para otimizar a logística empresarial**
