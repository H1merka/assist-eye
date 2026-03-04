import 'dart:typed_data';

import 'package:image/image.dart' as img;

import '../constants/app_constants.dart';

/// Утилиты предобработки изображений перед ML-inference (§5.1 ТЗ).
///
/// Все операции выполняются через Flutter `compute()` для вынесения
/// CPU-нагрузки из main isolate.
class ImagePreprocessing {
  ImagePreprocessing._();

  /// Автокоррекция яркости и контраста для OCR (§7.4 ТЗ).
  ///
  /// Вызывается перед подачей кадра в ML Kit Text Recognition.
  /// Выполнять через `compute(adjustBrightnessContrast, imageBytes)`.
  static Uint8List adjustBrightnessContrast(Uint8List imageBytes) {
    // TODO: Декодировать изображение через package:image
    // TODO: Применить автобаланс яркости/контраста
    // TODO: Закодировать обратно и вернуть
    return imageBytes;
  }

  /// Ресайз до заданного квадрата (для SSD MobileNet — 300×300).
  static Uint8List resizeSquare(Uint8List imageBytes, int targetSize) {
    // TODO: Декодировать, ресайзнуть с сохранением пропорций, вернуть
    return imageBytes;
  }

  /// Crop центральной области кадра (для классификатора купюр — 60%).
  static Uint8List cropCenter(Uint8List imageBytes, double ratio) {
    // TODO: Вырезать центральную часть с соотношением ratio
    return imageBytes;
  }

  /// Downscale, если изображение превышает максимальный размер (§5.3: 4096×4096).
  static Uint8List ensureMaxDimension(Uint8List imageBytes) {
    // TODO: Проверить размеры, при превышении — уменьшить
    return imageBytes;
  }
}
