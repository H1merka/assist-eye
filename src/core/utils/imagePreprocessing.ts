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
  SSD_INPUT_SIZE,
  BANKNOTE_INPUT_SIZE,
} from '@core/constants/appConstants';

// TODO: Подключить react-native-skia или написать нативный модуль
// для операций с пикселями. Текущие функции — заглушки с описанием контракта.

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Downscale изображения если какая-либо сторона > IMAGE_MAX_DIMENSION.
 * Сохраняет aspect ratio.
 *
 * @param uri — путь к файлу изображения
 * @returns путь к обработанному файлу (или тот же, если downscale не нужен)
 */
export async function downscaleIfNeeded(uri: string): Promise<string> {
  // TODO: Реализовать:
  //   1. Прочитать размеры изображения
  //   2. Если max(w, h) > IMAGE_MAX_DIMENSION → resize с сохранением пропорций
  //   3. Вернуть путь к новому файлу
  return uri;
}

/**
 * Автокоррекция яркости и контраста для OCR.
 * Применяет histogram equalization или простую линейную нормализацию.
 *
 * @param uri — путь к файлу
 * @returns путь к обработанному файлу
 */
export async function autoAdjustBrightnessContrast(uri: string): Promise<string> {
  // TODO: Реализовать через нативный модуль или react-native-skia
  return uri;
}

/**
 * Crop центральной области для классификации купюр.
 * Вырезает центральный квадрат с долей BANKNOTE_CROP_RATIO.
 *
 * @param uri — путь к файлу
 * @returns путь к обрезанному файлу
 */
export async function cropCenterForBanknote(uri: string): Promise<string> {
  // TODO: Реализовать crop центральных BANKNOTE_CROP_RATIO от ширины/высоты
  return uri;
}

/**
 * Resize изображения до указанного квадратного размера.
 *
 * @param uri — путь к файлу
 * @param size — целевой размер стороны (px)
 * @returns путь к обработанному файлу
 */
export async function resizeSquare(uri: string, size: number): Promise<string> {
  // TODO: Реализовать resize с padding или stretch
  return uri;
}
