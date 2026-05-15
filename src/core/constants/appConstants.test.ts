import {
  BANKNOTE_INPUT_SIZE,
  CAMERA_MAX_HEIGHT,
  CAMERA_MAX_WIDTH,
  DETECTION_TOP_N,
  YOLO_INPUT_SIZE,
} from './appConstants';

describe('appConstants', () => {
  it('defines valid ML input sizes', () => {
    expect(YOLO_INPUT_SIZE).toBeGreaterThan(0);
    expect(BANKNOTE_INPUT_SIZE).toBeGreaterThan(0);
  });

  it('defines camera capture bounds', () => {
    expect(CAMERA_MAX_WIDTH).toBeGreaterThan(0);
    expect(CAMERA_MAX_HEIGHT).toBeGreaterThan(0);
  });

  it('limits the detection result size', () => {
    expect(DETECTION_TOP_N).toBeGreaterThan(0);
  });
});
