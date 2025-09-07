# 🌐 Guia da Interface Web do Firebase

## 🚀 **Acesso Rápido**

**URL:** https://console.firebase.google.com
**Projeto:** logistica-c7afc
**Seção:** Firestore Database

## 📋 **Operações Principais**

### **Consultar Dados**

#### Buscar Veículo por Placa

1. Acesse: **Firestore Database** > **Dados**
2. Clique na coleção **`veiculos`**
3. Use o filtro: **Campo:** `placa` **Operador:** `==` **Valor:** `ABC1234`
4. Clique em **Aplicar**

#### Buscar Funcionário por CPF

1. Coleção: **`funcionarios`**
2. Filtro: **Campo:** `cpf` **Operador:** `==` **Valor:** `12345678901`

#### Listar Veículos por Status

1. Coleção: **`veiculos`**
2. Filtro: **Campo:** `status` **Operador:** `==` **Valor:** `ativo`

### **Adicionar Dados**

#### Criar Novo Veículo

1. Clique em **`veiculos`** > **Adicionar documento**
2. **ID:** Deixe vazio (gerado automaticamente)
3. **Campos:**
   ```
   placa: ABC1234
   modelo: Scania R450
   marca: Scania
   ano: 2023
   tipo: caminhao
   status: ativo
   criadoEm: 2024-01-25T10:30:00Z
   ```

#### Criar Novo Funcionário

1. Coleção: **`funcionarios`**
2. **Campos:**
   ```
   nome: João Silva
   cpf: 12345678901
   funcao: motorista
   status: trabalhando
   criadoEm: 2024-01-25T10:30:00Z
   ```

### **Editar Dados**

1. Clique no documento desejado
2. Clique no campo que deseja editar
3. Digite o novo valor
4. Clique em **Salvar**

### **Excluir Dados**

1. Clique no documento desejado
2. Clique no ícone de **lixeira** (⋮) > **Excluir**
3. Confirme a exclusão

## 🔍 **Filtros Úteis**

### Veículos

- **Status ativo:** `status == ativo`
- **Em manutenção:** `status == manutencao`
- **Tipo caminhão:** `tipo == caminhao`
- **Ano específico:** `ano == 2023`

### Funcionários

- **Motoristas:** `funcao == motorista`
- **Trabalhando:** `status == trabalhando`
- **Por CPF:** `cpf == 12345678901`

### Cidades

- **Por estado:** `estado == SP`
- **Por nome:** `nome == São Paulo`

## 📊 **Exportar Dados**

### Exportar Coleção Completa

1. Coleção desejada > **⋮** (três pontos)
2. **Exportar coleção**
3. Escolha formato: **JSON** ou **CSV**

### Exportar Dados Filtrados

1. Aplique os filtros desejados
2. **⋮** > **Exportar resultados**

## 💾 **Backup e Restauração**

### Backup Manual

1. **Configurações do projeto** > **Geral**
2. **Firestore** > **Backup**
3. **Criar backup** > Escolha nome e frequência

### Restaurar Backup

1. **Firestore** > **Backup**
2. Selecione o backup desejado
3. **Restaurar**

## 🏗️ **Estrutura das Coleções**

### `veiculos`

```
- placa (string)
- modelo (string)
- marca (string)
- ano (number)
- tipo (string)
- status (string)
- criadoEm (timestamp)
```

### `funcionarios`

```
- nome (string)
- cpf (string)
- funcao (string)
- status (string)
- criadoEm (timestamp)
```

### `cidades`

```
- nome (string)
- estado (string)
- codigo (string)
- criadoEm (timestamp)
```

### `rotas`

```
- origem (string)
- destino (string)
- distancia (number)
- tempoEstimado (number)
- status (string)
- criadoEm (timestamp)
```

## 💡 **Dicas de Produtividade**

### **Atalhos de Teclado**

- **Ctrl+F:** Buscar na página
- **Ctrl+Shift+F:** Buscar em todos os documentos
- **F5:** Atualizar dados

### **Visualizações**

- **Lista:** Para ver muitos registros
- **Tabela:** Para comparar dados
- **JSON:** Para ver estrutura completa

### **Filtros Avançados**

- **Múltiplos filtros:** Use **E** para AND, **OU** para OR
- **Filtros compostos:** `status == ativo E tipo == caminhao`
- **Filtros de data:** `criadoEm >= 2024-01-01`

## ✅ **Vantagens da Interface Web**

- **Segurança:** Acesso controlado por autenticação
- **Confiabilidade:** Interface oficial do Firebase
- **Facilidade:** Interface intuitiva e visual
- **Backup:** Fácil backup e restauração
- **Filtros:** Busca avançada
- **Exportação:** Múltiplos formatos
- **Auditoria:** Logs completos de operações
- **Colaboração:** Múltiplos usuários simultâneos

---

**🎯 Esta é a solução mais robusta e segura para gerenciar seu banco de dados Firebase!**
