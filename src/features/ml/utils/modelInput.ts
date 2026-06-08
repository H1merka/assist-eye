import type { Tensor } from 'react-native-fast-tflite';
import { convertImageToRGBATensor } from '@core/utils/imagePreprocessing';

type TypedArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array;

function isNchw(shape: number[]): boolean {
  return shape.length === 4 && shape[1] === 3;
}

function getInputSpatialSize(shape: number[]): { width: number; height: number } {
  if (isNchw(shape)) {
    return { height: shape[2] ?? 0, width: shape[3] ?? 0 };
  }
  return { height: shape[1] ?? 0, width: shape[2] ?? 0 };
}

function sampleRgb(
  rgb: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): Uint8Array {
  const output = new Uint8Array(targetWidth * targetHeight * 3);
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return output;
  }

  const xRatio = sourceWidth / targetWidth;
  const yRatio = sourceHeight / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const sourceY = Math.min(sourceHeight - 1, Math.floor(y * yRatio));
    for (let x = 0; x < targetWidth; x++) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor(x * xRatio));
      const sourceIndex = (sourceY * sourceWidth + sourceX) * 3;
      const targetIndex = (y * targetWidth + x) * 3;
      output[targetIndex] = rgb[sourceIndex] ?? 0;
      output[targetIndex + 1] = rgb[sourceIndex + 1] ?? 0;
      output[targetIndex + 2] = rgb[sourceIndex + 2] ?? 0;
    }
  }

  return output;
}

function normalizeRgbForFloat(rgb: Uint8Array, normalizeToUnit: boolean): Float32Array {
  const output = new Float32Array(rgb.length);
  if (normalizeToUnit) {
    for (let i = 0; i < rgb.length; i++) {
      output[i] = rgb[i] / 255;
    }
    return output;
  }

  for (let i = 0; i < rgb.length; i++) {
    output[i] = rgb[i];
  }
  return output;
}

export function rgbTensorToModelInput(
  rgb: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  inputTensor: Tensor,
  options?: { floatInputScale?: 'unit' | 'raw' },
): TypedArray {
  const shape = inputTensor.shape;
  const { width: targetWidth, height: targetHeight } = getInputSpatialSize(shape);
  const sampled =
    sourceWidth === targetWidth && sourceHeight === targetHeight
      ? rgb
      : sampleRgb(rgb, sourceWidth, sourceHeight, targetWidth, targetHeight);

  const floatScale = options?.floatInputScale ?? 'unit';

  if (inputTensor.dataType === 'uint8' || inputTensor.dataType === 'int8') {
    return sampled;
  }

  const floatValues = normalizeRgbForFloat(sampled, floatScale === 'unit');
  if (!isNchw(shape)) {
    return floatValues;
  }

  const chw = new Float32Array(floatValues.length);
  const planeSize = targetWidth * targetHeight;
  for (let i = 0; i < planeSize; i++) {
    chw[i] = floatValues[i * 3];
    chw[planeSize + i] = floatValues[i * 3 + 1];
    chw[planeSize * 2 + i] = floatValues[i * 3 + 2];
  }
  return chw;
}

export function toRgbUint8Array(
  imageInput: string | ArrayLike<number>,
  side: number,
): Promise<Uint8Array> {
  if (typeof imageInput !== 'string') {
    if (imageInput instanceof Uint8Array) {
      return Promise.resolve(imageInput);
    }
    return Promise.resolve(Uint8Array.from(imageInput));
  }

  return convertImageToRGBATensor(imageInput, side, side);
}
