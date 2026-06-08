import {
  CONFIDENCE_THRESHOLD_DEFAULT,
  CONFIDENCE_THRESHOLD_SAFETY,
  DETECTION_TOP_N,
  NMS_IOU_THRESHOLD,
  YOLO_INPUT_SIZE,
} from '@core/constants/appConstants';
import type { DetectionResult } from '@features/objectDetection/domain/detectionResult';

type RawDetection = DetectionResult & { classId: number };

const SAFETY_LABEL_KEYWORDS = ['люк', 'яма', 'трещина', 'бордюр', 'столб', 'забор'];

function isSafetyLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return SAFETY_LABEL_KEYWORDS.some(keyword => lower.includes(keyword));
}

function getConfidenceThreshold(label: string): number {
  return isSafetyLabel(label) ? CONFIDENCE_THRESHOLD_SAFETY : CONFIDENCE_THRESHOLD_DEFAULT;
}

function toFloatArray(data: ArrayLike<number>): Float32Array {
  if (data instanceof Float32Array) {
    return data;
  }
  return Float32Array.from(data as ArrayLike<number>);
}

function computeIoU(a: RawDetection, b: RawDetection): number {
  const x1 = Math.max(a.boundingBox.x, b.boundingBox.x);
  const y1 = Math.max(a.boundingBox.y, b.boundingBox.y);
  const x2 = Math.min(
    a.boundingBox.x + a.boundingBox.width,
    b.boundingBox.x + b.boundingBox.width,
  );
  const y2 = Math.min(
    a.boundingBox.y + a.boundingBox.height,
    b.boundingBox.y + b.boundingBox.height,
  );

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  if (intersection <= 0) {
    return 0;
  }

  const areaA = a.boundingBox.width * a.boundingBox.height;
  const areaB = b.boundingBox.width * b.boundingBox.height;
  return intersection / (areaA + areaB - intersection);
}

function applyNms(detections: RawDetection[], iouThreshold: number): RawDetection[] {
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: RawDetection[] = [];

  for (const candidate of sorted) {
    const overlaps = kept.some(existing => computeIoU(existing, candidate) > iouThreshold);
    if (!overlaps) {
      kept.push(candidate);
    }
  }

  return kept;
}

function parseBoxValues(values: Float32Array, labels: string[], inputSize: number): RawDetection | null {
  if (values.length < 5) {
    return null;
  }

  const scoresOffset = 4;
  const scores = values.subarray(scoresOffset);
  if (scores.length === 0) {
    return null;
  }

  let bestClassId = 0;
  let bestScore = scores[0];
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > bestScore) {
      bestScore = scores[i];
      bestClassId = i;
    }
  }

  const label = labels[bestClassId] ?? `class_${bestClassId}`;
  if (bestScore < getConfidenceThreshold(label)) {
    return null;
  }

  const [cx, cy, w, h] = values;
  const width = Math.max(0, w);
  const height = Math.max(0, h);
  const x = Math.max(0, cx - width / 2);
  const y = Math.max(0, cy - height / 2);

  return {
    label,
    confidence: bestScore,
    classId: bestClassId,
    boundingBox: {
      x: Math.min(x, inputSize),
      y: Math.min(y, inputSize),
      width: Math.min(width, inputSize),
      height: Math.min(height, inputSize),
    },
  };
}

export function parseYoloOutput(
  output: ArrayLike<number>,
  outputShape: number[],
  labels: string[],
  inputSize: number = YOLO_INPUT_SIZE,
): DetectionResult[] {
  const values = toFloatArray(output);
  const numClasses = labels.length;
  const channels = numClasses + 4;

  let rows: Float32Array[] = [];

  if (outputShape.length === 3) {
    const [, dimA, dimB] = outputShape;
    if (dimA === channels) {
      const numBoxes = dimB;
      rows = Array.from({ length: numBoxes }, (_, boxIndex) => {
        const row = new Float32Array(channels);
        for (let channel = 0; channel < channels; channel++) {
          row[channel] = values[channel * numBoxes + boxIndex];
        }
        return row;
      });
    } else if (dimB === channels) {
      const numBoxes = dimA;
      rows = Array.from({ length: numBoxes }, (_, boxIndex) =>
        values.subarray(boxIndex * channels, (boxIndex + 1) * channels),
      );
    }
  } else if (outputShape.length === 2) {
    const [, dimB] = outputShape;
    if (dimB === channels) {
      const numBoxes = outputShape[0];
      rows = Array.from({ length: numBoxes }, (_, boxIndex) =>
        values.subarray(boxIndex * channels, (boxIndex + 1) * channels),
      );
    }
  }

  const parsed = rows
    .map(row => parseBoxValues(row, labels, inputSize))
    .filter((item): item is RawDetection => item !== null);

  const deduped = applyNms(parsed, NMS_IOU_THRESHOLD);
  const uniqueByLabel = new Map<string, RawDetection>();
  for (const detection of deduped) {
    const existing = uniqueByLabel.get(detection.label);
    if (!existing || existing.confidence < detection.confidence) {
      uniqueByLabel.set(detection.label, detection);
    }
  }

  return [...uniqueByLabel.values()]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, DETECTION_TOP_N)
    .map(({ classId: _classId, ...result }) => result);
}
