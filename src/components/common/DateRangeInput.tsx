import React from "react";
import { DateInput } from "./DateInput";

export interface DateRangeInputProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minStartDate?: string;
  maxEndDate?: string;
  required?: boolean;
  errors?: { startDate?: string; endDate?: string; period?: string };
  className?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  disabled?: boolean;
}

/**
 * Componente reutilizável para input de período de datas
 * SÓ renderiza e captura input, NUNCA processa ou valida dados
 */
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  maxEndDate,
  required = false,
  errors = {},
  className = "",
  startDateLabel = "Data Início",
  endDateLabel = "Data Fim",
  disabled = false,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Data de Início */}
      <DateInput
        label={startDateLabel}
        value={startDate}
        onChange={onStartDateChange}
        minDate={minStartDate}
        maxDate={endDate}
        required={required}
        error={errors.startDate}
        disabled={disabled}
        name="startDate"
        id="startDate"
      />

      {/* Data de Fim */}
      <DateInput
        label={endDateLabel}
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
        maxDate={maxEndDate}
        required={required}
        error={errors.endDate}
        disabled={disabled}
        name="endDate"
        id="endDate"
      />

      {/* Erro de período (se houver) */}
      {errors.period && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.period}</p>
        </div>
      )}
    </div>
  );
};
