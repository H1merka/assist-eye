module.exports = ({ config }) => {
  return {
    ...config,
    icon: './assets/images/icon.png',
    android: {
      ...config.android,
      minSdk: 26,
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#000000',
      },
    },
    extra: {
      ...config.extra,
      mapKitApiKey: process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY,
      yandexRoutingApiKey: process.env.EXPO_PUBLIC_YANDEX_ROUTING_API_KEY,
      yandexGeocoderApiKey: process.env.EXPO_PUBLIC_YANDEX_GEOCODER_API_KEY,
    },
    plugins: [
      ...(config.plugins || []),
      ['./plugins/min-sdk-plugin', { minSdkVersion: 26 }],
      './plugins/permissions-plugin',
      './plugins/vision-camera-plugin',
      './plugins/fast-tflite-plugin',
      './plugins/vosk-plugin',
      './plugins/yamap-plugin',
      'expo-sqlite',
    ],
  };
};
