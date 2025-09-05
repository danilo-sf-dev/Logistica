import { useCallback } from "react";
import { DateService } from "../services/DateService";
import type { FirebaseDate } from "../types/permissions";

/**
 * Hook customizado para conversão de datas
 * SÓ converte, NUNCA altera dados (separação de responsabilidades)
 */
export const useDateConversion = () => {
  /**
   * Normaliza data para Firebase (evita problemas de fuso horário)
   */
  const normalizeForFirebase = useCallback((date: string | Date): Date => {
    return DateService.normalizeForFirebase(date);
  }, []);

  /**
   * Converte data para Timestamp do Firebase
   */
  const toFirebaseTimestamp = useCallback((date: string | Date) => {
    return DateService.toFirebaseTimestamp(date);
  }, []);

  /**
   * Obtém timestamp do servidor Firebase
   */
  const getServerTimestamp = useCallback(() => {
    return DateService.getServerTimestamp();
  }, []);

  /**
   * Formata data para exibição
   */
  const formatForDisplay = useCallback(
    (date: Date | string | FirebaseDate): string => {
      return DateService.formatForDisplay(date);
    },
    [],
  );

  /**
   * Formata data para exibição com hora
   */
  const formatDateTimeForDisplay = useCallback(
    (date: Date | string | FirebaseDate): string => {
      return DateService.formatDateTimeForDisplay(date);
    },
    [],
  );

  /**
   * Converte FirebaseDate para Date
   */
  const fromFirebaseDate = useCallback((firebaseDate: FirebaseDate): Date => {
    return DateService.fromFirebaseDate(firebaseDate);
  }, []);

  /**
   * Converte data para string ISO preservando fuso horário local
   */
  const toLocalISOString = useCallback((date: Date | string): string => {
    return DateService.toLocalISOString(date);
  }, []);

  /**
   * Obtém data atual no formato YYYY-MM-DD
   */
  const getCurrentDateString = useCallback((): string => {
    return DateService.getCurrentDateString();
  }, []);

  /**
   * Obtém data atual como objeto Date
   */
  const getCurrentDateLocal = useCallback((): Date => {
    return DateService.getCurrentDateLocal();
  }, []);

  /**
   * Calcula diferença em dias entre duas datas
   */
  const getDaysDifference = useCallback(
    (startDate: string, endDate: string): number => {
      return DateService.getDaysDifference(startDate, endDate);
    },
    [],
  );

  /**
   * Verifica se uma data está entre duas outras datas
   */
  const isDateBetween = useCallback(
    (date: string, startDate: string, endDate: string): boolean => {
      return DateService.isDateBetween(date, startDate, endDate);
    },
    [],
  );

  return {
    normalizeForFirebase,
    toFirebaseTimestamp,
    getServerTimestamp,
    formatForDisplay,
    formatDateTimeForDisplay,
    fromFirebaseDate,
    toLocalISOString,
    getCurrentDateString,
    getCurrentDateLocal,
    getDaysDifference,
    isDateBetween,
  };
};
