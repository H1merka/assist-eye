import { parseYoloOutput } from '@features/ml/utils/yoloPostprocess';
import { argmax, formatBanknoteLabel, softmax } from '@features/ml/utils/classification';

describe('yoloPostprocess', () => {
  it('parses YOLO output in channels-first layout', () => {
    const labels = ['a', 'b'];
    const output = new Float32Array([
      320, 100,
      320, 100,
      40, 20,
      40, 20,
      0.1, 0.8,
      0.9, 0.2,
    ]);
    const shape = [1, 6, 2];
    const detections = parseYoloOutput(output, shape, labels, 640);

    expect(detections.length).toBeGreaterThan(0);
    expect(detections[0]?.label).toBe('b');
    expect(detections[0]?.confidence).toBeGreaterThan(0.8);
  });
});

describe('classification utils', () => {
  it('formats numeric banknote labels', () => {
    expect(formatBanknoteLabel('500')).toBe('500 рублей');
  });

  it('returns softmax probabilities', () => {
    const probs = softmax([1, 2, 3]);
    const sum = probs.reduce((acc, value) => acc + value, 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(argmax(probs).index).toBe(2);
  });
});
