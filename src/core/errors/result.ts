/**
 * Result<T> — единый контракт возврата для всех модулей.
 *
 * Аналог sealed class из Flutter-версии.
 * Каждый модуль (OCR, CV, ASR, TTS) возвращает Result,
 * Command Processor обрабатывает через discriminated union.
 *
 * @example
 * ```ts
 * const result = await ocrService.recognize(imageBytes);
 * if (result.ok) {
 *   tts.speak(result.data);
 * } else {
 *   logger.error(result.errorCode);
 *   tts.speak(result.userMessage);
 * }
 * ```
 */

export type Result<T> = Success<T> | Failure;

export interface Success<T> {
  readonly ok: true;
  readonly data: T;
}

export interface Failure {
  readonly ok: false;
  readonly errorCode: string;
  readonly userMessage: string;
}

/** Фабрики для удобного создания */
export function success<T>(data: T): Success<T> {
  return {ok: true, data};
}

export function failure(errorCode: string, userMessage: string): Failure {
  return {ok: false, errorCode, userMessage};
}
