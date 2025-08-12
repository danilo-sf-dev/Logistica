import React from "react";
import {
  Map,
  Calendar,
  Truck,
  Users,
  Car,
  Building2,
  UserCheck,
} from "lucide-react";
import { AtividadeRecente } from "../types";

interface RecentActivitiesProps {
  atividades: AtividadeRecente[];
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Map":
      return Map;
    case "Calendar":
      return Calendar;
    case "Truck":
      return Truck;
    case "Users":
      return Users;
    case "Car":
      return Car;
    case "Building2":
      return Building2;
    case "UserCheck":
      return UserCheck;
    default:
      return Map;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-600";
    case "blue":
      return "bg-blue-100 text-blue-600";
    case "purple":
      return "bg-purple-100 text-purple-600";
    case "orange":
      return "bg-orange-100 text-orange-600";
    case "red":
      return "bg-red-100 text-red-600";
    case "gray":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  atividades,
}) => {
  if (atividades.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Atividades Recentes
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma atividade recente encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Atividades Recentes
      </h3>
      <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
        {atividades.map((atividade) => {
          const IconComponent = getIconComponent(atividade.icon);
          const colorClasses = getColorClasses(atividade.color);

          return (
            <div key={atividade.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 ${colorClasses} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {atividade.titulo}
                </p>
                <p className="text-sm text-gray-500">{atividade.descricao}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
