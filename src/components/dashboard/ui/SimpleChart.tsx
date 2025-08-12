import React from "react";
import { Tooltip, PieChart, Pie, Cell } from "recharts";
import { MotoristaStatus } from "../types";

interface SimpleChartProps {
  data: MotoristaStatus[];
  title: string;
  width?: number;
  height?: number;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  title,
  width = 300,
  height = 200,
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex justify-center">
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};
