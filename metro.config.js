const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for React Native.
 * @see https://reactnative.dev/docs/metro
 */
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('tflite', 'txt');

const config = {};

module.exports = mergeConfig(defaultConfig, config);
