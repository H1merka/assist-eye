/**
 * Абстрактный интерфейс классификатора купюр.
 */

import { Result } from '@core/errors/result';

export interface BanknoteClassifier {
  /**
   * Классифицировать купюру на изображении.
   * @param imageInput — путь к файлу или готовый RGB-тензор
   * @returns название купюры (напр. «500 рублей») или Failure
   */
  classify(imageInput: string | Uint8Array): Promise<Result<string>>;

  /** Загрузить модель */
  initialize(): Promise<Result<void>>;

  /** Освободить ресурсы */
  dispose(): Promise<void>;

  /** Загружена ли модель */
  isReady(): boolean;
}
