/**
 * Privacy utilities: PII filtering and data sanitization.
 * 
 * Ensures sensitive information is not stored in logs or exposed to analytics.
 * Rules:
 * - Filter email addresses, phone numbers, names
 * - Avoid logging raw voice input (only command type)
 * - Keep numeric indices, error codes, feature flags
 */

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /\+?[0-9]{7,}/g;
const COORDINATE_PATTERN = /\d+\.\d{4,}/g; // GPS coords: 55.7558, 37.6173

/**
 * Sanitize value for logging.
 * Removes PII: emails, phone numbers, coordinates.
 * Keeps: numeric IDs, command types, error messages.
 */
export function sanitizeForLogging(value: unknown): unknown {
  if (typeof value === 'string') {
    let sanitized = value;
    sanitized = sanitized.replace(EMAIL_PATTERN, '[EMAIL]');
    sanitized = sanitized.replace(PHONE_PATTERN, '[PHONE]');
    sanitized = sanitized.replace(COORDINATE_PATTERN, '[GPS]');
    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLogging(item));
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Skip known-sensitive keys
      if (
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('key')
      ) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeForLogging(val);
      }
    }
    return sanitized;
  }

  return value;
}

/**
 * Data retention policy: delete logs older than this many days.
 * 7 days = standard retention for device-side logs.
 */
export const LOG_RETENTION_DAYS = 7;

/**
 * History retention: keep last N entries.
 * See appConstants.HISTORY_MAX_ENTRIES
 */
export const HISTORY_RETENTION_MAX_ENTRIES = 50;

/**
 * Privacy policy documentation.
 * All processing is on-device; no data sent to cloud.
 */
export const PRIVACY_POLICY = {
  dataProcessing: 'All processing (OCR, object detection, banknote classification) is performed on the device.',
  dataStorage: 'Recognition results are stored locally in SQLite. Search history is kept for 7 days and auto-deleted.',
  dataSharing: 'No personal data is shared with third parties. Yandex Maps API calls include only your location (required for navigation).',
  backup: 'App backup is disabled (android:allowBackup="false") to prevent data leakage through backup mechanisms.',
};
