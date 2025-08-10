import { AlertTriangle, Trash2, CheckCircle, Info } from "lucide-react";
import type { ConfirmationModalType } from "./ConfirmationModalTypes";

export interface ModalConfig {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  titleColor: string;
  messageColor: string;
}

export const MODAL_CONFIGS: Record<ConfirmationModalType, ModalConfig> = {
  danger: {
    icon: Trash2,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    titleColor: "text-yellow-800",
    messageColor: "text-yellow-700",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
};

export const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-300 hover:bg-gray-400 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
};
