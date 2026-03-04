/// Абстрактный интерфейс сервиса синтеза речи (§7.3 ТЗ).
abstract class TtsService {
  /// Инициализирует TTS-движок.
  ///
  /// [languageCode] — 'ru' или 'en'.
  Future<void> initialize(String languageCode);

  /// Озвучивает текст.
  ///
  /// Сообщения добавляются в очередь FIFO (§8.2 ТЗ).
  Future<void> speak(String text);

  /// Останавливает текущее озвучивание и очищает очередь.
  ///
  /// Вызывается по команде «Стоп» (§5.1).
  Future<void> stop();

  /// Устанавливает скорость речи.
  ///
  /// [rate] — от 0.5 до 2.0 (§4.1 ТЗ).
  Future<void> setRate(double rate);

  /// Устанавливает громкость.
  ///
  /// [volume] — от 0.0 до 1.0.
  Future<void> setVolume(double volume);

  /// Устанавливает голос из доступных в системе.
  Future<void> setVoice(String voiceName);

  /// Возвращает список доступных голосов для текущего языка.
  Future<List<String>> getAvailableVoices();

  /// Освобождает ресурсы TTS.
  Future<void> dispose();
}
