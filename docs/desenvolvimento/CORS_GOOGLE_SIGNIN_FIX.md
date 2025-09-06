# Correção do Problema de CORS com Google Sign-In

## Problema Identificado

O erro `Cross-Origin-Opener-Policy policy would block the window.closed call` ocorre quando o navegador bloqueia a comunicação entre janelas devido às políticas de segurança CORS (Cross-Origin Resource Sharing) e COOP (Cross-Origin-Opener-Policy).

## Soluções Implementadas

### 1. Configuração do Vite (vite.config.ts)

Adicionados headers de segurança no servidor de desenvolvimento:

```typescript
server: {
  headers: {
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Embedder-Policy": "unsafe-none",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer-when-downgrade",
  },
}
```

### 2. Atualização do AuthContext.tsx

Implementado sistema inteligente de detecção e fallback:

- **Detecção automática**: Utilitário `copDetection.ts` detecta problemas de COOP
- **Método inteligente**: Escolhe automaticamente entre popup e redirect baseado na detecção
- **Fallback robusto**: Se popup falhar, automaticamente usa redirect
- **Tratamento de resultado**: Processa o resultado do redirect no `useEffect`

### 3. Meta Tags de Segurança (index.html)

Adicionadas meta tags para configurar políticas de segurança:

```html
<meta
  http-equiv="Cross-Origin-Opener-Policy"
  content="same-origin-allow-popups"
/>
<meta http-equiv="Cross-Origin-Embedder-Policy" content="unsafe-none" />
<meta http-equiv="Referrer-Policy" content="no-referrer-when-downgrade" />
```

### 4. Utilitário de Detecção de COOP (src/utils/copDetection.ts)

Criado utilitário para detectar automaticamente problemas de COOP:

- **Desenvolvimento**: Força uso de redirect em ambiente de desenvolvimento
- **Detecção de navegador**: Identifica navegadores com problemas conhecidos (Chrome 120+, Edge 139+)
- **Teste de popup**: Verifica se popups são bloqueados
- **Configurações de segurança**: Detecta ambientes com configurações restritivas
- **Recomendação automática**: Sugere o melhor método de login

### 5. Tratamento de Erros no Login

Atualizado o componente Login para tratar adequadamente o erro de redirect:

```typescript
if (error.message === "REDIRECT_INITIATED") {
  showNotification("Redirecionando para login com Google...", "info");
  return; // Não mostrar erro, pois o redirect foi iniciado
}
```

## Configurações de Produção

Para produção, certifique-se de que seu servidor web configure os seguintes headers:

### Apache (.htaccess)

```apache
Header set Cross-Origin-Opener-Policy "same-origin-allow-popups"
Header set Cross-Origin-Embedder-Policy "unsafe-none"
Header set Referrer-Policy "no-referrer-when-downgrade"
```

### Nginx

```nginx
add_header Cross-Origin-Opener-Policy "same-origin-allow-popups";
add_header Cross-Origin-Embedder-Policy "unsafe-none";
add_header Referrer-Policy "no-referrer-when-downgrade";
```

### Content Security Policy (Opcional)

Para maior segurança, considere implementar CSP:

```
Content-Security-Policy:
  default-src 'self' https://accounts.google.com/gsi/;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com/gsi/client;
  style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style;
  frame-src 'self' https://accounts.google.com/gsi/;
  connect-src 'self' https://accounts.google.com/gsi/;
```

## Testando as Correções

1. **Reinicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Teste o login com Google**:
   - Tente fazer login com Google
   - Verifique se não há mais erros de COOP no console
   - Se o popup falhar, o sistema deve automaticamente redirecionar

3. **Verifique os headers**:
   - Abra as ferramentas de desenvolvedor
   - Vá para a aba Network
   - Recarregue a página
   - Verifique se os headers COOP estão sendo enviados

## Referências

- [Google Identity - Cross Origin Opener Policy](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=pt-br#cross_origin_opener_policy)
- [Firebase Auth - Sign In with Redirect](https://firebase.google.com/docs/auth/web/google-signin#sign_in_with_redirect)
- [MDN - Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)

## Notas Importantes

- As configurações de COOP podem afetar outras funcionalidades que dependem de popups
- Teste todas as funcionalidades após implementar as mudanças
- Em produção, monitore os logs para garantir que não há problemas relacionados
- Considere implementar CSP para maior segurança, mas teste cuidadosamente
