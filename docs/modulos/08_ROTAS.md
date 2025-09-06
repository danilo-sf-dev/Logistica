# 🗺️ Rotas - Manual do Usuário

## 🎯 **O que você vai aprender**

- Como criar novas rotas
- Como editar rotas existentes
- Como acompanhar status das rotas
- Como associar funcionários e veículos
- Como gerenciar datas e horários
- Como buscar e filtrar rotas
- Como exportar relatórios de rotas

---

## 📋 **Pré-requisitos**

- Ter feito login no sistema
- Ter permissão de acesso ao módulo de rotas
- Ter funcionários e veículos cadastrados
- Ter cidades cadastradas no sistema
- Entender os conceitos básicos de logística

---

## 🚀 **Passo a Passo Detalhado**

### 1. **Acessando o Módulo de Rotas**

#### **Passo 1.1: Abrir o Módulo**

1. **Clique em "Rotas"** no menu lateral
2. **Aguarde o carregamento** da lista de rotas
3. **Verifique se a tela** mostra a lista de rotas cadastradas

#### **Passo 1.2: Entender a Tela Principal**

A tela de rotas contém:

- **Botão "Nova Rota"** (canto superior direito)
- **Campo de busca** (para procurar rotas)
- **Filtros** (por status, unidade de negócio, período)
- **Tabela de rotas** (lista com todos os dados)
- **Botões de ação** (editar, visualizar, etc.)

---

### 2. **Criando Nova Rota**

#### **Passo 2.1: Iniciar Criação**

1. **Clique em "Nova Rota"** no canto superior direito
2. **Aguarde o carregamento** do formulário
3. **Verifique se todos os campos** estão visíveis

#### **Passo 2.2: Preencher Dados da Rota**

**Campos obrigatórios** (marcados com \*):

1. **Origem\***:
   - Digite a cidade de origem
   - Exemplo: "Salvador"
   - Deve estar cadastrada no sistema

2. **Destino\***:
   - Digite a cidade de destino
   - Exemplo: "São Paulo"
   - Deve estar cadastrada no sistema

3. **Funcionário\***:
   - Selecione o motorista responsável
   - Deve ser funcionário cadastrado
   - Deve ter função de motorista

4. **Veículo\***:
   - Selecione o veículo da rota
   - Deve estar cadastrado no sistema
   - Deve estar disponível

#### **Passo 2.3: Preencher Datas e Horários**

1. **Data de Partida\***:
   - Clique no campo de data
   - Selecione a data no calendário
   - Formato: DD/MM/AAAA

2. **Data de Chegada\***:
   - Clique no campo de data
   - Selecione a data no calendário
   - Deve ser posterior à data de partida
   - Formato: DD/MM/AAAA

#### **Passo 2.4: Preencher Dados Operacionais**

1. **Status\***:
   - Selecione uma opção:
     - Agendada
     - Em Andamento
     - Concluída
     - Cancelada

2. **Unidade de Negócio\***:
   - Selecione uma opção:
     - Frigorífico
     - Ovos

3. **Observações** (opcional):
   - Digite informações adicionais
   - Exemplo: "Carga especial, cuidado com temperatura"
   - Máximo: 500 caracteres

#### **Passo 2.5: Salvar a Rota**

1. **Revise todos os dados** preenchidos
2. **Verifique se não há erros** nos campos
3. **Clique em "Cadastrar"**
4. **Aguarde a confirmação** de sucesso
5. **A rota será adicionada** à lista

---

### 3. **Editando Rota Existente**

#### **Passo 3.1: Localizar a Rota**

1. **Use o campo de busca** para encontrar a rota
2. **Ou navegue pela lista** até encontrar
3. **Clique no ícone de edição** (lápis) na linha da rota

#### **Passo 3.2: Modificar Dados**

1. **Altere os campos** que precisam ser atualizados
2. **Campos que podem ser editados**:
   - Origem, destino
   - Funcionário, veículo
   - Datas de partida e chegada
   - Status, observações
   - Unidade de negócio

#### **Passo 3.3: Salvar Alterações**

