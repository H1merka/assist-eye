const { withAppDelegate } = require('expo/config-plugins');

/**
 * Expo Config Plugin for react-native-yamap
 * This plugin initializes the Yandex MapKit SDK in the iOS AppDelegate.
 */
const withYandexMaps = (config) => {
  return withAppDelegate(config, (config) => {
    const appDelegate = config.modResults;
    const apiKey = config.extra?.mapKitApiKey;

    if (!apiKey) {
      console.warn('[yamap-plugin] MapKit API key not found in expo.extra.mapKitApiKey');
      return config;
    }

    // 1. Add Header Import
    if (!appDelegate.contents.includes('#import <YandexMapsMobile/YMKMapKitFactory.h>')) {
      appDelegate.contents = appDelegate.contents.replace(
        /#import "AppDelegate.h"/g,
        `#import "AppDelegate.h"\n#import <YandexMapsMobile/YMKMapKitFactory.h>`
      );
    }

    // 2. Prepare Initialization Code
    const mapKitInit = [
      `  [YMKMapKit setApiKey:@"${apiKey}"];`,
      `  [YMKMapKit setLocale:@"ru_RU"];`,
      `  [YMKMapKit mapKit];`,
    ].join('\n');

    // 3. Inject Initialization before return YES
    if (!appDelegate.contents.includes('[YMKMapKit setApiKey:')) {
      // Find the end of didFinishLaunchingWithOptions
      // Usually ends with "return YES;"
      appDelegate.contents = appDelegate.contents.replace(
        /\s+return YES;/g,
        `\n\n${mapKitInit}\n\n  return YES;`
      );
    }

    return config;
  });
};

module.exports = withYandexMaps;
