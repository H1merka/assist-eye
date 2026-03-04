import 'package:equatable/equatable.dart';

/// Результат детекции одного объекта (§8.2 ТЗ).
class DetectionResult extends Equatable {
  const DetectionResult({
    required this.label,
    required this.confidence,
    required this.boundingBox,
  });

  /// Человекочитаемое название объекта (например, «бутылка»).
  final String label;

  /// Уверенность модели (0.0 – 1.0).
  final double confidence;

  /// Bounding box: [left, top, right, bottom] в нормализованных координатах.
  final List<double> boundingBox;

  @override
  List<Object?> get props => [label, confidence, boundingBox];
}