1. **Revise as alterações** feitas
2. **Clique em "Salvar"**
3. **Aguarde a confirmação** de sucesso
4. **As alterações serão aplicadas** imediatamente

---

### 4. **Acompanhando Status das Rotas**

#### **Passo 4.1: Entender os Status**

**Status disponíveis**:

- **Agendada**: Rota programada para futuro
- **Em Andamento**: Rota atualmente em execução
- **Concluída**: Rota finalizada com sucesso
- **Cancelada**: Rota cancelada por algum motivo

#### **Passo 4.2: Alterar Status**

1. **Localize a rota** na lista
2. **Clique no campo "Status"** na linha da rota
3. **Selecione o novo status** no dropdown
4. **Confirme a alteração**
5. **O status será atualizado** imediatamente

#### **Passo 4.3: Quando Alterar Status**

- **Para "Em Andamento"**: Quando rota inicia
- **Para "Concluída"**: Quando rota termina
- **Para "Cancelada"**: Quando rota é cancelada
- **Para "Agendada"**: Quando rota é reagendada

---

### 5. **Associando Funcionários e Veículos**

#### **Passo 5.1: Associar Motorista**

1. **Edite a rota** desejada
2. **Clique no campo "Funcionário"**
3. **Selecione o motorista** na lista
4. **Verifique se funcionário** tem função de motorista
5. **Salve as alterações**

#### **Passo 5.2: Associar Veículo**

1. **Edite a rota** desejada
2. **Clique no campo "Veículo"**
3. **Selecione o veículo** na lista
4. **Verifique se veículo** está disponível
5. **Salve as alterações**

#### **Passo 5.3: Verificar Disponibilidade**

1. **Verifique se funcionário** não está em outra rota
2. **Verifique se veículo** não está em uso
3. **Confirme se datas** não conflitam
4. **Planeje com antecedência** para evitar conflitos

---

### 6. **Gerenciando Datas e Horários**

#### **Passo 6.1: Definir Data de Partida**

1. **Clique no campo "Data de Partida"**
2. **Selecione a data** no calendário
3. **Verifique se data** é futura
4. **Confirme a seleção**

#### **Passo 6.2: Definir Data de Chegada**

1. **Clique no campo "Data de Chegada"**
2. **Selecione a data** no calendário
3. **Verifique se data** é posterior à partida
4. **Confirme a seleção**

#### **Passo 6.3: Ajustar Datas**

1. **Se precisar alterar**: Edite a rota
2. **Se rota atrasou**: Atualize data de chegada
3. **Se rota foi antecipada**: Atualize data de partida
4. **Sempre salve** as alterações

---

### 7. **Buscando e Filtrando Rotas**

#### **Passo 7.1: Busca por Origem/Destino**

1. **Digite a cidade** no campo de busca
2. **A lista será filtrada** automaticamente
3. **Para limpar**: Apague o texto da busca

#### **Passo 7.2: Filtro por Status**

1. **Clique no dropdown "Status"**
2. **Selecione o status** desejado
3. **A lista mostrará apenas** rotas com esse status
4. **Para limpar**: Selecione "Todos"

#### **Passo 7.3: Filtro por Período**

1. **Clique no dropdown "Período"**
2. **Selecione o período** desejado:
   - Hoje
   - Esta semana
   - Este mês
   - Últimos 30 dias
3. **A lista mostrará apenas** rotas do período
4. **Para limpar**: Selecione "Todos"

#### **Passo 7.4: Filtro por Unidade de Negócio**

1. **Clique no dropdown "Unidade"**
2. **Selecione a unidade** desejada
3. **A lista mostrará apenas** rotas dessa unidade
4. **Para limpar**: Selecione "Todas"

---

### 8. **Exportando Relatórios de Rotas**

#### **Passo 8.1: Acessar Relatórios**

1. **Clique em "Relatórios"** no menu lateral
2. **Selecione "Relatórios Detalhados"**
3. **Escolha "Rotas Detalhado"**

#### **Passo 8.2: Exportar para Excel**

