import React from "react";
import { MotoristaStatus } from "../types";
import { SimpleChart } from "./SimpleChart";

interface DashboardChartsProps {
  motoristasStatus: MotoristaStatus[];
  veiculosStatus: MotoristaStatus[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  motoristasStatus,
  veiculosStatus,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Status dos Motoristas */}
      <SimpleChart
        data={motoristasStatus}
        title="Status dos Motoristas"
        width={300}
        height={200}
      />

      {/* Status dos Veículos */}
      <SimpleChart
        data={veiculosStatus}
        title="Status dos Veículos"
        width={300}
        height={200}
      />
    </div>
  );
};
