const { withInfoPlist, withAppBuildGradle, withEntitlementsPlist } = require('@expo/config-plugins');

module.exports = function withVisionCamera(config) {
  config = withInfoPlist(config, config => {
    config.modResults.NSCameraUsageDescription =
      config.modResults.NSCameraUsageDescription || 'Требуется для работы камеры';
    return config;
  });

  // Note: Additional native Pod settings must be validated after prebuild.
  return config;
};
