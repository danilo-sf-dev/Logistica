import { Settings, Bell, Database, Shield, Users } from "lucide-react";
import type { ConfigTab } from "../types";

export const configTabs: ConfigTab[] = [
  { id: "perfil", name: "Perfil", icon: Settings },
  { id: "notificacoes", name: "Notificações", icon: Bell },
  { id: "sistema", name: "Sistema", icon: Database },
  { id: "seguranca", name: "Segurança", icon: Shield },
  { id: "gestao-usuarios", name: "Gestão de Usuários", icon: Users },
];

export default configTabs;
