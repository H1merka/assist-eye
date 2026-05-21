type EnvLike = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

function getEnv() {
  return (globalThis as EnvLike).process?.env;
}

export function getYandexMapKitApiKey(): string {
  const env = getEnv();
  return env?.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY ?? '';
}

export function getYandexRoutingApiKey(): string {
  const env = getEnv();
  return env?.EXPO_PUBLIC_YANDEX_ROUTING_API_KEY ?? env?.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY ?? '';
}

export function getYandexGeocoderApiKey(): string {
  const env = getEnv();
  return env?.EXPO_PUBLIC_YANDEX_GEOCODER_API_KEY ?? env?.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY ?? '';
}
