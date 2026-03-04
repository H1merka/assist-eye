/**
 * Тесты OCR сервиса (MlKitOcrService).
 */

import {MlKitOcrService} from '../../../src/features/ocr/data/mlKitOcrService';

describe('MlKitOcrService', () => {
  let service: MlKitOcrService;

  beforeEach(() => {
    service = new MlKitOcrService();
  });

  it('возвращает Failure, когда текст не обнаружен (заглушка)', async () => {
    const result = await service.recognize('/fake/path.jpg');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorCode).toBe('OCR_NO_TEXT');
    }
  });

  // TODO: После реализации добавить тесты:
  // - Успешное распознавание (мок ML Kit)
  // - Фильтрация блоков с низким confidence
  // - Сортировка блоков (top→bottom, left→right)
  // - Пустое изображение
  // - Ошибка ML Kit → Processing Failed
});
