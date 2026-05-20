type EnvLike = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

export function getYandexMapKitApiKey(): string {
  const env = (globalThis as EnvLike).process?.env;
  return env?.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY ?? '';
}
