const { withInfoPlist } = require('@expo/config-plugins');

module.exports = function withFastTflite(config) {
  // Minimal plugin: allow adding any required Info.plist keys for TFLite
  config = withInfoPlist(config, config => {
    config.modResults.NSPhotoLibraryAddUsageDescription =
      config.modResults.NSPhotoLibraryAddUsageDescription || 'Требуется для сохранения снимков';
    return config;
  });

  // For advanced Pod tweaks, inspect `ios/Podfile` after `expo prebuild`.
  return config;
};
