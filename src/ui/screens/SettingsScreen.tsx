/**
 * SettingsScreen — экран настроек.
 *
 * - Язык интерфейса / ASR
 * - Голос TTS
 * - Скорость речи (слайдер 0.5×–2.0×)
 * - Очистка истории
 */

import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AccessibleButton} from '../components/AccessibleButton';
import {Colors, Typography} from '../theme/appTheme';

export function SettingsScreen(): React.JSX.Element {
  const {t} = useTranslation();

  const handleClearHistory = useCallback(() => {
    // TODO: historyRepository.clearHistory()
    // TODO: ttsService.speak(t('settings.historyCleared'))
  }, [t]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessible
      accessibilityLabel={t('settings.screenLabel')}
    >
      {/* Язык */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {t('settings.language')}
        </Text>
        {/* TODO: Переключатель языка (RU / EN) */}
        <Text style={styles.placeholder}>TODO: Language picker</Text>
      </View>

      {/* Голос TTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {t('settings.voice')}
        </Text>
        {/* TODO: Список голосов из ttsService.getAvailableVoices() */}
        <Text style={styles.placeholder}>TODO: Voice picker</Text>
      </View>

      {/* Скорость речи */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {t('settings.speechRate')}
        </Text>
        {/* TODO: Slider 0.5–2.0 с accessibilityValue */}
        <Text style={styles.placeholder}>TODO: Rate slider (0.5×–2.0×)</Text>
      </View>

      {/* Очистка */}
      <View style={styles.section}>
        <AccessibleButton
          label={t('settings.clearHistory')}
          accessibilityLabel={t('settings.clearHistoryA11y')}
          accessibilityHint={t('settings.clearHistoryHint')}
          onPress={handleClearHistory}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.titleLarge,
    color: Colors.light.onSurface,
    marginBottom: 12,
  },
  placeholder: {
    ...Typography.bodyMedium,
    color: Colors.light.outline,
    fontStyle: 'italic',
  },
});
