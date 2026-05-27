import Constants from 'expo-constants';

type EnvLike = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

type ExpoExtra = Record<string, unknown>;

function getEnv() {
  return (globalThis as EnvLike).process?.env;
}

function getExpoExtra(): ExpoExtra {
  const configExtra = Constants.expoConfig?.extra as ExpoExtra | undefined;
  const manifestExtra = (Constants as {manifest?: {extra?: ExpoExtra}}).manifest?.extra;
  const manifest2Extra = (Constants as {manifest2?: {extra?: ExpoExtra}}).manifest2?.extra;
  return configExtra ?? manifest2Extra ?? manifestExtra ?? {};
}

function getEnvValue(key: string): string {
  const env = getEnv();
  const envValue = env?.[key];
  if (envValue) {
    return envValue;
  }
  const extra = getExpoExtra();
  const extraValue = extra[key];
  return typeof extraValue === 'string' ? extraValue : '';
}

export function getYandexMapKitApiKey(): string {
  const extra = getExpoExtra();
  const extraKey = extra.mapKitApiKey;
  return (
    getEnvValue('EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY') ||
    (typeof extraKey === 'string' ? extraKey : '')
  );
}

export function getYandexRoutingApiKey(): string {
  const extra = getExpoExtra();
  const extraKey = extra.yandexRoutingApiKey;
  return (
    getEnvValue('EXPO_PUBLIC_YANDEX_ROUTING_API_KEY') ||
    (typeof extraKey === 'string' ? extraKey : '') ||
    getYandexMapKitApiKey()
  );
}

export function getYandexGeocoderApiKey(): string {
  const extra = getExpoExtra();
  const extraKey = extra.yandexGeocoderApiKey;
  return (
    getEnvValue('EXPO_PUBLIC_YANDEX_GEOCODER_API_KEY') ||
    (typeof extraKey === 'string' ? extraKey : '') ||
    getYandexMapKitApiKey()
  );
}
