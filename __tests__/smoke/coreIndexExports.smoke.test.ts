import * as core from '../../src/core';

describe('core index exports smoke', () => {
  it('exports key API members', () => {
    expect(typeof core.success).toBe('function');
    expect(typeof core.failure).toBe('function');
    expect(typeof core.isFeatureEnabled).toBe('function');
    expect(typeof core.Logger).toBe('object');
  });

  it('exports known error code constants', () => {
    expect(core.OCR_NO_TEXT).toBe('OCR_NO_TEXT');
    expect(core.DETECTION_MODEL_FAILED).toBe('DETECTION_MODEL_FAILED');
  });
});
