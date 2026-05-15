const { withInfoPlist } = require('@expo/config-plugins');

module.exports = function withPermissions(config) {
  return withInfoPlist(config, config => {
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
};
