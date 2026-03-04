/**
 * Абстрактный интерфейс классификатора купюр.
 */

import {Result} from '@core/errors/result';

export interface BanknoteClassifier {
  /**
   * Классифицировать купюру на изображении.
   * @param imageUri — путь к файлу (уже обрезанный/ресайзнутый)
   * @returns название купюры (напр. «500 рублей») или Failure
   */
  classify(imageUri: string): Promise<Result<string>>;

  /** Загрузить модель */
  initialize(): Promise<Result<void>>;

  /** Освободить ресурсы */
  dispose(): Promise<void>;

  /** Загружена ли модель */
  isReady(): boolean;
}
