import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { YamapInstance } from 'react-native-yamap-plus';
import App from './App';

YamapInstance.init(process.env.EXPO_PUBLIC_YANDEX_MAPKIT_API_KEY);
registerRootComponent(App);
