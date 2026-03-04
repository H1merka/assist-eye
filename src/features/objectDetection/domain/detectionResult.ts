/**
 * Модель результата детекции объекта.
 */

export interface DetectionResult {
  /** Название объекта (из label map) */
  label: string;

  /** Уверенность модели (0–1) */
  confidence: number;

  /** Bounding box: [x, y, width, height] в пикселях исходного изображения */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
