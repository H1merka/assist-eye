/**
 * Интерфейс key-value хранилища настроек.
 *
 * Ключи: language, tts_voice, tts_rate, tts_volume и др.
 */

export interface SettingsRepository {
  getString(key: string): Promise<string | null>;
  setString(key: string, value: string): Promise<void>;

  getNumber(key: string): Promise<number | null>;
  setNumber(key: string, value: number): Promise<void>;

  getBool(key: string): Promise<boolean | null>;
  setBool(key: string, value: boolean): Promise<void>;

  /** Удалить значение */
  remove(key: string): Promise<void>;

  /** Очистить все настройки */
  clear(): Promise<void>;
}
