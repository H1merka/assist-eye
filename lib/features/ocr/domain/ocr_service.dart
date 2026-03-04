import 'dart:typed_data';

import '../../../core/errors/result.dart';

/// Абстрактный интерфейс OCR-сервиса (§7.4 ТЗ).
///
/// Позволяет подменять реализацию (ML Kit → Tesseract)
/// без изменения Command Processor. Fallback-стратегия:
/// ML Kit (основной) → Tesseract (для устройств без GMS).
abstract class OcrService {
  /// Распознаёт текст на изображении.
  ///
  /// [imageBytes] — байты изображения после preprocessing
  /// (brighness/contrast уже скорректированы).
  ///
  /// Возвращает:
  /// - [Success<String>] с распознанным текстом (блоки слева→направо, сверху→вниз)
  /// - [Failure] с кодом ошибки и сообщением для пользователя
  Future<Result<String>> recognizeText(Uint8List imageBytes);

  /// Освобождает ресурсы (TextRecognizer и др.).
  Future<void> dispose();
}
