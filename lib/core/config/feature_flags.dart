/// Feature flags для управления незавершёнными функциями (§4.7 ТЗ).
///
/// Если флаг отключён, соответствующая команда не отображается в UI
/// и возвращает «Функция пока недоступна» при попытке вызова.
///
/// В MVP значения захардкожены; в будущем можно переключить
/// на Remote Config или загрузку из .env.
class FeatureFlags {
  FeatureFlags._();

  /// Классификатор денежных купюр (Should-have, §4.7).
  /// Скрыт за флагом до готовности модели и прохождения тестов.
  static const bool banknoteClassifier = false;

  /// Голосовой туториал при первом запуске (Should-have, §4.8).
  static const bool voiceOnboarding = false;

  /// Описание расположения объектов (Could-have, §4.9).
  static const bool objectPositionDescription = false;
}
