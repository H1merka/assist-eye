/**
 * Feature flags — управление незавершёнными/экспериментальными функциями.
 *
 * Когда flag = false, функция:
 * - скрыта из UI
 * - при вызове через голос возвращает «Функция пока недоступна»
 *
 * Значения можно переопределить через .env (FEATURE_*)
 * или удалённый конфиг в будущем.
 */

export const FeatureFlags = {
  /** Классификатор денежных купюр (Should-have) */
  banknoteClassifier: __DEV__ ? false : false,

  /** Голосовой онбординг при первом запуске (Should-have) */
  onboarding: false,

  /** Описание позиции объектов: лево/центр/право (Could-have, post-MVP) */
  objectPosition: false,
} as const;

export type FeatureFlagKey = keyof typeof FeatureFlags;

/**
 * Проверяет, включена ли функция.
 * Единая точка входа — удобно для будущей интеграции с remote config.
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return FeatureFlags[flag];
}
