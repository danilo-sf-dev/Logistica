# LoadingButton Component

Componente de botão com estado de loading baseado no **Modelo 2: Spinner Substituindo Texto**.

## 🎯 Características

- ✅ **Tamanho consistente**: O botão mantém o mesmo tamanho durante o loading
- ✅ **Visual limpo**: Spinner substitui completamente o texto
- ✅ **Previne cliques duplos**: Botão fica desabilitado durante o loading
- ✅ **Múltiplas variantes**: Primary, Secondary, Danger, Success
- ✅ **Múltiplos tamanhos**: Small, Medium, Large
- ✅ **Totalmente tipado**: TypeScript completo

## 📦 Instalação

```tsx
import LoadingButton from "../components/common/LoadingButton";
```

## 🚀 Uso Básico

```tsx
import React, { useState } from "react";
import LoadingButton from "../components/common/LoadingButton";

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton loading={loading} onClick={handleSave}>
      Salvar
    </LoadingButton>
  );
};
```

## 🎨 Variantes

### Primary (Padrão)

```tsx
<LoadingButton variant="primary" loading={loading}>
  Salvar
</LoadingButton>
```

### Secondary

```tsx
<LoadingButton variant="secondary" loading={loading}>
  Cancelar
</LoadingButton>
```

### Danger

```tsx
<LoadingButton variant="danger" loading={loading}>
  Excluir
</LoadingButton>
```

### Success

```tsx
<LoadingButton variant="success" loading={loading}>
  Aprovar
</LoadingButton>
```

## 📏 Tamanhos

### Small

```tsx
<LoadingButton size="sm" loading={loading}>
  Salvar
</LoadingButton>
```

### Medium (Padrão)

```tsx
<LoadingButton size="md" loading={loading}>
  Salvar
</LoadingButton>
```

### Large

```tsx
<LoadingButton size="lg" loading={loading}>
  Salvar
</LoadingButton>
```

## 🔧 Props

| Prop        | Tipo                                                | Padrão      | Descrição                  |
| ----------- | --------------------------------------------------- | ----------- | -------------------------- |
| `loading`   | `boolean`                                           | `false`     | Estado de loading do botão |
| `children`  | `ReactNode`                                         | -           | Conteúdo do botão          |
| `onClick`   | `() => void`                                        | -           | Função executada ao clicar |
| `disabled`  | `boolean`                                           | `false`     | Estado desabilitado        |
| `className` | `string`                                            | `""`        | Classes CSS adicionais     |
| `type`      | `'button' \| 'submit' \| 'reset'`                   | `'button'`  | Tipo do botão              |
| `variant`   | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Variante visual            |
| `size`      | `'sm' \| 'md' \| 'lg'`                              | `'md'`      | Tamanho do botão           |

## 💡 Exemplos de Uso

### Formulário com Submit

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    await api.submitForm(formData);
  } finally {
    setLoading(false);
  }
};

<form onSubmit={handleSubmit}>
  {/* campos do formulário */}
  <LoadingButton type="submit" loading={loading} variant="primary" size="lg">
    Enviar Formulário
  </LoadingButton>
</form>;
```

### Ações em Tabela

```tsx
const handleDelete = async (id: string) => {
  setLoading(true);
  try {
    await api.deleteItem(id);
    // Atualizar lista
  } finally {
    setLoading(false);
  }
};

<LoadingButton
  loading={loading}
  onClick={() => handleDelete(item.id)}
  variant="danger"
  size="sm"
>
  Excluir
</LoadingButton>;
```

### Exportação

```tsx
const handleExport = async () => {
  setLoading(true);
  try {
    await api.exportData();
  } finally {
    setLoading(false);
  }
};

<LoadingButton
  loading={loading}
  onClick={handleExport}
  variant="secondary"
  size="md"
>
  Exportar Excel
</LoadingButton>;
```

## 🎨 Estilos

O componente usa as classes do Tailwind CSS e segue o design system do projeto:

- **Cores**: Usa as cores primárias definidas no tema
- **Animações**: Spinner com `animate-spin`
- **Estados**: Hover, focus, disabled
- **Responsivo**: Funciona em todos os tamanhos de tela

## 🔄 Migração

Para migrar botões existentes:

### Antes

```tsx
<button onClick={handleSave} disabled={loading} className="btn-primary">
  {loading ? "Salvando..." : "Salvar"}
</button>
```

### Depois

```tsx
<LoadingButton loading={loading} onClick={handleSave} variant="primary">
  Salvar
</LoadingButton>
```

## 📝 Notas

- O componente automaticamente desabilita o botão durante o loading
- O spinner substitui completamente o texto para manter consistência visual
- Todas as variantes seguem o mesmo padrão de loading
- Compatível com formulários (type="submit")
- Totalmente acessível com suporte a teclado
