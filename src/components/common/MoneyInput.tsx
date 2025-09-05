import React from "react";

interface MoneyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "R$ 0,00",
  required = false,
  error,
  disabled = false,
  className = "",
}) => {
  const formatDisplayValue = (centavos: string): string => {
    if (!centavos || centavos === "0") return "";

    const valor = parseInt(centavos) || 0;
    const reais = valor / 100;

    return reais.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    let digitsOnly = rawValue.replace(/\D/g, "");

    if (!digitsOnly) {
      onChange("0");
      return;
    }

    // Garante que sempre temos pelo menos 2 dígitos para centavos
    if (digitsOnly.length === 1) {
      digitsOnly = "0" + digitsOnly;
    }

    onChange(digitsOnly);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    const isNumber = e.key >= "0" && e.key <= "9";
    const isAllowedKey = allowedKeys.includes(e.key);
    const isCtrlCmd = e.ctrlKey || e.metaKey;

    if (!isNumber && !isAllowedKey && !isCtrlCmd) {
      e.preventDefault();
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={formatDisplayValue(value)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field h-11 ${
          error ? "border-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
