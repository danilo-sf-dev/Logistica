import { useCallback } from "react";
import { DateService, type ValidationResult } from "../services/DateService";

/**
 * Hook customizado para validação de datas
 * SÓ valida, NUNCA altera dados (separação de responsabilidades)
 */
export const useDateValidation = () => {
  /**
   * Valida se uma data está no futuro
   */
  const validateDate = useCallback((date: string): ValidationResult => {
    return DateService.validateFutureDate(date);
  }, []);

  /**
   * Valida um período de datas
   */
  const validatePeriod = useCallback(
    (
      startDate: string,
      endDate: string,
      maxDays: number = 365,
    ): ValidationResult => {
      return DateService.validatePeriod(startDate, endDate, maxDays);
    },
    [],
  );

  /**
   * Valida se uma data está entre duas outras datas
   */
  const validateDateInRange = useCallback(
    (date: string, startDate: string, endDate: string): ValidationResult => {
      if (!date) {
        return { isValid: false, error: "Data é obrigatória" };
      }

      if (!DateService.isDateBetween(date, startDate, endDate)) {
        return {
          isValid: false,
          error: "Data deve estar dentro do período especificado",
        };
      }

      return { isValid: true };
    },
    [],
  );

  /**
   * Valida se uma data é válida (formato correto)
   */
  const validateDateFormat = useCallback((date: string): ValidationResult => {
    if (!date) {
      return { isValid: false, error: "Data é obrigatória" };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return { isValid: false, error: "Formato de data inválido" };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: "Data inválida" };
    }

    return { isValid: true };
  }, []);

  /**
   * Validação completa de data (formato + futuro)
   */
  const validateDateComplete = useCallback(
    (date: string): ValidationResult => {
      // Primeiro valida formato
      const formatValidation = validateDateFormat(date);
      if (!formatValidation.isValid) {
        return formatValidation;
      }

      // Depois valida se está no futuro
      return validateDate(date);
    },
    [validateDate, validateDateFormat],
  );

  /**
   * Validação completa de período (formato + lógica + duração)
   */
  const validatePeriodComplete = useCallback(
    (
      startDate: string,
      endDate: string,
      maxDays: number = 365,
    ): ValidationResult => {
      // Valida formato das datas
      const startFormatValidation = validateDateFormat(startDate);
      if (!startFormatValidation.isValid) {
        return {
          isValid: false,
          error: `Data início: ${startFormatValidation.error}`,
        };
      }

      const endFormatValidation = validateDateFormat(endDate);
      if (!endFormatValidation.isValid) {
        return {
          isValid: false,
          error: `Data fim: ${endFormatValidation.error}`,
        };
      }

      // Valida se data início está no futuro
      const startFutureValidation = validateDate(startDate);
      if (!startFutureValidation.isValid) {
        return {
          isValid: false,
          error: `Data início: ${startFutureValidation.error}`,
        };
      }

      // Valida lógica do período
      return validatePeriod(startDate, endDate, maxDays);
    },
    [validateDate, validateDateFormat, validatePeriod],
  );

  return {
    validateDate,
    validatePeriod,
    validateDateInRange,
    validateDateFormat,
    validateDateComplete,
    validatePeriodComplete,
  };
};
