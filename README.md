# Sistema de Gestão de Logística (SGL)

Um sistema completo de gestão logística desenvolvido em React com Firebase, focado nas operações de Frigorífico e Ovos.

## 🚀 Funcionalidades

### Módulos Principais

- **Dashboard**: Visão geral com KPIs e gráficos em tempo real
- **Motoristas**: Gestão completa de motoristas com status e informações
- **Veículos**: Controle da frota com manutenção e status
- **Rotas**: Planejamento e acompanhamento de rotas de entrega
- **Folgas**: Gestão de solicitações de folgas e férias
- **Cidades**: Cadastro de cidades atendidas
- **Vendedores**: Gestão da equipe comercial
- **Relatórios**: Análises detalhadas com gráficos e exportação
- **Configurações**: Preferências do usuário e sistema

### Características Técnicas

- ✅ Interface moderna e responsiva
- ✅ Autenticação segura com Firebase Auth
- ✅ Banco de dados em tempo real (Firestore)
- ✅ Notificações push
- ✅ Gráficos interativos
- ✅ Sistema de permissões
- ✅ Otimização de rotas (preparado para Google Maps API)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, React Router, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Functions, Hosting)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast
- **Maps**: Google Maps Platform (preparado)

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no Firebase Console
- Google Maps API Key (opcional)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd sistema-gestao-logistica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

#### 3.1 Crie um projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos para criar o projeto

#### 3.2 Configure os serviços

1. **Authentication**: Ative o provedor Email/Senha
2. **Firestore Database**: Crie o banco de dados
3. **Hosting**: Configure o hosting (opcional)
4. **Functions**: Ative as Cloud Functions (opcional)

#### 3.3 Obtenha as credenciais

1. Vá em Configurações do Projeto > Geral
2. Role até "Seus aplicativos" e clique em "Adicionar app"
3. Escolha Web e registre o app
4. Copie as credenciais

#### 3.4 Configure o arquivo de configuração

Edite o arquivo `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id",
};
```

### 4. Configure as regras do Firestore

No Firebase Console, vá em Firestore Database > Regras e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Dados do sistema - apenas usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Execute o projeto

```bash
npm start
```

O sistema estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── motoristas/     # Gestão de motoristas
│   ├── veiculos/       # Gestão de veículos
│   ├── rotas/          # Gestão de rotas
│   ├── folgas/         # Gestão de folgas
│   ├── cidades/        # Gestão de cidades
│   ├── vendedores/     # Gestão de vendedores
│   ├── relatorios/     # Relatórios e análises
│   ├── configuracoes/  # Configurações do sistema
│   └── layout/         # Layout principal
├── contexts/           # Contextos React
├── firebase/           # Configuração Firebase
└── App.js             # Componente principal
```

## 🔐 Primeiro Acesso

1. Acesse o sistema pela primeira vez
2. O sistema redirecionará para a tela de login
3. Como não há usuários cadastrados, você precisará criar o primeiro usuário

### Criando o primeiro usuário administrador

No Firebase Console:

1. Vá em Authentication > Users
2. Clique em "Adicionar usuário"
3. Digite email e senha
4. No Firestore, crie um documento na coleção `users`:

```javascript
{
  uid: "ID_DO_USUARIO_CRIADO",
  email: "admin@empresa.com",
  displayName: "Administrador",
  role: "admin",
  createdAt: Timestamp.now(),
  lastLogin: Timestamp.now()
}
```

## 🚀 Deploy

### Deploy no Firebase Hosting

1. Instale o Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Faça login:

```bash
firebase login
```

3. Inicialize o projeto:

```bash
firebase init hosting
```

4. Build do projeto:

```bash
npm run build
```

5. Deploy:

```bash
firebase deploy
```

## 📊 Configuração do Google Maps (Opcional)

Para usar a otimização de rotas:

1. Obtenha uma API Key no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a Maps JavaScript API e Directions API
3. Configure no arquivo de configuração do Firebase

## 🔧 Personalização

### Cores e Tema

Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#sua-cor-primaria',
        // ... outras variações
      }
    }
  }
}
```

### Logo e Branding

- Substitua o ícone do caminhão em `src/components/layout/Layout.js`
- Atualize o título no `public/index.html`

## 📈 Monitoramento e Analytics

O sistema está preparado para integração com:

- Google Analytics
- Firebase Analytics
- Sentry (para monitoramento de erros)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:

- Email: suporte@empresa.com
- Documentação: [Link para documentação]
- Issues: [Link para issues do GitHub]

## 🔄 Atualizações

### v1.0.0

- ✅ Sistema base completo
- ✅ Módulos principais implementados
- ✅ Autenticação e autorização
- ✅ Dashboard com gráficos
- ✅ CRUD completo para todas as entidades

### Próximas versões

- 🔄 Integração com Google Maps
- 🔄 App mobile (React Native)
- 🔄 Integração com sistemas ERP
- 🔄 Relatórios avançados
- 🔄 Machine Learning para otimização

---

**Desenvolvido por João Victor Silva Ferreira**  
_Analista de Logística_
