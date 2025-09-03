import { useState, useCallback } from "react";
import { useDateValidation } from "./useDateValidation";
import { useDateConversion } from "./useDateConversion";

export interface DateFormData {
  startDate: string;
  endDate: string;
  type?: "temporary" | "permanent";
}

export interface DateFormErrors {
  startDate?: string;
  endDate?: string;
  period?: string;
}

/**
 * Hook customizado para gerenciamento de formulários de datas
 * Gerencia estado e validações, mas NUNCA altera dados originais
 */
export const useDateForm = (initialData: DateFormData) => {
  const [formData, setFormData] = useState<DateFormData>(initialData);
  const [errors, setErrors] = useState<DateFormErrors>({});

  const { validateDate, validatePeriod } = useDateValidation();
  const { normalizeForFirebase, getCurrentDateString } = useDateConversion();

  /**
   * Atualiza um campo do formulário
   */
  const updateField = useCallback(
    (field: keyof DateFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpar erro do campo quando atualizado
      if (errors[field as keyof DateFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Limpar erro de período se ambas as datas foram atualizadas
      if (field === "startDate" || field === "endDate") {
        if (errors.period) {
          setErrors((prev) => ({ ...prev, period: undefined }));
        }
      }
    },
    [errors],
  );

  /**
   * Valida um campo específico
   */
  const validateField = useCallback(
    (field: keyof DateFormData) => {
      const newErrors: DateFormErrors = { ...errors };

      if (field === "startDate") {
        const validation = validateDate(formData.startDate);
        if (!validation.isValid) {
          newErrors.startDate = validation.error;
        } else {
          delete newErrors.startDate;
        }
      }

      if (field === "endDate") {
        const validation = validateDate(formData.endDate);
        if (!validation.isValid) {
          newErrors.endDate = validation.error;
        } else {
          delete newErrors.endDate;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, errors, validateDate],
  );

  /**
   * Valida o período completo
   */
  const validatePeriodForm = useCallback(() => {
    const newErrors: DateFormErrors = { ...errors };

    // Validação individual das datas
    if (formData.startDate) {
      const startValidation = validateDate(formData.startDate);
      if (!startValidation.isValid) {
        newErrors.startDate = startValidation.error;
      } else {
        delete newErrors.startDate;
      }
    }

    if (formData.endDate) {
      const endValidation = validateDate(formData.endDate);
      if (!endValidation.isValid) {
        newErrors.endDate = endValidation.error;
      } else {
        delete newErrors.endDate;
      }
    }

    // Validação do período
    if (formData.startDate && formData.endDate) {
      const periodValidation = validatePeriod(
        formData.startDate,
        formData.endDate,
      );
      if (!periodValidation.isValid) {
        newErrors.period = periodValidation.error;
      } else {
        delete newErrors.period;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, errors, validateDate, validatePeriod]);

  /**
   * Valida todo o formulário
   */
  const validateForm = useCallback(() => {
    const newErrors: DateFormErrors = {};

    // Validações específicas baseadas no tipo de formulário
    if (formData.type === "temporary") {
      // Para alterações temporárias, ambas as datas são obrigatórias
      if (!formData.startDate) {
        newErrors.startDate = "Data de início é obrigatória";
      } else {
        const startValidation = validateDate(formData.startDate);
        if (!startValidation.isValid) {
          newErrors.startDate = startValidation.error;
        }
      }

      if (!formData.endDate) {
        newErrors.endDate = "Data de fim é obrigatória";
      } else {
        const endValidation = validateDate(formData.endDate);
        if (!endValidation.isValid) {
          newErrors.endDate = endValidation.error;
        }
      }

      // Validação do período
      if (formData.startDate && formData.endDate) {
        const periodValidation = validatePeriod(
          formData.startDate,
          formData.endDate,
        );
        if (!periodValidation.isValid) {
          newErrors.period = periodValidation.error;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDate, validatePeriod]);

  /**
   * Obtém dados normalizados para Firebase (sem alterar dados originais)
   */
  const getNormalizedData = useCallback(() => {
    return {
      ...formData,
      startDate: formData.startDate
        ? normalizeForFirebase(formData.startDate)
        : undefined,
      endDate: formData.endDate
        ? normalizeForFirebase(formData.endDate)
        : undefined,
    };
  }, [formData, normalizeForFirebase]);

  /**
   * Obtém dados normalizados para Firebase com Timestamps
   */
  const getNormalizedDataWithTimestamps = useCallback(() => {
    return {
      ...formData,
      startDate: formData.startDate
        ? normalizeForFirebase(formData.startDate)
        : undefined,
      endDate: formData.endDate
        ? normalizeForFirebase(formData.endDate)
        : undefined,
    };
  }, [formData, normalizeForFirebase]);

  /**
   * Define data mínima para início (hoje)
   */
  const getMinStartDate = useCallback((): string => {
    return getCurrentDateString();
  }, [getCurrentDateString]);

  /**
   * Define data mínima para fim (data de início + 1 dia)
   */
  const getMinEndDate = useCallback((): string => {
    if (!formData.startDate) return getCurrentDateString();

    const startDate = new Date(formData.startDate);
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);

    return nextDay.toLocaleDateString("en-CA");
  }, [formData.startDate, getCurrentDateString]);

  /**
   * Reseta o formulário para valores iniciais
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  /**
   * Limpa todos os erros
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateField,
    validatePeriodForm,
    validateForm,
    getNormalizedData,
    getNormalizedDataWithTimestamps,
    getMinStartDate,
    getMinEndDate,
    resetForm,
    clearErrors,
    setFormData,
    setErrors,
  };
};
