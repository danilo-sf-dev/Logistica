# LoadingButton - Guia de Implementação

Este documento serve como referência para implementar o LoadingButton em todo o sistema de forma padronizada.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Componente LoadingButton](#componente-loadingbutton)
- [Padrão de Implementação](#padrão-de-implementação)
- [Exemplos Práticos](#exemplos-práticos)
- [Checklist de Implementação](#checklist-de-implementação)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O **LoadingButton** é um componente reutilizável que implementa o **Modelo 2: Spinner Substituindo Texto**, garantindo:

- ✅ **Tamanho consistente** durante o loading
- ✅ **Visual limpo** com spinner centralizado
- ✅ **Prevenção de cliques duplos**
- ✅ **Padronização** em todo o sistema

## 🧩 Componente LoadingButton

### Localização

```
src/components/common/LoadingButton.tsx
```

### Importação

```tsx
import LoadingButton from "../components/common/LoadingButton";
```

### Props Disponíveis

| Prop        | Tipo                                                | Padrão      | Descrição                  |
| ----------- | --------------------------------------------------- | ----------- | -------------------------- |
| `loading`   | `boolean`                                           | `false`     | Estado de loading          |
| `children`  | `ReactNode`                                         | -           | Conteúdo do botão          |
| `onClick`   | `() => void`                                        | -           | Função executada ao clicar |
| `disabled`  | `boolean`                                           | `false`     | Estado desabilitado        |
| `className` | `string`                                            | `""`        | Classes CSS adicionais     |
| `type`      | `'button' \| 'submit' \| 'reset'`                   | `'button'`  | Tipo do botão              |
| `variant`   | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Variante visual            |
| `size`      | `'sm' \| 'md' \| 'lg'`                              | `'md'`      | Tamanho do botão           |

### Variantes Disponíveis

```tsx
// Primary (padrão) - Para ações principais
<LoadingButton variant="primary" loading={loading}>
  Salvar
</LoadingButton>

// Secondary - Para ações secundárias
<LoadingButton variant="secondary" loading={loading}>
  Cancelar
</LoadingButton>

// Danger - Para ações perigosas
<LoadingButton variant="danger" loading={loading}>
  Excluir
</LoadingButton>

// Success - Para ações positivas
<LoadingButton variant="success" loading={loading}>
  Aprovar
</LoadingButton>
```

### Tamanhos Disponíveis

```tsx
// Small - Para ações em tabelas
<LoadingButton size="sm" loading={loading}>
  Editar
</LoadingButton>

// Medium (padrão) - Para formulários
<LoadingButton size="md" loading={loading}>
  Salvar
</LoadingButton>

// Large - Para ações principais
<LoadingButton size="lg" loading={loading}>
  Enviar Formulário
</LoadingButton>
```

## 🔄 Padrão de Implementação

### 1. Estado de Loading

```tsx
const [loading, setLoading] = useState(false);
```

### 2. Função com Loading

```tsx
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.saveData();
    showNotification("Salvo com sucesso!", "success");
  } catch (error) {
    showNotification("Erro ao salvar", "error");
  } finally {
    setLoading(false);
  }
};
```

### 3. Implementação do Botão

```tsx
<LoadingButton
  loading={loading}
  onClick={handleSubmit}
  variant="primary"
  size="md"
>
  Salvar
</LoadingButton>
```

## 💡 Exemplos Práticos

### Formulário de Criação/Edição

```tsx
// Antes
<button
  type="submit"
  disabled={loading}
  className="btn-primary"
>
  {loading ? "Salvando..." : "Salvar"}
</button>

// Depois
<LoadingButton
  type="submit"
  loading={loading}
  variant="primary"
  size="md"
>
  Salvar
</LoadingButton>
```

### Botão de Exclusão

```tsx
// Antes
<button
  onClick={handleDelete}
  disabled={loading}
  className="btn-danger"
>
  {loading ? "Excluindo..." : "Excluir"}
</button>

// Depois
<LoadingButton
  onClick={handleDelete}
  loading={loading}
  variant="danger"
  size="sm"
>
  Excluir
</LoadingButton>
```

### Botão de Exportação

```tsx
// Antes
<button
  onClick={handleExport}
  disabled={loading}
  className="btn-secondary"
>
  {loading ? "Exportando..." : "Exportar Excel"}
</button>

// Depois
<LoadingButton
  onClick={handleExport}
  loading={loading}
  variant="secondary"
  size="md"
>
  Exportar Excel
</LoadingButton>
```

### Botão de Aprovação

```tsx
// Antes
<button
  onClick={handleApprove}
  disabled={loading}
  className="btn-success"
>
  {loading ? "Aprovando..." : "Aprovar"}
</button>

// Depois
<LoadingButton
  onClick={handleApprove}
  loading={loading}
  variant="success"
  size="sm"
>
  Aprovar
</LoadingButton>
```

## 📝 Checklist de Implementação

### ✅ Preparação

- [ ] Importar o LoadingButton
- [ ] Criar estado de loading
- [ ] Identificar função que precisa de loading

### ✅ Implementação

- [ ] Adicionar setLoading(true) no início da função
- [ ] Adicionar setLoading(false) no finally
- [ ] Substituir botão pelo LoadingButton
- [ ] Definir variant apropriada
- [ ] Definir size apropriada

### ✅ Teste

- [ ] Verificar se o spinner aparece
- [ ] Verificar se o botão fica desabilitado
- [ ] Verificar se não há cliques duplos
- [ ] Testar em diferentes tamanhos de tela

## 🎨 Padrões por Contexto

### Formulários (Salvar/Atualizar)

```tsx
// Usando LoadingButton (quando já existe)
<LoadingButton type="submit" loading={loading} variant="primary" size="md">
  Salvar
</LoadingButton>

// Ou mantendo layout original
<button
  type="submit"
  disabled={loading}
  className="btn-primary flex items-center justify-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : null}
  Salvar
</button>
```

**Comportamento do Modal:**

- Modal permanece aberto durante loading
- Só fecha após sucesso da operação
- Em caso de erro, modal permanece aberto para nova tentativa

### Ações em Tabela (Editar/Excluir)

```tsx
// Usando LoadingButton (quando já existe)
<LoadingButton
  onClick={handleAction}
  loading={loading}
  variant="danger"
  size="sm"
>
  Excluir
</LoadingButton>

// Ou mantendo layout original
<button
  onClick={handleAction}
  disabled={loading}
  className="btn-danger flex items-center justify-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : null}
  Excluir
</button>
```

### Exportação/Importação

```tsx
// Botão principal (abre modal)
<button
  onClick={handleExportClick}
  className="btn-secondary"
>
  Exportar Excel
</button>

// Botão no modal (com loading)
<button
  onClick={handleExport}
  disabled={loading}
  className="btn-primary flex items-center justify-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : (
    <Download className="h-4 w-4 mr-2" />
  )}
  Exportar Excel
</button>
```

**Comportamento do Modal:**

- Modal permanece aberto durante exportação
- Só fecha após sucesso da operação
- Em caso de erro, modal permanece aberto para nova tentativa

### Aprovação/Rejeição

```tsx
// Botão no modal de confirmação
<button
  onClick={handleApprove}
  disabled={loading}
  className="btn-success flex items-center justify-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : null}
  Aprovar
</button>
```

**Comportamento do Modal:**

- Modal permanece aberto durante confirmação
- Só fecha após sucesso da operação
- Em caso de erro, modal permanece aberto para nova tentativa

### Importação

```tsx
// Botão de download template
<button
  onClick={handleDownloadTemplate}
  disabled={loading}
  className="btn-primary flex items-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : (
    <Download className="h-4 w-4 mr-2" />
  )}
  Baixar Template Excel
</button>

// Botão de importar dados
<button
  onClick={handleImport}
  disabled={loadingImport}
  className="btn-primary flex items-center justify-center"
>
  {loadingImport ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  ) : null}
  Importar Dados
</button>
```

## 🔧 Troubleshooting

### Problema: Spinner não aparece

**Solução:** Verificar se o estado `loading` está sendo atualizado corretamente

```tsx
// ❌ Errado
const handleSubmit = async () => {
  await api.saveData(); // Sem setLoading
};

// ✅ Correto
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.saveData();
  } finally {
    setLoading(false);
  }
};
```

### Problema: Botão não fica desabilitado

**Solução:** Verificar se a prop `loading` está sendo passada

```tsx
// ❌ Errado
<LoadingButton onClick={handleSubmit}>
  Salvar
</LoadingButton>

// ✅ Correto
<LoadingButton loading={loading} onClick={handleSubmit}>
  Salvar
</LoadingButton>
```

### Problema: Loading não para

**Solução:** Verificar se `setLoading(false)` está no `finally`

```tsx
// ❌ Errado
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.saveData();
    setLoading(false); // Pode não executar se houver erro
  } catch (error) {
    // setLoading(false) não executou
  }
};

// ✅ Correto
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.saveData();
  } catch (error) {
    // Tratar erro
  } finally {
    setLoading(false); // Sempre executa
  }
};
```

## 📋 Seções Implementadas

### ✅ Configurações

- **PerfilForm**: Botão "Salvar Alterações"
- **NotificacoesForm**: Botão "Salvar Configurações"
- **SistemaForm**: Botão "Salvar Configurações"

### ✅ Vendedores

- **VendedorFormModal**: Botão "Atualizar" / "Cadastrar"
- **VendedoresListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (com loading no modal)
- **ConfirmationModal**: Botões "Confirmar Inativação" e "Confirmar Ativação"
- **ImportModal**: Botões "Baixar Template Excel" e "Importar Dados"

### ✅ Cidades

- **CidadeFormModal**: Botão "Atualizar" / "Cadastrar" (modal fecha apenas após sucesso)
- **CidadesListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (modal fecha apenas após sucesso)
- **ConfirmationModal**: Botão "Confirmar Exclusão" (modal fecha apenas após sucesso)
- **ImportModal**: Botões "Baixar Template Excel" e "Importar Dados"

### ✅ Folgas

- **FolgaFormModal**: Botão "Atualizar" / "Solicitar" (modal fecha apenas após sucesso)
- **FolgasListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (modal fecha apenas após sucesso)
- **ConfirmationModal**: Botão "Excluir" (modal fecha apenas após sucesso)
- **FolgasTable**: Botões "Aprovar" e "Rejeitar" (com loading inline)

### ✅ Rotas

- **RotaFormModal**: Botão "Atualizar" / "Criar" (modal fecha apenas após sucesso)
- **RotasListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (modal fecha apenas após sucesso)
- **ModalConfirmacaoExclusaoGenerico**: Botão "Confirmar Exclusão" (modal fecha apenas após sucesso)

### ✅ Veículos

- **VeiculoFormModal**: Botão "Atualizar" / "Cadastrar" (modal fecha apenas após sucesso)
- **VeiculosListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (modal fecha apenas após sucesso)
- **ConfirmationModal**: Botões "Sim, Ativar" e "Sim, Inativar" (modal fecha apenas após sucesso)
- **ImportModal**: Botões de importação (já implementado)

### ✅ Funcionários

- **FuncionarioFormModal**: Botão "Atualizar" / "Cadastrar" (modal fecha apenas após sucesso)
- **FuncionariosListPage**: Botão "Exportar Excel" (abre modal)
- **TableExportModal**: Botão "Exportar Excel" (modal fecha apenas após sucesso)
- **ConfirmationModal**: Botões "Confirmar Inativação" e "Confirmar Ativação" (modal fecha apenas após sucesso)
- **ImportModal**: Botões de importação (já implementado)

### 🔄 Próximas Seções

- [ ] Autenticação

## 🎯 Boas Práticas

1. **Sempre use try/catch/finally** para garantir que loading seja resetado
2. **Mantenha o layout original** - Não altere o visual dos botões
3. **Loading apenas no botão da ação** - Não desabilite botões de cancelar/fechar
4. **Modal permanece aberto** durante loading - Só fecha após sucesso
5. **Em caso de erro** - Modal permanece aberto para nova tentativa
6. **Teste sempre** o comportamento de loading
7. **Documente mudanças** quando necessário

## 📞 Suporte

Para dúvidas sobre implementação:

1. Consulte este documento
2. Verifique exemplos já implementados
3. Siga o padrão estabelecido
4. Mantenha consistência visual

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.6  
**Status:** Funcionários implementado com comportamento correto dos modais
