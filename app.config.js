const { name, version } = require('./package.json');

module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      ...(config.expo || {}),
      name: name,
      version: version,
      ios: {
        ...(config.expo?.ios || {}),
        bundleIdentifier: 'com.example.assisteye',
      },
      android: {
        ...(config.expo?.android || {}),
        package: 'com.example.assisteye',
      },
      plugins: [
        './plugins/permissions-plugin',
        './plugins/vision-camera-plugin',
        './plugins/fast-tflite-plugin',
        './plugins/vosk-plugin',
        './plugins/yamap-plugin',
        'expo-sqlite',
      ],
      extra: {
        mapKitApiKey: process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY,
      },
    },
  };
};
