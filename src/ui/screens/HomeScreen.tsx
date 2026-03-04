/**
 * HomeScreen — главный экран приложения.
 *
 * - Крупная кнопка голосовой активации (центр)
 * - Статус текущей операции
 * - Навигация в настройки и историю
 * - Все элементы с accessibilityLabel / accessibilityHint
 */

import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {AccessibleButton} from '../components/AccessibleButton';
import {useCommandProcessor} from '@features/commandProcessor/store/commandStore';
import {Colors, Typography} from '../theme/appTheme';
import type {RootStackParamList} from '@navigation/RootNavigator';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen(): React.JSX.Element {
  const {t} = useTranslation();
  const navigation = useNavigation<HomeNavProp>();
  const {state, lastResult, errorMessage} = useCommandProcessor();

  const handleVoiceActivation = useCallback(() => {
    // TODO: Реализовать:
    //   1. Haptic feedback (короткий тон начала)
    //   2. speechRecognizer.startListening()
    //   3. По результату → commandProcessor.processVoiceInput(text)
  }, []);

  const statusText = (() => {
    switch (state) {
      case 'listening':
        return t('status.listening');
      case 'processing':
        return t('status.processing');
      case 'success':
        return lastResult ?? '';
      case 'error':
        return errorMessage ?? t('status.error');
      default:
        return t('status.ready');
    }
  })();

  return (
    <View style={styles.container} accessible accessibilityLabel={t('home.screenLabel')}>
      {/* Статус */}
      <View style={styles.statusContainer}>
        <Text
          style={styles.statusText}
          accessible
          accessibilityRole="text"
          accessibilityLabel={statusText}
          accessibilityLiveRegion="polite"
        >
          {statusText}
        </Text>
      </View>

      {/* Главная кнопка */}
      <View style={styles.mainButtonContainer}>
        <AccessibleButton
          label={t('home.voiceButton')}
          accessibilityLabel={t('home.voiceButtonA11y')}
          accessibilityHint={t('home.voiceButtonHint')}
          onPress={handleVoiceActivation}
          style={styles.mainButton}
          labelStyle={styles.mainButtonLabel}
        />
      </View>

      {/* Навигация */}
      <View style={styles.navContainer}>
        <AccessibleButton
          label={t('home.settings')}
          accessibilityLabel={t('home.settingsA11y')}
          onPress={() => navigation.navigate('Settings')}
          style={styles.navButton}
        />
        <AccessibleButton
          label={t('home.history')}
          accessibilityLabel={t('home.historyA11y')}
          onPress={() => navigation.navigate('History')}
          style={styles.navButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...Typography.bodyLarge,
    color: Colors.light.onSurface,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  mainButtonContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonLabel: {
    ...Typography.headlineMedium,
    color: Colors.light.onPrimary,
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 32,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
