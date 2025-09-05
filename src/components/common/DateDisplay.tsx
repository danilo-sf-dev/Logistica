import React from "react";
import { DateService } from "../../services/DateService";
import type { FirebaseDate } from "../../types/permissions";

export interface DateDisplayProps {
  date: Date | string | FirebaseDate;
  format?: "short" | "long" | "time" | "relative";
  className?: string;
  showTime?: boolean;
}

/**
 * Componente reutilizável para exibição de datas
 * SÓ exibe dados, NUNCA processa ou valida
 */
export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  format = "short",
  className = "",
  showTime = false,
}) => {
  const formatDate = (date: Date | string | FirebaseDate) => {
    const dateObj =
      typeof date === "string"
        ? new Date(date)
        : DateService.fromFirebaseDate(date);

    switch (format) {
      case "short":
        return dateObj.toLocaleDateString("pt-BR");
      case "long":
        return dateObj.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "time":
        return dateObj.toLocaleString("pt-BR");
      case "relative":
        return getRelativeTimeString(dateObj);
      default:
        return dateObj.toLocaleDateString("pt-BR");
    }
  };

  const getRelativeTimeString = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffDays > 7) {
      return date.toLocaleDateString("pt-BR");
    } else if (diffDays > 1) {
      return `há ${diffDays} dias`;
    } else if (diffDays === 1) {
      return "ontem";
    } else if (diffHours > 1) {
      return `há ${diffHours} horas`;
    } else if (diffMinutes > 1) {
      return `há ${diffMinutes} minutos`;
    } else {
      return "agora";
    }
  };

  const renderDate = () => {
    const formattedDate = formatDate(date);

    if (showTime && format !== "time" && format !== "relative") {
      const dateObj =
        typeof date === "string"
          ? new Date(date)
          : DateService.fromFirebaseDate(date);
      const timeString = dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <span>
          {formattedDate} às {timeString}
        </span>
      );
    }

    return formattedDate;
  };

  return <span className={className}>{renderDate()}</span>;
};
