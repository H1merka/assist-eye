const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Config Plugin: sets android.minSdkVersion in gradle.properties.
 * This is the correct way to override minSdkVersion in Expo SDK 55+,
 * as the value is read from the Gradle property `android.minSdkVersion`
 * by the expo-modules-autolinking plugin (ExpoAutolinkingSettingsExtension.kt).
 */
const withMinSdk = (config, { minSdkVersion }) => {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;

    // Remove existing entry if present
    const filtered = properties.filter(
      (item) => !(item.type === 'property' && item.key === 'android.minSdkVersion')
    );

    // Add the new value
    filtered.push({
      type: 'property',
      key: 'android.minSdkVersion',
      value: String(minSdkVersion),
    });

    config.modResults = filtered;
    return config;
  });
};

module.exports = withMinSdk;
