import {
  Home,
  Users,
  Truck,
  Map,
  Calendar,
  MapPin,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react";
import type { NavigationItem } from "../types";

export const defaultNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Funcionários", href: "/funcionarios", icon: Users },
  { name: "Veículos", href: "/veiculos", icon: Truck },
  { name: "Rotas", href: "/rotas", icon: Map },
  { name: "Folgas", href: "/folgas", icon: Calendar },
  { name: "Cidades", href: "/cidades", icon: MapPin },
  { name: "Vendedores", href: "/vendedores", icon: Building2 },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export const getNavigationByRole = (role?: string): NavigationItem[] => {
  const baseNavigation = defaultNavigation.filter(
    (item) => !item.roles || item.roles.includes(role || "user")
  );

  return baseNavigation;
};

export default defaultNavigation;
