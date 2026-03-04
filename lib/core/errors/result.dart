import 'package:equatable/equatable.dart';

/// Универсальный тип результата для всех модулей (§8.4 ТЗ).
///
/// Каждый модуль (OCR, CV, ASR, TTS) возвращает `Result<T>`,
/// что позволяет Command Processor единообразно обрабатывать
/// успехи и ошибки, логировать и озвучивать fallback-сообщения.
///
/// Пример использования:
/// ```dart
/// final result = await ocrService.recognizeText(image);
/// switch (result) {
///   case Success(:final data):
///     tts.speak(data);
///   case Failure(:final userMessage):
///     tts.speak(userMessage);
/// }
/// ```
sealed class Result<T> extends Equatable {
  const Result();
}

/// Успешный результат с данными типа [T].
class Success<T> extends Result<T> {
  const Success(this.data);

  final T data;

  @override
  List<Object?> get props => [data];
}

/// Результат с ошибкой.
///
/// [errorCode] — машиночитаемый код для логирования (см. [ErrorCode]).
/// [userMessage] — человекочитаемое сообщение для озвучивания через TTS.
class Failure<T> extends Result<T> {
  const Failure({
    required this.errorCode,
    required this.userMessage,
  });

  final String errorCode;
  final String userMessage;

  @override
  List<Object?> get props => [errorCode, userMessage];
}
