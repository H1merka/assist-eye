export {
  CONFIDENCE_THRESHOLD_DEFAULT,
  CONFIDENCE_THRESHOLD_SAFETY,
  CONFIDENCE_THRESHOLD_BANKNOTE,
  CONFIDENCE_THRESHOLD_OCR,
  NMS_IOU_THRESHOLD,
  CAMERA_INACTIVITY_TIMEOUT_MS,
  ASR_LISTEN_TIMEOUT_MS,
  MODEL_DISPOSE_TIMEOUT_MS,
  PROCESSING_FEEDBACK_DELAY_MS,
  YOLO_INPUT_SIZE,
  BANKNOTE_INPUT_SIZE,
  CAMERA_MAX_WIDTH,
  CAMERA_MAX_HEIGHT,
  IMAGE_MAX_DIMENSION,
  BANKNOTE_CROP_RATIO,
  HISTORY_MAX_ENTRIES,
  LOG_MAX_FILE_SIZE_BYTES,
  LOG_MAX_FILES,
  DETECTION_TOP_N,
  TTS_RATE_MIN,
  TTS_RATE_MAX,
  TTS_RATE_DEFAULT,
  MIN_TOUCH_TARGET,
} from './constants/appConstants';

export { FeatureFlags, isFeatureEnabled } from './config/featureFlags';
export type { FeatureFlagKey } from './config/featureFlags';

export { success, failure } from './errors/result';
export type { Result, Success, Failure } from './errors/result';

export * from './errors/errorCodes';

export { Logger } from './utils/logger';
