import React from "react";
import {
  Users,
  Truck,
  Map,
  TrendingUp,
  TrendingDown,
  Building2,
  UserCheck,
  Car,
} from "lucide-react";
import { DashboardStats } from "../types";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}) => (
  <div className="card">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div className="flex items-center mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`ml-1 text-sm ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Funcionários"
        value={stats.funcionarios}
        icon={Users}
        color="bg-blue-500"
      />
      <StatCard
        title="Motoristas"
        value={stats.motoristas}
        icon={Car}
        color="bg-green-500"
      />
      <StatCard
        title="Vendedores"
        value={stats.vendedores}
        icon={UserCheck}
        color="bg-teal-500"
      />
      <StatCard
        title="Cidades"
        value={stats.cidades}
        icon={Building2}
        color="bg-purple-500"
      />
      <StatCard
        title="Veículos"
        value={stats.veiculos}
        icon={Truck}
        color="bg-indigo-500"
      />
      <StatCard
        title="Rotas Ativas"
        value={stats.rotas}
        icon={Map}
        color="bg-orange-500"
      />
    </div>
  );
};
