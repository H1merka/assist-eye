import 'dart:typed_data';

import '../../../core/errors/result.dart';

/// Абстрактный интерфейс классификатора денежных купюр (§4.7 ТЗ).
///
/// Should-have фича, защищена feature flag.
/// Если [FeatureFlags.banknoteClassifier] == false,
/// Command Processor возвращает «Функция пока недоступна».
abstract class BanknoteClassifier {
  /// Классифицирует купюру на изображении.
  ///
  /// [imageBytes] — байты изображения (crop центра 60% уже выполнен).
  ///
  /// Возвращает:
  /// - [Success<String>] с описанием («500 рублей»)
  /// - [Failure] при низком confidence или ошибке
  Future<Result<String>> classify(Uint8List imageBytes);

  /// Освобождает ресурсы.
  Future<void> dispose();
}
