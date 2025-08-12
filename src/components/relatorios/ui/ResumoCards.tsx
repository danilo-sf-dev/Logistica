import React from "react";
import { Users, Truck, Calendar } from "lucide-react";
import type { ResumoCardsProps } from "../types";

export const ResumoCards: React.FC<ResumoCardsProps> = ({
  dadosMotoristas,
  dadosVeiculos,
  dadosRotas,
  dadosFolgas,
  className = "",
}) => {
  const calcularTotal = (dados: any[]) => {
    return dados.reduce((sum, item) => sum + item.value, 0);
  };

  const obterValorPorNome = (dados: any[], nome: string) => {
    return dados.find((item) => item.name === nome)?.value || 0;
  };

  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      <div className="card">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-500">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Total Funcionários
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {calcularTotal(dadosMotoristas)}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-500">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Veículos</p>
            <p className="text-2xl font-semibold text-gray-900">
              {calcularTotal(dadosVeiculos)}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-orange-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Folgas Pendentes
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {obterValorPorNome(dadosFolgas, "Pendente")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoCards;
