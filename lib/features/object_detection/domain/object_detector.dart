import 'dart:typed_data';

import '../../../core/errors/result.dart';
import 'detection_result.dart';

/// Абстрактный интерфейс детектора объектов (§7.5 ТЗ).
abstract class ObjectDetector {
  /// Детекция объектов на изображении.
  ///
  /// [imageBytes] — байты изображения (будут ресайзнуты до 300×300 внутри).
  ///
  /// Возвращает список обнаруженных объектов после NMS (IoU=0.45),
  /// отфильтрованных по confidence ≥ 0.45 (или 0.35 для объектов безопасности).
  Future<Result<List<DetectionResult>>> detect(Uint8List imageBytes);

  /// Освобождает TFLite Interpreter и связанные ресурсы.
  Future<void> dispose();
}
