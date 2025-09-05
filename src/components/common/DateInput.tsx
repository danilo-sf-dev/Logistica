import React from "react";

export interface DateInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

/**
 * Componente reutilizável para input de data
 * SÓ renderiza e captura input, NUNCA processa ou valida dados
 */
export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  required = false,
  error,
  disabled = false,
  placeholder = "Selecione uma data",
  className = "",
  id,
  name,
  autoFocus = false,
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label
        htmlFor={id || name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-gray-900">*</span>}
      </label>
      <input
        id={id || name}
        name={name}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200 ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
