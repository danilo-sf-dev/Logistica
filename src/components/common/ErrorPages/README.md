# Páginas de Erro - SGL

Este diretório contém as páginas de erro personalizadas para o Sistema de Gestão de Logística.

## 📁 Estrutura

```
ErrorPages/
├── ErrorPage.tsx          # Componente base para todas as páginas de erro
├── NotFoundPage.tsx       # Erro 404 - Página não encontrada
├── BadRequestPage.tsx     # Erro 400 - Requisição inválida
├── UnauthorizedPage.tsx   # Erro 401 - Não autorizado
├── ForbiddenPage.tsx      # Erro 403 - Acesso proibido
├── ServerErrorPage.tsx    # Erro 500 - Erro interno do servidor
└── index.ts              # Exportações
```

## 🚀 Como Usar

### 1. Importação

```tsx
import {
  NotFoundPage,
  BadRequestPage,
  UnauthorizedPage,
  ForbiddenPage,
  ServerErrorPage,
} from "../components/common/ErrorPages";
```

### 2. Uso Direto em Rotas

```tsx
import { Routes, Route } from "react-router-dom";
import { NotFoundPage, ServerErrorPage } from "../components/common/ErrorPages";

<Routes>
  {/* Suas rotas normais */}
  <Route path="/dashboard" element={<Dashboard />} />

  {/* Rotas de erro */}
  <Route path="/error/404" element={<NotFoundPage />} />
  <Route path="/error/500" element={<ServerErrorPage />} />

  {/* Rota catch-all para 404 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>;
```

### 3. Uso com Error Boundary

```tsx
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { ServerErrorPage } from "../components/common/ErrorPages";

<ErrorBoundary fallback={<ServerErrorPage />}>
  <YourComponent />
</ErrorBoundary>;
```

### 4. Uso com Hook de Erro

```tsx
import { useErrorHandler } from "../../hooks/useErrorHandler";

const MyComponent = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  const handleSomeAction = async () => {
    try {
      // Sua lógica aqui
      await someAsyncOperation();
    } catch (error) {
      handleError(error, {
        showNotification: true,
        redirectToErrorPage: true,
        errorPageType: "500",
      });
    }
  };

  // Ou usando o wrapper assíncrono
  const result = await handleAsyncError(() => someAsyncOperation(), {
    showNotification: true,
    redirectToErrorPage: false,
  });
};
```

## 🎨 Personalização

### Componente Base ErrorPage

O componente `ErrorPage` aceita as seguintes props:

```tsx
interface ErrorPageProps {
  code: string; // Código do erro (ex: "404")
  title: string; // Título da página
  message: string; // Mensagem principal
  description?: string; // Descrição adicional
  icon?: React.ReactNode; // Ícone personalizado
  showHomeButton?: boolean; // Mostrar botão "Ir para Dashboard"
  showBackButton?: boolean; // Mostrar botão "Voltar"
  showRefreshButton?: boolean; // Mostrar botão "Recarregar"
  className?: string; // Classes CSS adicionais
}
```

### Exemplo de Página Personalizada

```tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const CustomErrorPage: React.FC = () => {
  return (
    <ErrorPage
      code="999"
      title="Erro Personalizado"
      message="Esta é uma mensagem personalizada"
      description="Descrição adicional do erro"
      icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
      showHomeButton={true}
      showBackButton={false}
      showRefreshButton={true}
      className="bg-red-50"
    />
  );
};
```

## 🔧 Configuração

### Rotas Configuradas

As seguintes rotas estão configuradas no `App.tsx`:

- `/error/400` - Bad Request
- `/error/401` - Unauthorized
- `/error/403` - Forbidden
- `/error/404` - Not Found
- `/error/500` - Server Error

### Error Boundary Global

O `ErrorBoundary` está configurado globalmente no `App.tsx` para capturar erros de JavaScript não tratados.

## 📱 Responsividade

Todas as páginas de erro são responsivas e funcionam bem em dispositivos móveis e desktop.

## 🎯 Boas Práticas

1. **Use o Error Boundary** para capturar erros de JavaScript
2. **Use o hook useErrorHandler** para tratamento consistente de erros
3. **Personalize as mensagens** para serem amigáveis ao usuário
4. **Não exponha detalhes técnicos** nas mensagens de erro
5. **Sempre forneça uma ação** para o usuário (voltar, recarregar, etc.)

## 🔍 Debugging

Para debugging, os erros são logados no console com o prefixo `[SGL Error]`. Em produção, você pode integrar com serviços como Sentry ou LogRocket.
