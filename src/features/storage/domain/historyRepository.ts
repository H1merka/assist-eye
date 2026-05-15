/**
 * Интерфейс репозитория истории распознаваний.
 * Лимит: HISTORY_MAX_ENTRIES (50) записей.
 */

import { HistoryEntry } from './historyEntry';

export interface HistoryRepository {
  /** Добавить запись. Если превышен лимит — удалить самую старую. */
  addEntry(entry: Omit<HistoryEntry, 'id'>): Promise<void>;

  /** Получить последнюю запись (для команды «Повтори») */
  getLastEntry(): Promise<HistoryEntry | null>;

  /** Получить все записи (новые первыми) */
  getAllEntries(): Promise<HistoryEntry[]>;

  /** Очистить всю историю */
  clearHistory(): Promise<void>;
}
