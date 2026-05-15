import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { useApp, Language } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPEED_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const SPEED_LABELS: Record<number, string> = {
  0.5: '0.5x',
  0.75: '0.75x',
  1.0: '1x',
  1.25: '1.25x',
  1.5: '1.5x',
  2.0: '2x',
};

export default function SettingsScreen() {
  const {
    language,
    setLanguage,
    speechSpeed,
    setSpeechSpeed,
    vibrationEnabled,
    setVibrationEnabled,
    history,
    clearHistory,
    t,
  } = useApp();

  const currentSpeedIndex = SPEED_STEPS.indexOf(speechSpeed);

  const decreaseSpeed = () => {
    if (currentSpeedIndex > 0) {
      setSpeechSpeed(SPEED_STEPS[currentSpeedIndex - 1]);
    }
  };

  const increaseSpeed = () => {
    if (currentSpeedIndex < SPEED_STEPS.length - 1) {
      setSpeechSpeed(SPEED_STEPS[currentSpeedIndex + 1]);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(t('settings.clearHistory'), t('settings.clearHistoryHint'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: clearHistory,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle} accessibilityRole={'header' as AccessibilityRole}>
          {t('settings.screenLabel')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
          <View style={styles.languageRow}>
            {(['EN', 'RU'] as Language[]).map(lang => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                accessibilityLabel={lang === 'EN' ? 'English' : 'Russian'}
                accessibilityHint={t('settings.languageHint')}
                accessibilityRole={'button' as AccessibilityRole}
                accessibilityState={{ selected: language === lang }}
                style={[styles.langButton, language === lang && styles.langButtonActive]}
              >
                <Text
                  style={[styles.langButtonText, language === lang && styles.langButtonTextActive]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{t('settings.speechRate')}</Text>
            <Text style={styles.speedValue}>{SPEED_LABELS[speechSpeed]}</Text>
          </View>

          <View style={styles.speedRow}>
            <TouchableOpacity
              onPress={decreaseSpeed}
              disabled={currentSpeedIndex === 0}
              accessibilityLabel={t('common.slow')}
              accessibilityHint={t('settings.speechRateDown')}
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityState={{ disabled: currentSpeedIndex === 0 }}
              style={[styles.speedButton, currentSpeedIndex === 0 && styles.speedButtonDisabled]}
            >
              <Text style={styles.speedButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.speedTrack}>
              {SPEED_STEPS.map((step, i) => (
                <View
                  key={step}
                  style={[styles.speedDot, i <= currentSpeedIndex && styles.speedDotActive]}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={increaseSpeed}
              disabled={currentSpeedIndex === SPEED_STEPS.length - 1}
              accessibilityLabel={t('common.fast')}
              accessibilityHint={t('settings.speechRateUp')}
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityState={{ disabled: currentSpeedIndex === SPEED_STEPS.length - 1 }}
              style={[
                styles.speedButton,
                currentSpeedIndex === SPEED_STEPS.length - 1 && styles.speedButtonDisabled,
              ]}
            >
              <Text style={styles.speedButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.speedLabels}>
            <Text style={styles.speedEndLabel}>{t('common.slow')}</Text>
            <Text style={styles.speedEndLabel}>{t('common.fast')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.sectionLabel}>{t('settings.vibration')}</Text>
              <Text style={styles.toggleSubtext}>
                {vibrationEnabled ? t('common.on') : t('common.off')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVibrationEnabled(!vibrationEnabled)}
              accessibilityLabel={t('settings.vibration')}
              accessibilityHint={t('settings.vibrationHint')}
              accessibilityRole={'switch' as AccessibilityRole}
              accessibilityState={{ checked: vibrationEnabled }}
              style={styles.toggleWrapper}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleTrack, vibrationEnabled && styles.toggleTrackOn]}>
                <View style={[styles.toggleThumb, vibrationEnabled && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        </View>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleClearHistory}
            disabled={history.length === 0}
            accessibilityLabel={t('settings.clearHistory')}
            accessibilityHint={t('settings.clearHistoryHint')}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityState={{ disabled: history.length === 0 }}
            style={[styles.clearButton, history.length === 0 && styles.clearButtonDisabled]}
          >
            <Text
              style={[
                styles.clearButtonText,
                history.length === 0 && styles.clearButtonTextDisabled,
              ]}
            >
              {t('settings.clearHistory')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: COLORS.accentMuted,
    borderColor: COLORS.accent,
  },
  langButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  langButtonTextActive: {
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonDisabled: {
    opacity: 0.5,
  },
  speedButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  speedTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  speedDotActive: {
    backgroundColor: COLORS.accent,
  },
  speedLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  speedEndLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleSubtext: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  toggleWrapper: {
    padding: 4,
  },
  toggleTrack: {
    width: 54,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.toggleTrackOff,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleTrackOn: {
    backgroundColor: COLORS.toggleTrackOn,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.toggleThumb,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  clearButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 16,
  },
  clearButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});
