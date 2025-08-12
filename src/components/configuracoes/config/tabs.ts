import { Settings, Bell, Database, Shield } from "lucide-react";
import type { ConfigTab } from "../types";

export const configTabs: ConfigTab[] = [
  { id: "perfil", name: "Perfil", icon: Settings },
  { id: "notificacoes", name: "Notificações", icon: Bell },
  { id: "sistema", name: "Sistema", icon: Database },
  { id: "seguranca", name: "Segurança", icon: Shield },
];

export default configTabs;
