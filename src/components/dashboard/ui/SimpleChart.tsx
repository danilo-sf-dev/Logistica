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
      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)`,
                name,
              ]}
            />
          </PieChart>
        </div>

        {/* Legenda separada */}
        <div className="mt-6 w-full">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className="flex items-center space-x-3"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 block truncate">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
