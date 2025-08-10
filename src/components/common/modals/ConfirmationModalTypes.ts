export type ConfirmationModalType = "danger" | "warning" | "success" | "info";

export interface ConfirmationModalDetail {
  label: string;
  value: string | number | null;
}

export interface ConfirmationModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
  disabled?: boolean;
}

export interface ConfirmationModalProps {
  type: ConfirmationModalType;
  title: string;
  message: string;
  details?: ConfirmationModalDetail[];
  warning?: string;
  primaryAction: ConfirmationModalAction;
  secondaryAction: ConfirmationModalAction;
  isOpen: boolean;
  onClose?: () => void;
}
