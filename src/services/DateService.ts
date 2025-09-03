import { Timestamp, FieldValue } from "firebase/firestore";
import {
  normalizeDateForFirebase,
  toFirebaseTimestamp,
  getServerTimestamp as getServerTimestampUtil,
  validateFutureDate as validateFutureDateUtil,
  validateDatePeriod as validateDatePeriodUtil,
  formatDateBR,
  getCurrentDateString as getCurrentDateStringUtil,
} from "../utils/dateUtils";
import type { FirebaseDate } from "../types/permissions";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Serviço centralizado para todas as operações de data
 * Segue o princípio de separação de responsabilidades
 */
export class DateService {
  /**
   * Normaliza data para Firebase (evita problemas de fuso horário)
   */
  static normalizeForFirebase(date: string | Date): Date {
    return normalizeDateForFirebase(date);
  }

  /**
   * Converte data para Timestamp do Firebase
   */
  static toFirebaseTimestamp(date: string | Date): Timestamp {
    return toFirebaseTimestamp(date);
  }

  /**
   * Obtém timestamp do servidor Firebase
   */
  static getServerTimestamp(): FieldValue {
    return getServerTimestampUtil();
  }

  /**
   * Valida se data está no futuro
   */
  static validateFutureDate(date: string): ValidationResult {
    return validateFutureDateUtil(date);
  }

  /**
   * Valida período de datas
   */
  static validatePeriod(
    startDate: string,
    endDate: string,
    maxDays: number = 365,
  ): ValidationResult {
    return validateDatePeriodUtil(startDate, endDate, maxDays);
  }

  /**
   * Formata data para exibição
   */
  static formatForDisplay(date: Date | string | FirebaseDate): string {
    return formatDateBR(date);
  }

  /**
   * Obtém data atual no formato YYYY-MM-DD
   */
  static getCurrentDateString(): string {
    return getCurrentDateStringUtil();
  }

  /**
   * Obtém data atual como objeto Date
   */
  static getCurrentDateLocal(): Date {
    return new Date();
  }

  /**
   * Converte FirebaseDate para Date
   */
  static fromFirebaseDate(firebaseDate: FirebaseDate): Date {
    if (firebaseDate instanceof Date) {
      return firebaseDate;
    }
    if (firebaseDate && typeof firebaseDate.toDate === "function") {
      return firebaseDate.toDate();
    }
    return new Date();
  }

  /**
   * Converte data para string ISO preservando fuso horário local
   */
  static toLocalISOString(date: Date | string): string {
    const normalizedDate = this.normalizeForFirebase(date);
    const year = normalizedDate.getFullYear();
    const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
    const day = String(normalizedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T12:00:00.000Z`;
  }

  /**
   * Formata data para exibição com hora
   */
  static formatDateTimeForDisplay(date: Date | string | FirebaseDate): string {
    const dateObj =
      typeof date === "string" ? new Date(date) : this.fromFirebaseDate(date);
    return dateObj.toLocaleString("pt-BR");
  }

  /**
   * Calcula diferença em dias entre duas datas
   */
  static getDaysDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se uma data está entre duas outras datas (inclusive)
   */
  static isDateBetween(
    date: string,
    startDate: string,
    endDate: string,
  ): boolean {
    const targetDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return targetDate >= start && targetDate <= end;
  }
}
