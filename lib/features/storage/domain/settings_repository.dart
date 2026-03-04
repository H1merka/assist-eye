/// Репозиторий пользовательских настроек (§4.5 ТЗ).
///
/// Key-value хранилище в SQLite. Настройки:
/// - Язык интерфейса / ASR ('ru' / 'en')
/// - Голос TTS
/// - Скорость речи (0.5–2.0)
/// - Feature flags (перезаписываемые)
abstract class SettingsRepository {
  /// Получает строковую настройку по ключу.
  Future<String?> getString(String key);

  /// Сохраняет строковую настройку.
  Future<void> setString(String key, String value);

  /// Получает числовую настройку.
  Future<double?> getDouble(String key);

  /// Сохраняет числовую настройку.
  Future<void> setDouble(String key, double value);

  /// Получает булеву настройку.
  Future<bool> getBool(String key, {bool defaultValue = false});

  /// Сохраняет булеву настройку.
  Future<void> setBool(String key, bool value);

  /// Ключи настроек — для единообразия.
  static const String keyLanguage = 'language';
  static const String keyTtsVoice = 'tts_voice';
  static const String keyTtsRate = 'tts_rate';
  static const String keyTtsVolume = 'tts_volume';
  static const String keyOnboardingComplete = 'onboarding_complete';
}
