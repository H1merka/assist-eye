/// Глобальные константы приложения assist-eye.
///
/// Все «магические числа» из ТЗ собраны здесь, чтобы менять
/// поведение в одном месте, а не искать по всему коду.
class AppConstants {
  AppConstants._(); // Запрет создания экземпляров

  // --------------- Камера ---------------
  /// Максимальное разрешение кадра для OCR (ширина × высота).
  /// Баланс качества и скорости (§5.1 ТЗ).
  static const int cameraMaxWidth = 1280;
  static const int cameraMaxHeight = 960;

  /// Таймаут бездействия камеры — после этого камера авто-деактивируется (§4.6).
  static const Duration cameraInactivityTimeout = Duration(seconds: 30);

  // --------------- ASR ---------------
  /// Таймаут записи голоса (§5.1 ТЗ: ≤ 5 с).
  static const Duration asrListenTimeout = Duration(seconds: 5);

  // --------------- OCR ---------------
  /// Минимальный confidence для блока текста (§5.1e).
  static const double ocrMinConfidence = 0.4;

  /// Максимальный размер изображения — downscale если больше (§5.3).
  static const int imageMaxDimension = 4096;

  // --------------- Детекция объектов ---------------
  /// Размер входного тензора SSD MobileNet v2 (§5.1 сценарий «Опиши»).
  static const int detectorInputSize = 300;

  /// IoU-порог для Non-Maximum Suppression (§ТЗ: 0.45).
  static const double nmsIouThreshold = 0.45;

  /// Минимальный confidence для обычных объектов (§4.3).
  static const double detectionConfidenceThreshold = 0.45;

  /// Повышенный confidence-порог для объектов безопасности
  /// (ступенька, traffic light, stop sign — Приложение A).
  static const double safetyConfidenceThreshold = 0.35;

  /// Максимальное количество озвучиваемых объектов (§5.1: топ-3).
  static const int maxDetectionsToAnnounce = 3;

  // --------------- Классификатор купюр ---------------
  /// Размер входного тензора MobileNet v3-Small (§5.1 сценарий «Купюра»).
  static const int banknoteInputSize = 224;

  /// Crop центральной области кадра (§5.1: 60%).
  static const double banknoteCropRatio = 0.6;

  /// Минимальный confidence для купюры (§5.1: 0.6).
  static const double banknoteMinConfidence = 0.6;

  // --------------- Хранилище ---------------
  /// Максимальное число записей в истории (§4.5).
  static const int historyMaxEntries = 50;

  /// Имя файла БД SQLite.
  static const String databaseName = 'assist_eye.db';

  /// Версия схемы БД (для миграций).
  static const int databaseVersion = 1;

  // --------------- Логирование ---------------
  /// Максимальный размер лог-файла перед ротацией (§8.2).
  static const int logMaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

  /// Количество файлов лога для хранения.
  static const int logMaxFileCount = 3;

  // --------------- ML-модели: жизненный цикл ---------------
  /// Таймаут перед выгрузкой моделей при уходе в фон (§8.3: >60 с).
  static const Duration modelDisposeDelay = Duration(seconds: 60);

  // --------------- UX: обратная связь ---------------
  /// Порог длительной операции для показа «Обрабатываю…» (§5.2: >1.5 с).
  static const Duration longOperationThreshold = Duration(milliseconds: 1500);
}
