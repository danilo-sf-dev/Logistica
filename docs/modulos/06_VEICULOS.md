# 🚚 Veículos - Manual do Usuário

## 🎯 **O que você vai aprender**

- Como cadastrar novos veículos na frota
- Como editar informações de veículos existentes
- Como gerenciar status dos veículos
- Como controlar manutenções
- Como associar motoristas aos veículos
- Como buscar e filtrar veículos
- Como exportar relatórios da frota

---

## 📋 **Pré-requisitos**

- Ter feito login no sistema
- Ter permissão de acesso ao módulo de veículos
- Ter os dados do veículo em mãos (placa, modelo, marca, etc.)
- Entender os conceitos básicos de gestão de frota

---

## 🚀 **Passo a Passo Detalhado**

### 1. **Acessando o Módulo de Veículos**

#### **Passo 1.1: Abrir o Módulo**

1. **Clique em "Veículos"** no menu lateral
2. **Aguarde o carregamento** da lista de veículos
3. **Verifique se a tela** mostra a lista da frota cadastrada

#### **Passo 1.2: Entender a Tela Principal**

A tela de veículos contém:

- **Botão "Novo Veículo"** (canto superior direito)
- **Campo de busca** (para procurar veículos)
- **Filtros** (por status, unidade de negócio)
- **Tabela de veículos** (lista com todos os dados)
- **Botões de ação** (editar, visualizar, etc.)

---

### 2. **Cadastrando Novo Veículo**

#### **Passo 2.1: Iniciar Cadastro**

1. **Clique em "Novo Veículo"** no canto superior direito
2. **Aguarde o carregamento** do formulário
3. **Verifique se todos os campos** estão visíveis

#### **Passo 2.2: Preencher Dados Básicos**

**Campos obrigatórios** (marcados com \*):

1. **Placa\***:
   - Digite a placa do veículo
   - Exemplo: "ABC1234"
   - Formato: 3 letras + 4 números
   - Deve ser única no sistema

2. **Modelo\***:
   - Digite o modelo do veículo
   - Exemplo: "Sprinter 3500"
   - Mínimo: 2 caracteres

3. **Marca\***:
   - Digite a marca do veículo
   - Exemplo: "Mercedes-Benz"
   - Mínimo: 2 caracteres

4. **Ano\***:
   - Digite o ano do veículo
   - Exemplo: "2020"
   - Formato: 4 dígitos

5. **Capacidade\***:
   - Digite a capacidade em toneladas
   - Exemplo: "3.5"
   - Use ponto para separar decimais

#### **Passo 2.3: Preencher Dados Operacionais**

1. **Status\***:
   - Selecione uma opção:
     - Disponível
     - Em Uso
     - Manutenção
     - Inativo

2. **Unidade de Negócio\***:
   - Selecione uma opção:
     - Frigorífico
     - Ovos

3. **Funcionário** (opcional):
   - Selecione o motorista responsável
   - Deve ser funcionário cadastrado
   - Deixe em branco se não tiver

#### **Passo 2.4: Preencher Dados de Manutenção**

1. **Última Manutenção** (opcional):
   - Clique no campo de data
   - Selecione a data no calendário
   - Formato: DD/MM/AAAA

2. **Próxima Manutenção** (opcional):
   - Clique no campo de data
   - Selecione a data no calendário
   - Formato: DD/MM/AAAA

#### **Passo 2.5: Salvar o Cadastro**

1. **Revise todos os dados** preenchidos
2. **Verifique se não há erros** nos campos
3. **Clique em "Cadastrar"**
4. **Aguarde a confirmação** de sucesso
5. **O veículo será adicionado** à frota

---

### 3. **Editando Veículo Existente**

#### **Passo 3.1: Localizar o Veículo**

1. **Use o campo de busca** para encontrar o veículo
2. **Ou navegue pela lista** até encontrar
3. **Clique no ícone de edição** (lápis) na linha do veículo

#### **Passo 3.2: Modificar Dados**

1. **Altere os campos** que precisam ser atualizados
2. **Campos que NÃO podem ser editados**:
   - Placa (por segurança)
   - Data de criação
