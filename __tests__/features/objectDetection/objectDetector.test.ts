/**
 * Тесты Object Detector (TfliteObjectDetector).
 */

import {TfliteObjectDetector} from '../../../src/features/objectDetection/data/tfliteObjectDetector';

describe('TfliteObjectDetector', () => {
  let detector: TfliteObjectDetector;

  beforeEach(() => {
    detector = new TfliteObjectDetector();
  });

  afterEach(async () => {
    await detector.dispose();
  });

  it('начинает в состоянии не загружен', () => {
    expect(detector.isReady()).toBe(false);
  });

  it('detect возвращает ошибку, если модель не загружена', async () => {
    const result = await detector.detect('/fake.jpg');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorCode).toBe('DETECTION_MODEL_NOT_LOADED');
    }
  });

  it('initialize меняет состояние на ready', async () => {
    const result = await detector.initialize();
    expect(result.ok).toBe(true);
    expect(detector.isReady()).toBe(true);
  });

  it('dispose сбрасывает состояние', async () => {
    await detector.initialize();
    await detector.dispose();
    expect(detector.isReady()).toBe(false);
  });

  // TODO: После реализации inference — тесты:
  // - Топ-3 объектов
  // - NMS (IoU = 0.45)
  // - Пороги confidence (0.45 обычные, 0.35 безопасность)
  // - Пустое изображение → DETECTION_NO_OBJECTS
});
