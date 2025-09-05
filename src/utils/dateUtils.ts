// ========================================
// UTILITÁRIOS PARA DATAS
// ========================================

import { Timestamp, serverTimestamp } from "firebase/firestore";
import type { FirebaseDate, FirebaseAuditDate } from "../types/permissions";

/**
 * Converte FirebaseDate (Date | Timestamp) para Date
 */
export const fromFirebaseDate = (firebaseDate: FirebaseDate): Date => {
  if (firebaseDate instanceof Date) {
    return firebaseDate;
  }
  if (firebaseDate && typeof firebaseDate.toDate === "function") {
    return firebaseDate.toDate();
  }
  return new Date();
};

/**
 * Converte FirebaseAuditDate (Date | Timestamp | FieldValue) para Date
 * Trata FieldValue como data atual (para serverTimestamp)
 */
export const fromFirebaseAuditDate = (
  firebaseAuditDate: FirebaseAuditDate,
): Date => {
  if (firebaseAuditDate instanceof Date) {
    return firebaseAuditDate;
  }
  // Verifica se é Timestamp (tem método toDate)
  if (
    firebaseAuditDate &&
    "toDate" in firebaseAuditDate &&
    typeof firebaseAuditDate.toDate === "function"
  ) {
    return firebaseAuditDate.toDate();
  }
  // Se for FieldValue (serverTimestamp) ou qualquer outro tipo, retorna data atual
  return new Date();
};

/**
 * SOLUÇÃO DEFINITIVA: Usa serverTimestamp() do Firebase
 * Elimina problemas de fuso horário ao registrar o horário exato do servidor
 */
export const getServerTimestamp = () => {
  return serverTimestamp();
};

/**
 * Normaliza uma data para evitar problemas de fuso horário no Firebase
 * Usa Timestamp.fromDate() para garantir consistência
 */
export const normalizeDateForFirebase = (date: Date | string): Date => {
  let localDate: Date;

  if (typeof date === "string") {
    // Para strings de data (YYYY-MM-DD), criar data no fuso horário local
    const [year, month, day] = date.split("-").map(Number);
    localDate = new Date(year, month - 1, day, 12, 0, 0, 0);
  } else {
    // Para objetos Date, criar nova data no fuso horário local
    localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );
  }

  return localDate;
};

/**
 * Converte uma data para Timestamp do Firebase preservando o fuso horário local
 * SOLUÇÃO DEFINITIVA para problemas de fuso horário
 */
export const toFirebaseTimestamp = (date: Date | string): Timestamp => {
  const normalizedDate = normalizeDateForFirebase(date);
  return Timestamp.fromDate(normalizedDate);
};

/**
 * Converte uma data para string ISO preservando o fuso horário local
 * Alternativa para casos onde Timestamp não é necessário
 */
export const toLocalISOString = (date: Date | string): string => {
  const normalizedDate = normalizeDateForFirebase(date);

  // Criar string ISO no fuso horário local
  const year = normalizedDate.getFullYear();
  const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
  const day = String(normalizedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T12:00:00.000Z`;
};

/**
 * Obtém a data atual no formato YYYY-MM-DD (fuso horário local)
 */
export const getCurrentDateString = (): string => {
  const hoje = new Date();
  return hoje.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
};

/**
 * Obtém a data atual como objeto Date (fuso horário local)
 */
export const getCurrentDateLocal = (): Date => {
  return new Date();
};

/**
 * Valida se uma data está no futuro (incluindo hoje)
 */
export const validateFutureDate = (
  date: string,
): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: "Data é obrigatória" };
  }

  const hoje = new Date();
  const hojeLocal = hoje.toLocaleDateString("en-CA");

  if (date < hojeLocal) {
    return { isValid: false, error: "Data não pode ser no passado" };
  }

  return { isValid: true };
};

/**
 * Valida um período de datas
 */
export const validateDatePeriod = (
  startDate: string,
  endDate: string,
  maxDays: number = 365,
): { isValid: boolean; error?: string } => {
  if (!startDate || !endDate) {
    return { isValid: false, error: "Datas são obrigatórias" };
  }

  if (endDate <= startDate) {
    return {
      isValid: false,
      error: "Data de fim deve ser posterior à data de início",
    };
  }

  const diffDays = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays > maxDays) {
    return {
      isValid: false,
      error: `O período não pode exceder ${maxDays} dias`,
    };
  }

  return { isValid: true };
};

/**
 * Formata uma data para exibição no formato brasileiro
 */
export const formatDateBR = (date: Date | string | FirebaseDate): string => {
  const dateObj =
    typeof date === "string" ? new Date(date) : fromFirebaseDate(date);
  return dateObj.toLocaleDateString("pt-BR");
};

/**
 * Formata uma data para exibição no formato brasileiro com hora
 */
export const formatDateTimeBR = (
  date: Date | string | FirebaseDate,
): string => {
  const dateObj =
    typeof date === "string" ? new Date(date) : fromFirebaseDate(date);
  return dateObj.toLocaleString("pt-BR");
};
