import 'react-native-gesture-handler';
import { Image } from 'react-native';

// Polyfill for react-native-sound and other old libraries
if (typeof global.resolveAssetSource === 'undefined') {
  global.resolveAssetSource = Image.resolveAssetSource;
}
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { YamapInstance } from 'react-native-yamap-plus';
import App from './App';

const mapKitKey =
  process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY ||
  Constants.expoConfig?.extra?.mapKitApiKey ||
  Constants.manifest?.extra?.mapKitApiKey ||
  Constants.manifest2?.extra?.mapKitApiKey ||
  '';

if (mapKitKey) {
  YamapInstance.init(mapKitKey);
}
registerRootComponent(App);
