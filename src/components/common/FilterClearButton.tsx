import React from "react";

interface FilterClearButtonProps {
  onClear: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const FilterClearButton: React.FC<FilterClearButtonProps> = ({
  onClear,
  className = "btn-secondary text-sm",
  children = "Limpar Filtros",
}) => {
  return (
    <div className="flex justify-end">
      <button onClick={onClear} className={className}>
        {children}
      </button>
    </div>
  );
};
