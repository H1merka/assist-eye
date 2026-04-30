import {
  CONFIDENCE_THRESHOLD_DEFAULT,
  CONFIDENCE_THRESHOLD_OCR,
  DETECTION_TOP_N,
  IMAGE_MAX_DIMENSION,
  MIN_TOUCH_TARGET,
} from '../../src/core/constants/appConstants';

describe('appConstants smoke', () => {
  it('contains thresholds in expected ranges', () => {
    expect(CONFIDENCE_THRESHOLD_DEFAULT).toBeGreaterThan(0);
    expect(CONFIDENCE_THRESHOLD_DEFAULT).toBeLessThanOrEqual(1);
    expect(CONFIDENCE_THRESHOLD_OCR).toBeGreaterThan(0);
    expect(CONFIDENCE_THRESHOLD_OCR).toBeLessThanOrEqual(1);
  });

  it('contains positive operational limits', () => {
    expect(DETECTION_TOP_N).toBeGreaterThan(0);
    expect(IMAGE_MAX_DIMENSION).toBeGreaterThan(0);
    expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44);
  });
});
