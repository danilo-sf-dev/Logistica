# 🔥 Documentação Firebase

Esta pasta contém toda a documentação relacionada ao Firebase do projeto SGL (Sistema de Gestão de Logística).

## 📁 **Arquivos Disponíveis**

### 🌐 **Interface Web**

- **[GUIA_INTERFACE_WEB.md](./GUIA_INTERFACE_WEB.md)** - Guia completo para usar a interface web do Firebase

## 🎯 **Acesso Rápido**

### **Console do Firebase**

- **URL:** https://console.firebase.google.com
- **Projeto:** logistica-c7afc
- **Seção:** Firestore Database

## 📋 **Operações Principais**

### **Consultar Dados**

- Buscar veículos por placa
- Buscar funcionários por CPF
- Listar veículos por status
- Filtros avançados

### **Gerenciar Dados**

- Adicionar novos registros
- Editar dados existentes
- Excluir registros
- Exportar dados

### **Backup e Segurança**

- Backup automático
- Restauração de dados
- Logs de auditoria
- Controle de acesso

## 🏗️ **Estrutura do Banco**

### **Coleções Principais**

- `veiculos` - Frota de veículos
- `funcionarios` - Funcionários da empresa
- `vendedores` - Vendedores
- `cidades` - Cidades cadastradas
- `rotas` - Rotas de entrega
- `folgas` - Folgas dos funcionários
- `users` - Usuários do sistema

## 🔧 **Configuração**

### **Regras de Segurança**

- Localizadas em: `firestore.rules` (raiz do projeto)
- Exigem autenticação para todas as operações
- Diferentes níveis de permissão por role

### **Índices**

- Configurados em: `firestore.indexes.json`
- Otimizam consultas frequentes
- Melhoram performance

## 📚 **Documentação Relacionada**

### **Desenvolvimento**

- `../desenvolvimento/` - Documentação técnica
- `../seguranca/` - Configurações de segurança
- `../usuarios/` - Gestão de usuários

### **Módulos**

- `../modulos/` - Documentação dos módulos do sistema
- `../implementacoes/` - Implementações específicas

## 🚀 **Próximos Passos**

1. **Familiarize-se** com a interface web
2. **Configure backup** automático
3. **Treine a equipe** no uso
4. **Monitore** logs e performance

## 📞 **Suporte**

- **Firebase Docs:** https://firebase.google.com/docs
- **Console:** https://console.firebase.google.com
- **Documentação do Projeto:** `../README.md`

---

**✅ A interface web do Firebase é a solução principal para gerenciar o banco de dados!**
