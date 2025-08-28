# 🔄 Migração para Vite - Variáveis de Ambiente

## 📋 **Resumo da Mudança**

O projeto foi migrado de Create React App (CRA) para **Vite**, resultando na mudança do prefixo das variáveis de ambiente de `REACT_APP_` para `VITE_`.

## 🔧 **Mudanças Realizadas**

### **1. Variáveis de Ambiente**

**Antes (CRA):**

```env
REACT_APP_FIREBASE_API_KEY=sua-chave-aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Depois (Vite):**

```env
VITE_FIREBASE_API_KEY=sua-chave-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_VAPID_PUBLIC_KEY=sua-vapid-key-aqui
```

### **2. Configuração do Vite**

**Arquivo:** `vite.config.ts`

```typescript
define: {
  global: "globalThis",
  // Expor variáveis de ambiente com prefixo VITE_
  "process.env": Object.keys(env).reduce(
    (prev, key) => {
      if (key.startsWith("VITE_")) {
        prev[key] = env[key];
      }
      return prev;
    },
    {} as Record<string, string>
  ),
},
```

### **3. Configuração do Firebase**

**Arquivo:** `src/firebase/config.ts`

```typescript
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

## 🚀 **Como Atualizar Seu Projeto**

### **1. Atualizar Arquivo .env**

Se você já tem um arquivo `.env`, execute:

```bash
# Script para converter automaticamente
node fix-env.js
```

Ou manualmente, substitua todas as ocorrências de `REACT_APP_` por `VITE_`.

### **2. Verificar Configurações**

1. **Vite Config:** Verificar se `vite.config.ts` está configurado corretamente
2. **Firebase Config:** Verificar se `src/firebase/config.ts` usa `process.env.VITE_*`
3. **Scripts:** Verificar se `package.json` usa comandos do Vite

### **3. Testar Aplicação**

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📝 **Arquivos Atualizados**

- ✅ `vite.config.ts` - Configuração do Vite
- ✅ `src/firebase/config.ts` - Configuração do Firebase
- ✅ `setup-firebase.js` - Script de configuração
- ✅ `setup.js` - Script de setup
- ✅ `docs/INSTALACAO_DEV.md` - Documentação de instalação
- ✅ `docs/CONTRIBUICAO.md` - Guia de contribuição
- ✅ `README.md` - Documentação principal

## 🔒 **Segurança**

- ✅ Todas as credenciais usam dados fictícios na documentação
- ✅ Arquivo `.env` está no `.gitignore`
- ✅ Scripts de configuração atualizados
- ✅ Documentação sem exposição de dados reais

## ⚠️ **Importante**

1. **Nunca commite** o arquivo `.env` no Git
2. **Use credenciais diferentes** para desenvolvimento e produção
3. **Mantenha as chaves seguras** e não as exponha publicamente
4. **Atualize a documentação** se fizer mudanças nas variáveis

## 🆘 **Solução de Problemas**

### **Erro: "Firebase: Error (auth/invalid-api-key)"**

1. Verificar se o arquivo `.env` existe
2. Verificar se as variáveis usam prefixo `VITE_`
3. Reiniciar o servidor de desenvolvimento
4. Verificar se as credenciais estão corretas

### **Erro: "process.env is not defined"**

1. Verificar configuração do `vite.config.ts`
2. Verificar se as variáveis começam com `VITE_`
3. Reiniciar o servidor de desenvolvimento

## 📚 **Referências**

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Configuration](https://firebase.google.com/docs/web/setup)
- [React Router v6 Migration](https://reactrouter.com/docs/en/v6/upgrading/v5)