3. **Campos que podem ser editados**:
   - Modelo, marca, ano
   - Capacidade
   - Status, unidade de negócio
   - Funcionário responsável
   - Datas de manutenção

#### **Passo 3.3: Salvar Alterações**

1. **Revise as alterações** feitas
2. **Clique em "Salvar"**
3. **Aguarde a confirmação** de sucesso
4. **As alterações serão aplicadas** imediatamente

---

### 4. **Gerenciando Status dos Veículos**

#### **Passo 4.1: Entender os Status**

**Status disponíveis**:

- **Disponível**: Veículo pronto para uso
- **Em Uso**: Veículo atualmente em rota
- **Manutenção**: Veículo em manutenção
- **Inativo**: Veículo fora de operação

#### **Passo 4.2: Alterar Status**

1. **Localize o veículo** na lista
2. **Clique no campo "Status"** na linha do veículo
3. **Selecione o novo status** no dropdown
4. **Confirme a alteração**
5. **O status será atualizado** imediatamente

#### **Passo 4.3: Quando Alterar Status**

- **Para "Disponível"**: Quando veículo termina rota
- **Para "Em Uso"**: Quando veículo inicia rota
- **Para "Manutenção"**: Quando veículo vai para manutenção
- **Para "Inativo"**: Quando veículo sai de operação

---

### 5. **Controlando Manutenções**

#### **Passo 5.1: Registrar Manutenção Realizada**

1. **Edite o veículo** que passou por manutenção
2. **Altere o campo "Última Manutenção"** para a data atual
3. **Calcule a próxima manutenção** (ex: +6 meses)
4. **Altere o campo "Próxima Manutenção"**
5. **Altere o status** para "Disponível"
6. **Salve as alterações**

#### **Passo 5.2: Agendar Próxima Manutenção**

1. **Edite o veículo** que precisa de manutenção
2. **Altere o campo "Próxima Manutenção"** para a data agendada
3. **Altere o status** para "Manutenção"
4. **Salve as alterações**

#### **Passo 5.3: Acompanhar Manutenções**

1. **Use o filtro "Status"** para ver veículos em manutenção
2. **Verifique as datas** de próxima manutenção
3. **Planeje a manutenção** com antecedência
4. **Atualize as datas** após manutenção

---

### 6. **Associando Motoristas aos Veículos**

#### **Passo 6.1: Associar Motorista**

1. **Edite o veículo** desejado
2. **Clique no campo "Funcionário"**
3. **Selecione o motorista** na lista
4. **Salve as alterações**
5. **O motorista será associado** ao veículo

#### **Passo 6.2: Desassociar Motorista**

1. **Edite o veículo** desejado
2. **Clique no campo "Funcionário"**
3. **Selecione "Nenhum"** ou deixe em branco
4. **Salve as alterações**
5. **O motorista será desassociado** do veículo

#### **Passo 6.3: Verificar Associações**

1. **Use o filtro "Status"** para ver veículos disponíveis
2. **Verifique a coluna "Funcionário"** para ver associações
3. **Planeje rotas** considerando as associações
4. **Atualize associações** conforme necessário

---

### 7. **Buscando e Filtrando Veículos**

#### **Passo 7.1: Busca por Placa**

1. **Digite a placa** no campo de busca
2. **A lista será filtrada** automaticamente
3. **Para limpar**: Apague o texto da busca

#### **Passo 7.2: Filtro por Status**

1. **Clique no dropdown "Status"**
2. **Selecione o status** desejado
3. **A lista mostrará apenas** veículos com esse status
4. **Para limpar**: Selecione "Todos"

#### **Passo 7.3: Filtro por Unidade de Negócio**

1. **Clique no dropdown "Unidade"**
2. **Selecione a unidade** desejada
3. **A lista mostrará apenas** veículos dessa unidade
4. **Para limpar**: Selecione "Todas"

---

### 8. **Exportando Relatórios da Frota**

#### **Passo 8.1: Acessar Relatórios**

1. **Clique em "Relatórios"** no menu lateral
2. **Selecione "Relatórios Detalhados"**
3. **Escolha "Veículos Detalhado"**

