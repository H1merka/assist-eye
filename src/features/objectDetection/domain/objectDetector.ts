/**
 * Абстрактный интерфейс детектора объектов.
 */

import { Result } from '@core/errors/result';
import { DetectionResult } from './detectionResult';

export interface ObjectDetector {
  /**
   * Запустить детекцию на изображении.
   * @param imageInput — путь к файлу или готовый RGB-тензор
   * @returns список обнаруженных объектов (уже после NMS и фильтрации)
   */
  detect(imageInput: string | Uint8Array): Promise<Result<DetectionResult[]>>;

  /** Загрузить модель в память (lazy init) */
  initialize(): Promise<Result<void>>;

  /** Освободить ресурсы модели */
  dispose(): Promise<void>;

  /** Загружена ли модель */
  isReady(): boolean;
}
