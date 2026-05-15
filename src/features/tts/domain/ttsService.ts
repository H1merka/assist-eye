/**
 * Абстрактный интерфейс TTS-сервиса.
 */

export interface TtsService {
  /** Озвучить текст. Добавляется в FIFO-очередь. */
  speak(text: string): Promise<void>;

  /** Остановить текущее озвучивание и очистить очередь */
  stop(): Promise<void>;

  /** Установить скорость речи (0.5–2.0) */
  setRate(rate: number): Promise<void>;

  /** Установить громкость (0.0–1.0) */
  setVolume(volume: number): Promise<void>;

  /** Установить язык */
  setLanguage(language: string): Promise<void>;

  /** Получить список доступных голосов */
  getAvailableVoices(): Promise<string[]>;

  /** Установить конкретный голос */
  setVoice(voiceId: string): Promise<void>;
}
