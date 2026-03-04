/**
 * Все «магические числа» из ТЗ собраны в одном месте.
 * Менять пороги, таймауты и лимиты — только здесь.
 */

// ---------- Confidence thresholds ----------

/** Минимальный confidence для озвучивания обычного объекта */
export const CONFIDENCE_THRESHOLD_DEFAULT = 0.45;

/** Пониженный порог для объектов безопасности (ступени, traffic light, stop sign) */
export const CONFIDENCE_THRESHOLD_SAFETY = 0.35;

/** Минимальный confidence для классификации купюр */
export const CONFIDENCE_THRESHOLD_BANKNOTE = 0.6;

/** Минимальный confidence OCR-блока для озвучивания */
export const CONFIDENCE_THRESHOLD_OCR = 0.4;

/** IoU-порог для Non-Maximum Suppression */
export const NMS_IOU_THRESHOLD = 0.45;

// ---------- Timeouts (ms) ----------

/** Авто-отключение камеры после бездействия */
export const CAMERA_INACTIVITY_TIMEOUT_MS = 30_000;

/** Время ожидания голосовой команды (ASR) */
export const ASR_LISTEN_TIMEOUT_MS = 5_000;

/** Время бездействия модели в фоне до выгрузки */
export const MODEL_DISPOSE_TIMEOUT_MS = 60_000;

/** Таймаут для промежуточного сообщения «Обрабатываю…» */
export const PROCESSING_FEEDBACK_DELAY_MS = 1_500;

// ---------- Image sizes ----------

/** Входной размер SSD MobileNet v2 */
export const SSD_INPUT_SIZE = 300;

/** Входной размер MobileNet v3-Small (купюры) */
export const BANKNOTE_INPUT_SIZE = 224;

/** Максимальное разрешение захвата камеры */
export const CAMERA_MAX_WIDTH = 1280;
export const CAMERA_MAX_HEIGHT = 960;

/** Максимальный размер изображения (downscale если больше) */
export const IMAGE_MAX_DIMENSION = 4096;

/** Crop-доля для купюр (центральная область) */
export const BANKNOTE_CROP_RATIO = 0.6;

// ---------- Limits ----------

/** Максимум записей в истории распознаваний */
export const HISTORY_MAX_ENTRIES = 50;

/** Максимальный размер лог-файла (байт) */
export const LOG_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Количество хранимых лог-файлов */
export const LOG_MAX_FILES = 3;

/** Количество объектов для озвучивания (топ-N) */
export const DETECTION_TOP_N = 3;

// ---------- TTS ----------

/** Минимальная скорость речи */
export const TTS_RATE_MIN = 0.5;

/** Максимальная скорость речи */
export const TTS_RATE_MAX = 2.0;

/** Скорость речи по умолчанию */
export const TTS_RATE_DEFAULT = 1.0;

// ---------- UI ----------

/** Минимальный touch-target (dp) для accessibility */
export const MIN_TOUCH_TARGET = 48;
