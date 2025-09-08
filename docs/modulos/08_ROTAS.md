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

1. **Nome da Rota\***:
   - Digite um nome descritivo para a rota
   - Exemplo: "Rota Sul", "Entrega Capital"
   - Deve ser único no sistema

2. **Peso Mínimo (kg)**:
   - Digite o peso mínimo para a rota
   - Exemplo: 1000 (para 1000 kg)
   - Campo opcional

#### **Passo 2.3: Configurar Dias da Semana**

1. **Dias da Semana\***:
   - **Opção 1 - Qualquer dia da semana**:
     - Marque o checkbox "Qualquer dia da semana"
     - A rota estará disponível todos os dias
     - Os checkboxes individuais ficam desabilitados
   - **Opção 2 - Dias específicos**:
     - Marque os dias específicos da semana
     - Segunda-feira, Terça-feira, etc.
     - Pode selecionar múltiplos dias
     - Se marcar qualquer dia individual, "Qualquer dia" é desmarcado automaticamente

#### **Passo 2.4: Vincular Cidades**

1. **Cidades Vinculadas**:
   - As cidades são vinculadas na seção de Cidades
   - Vá para o módulo "Cidades"
   - Selecione a rota no dropdown de cada cidade
   - As cidades vinculadas aparecerão aqui automaticamente

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
   - Nome da rota
   - Peso mínimo
   - Dias da semana (incluindo "Qualquer dia da semana")
   - Cidades vinculadas (através do módulo Cidades)

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

### 5. **Gerenciando Cidades Vinculadas**

#### **Passo 5.1: Vincular Cidades à Rota**

1. **Acesse o módulo "Cidades"**
2. **Encontre a cidade** que deseja vincular
3. **Clique no ícone de edição** da cidade
4. **Selecione a rota** no dropdown "Rota Vinculada"
5. **Salve as alterações**

#### **Passo 5.2: Desvincular Cidades**

1. **Acesse o módulo "Cidades"**
2. **Encontre a cidade** vinculada
3. **Clique no ícone de edição** da cidade
4. **Selecione "Nenhuma rota"** no dropdown
5. **Salve as alterações**

#### **Passo 5.3: Verificar Cidades Vinculadas**

1. **Na tela de rotas**, veja a coluna "Cidades"
2. **Mostra quantas cidades** estão vinculadas
3. **Clique na rota** para ver detalhes
4. **As cidades aparecem** na seção inferior

---

### 6. **Configurando Dias da Semana**

#### **Passo 6.1: Usar "Qualquer Dia da Semana"**

1. **Marque o checkbox** "Qualquer dia da semana"
2. **Os dias individuais** ficam desabilitados
3. **A rota estará disponível** todos os dias
4. **Ideal para rotas** que funcionam diariamente

#### **Passo 6.2: Selecionar Dias Específicos**

1. **Desmarque "Qualquer dia"** se estiver marcado
2. **Marque os dias específicos** desejados
3. **Pode selecionar múltiplos** dias
4. **Ideal para rotas** com horários específicos

#### **Passo 6.3: Alterar Configuração**

1. **Se precisar alterar**: Edite a rota
2. **Se rota atrasou**: Atualize data de chegada
3. **Se rota foi antecipada**: Atualize data de partida
4. **Sempre salve** as alterações

---

### 7. **Buscando e Filtrando Rotas**

#### **Passo 7.1: Busca por Nome**

1. **Digite o nome da rota** no campo de busca
2. **A lista será filtrada** automaticamente
3. **Para limpar**: Apague o texto da busca

#### **Passo 7.2: Filtro por Dia da Semana**

1. **Clique no dropdown "Dia da Semana"**
2. **Selecione o dia** desejado:
   - Qualquer dia da semana
   - Segunda-feira
   - Terça-feira
   - Quarta-feira
   - Quinta-feira
   - Sexta-feira
   - Sábado
   - Domingo
3. **A lista mostrará apenas** rotas desse dia
4. **Para limpar**: Selecione "Todos os dias da semana"

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
