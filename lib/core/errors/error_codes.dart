/// Коды ошибок для единообразного логирования (§8.4 ТЗ).
///
/// Используются в [Failure.errorCode]. Машиночитаемые —
/// содержат префикс модуля для быстрой фильтрации логов.
class ErrorCode {
  ErrorCode._();

  // --- Камера ---
  static const String cameraBusy = 'CAMERA_BUSY';
  static const String cameraPermissionDenied = 'CAMERA_PERMISSION_DENIED';
  static const String cameraInitFailed = 'CAMERA_INIT_FAILED';

  // --- ASR ---
  static const String asrTimeout = 'ASR_TIMEOUT';
  static const String asrModelNotLoaded = 'ASR_MODEL_NOT_LOADED';
  static const String asrCommandNotRecognized = 'ASR_COMMAND_NOT_RECOGNIZED';
  static const String micPermissionDenied = 'MIC_PERMISSION_DENIED';

  // --- OCR ---
  static const String ocrNoText = 'OCR_NO_TEXT';
  static const String ocrLowQuality = 'OCR_LOW_QUALITY';
  static const String ocrProcessingFailed = 'OCR_PROCESSING_FAILED';

  // --- Детекция объектов ---
  static const String detectionNoObjects = 'DETECTION_NO_OBJECTS';
  static const String detectionModelFailed = 'DETECTION_MODEL_FAILED';

  // --- Классификатор купюр ---
  static const String banknoteFeatureDisabled = 'BANKNOTE_FEATURE_DISABLED';
  static const String banknoteLowConfidence = 'BANKNOTE_LOW_CONFIDENCE';
  static const String banknoteModelFailed = 'BANKNOTE_MODEL_FAILED';

  // --- TTS ---
  static const String ttsInitFailed = 'TTS_INIT_FAILED';

  // --- Хранилище ---
  static const String storageReadFailed = 'STORAGE_READ_FAILED';
  static const String storageWriteFailed = 'STORAGE_WRITE_FAILED';

  // --- Модели (общие) ---
  static const String modelNotDownloaded = 'MODEL_NOT_DOWNLOADED';
  static const String modelCorrupted = 'MODEL_CORRUPTED';
}
