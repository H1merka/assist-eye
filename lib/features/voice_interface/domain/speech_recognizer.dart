/// Абстрактный интерфейс распознавателя речи.
///
/// Позволяет подменять реализацию (Vosk → другой движок)
/// без изменения Command Processor.
abstract class SpeechRecognizer {
  /// Инициализирует ASR-движок и загружает модель для [languageCode].
  ///
  /// [languageCode] — 'ru' или 'en'.
  /// Возвращает `true`, если модель успешно загружена.
  Future<bool> initialize(String languageCode);

  /// Начинает прослушивание микрофона.
  ///
  /// Возвращает распознанный текст или `null` при таймауте/ошибке.
  /// Таймаут: [AppConstants.asrListenTimeout] (5 с).
  Future<String?> listen();

  /// Останавливает прослушивание.
  Future<void> stop();

  /// Проверяет, загружена ли модель для текущего языка.
  bool get isModelLoaded;

  /// Проверяет, идёт ли сейчас распознавание.
  bool get isListening;

  /// Освобождает ресурсы ASR-движка.
  Future<void> dispose();
}
