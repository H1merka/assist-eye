const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo.
 */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('tflite', 'txt');

module.exports = config;
