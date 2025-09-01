import React from "react";

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-w-[80px] h-8",
    md: "px-4 py-2 text-sm min-w-[100px] h-10",
    lg: "px-6 py-3 text-base min-w-[120px] h-12",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={classes}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
