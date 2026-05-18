// ─── RÜVEL — Registro de Práctica y Rachas ──────────────────────────────────

import { getStorage, setStorage } from './storage';

export interface PracticeLog {
  dates: string[]; // fechas ISO 'YYYY-MM-DD' en que practicó
  totalMinutes: number; // minutos acumulados de práctica
}

export type PracticeStore = Record<string, PracticeLog>;

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function getPracticeLog(studentId: string): PracticeLog {
  const store = getStorage<PracticeStore>('practice_log', {});
  return store[studentId] || { dates: [], totalMinutes: 0 };
}

// Registra una sesión de práctica de hoy
export function logPractice(studentId: string, minutes: number): PracticeLog {
  const store = getStorage<PracticeStore>('practice_log', {});
  const log = store[studentId] || { dates: [], totalMinutes: 0 };
  const today = todayStr();
  if (!log.dates.includes(today)) {
    log.dates = [...log.dates, today];
  }
  log.totalMinutes += minutes;
  store[studentId] = log;
  setStorage('practice_log', store);
  return log;
}

// Calcula la racha actual de días consecutivos
export function getStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  // Si no practicó hoy, la racha puede seguir contando desde ayer
  if (!set.has(cursor.toISOString().split('T')[0])) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(cursor.toISOString().split('T')[0])) return 0;
  }
  while (set.has(cursor.toISOString().split('T')[0])) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function practicedToday(dates: string[]): boolean {
  return dates.includes(todayStr());
}
