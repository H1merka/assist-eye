/**
 * Утилиты предобработки изображений перед ML-inference.
 *
 * В React Native нет встроенного аналога Flutter image-пакета,
 * поэтому тяжёлые операции (яркость, контраст, crop) выполняются
 * через нативные модули или react-native-skia.
 *
 * Этот модуль предоставляет TypeScript-обёртки с единым API.
 */

import {
  BANKNOTE_CROP_RATIO,
  IMAGE_MAX_DIMENSION,
  YOLO_INPUT_SIZE,
} from '@core/constants/appConstants';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { Logger } from '@core/utils/logger';
import { Image } from 'react-native';

export interface ImageSize {
  width: number;
  height: number;
}

export async function getImageSize(uri: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      error => reject(error),
    );
  });
}

/**
 * Downscale изображения если какая-либо сторона > IMAGE_MAX_DIMENSION.
 * Сохраняет aspect ratio.
 */
export async function downscaleIfNeeded(uri: string): Promise<string> {
  try {
    const size = await getImageSize(uri);
    if (size.width <= IMAGE_MAX_DIMENSION && size.height <= IMAGE_MAX_DIMENSION) {
      return uri; // Resize не нужен
    }

    const isLandscape = size.width > size.height;
    const newWidth = isLandscape
      ? IMAGE_MAX_DIMENSION
      : Math.round((size.width / size.height) * IMAGE_MAX_DIMENSION);
    const newHeight = isLandscape
      ? Math.round((size.height / size.width) * IMAGE_MAX_DIMENSION)
      : IMAGE_MAX_DIMENSION;

    Logger.info(
      'ImagePreprocessing',
      `Downscaling image from ${size.width}x${size.height} to ${newWidth}x${newHeight}`,
    );

    // Resize with JPEG output, 85 quality
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      newWidth,
      newHeight,
      'JPEG',
      85,
      0,
      undefined,
      false,
      { mode: 'contain', onlyScaleDown: true },
    );

    return resizedImage.uri;
  } catch (error) {
    Logger.error('ImagePreprocessing', 'Failed to downscale image', error);
    return uri; // Fallback to original image
  }
}

/**
 * Автокоррекция яркости и контраста для OCR.
 * Пока не поддерживается в JS-слое нативно, оставляем как есть.
 */
export async function autoAdjustBrightnessContrast(uri: string): Promise<string> {
  return uri;
}

/**
 * Crop центральной области для классификации купюр.
 * Вырезает центральный квадрат.
 */
export async function cropCenterForBanknote(uri: string): Promise<string> {
  try {
    const size = await getImageSize(uri);
    const cropWidth = size.width * BANKNOTE_CROP_RATIO;
    const cropHeight = size.height * BANKNOTE_CROP_RATIO;

    Logger.info('ImagePreprocessing', `Cropping center for banknote: ${cropWidth}x${cropHeight}`);

    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      cropWidth,
      cropHeight,
      'JPEG',
      90,
      0,
      undefined,
      false,
      { mode: 'cover' },
    );

    return resizedImage.uri;
  } catch (error) {
    Logger.error('ImagePreprocessing', 'Failed to crop banknote center', error);
    return uri;
  }
}

/**
 * Resize изображения до указанного квадратного размера.
 */
export async function resizeSquare(uri: string, size: number): Promise<string> {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      size,
      size,
      'JPEG',
      90,
      0,
      undefined,
      false,
      { mode: 'stretch' },
    );
    return resizedImage.uri;
  } catch (error) {
    Logger.error('ImagePreprocessing', 'Failed to square-resize image', error);
    return uri;
  }
}

/**
 * Convert image at `uri` into an RGB(A) tensor suitable for TFLite.
 *
 * NOTE: Proper pixel extraction should be implemented in native code or
 * via a Frame Processor (react-native-vision-camera + worklets). This
 * JS implementation provides a safe fallback for tests/dev: it resizes
 * the image to `size` and returns a zero-filled Uint8Array of length
 * `size * size * 3` (RGB), which satisfies callers expecting a buffer.
 */
export async function convertImageToRGBATensor(
  uri: string,
  width: number = YOLO_INPUT_SIZE,
  height: number = YOLO_INPUT_SIZE,
): Promise<Uint8Array> {
  try {
    await resizeSquare(uri, Math.max(width, height));

    // Proper decoding of JPEG -> raw pixels requires native support.
    // Placeholder: create zeroed RGB buffer of requested size.
    return new Uint8Array(width * height * 3);
  } catch (e) {
    Logger.error('ImagePreprocessing', 'convertImageToRGBATensor failed', e);
    return new Uint8Array(width * height * 3);
  }
}

/**
 * Convert a Vision Camera `frame` (worklet thread) to RGB tensor using the worklet.
 * This function is intended to be called from a frame-processor worklet context.
 */
export function convertFrameToRGBATensorFromWorklet(
  frame: any,
  width: number = YOLO_INPUT_SIZE,
  height: number = YOLO_INPUT_SIZE,
): Uint8Array {
  const convertWorklet =
    require('@features/objectDetection/frameProcessor/convertFrameToTensor.worklet').default;
  if (typeof convertWorklet === 'function') {
    // run on worklet: convertWorklet(frame, width, height)
    // In practice this file will be executed on the worklet thread; here we just forward the call.
    return convertWorklet(frame, width, height);
  }
  return new Uint8Array(width * height * 3);
}
