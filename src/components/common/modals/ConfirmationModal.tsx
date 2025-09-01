import React from "react";
import { X } from "lucide-react";
import type { ConfirmationModalProps } from "./ConfirmationModalTypes";
import { MODAL_CONFIGS, BUTTON_VARIANTS } from "./ConfirmationModalConfig";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  type,
  title,
  message,
  details = [],
  warning,
  primaryAction,
  secondaryAction,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const config = MODAL_CONFIGS[type];
  const IconComponent = config.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose && !primaryAction.loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg shadow-xl max-w-md w-full mx-4`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
            <h2 className={`text-xl font-semibold ${config.titleColor}`}>
              {title}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              disabled={primaryAction.loading}
              className={`text-gray-400 hover:text-gray-600 transition-colors ${
                primaryAction.loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`text-base ${config.messageColor} mb-4`}>{message}</p>

          {/* Details */}
          {details.length > 0 && (
            <div className="mb-4 space-y-3">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center py-2">
                  <span className="font-medium text-gray-700 text-sm w-20">
                    {detail.label}:
                  </span>
                  <span className="text-gray-900 text-sm font-medium ml-3">
                    {detail.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Warning */}
          {warning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">{warning}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled || primaryAction.loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              BUTTON_VARIANTS[secondaryAction.variant || "secondary"]
            } ${secondaryAction.disabled || primaryAction.loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {secondaryAction.label}
          </button>
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
              BUTTON_VARIANTS[primaryAction.variant || "primary"]
            } ${primaryAction.disabled || primaryAction.loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {primaryAction.loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