#### **Passo 8.2: Exportar para Excel**

1. **Clique no botão "Excel"**
2. **Aguarde o processamento** do arquivo
3. **O arquivo será baixado** automaticamente
4. **Nome do arquivo**: "veiculos_DD-MM-AAAA.xlsx"

#### **Passo 8.3: Exportar para PDF**

1. **Clique no botão "PDF"**
2. **Aguarde o processamento** do arquivo
3. **O arquivo será baixado** automaticamente
4. **Nome do arquivo**: "veiculos_DD-MM-AAAA.pdf\*\*

---

### 9. **Gerenciando Informações Específicas**

#### **Passo 9.1: Informações Técnicas**

**Para alterar modelo/marca**:

1. Edite o veículo
2. Altere os campos "Modelo" e "Marca"
3. Salve as alterações

**Para alterar capacidade**:

1. Edite o veículo
2. Altere o campo "Capacidade"
3. Salve as alterações

#### **Passo 9.2: Informações Operacionais**

**Para alterar unidade de negócio**:

1. Edite o veículo
2. Altere o campo "Unidade de Negócio"
3. Salve as alterações

**Para alterar funcionário responsável**:

1. Edite o veículo
2. Altere o campo "Funcionário"
3. Salve as alterações

---

## ⚠️ **Dicas Importantes**

### 📝 **Preenchimento de Dados**

- **Placa deve ser única**: Não pode haver dois veículos com mesma placa
- **Ano deve ser real**: Use ano de fabricação do veículo
- **Capacidade deve ser precisa**: Para planejamento de cargas
- **Status deve ser atualizado**: Para controle operacional

### 🔒 **Segurança e Validação**

- **Placa não pode ser editada**: Por segurança, após cadastro
- **Dados são validados**: Sistema verifica formato e unicidade
- **Alterações são registradas**: Histórico de mudanças é mantido
- **Apenas usuários autorizados**: Podem editar veículos

### 💡 **Uso Eficiente**

- **Use filtros**: Para encontrar veículos rapidamente
- **Mantenha status atualizado**: Para planejamento de rotas
- **Controle manutenções**: Para evitar problemas operacionais
- **Exporte regularmente**: Para backup e análise

---

## 🐛 **Problemas Comuns**

### ❌ **"Placa já cadastrada"**

**Problema**: Sistema informa que placa já existe
**Soluções**:

1. Verifique se veículo já está cadastrado
2. Use busca para encontrar veículo existente
3. Edite veículo existente se necessário
4. Verifique se digitou placa corretamente

### ❌ **"Funcionário não encontrado"**

**Problema**: Sistema não encontra motorista para associar
**Soluções**:

1. Verifique se funcionário está cadastrado
2. Cadastre funcionário primeiro no módulo "Funcionários"
3. Verifique se funcionário tem função de motorista
4. Verifique se digitou nome corretamente

### ❌ **"Dados não salvam"**

**Problema**: Clica em salvar mas dados não são salvos
**Soluções**:

1. Verifique se preencheu todos os campos obrigatórios
2. Verifique se há erros nos campos
3. Aguarde alguns segundos
4. Atualize a página e tente novamente

### ❌ **"Veículo não aparece na lista"**

**Problema**: Cadastrou mas veículo não aparece
**Soluções**:

1. Aguarde alguns segundos
2. Atualize a página (F5)
3. Verifique se não há filtros ativos
4. Verifique se cadastro foi concluído

---

## 🔄 **Próximos Passos**

Após dominar o módulo de veículos:

1. **Leia o [Manual de Rotas](./08_ROTAS.md)** para associar veículos a rotas
2. **Aprenda sobre [Funcionários](./04_FUNCIONARIOS.md)** para associar motoristas
3. **Configure [Folgas](./09_FOLGAS.md)** para controlar disponibilidade
4. **Use [Relatórios](./10_RELATORIOS.md)** para acompanhar a frota

---

## 📞 **Suporte**

### 🆘 **Precisa de Ajuda?**

- **Email**: suporte@empresa.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

**🚚 Manual de Veículos - SGL v1.2.3**

_Última atualização: Janeiro 2025_
