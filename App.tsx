/**
 * AssistEye — корневой компонент приложения.
 *
 * Инициализация провайдеров навигации, i18n, и глобального состояния.
 * ML-модели НЕ загружаются здесь — используется lazy loading
 * при первом вызове соответствующей команды.
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootNavigator} from '@navigation/RootNavigator';
import {initI18n} from '@i18n/i18n';
import {initDatabase} from '@features/storage/data/databaseHelper';
import {Logger} from '@core/utils/logger';

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Инициализация сервисов при первом рендере
    const bootstrap = async (): Promise<void> => {
      try {
        await initI18n();
        await initDatabase();
        Logger.info('App', 'Приложение инициализировано');
      } catch (error) {
        Logger.error('App', 'Ошибка инициализации', error);
      }
    };

    bootstrap();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
