/**
 * Строковые коды ошибок по модулям.
 *
 * Используются в Failure.errorCode для логирования
 * и маршрутизации восстановления (recovery).
 * userMessage — то, что озвучивается пользователю через TTS.
 */

// ---------- Camera ----------
export const CAMERA_BUSY = 'CAMERA_BUSY';
export const CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED';
export const CAMERA_INIT_FAILED = 'CAMERA_INIT_FAILED';

// ---------- ASR ----------
export const ASR_TIMEOUT = 'ASR_TIMEOUT';
export const ASR_MODEL_NOT_LOADED = 'ASR_MODEL_NOT_LOADED';
export const ASR_RECOGNITION_FAILED = 'ASR_RECOGNITION_FAILED';
export const MIC_PERMISSION_DENIED = 'MIC_PERMISSION_DENIED';

// ---------- OCR ----------
export const OCR_NO_TEXT = 'OCR_NO_TEXT';
export const OCR_LOW_CONFIDENCE = 'OCR_LOW_CONFIDENCE';
export const OCR_PROCESSING_FAILED = 'OCR_PROCESSING_FAILED';

// ---------- Object Detection ----------
export const DETECTION_NO_OBJECTS = 'DETECTION_NO_OBJECTS';
export const DETECTION_MODEL_FAILED = 'DETECTION_MODEL_FAILED';
export const DETECTION_MODEL_NOT_LOADED = 'DETECTION_MODEL_NOT_LOADED';

// ---------- Banknote ----------
export const BANKNOTE_LOW_CONFIDENCE = 'BANKNOTE_LOW_CONFIDENCE';
export const BANKNOTE_MODEL_FAILED = 'BANKNOTE_MODEL_FAILED';
export const BANKNOTE_FEATURE_DISABLED = 'BANKNOTE_FEATURE_DISABLED';

// ---------- TTS ----------
export const TTS_INIT_FAILED = 'TTS_INIT_FAILED';
export const TTS_SPEAK_FAILED = 'TTS_SPEAK_FAILED';

// ---------- Storage ----------
export const STORAGE_READ_FAILED = 'STORAGE_READ_FAILED';
export const STORAGE_WRITE_FAILED = 'STORAGE_WRITE_FAILED';
export const STORAGE_DB_INIT_FAILED = 'STORAGE_DB_INIT_FAILED';

// ---------- Model Download ----------
export const MODEL_DOWNLOAD_FAILED = 'MODEL_DOWNLOAD_FAILED';
export const MODEL_DOWNLOAD_NO_NETWORK = 'MODEL_DOWNLOAD_NO_NETWORK';

// ---------- Navigation ----------
export const NAVIGATION_API_KEY_MISSING = 'NAVIGATION_API_KEY_MISSING';
export const NAVIGATION_OFFLINE = 'NAVIGATION_OFFLINE';
export const NAVIGATION_GEOCODE_FAILED = 'NAVIGATION_GEOCODE_FAILED';
export const NAVIGATION_ROUTE_FAILED = 'NAVIGATION_ROUTE_FAILED';
