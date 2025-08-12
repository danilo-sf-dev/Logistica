# Pacote Configurações

Este pacote contém os componentes e lógica relacionados às configurações do sistema e perfil do usuário.

## Estrutura

```
configuracoes/
├── config/
│   └── tabs.ts                    # Configuração das abas
├── state/
│   └── useConfiguracoes.ts        # Hook para gerenciar estado
├── ui/
│   ├── ConfiguracoesTabs.tsx      # Componente de abas
│   ├── PerfilForm.tsx             # Formulário de perfil
│   ├── NotificacoesForm.tsx       # Formulário de notificações
│   ├── SistemaForm.tsx            # Formulário do sistema
│   └── SegurancaForm.tsx          # Formulário de segurança
├── pages/
│   └── ConfiguracoesPage.tsx      # Página principal
├── types.ts                       # Definições de tipos
├── Configuracoes.tsx              # Componente principal
├── index.ts                       # Exportações do pacote
├── index.tsx                      # Ponto de entrada
└── README.md                      # Esta documentação
```

## Componentes

### Configuracoes

Componente principal que renderiza a página de configurações.

```tsx
import Configuracoes from "./components/configuracoes";

<Configuracoes />;
```

### ConfiguracoesPage

Página principal que orquestra todos os formulários de configuração.

```tsx
import { ConfiguracoesPage } from "./components/configuracoes";

<ConfiguracoesPage />;
```

### ConfiguracoesTabs

Componente de navegação por abas.

```tsx
import { ConfiguracoesTabs } from "./components/configuracoes";

<ConfiguracoesTabs
  tabs={configTabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>;
```

### PerfilForm

Formulário para edição do perfil do usuário.

```tsx
import { PerfilForm } from "./components/configuracoes";

<PerfilForm
  data={perfilData}
  errors={errors}
  loading={loading}
  onSubmit={handlePerfilSubmit}
  onChange={handlePerfilChange}
/>;
```

### NotificacoesForm

Formulário para configurações de notificações.

```tsx
import { NotificacoesForm } from "./components/configuracoes";

<NotificacoesForm config={notificacoes} onChange={handleNotificacoesChange} />;
```

### SistemaForm

Formulário para configurações do sistema.

```tsx
import { SistemaForm } from "./components/configuracoes";

<SistemaForm config={sistema} onChange={handleSistemaChange} />;
```

### SegurancaForm

Formulário para informações de segurança.

```tsx
import { SegurancaForm } from "./components/configuracoes";

<SegurancaForm userProfile={userProfile} />;
```

## Hooks

### useConfiguracoes

Hook principal para gerenciar o estado das configurações.

```tsx
import { useConfiguracoes } from "./components/configuracoes";

const {
  activeTab,
  setActiveTab,
  loading,
  errors,
  perfilData,
  notificacoes,
  sistema,
  handlePerfilSubmit,
  handlePerfilChange,
  handleNotificacoesChange,
  handleSistemaChange,
} = useConfiguracoes();
```

## Configuração

### Abas

As abas são configuradas através do arquivo `config/tabs.ts`:

```tsx
import { configTabs } from "./components/configuracoes";

const tabs = configTabs;
```

## Tipos

### PerfilData

```tsx
interface PerfilData {
  displayName: string;
  email: string;
  telefone: string;
  cargo: string;
}
```

### NotificacoesConfig

```tsx
interface NotificacoesConfig {
  email: boolean;
  push: boolean;
  rotas: boolean;
  folgas: boolean;
  manutencao: boolean;
}
```

### SistemaConfig

```tsx
interface SistemaConfig {
  idioma: string;
  timezone: string;
  backup: boolean;
}
```

### ConfigTab

```tsx
interface ConfigTab {
  id: string;
  name: string;
  icon: LucideIcon;
}
```

## Funcionalidades

### Perfil do Usuário

- Edição de informações pessoais
- Validação de email e telefone
- Conversão automática para maiúsculas
- Integração com Firebase Auth

### Notificações

- Configuração de notificações por email
- Configuração de notificações push
- Notificações específicas por módulo
- Toggles interativos

### Sistema

- Seleção de idioma
- Configuração de fuso horário
- Backup automático
- Configurações globais

### Segurança

- Informações de sessão
- Último login
- Informações do dispositivo
- Encerramento de sessões

## Validações

### Perfil

- Email válido
- Telefone no formato brasileiro
- Campos obrigatórios
- Validação em tempo real

## Boas Práticas

1. **Separação de Responsabilidades**: Cada componente tem uma função específica
2. **Reutilização**: Componentes são modulares e reutilizáveis
3. **Tipagem**: Todos os componentes são tipados com TypeScript
4. **Validação**: Validação robusta de formulários
5. **Feedback**: Notificações de sucesso e erro
6. **Acessibilidade**: Componentes seguem boas práticas de acessibilidade

## Uso

```tsx
import Configuracoes, { useConfiguracoes } from "./components/configuracoes";

function App() {
  return (
    <div>
      <Configuracoes />
    </div>
  );
}
```
