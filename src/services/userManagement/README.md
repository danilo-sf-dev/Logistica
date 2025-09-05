# Serviços de Gerenciamento de Usuários

Esta pasta contém os serviços modulares responsáveis pelo gerenciamento de usuários, refatorados do serviço monolítico original.

## Estrutura

### 📁 UserRoleService.ts (~150 linhas)

Responsável pelo gerenciamento de roles e mudanças de perfil:

- Alteração de roles (permanente/temporário)
- Validação de permissões
- Registro de mudanças no histórico

### 📁 UserProfileService.ts (~180 linhas)

Gerencia operações básicas de perfil de usuário:

- Busca de usuários por role
- Listagem paginada de usuários
- Busca por termo
- Atualização de informações
- Desativação de usuários
- Estatísticas por role

### 📁 TemporaryRoleService.ts (~280 linhas)

Especializado em roles temporários:

- Extensão de roles temporários
- Verificação de expiração
- Reversão automática
- Processamento em lote
- Correção de inconsistências

### 📁 UserAuditService.ts (~180 linhas)

Gerencia auditoria e logs:

- Criação de logs de auditoria
- Histórico de mudanças
- Filtros avançados
- Relatórios de auditoria

### 📁 UserNotificationService.ts (~120 linhas)

Responsável pelas notificações:

- Notificações de mudança de role
- Agendamento de lembretes
- Notificações de expiração

### 📁 UserValidationService.ts (~140 linhas)

Validações de segurança:

- Validação de mudanças de role
- Verificação de promoções significativas
- Validação de períodos temporários
- Histórico de mudanças recentes

## Arquivo Principal

### 📁 userManagementService.ts (~200 linhas)

Atua como uma **fachada** que:

- Mantém a interface pública original
- Delega operações para os serviços especializados
- Coordena operações que envolvem múltiplos serviços
- Mantém logs de auditoria centralizados

## Benefícios da Refatoração

✅ **Responsabilidade Única**: Cada serviço tem uma responsabilidade específica
✅ **Manutenibilidade**: Código mais fácil de entender e modificar
✅ **Testabilidade**: Serviços menores são mais fáceis de testar
✅ **Reutilização**: Serviços podem ser usados independentemente
✅ **Escalabilidade**: Novos recursos podem ser adicionados sem afetar outros
✅ **Padrão**: Nenhum arquivo tem mais de 300 linhas

## Uso

```typescript
// Importar o serviço principal (mantém compatibilidade)
import { UserManagementService } from "../services/userManagementService";

// Ou importar serviços específicos
import {
  UserRoleService,
  UserProfileService,
} from "../services/userManagement";

// Exemplo de uso
await UserManagementService.changeUserRole(
  userId,
  newRole,
  "permanent",
  reason,
  adminId,
);
```

## Migração

O `UserManagementService` mantém **100% de compatibilidade** com o código existente. Todos os métodos públicos continuam funcionando exatamente como antes, mas agora delegam para os serviços especializados internamente.
