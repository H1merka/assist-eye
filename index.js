import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import YaMap from 'react-native-yamap';
import App from './App';

YaMap.init(process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY);
registerRootComponent(App);
