/**
 * Абстрактный интерфейс ASR (распознавание речи).
 *
 * Реализация: VoskSpeechRecognizer.
 * В RN Vosk работает через нативный мост (react-native-vosk),
 * recognition loop выполняется на native thread — UI не блокируется.
 */

import { Result } from '@core/errors/result';

export interface SpeechRecognizer {
  /** Инициализация модели (загрузка в память, не в UI-потоке) */
  initialize(language: 'ru' | 'en'): Promise<Result<void>>;

  /** Начать прослушивание микрофона */
  startListening(): Promise<Result<void>>;

  /** Остановить прослушивание */
  stopListening(): Promise<void>;

  /** Освободить ресурсы модели */
  dispose(): Promise<void>;

  /** Подписка на распознанный текст */
  onResult(callback: (text: string) => void): void;

  /** Подписка на частичный результат (partial) */
  onPartialResult(callback: (text: string) => void): void;

  /** Подписка на ошибку */
  onError(callback: (error: string) => void): void;

  /** Загружена ли модель */
  isReady(): boolean;
}
