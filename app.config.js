module.exports = ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      minSdk: 26,
    },
    extra: {
      ...config.extra,
      mapKitApiKey: process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY,
    },
    plugins: [
      ...(config.plugins || []),
      ['./plugins/min-sdk-plugin', { minSdkVersion: 26 }],
      './plugins/vision-camera-plugin',
      './plugins/fast-tflite-plugin',
      './plugins/vosk-plugin',
      './plugins/yamap-plugin',
      'expo-sqlite',
    ],
  };
};
