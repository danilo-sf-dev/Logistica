# Pacote Layout

Este pacote contém os componentes e lógica relacionados ao layout principal da aplicação.

## Estrutura

```
layout/
├── config/
│   └── navigation.ts          # Configuração da navegação
├── state/
│   └── useLayout.ts           # Hook para gerenciar estado do layout
├── ui/
│   ├── Sidebar.tsx            # Componente da barra lateral
│   ├── Header.tsx             # Componente do cabeçalho mobile
│   └── MainContent.tsx        # Componente do conteúdo principal
├── types.ts                   # Definições de tipos
├── Layout.tsx                 # Componente principal do layout
├── index.ts                   # Exportações do pacote
├── index.tsx                  # Ponto de entrada
└── README.md                  # Esta documentação
```

## Componentes

### Layout

Componente principal que orquestra todo o layout da aplicação.

```tsx
import Layout from "./components/layout";

<Layout config={{ title: "Minha App" }} />;
```

### Sidebar

Componente da barra lateral responsiva.

```tsx
import { Sidebar } from "./components/layout";

<Sidebar
  navigation={navigation}
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  userProfile={userProfile}
  onLogout={handleLogout}
/>;
```

### Header

Componente do cabeçalho para dispositivos móveis.

```tsx
import { Header } from "./components/layout";

<Header onMenuClick={toggleSidebar} title="Título da Página" />;
```

### MainContent

Componente que encapsula a área principal de conteúdo.

```tsx
import { MainContent } from "./components/layout";

<MainContent>
  <Outlet />
</MainContent>;
```

## Hooks

### useLayout

Hook personalizado para gerenciar o estado do layout.

```tsx
import { useLayout } from "./components/layout";

const { sidebarOpen, setSidebarOpen, handleLogout, toggleSidebar } =
  useLayout();
```

## Configuração

### Navegação

A navegação pode ser configurada através do arquivo `config/navigation.ts`:

```tsx
import { getNavigationByRole } from "./components/layout";

const navigation = getNavigationByRole(userRole);
```

## Tipos

### NavigationItem

```tsx
interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  roles?: string[];
}
```

### LayoutConfig

```tsx
interface LayoutConfig {
  title: string;
  logo?: ReactNode;
  navigation: NavigationItem[];
  showUserProfile?: boolean;
  showLogout?: boolean;
  sidebarWidth?: string;
  mobileBreakpoint?: string;
}
```

## Boas Práticas

1. **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes são modulares e reutilizáveis
3. **Tipagem**: Todos os componentes são tipados com TypeScript
4. **Configurabilidade**: O layout é altamente configurável através de props
5. **Responsividade**: Suporte completo para dispositivos móveis e desktop
6. **Acessibilidade**: Componentes seguem boas práticas de acessibilidade

## Uso

```tsx
import Layout, { useLayout, getNavigationByRole } from "./components/layout";

function App() {
  const { userProfile } = useAuth();
  const navigation = getNavigationByRole(userProfile?.role);

  return (
    <Layout
      config={{
        title: "Sistema de Gestão Logística",
        navigation,
        showUserProfile: true,
        showLogout: true,
      }}
    />
  );
}
```
