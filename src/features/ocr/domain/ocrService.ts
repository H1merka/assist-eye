/**
 * Абстрактный интерфейс OCR-сервиса.
 */

import { Result } from '@core/errors/result';

export interface OcrService {
  /**
   * Распознать текст на изображении.
   * @param imageUri — путь к файлу изображения
   * @returns распознанный текст или Failure
   */
  recognize(imageUri: string): Promise<Result<string>>;

  /** Освободить ресурсы */
  dispose(): Promise<void>;
}