1. **Clique no botão "Excel"**
2. **Aguarde o processamento** do arquivo
3. **O arquivo será baixado** automaticamente
4. **Nome do arquivo**: "rotas_DD-MM-AAAA.xlsx"

#### **Passo 8.3: Exportar para PDF**

1. **Clique no botão "PDF"**
2. **Aguarde o processamento** do arquivo
3. **O arquivo será baixado** automaticamente
4. **Nome do arquivo**: "rotas_DD-MM-AAAA.pdf"

---

### 9. **Gerenciando Informações Específicas**

#### **Passo 9.1: Informações de Rota**

**Para alterar origem/destino**:

1. Edite a rota
2. Altere os campos "Origem" e "Destino"
3. Salve as alterações

**Para alterar observações**:

1. Edite a rota
2. Altere o campo "Observações"
3. Salve as alterações

#### **Passo 9.2: Informações Operacionais**

**Para alterar unidade de negócio**:

1. Edite a rota
2. Altere o campo "Unidade de Negócio"
3. Salve as alterações

**Para alterar funcionário/veículo**:

1. Edite a rota
2. Altere os campos "Funcionário" e "Veículo"
3. Salve as alterações

---

## ⚠️ **Dicas Importantes**

### 📝 **Preenchimento de Dados**

- **Cidades devem estar cadastradas**: Cadastre antes de criar rota
- **Funcionário deve ser motorista**: Verifique função antes de associar
- **Veículo deve estar disponível**: Verifique status antes de associar
- **Datas devem ser lógicas**: Chegada deve ser posterior à partida

### 🔒 **Segurança e Validação**

- **Dados são validados**: Sistema verifica disponibilidade e conflitos
- **Alterações são registradas**: Histórico de mudanças é mantido
- **Apenas usuários autorizados**: Podem criar e editar rotas
- **Conflitos são detectados**: Sistema avisa sobre sobreposições

### 💡 **Uso Eficiente**

- **Use filtros**: Para encontrar rotas rapidamente
- **Mantenha status atualizado**: Para acompanhamento em tempo real
- **Planeje com antecedência**: Para evitar conflitos
- **Exporte regularmente**: Para backup e análise

---

## 🐛 **Problemas Comuns**

### ❌ **"Cidade não encontrada"**

**Problema**: Sistema não reconhece origem ou destino
**Soluções**:

1. Verifique se cidade está cadastrada no sistema
2. Cadastre a cidade primeiro no módulo "Cidades"
3. Use nome exato da cidade
4. Verifique se digitou corretamente

### ❌ **"Funcionário não disponível"**

**Problema**: Sistema informa que funcionário não está disponível
**Soluções**:

1. Verifique se funcionário está em outra rota
2. Verifique se funcionário tem função de motorista
3. Verifique se funcionário está ativo
4. Escolha outro funcionário disponível

### ❌ **"Veículo não disponível"**

**Problema**: Sistema informa que veículo não está disponível
**Soluções**:

1. Verifique se veículo está em uso
2. Verifique se veículo está em manutenção
3. Verifique se veículo está ativo
4. Escolha outro veículo disponível

### ❌ **"Data inválida"**

**Problema**: Sistema não aceita as datas informadas
**Soluções**:

1. Verifique se data de chegada é posterior à partida
2. Verifique se datas são futuras (para rotas agendadas)
3. Verifique se formato está correto (DD/MM/AAAA)
4. Verifique se não há conflitos com outras rotas

---

## 🔄 **Próximos Passos**

Após dominar o módulo de rotas:

1. **Leia o [Manual de Folgas](./09_FOLGAS.md)** para controlar disponibilidade
2. **Aprenda sobre [Funcionários](./04_FUNCIONARIOS.md)** para gerenciar motoristas
3. **Configure [Veículos](./06_VEICULOS.md)** para gerenciar a frota
4. **Use [Relatórios](./10_RELATORIOS.md)** para acompanhar performance

---

## 📞 **Suporte**

### 🆘 **Precisa de Ajuda?**

- **Email**: suporte@empresa.com
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

**🗺️ Manual de Rotas - SGL v1.2.3**

_Última atualização: Janeiro 2025_
