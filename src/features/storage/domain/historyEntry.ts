/**
 * Модель записи истории распознаваний.
 */

export interface HistoryEntry {
  id?: number;
  /** Тип операции: 'ocr' | 'detection' | 'banknote' */
  type: string;
  /** Текстовый результат */
  resultText: string;
  /** Дата создания (ISO 8601) */
  createdAt: string;
}
