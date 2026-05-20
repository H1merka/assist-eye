const { withInfoPlist, withAndroidManifest } = require('@expo/config-plugins');

const ANDROID_PERMISSIONS = [
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
];

module.exports = function withPermissions(config) {
  config = withInfoPlist(config, config => {
    config.modResults.NSCameraUsageDescription =
      config.modResults.NSCameraUsageDescription || 'Требуется для съемки изображений';
    config.modResults.NSMicrophoneUsageDescription =
      config.modResults.NSMicrophoneUsageDescription || 'Требуется для записи голоса';
    config.modResults.NSPhotoLibraryAddUsageDescription =
      config.modResults.NSPhotoLibraryAddUsageDescription || 'Требуется для сохранения изображений';
    config.modResults.NSLocationWhenInUseUsageDescription =
      config.modResults.NSLocationWhenInUseUsageDescription || 'Требуется для функций навигации';
    return config;
  });

  return withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }
    ANDROID_PERMISSIONS.forEach((permission) => {
      const exists = manifest['uses-permission'].some(
        entry => entry.$?.['android:name'] === permission,
      );
      if (!exists) {
        manifest['uses-permission'].push({ $: { 'android:name': permission } });
      }
    });
    return config;
  });
};
