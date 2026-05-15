module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './',
          '@core': './src/core',
          '@features': './src/features',
          '@ui': './src/ui',
          '@navigation': './src/navigation',
          '@i18n': './src/i18n',
          '@assets': './assets',
        },
      },
    ],
    ['react-native-worklets-core/plugin'],
  ],
};
