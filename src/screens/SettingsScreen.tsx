import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { useApp, Language } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPEECH_RATE_STEPS } from '@core/constants/appConstants';

const SPEED_STEPS = SPEECH_RATE_STEPS;
const SPEED_LABELS: Record<number, string> = SPEED_STEPS.reduce(
  (acc, step) => {
    acc[step] = `${Number.isInteger(step) ? step : step}x`;
    return acc;
  },
  {} as Record<number, string>,
);

export default function SettingsScreen() {
  const {
    language,
    setLanguage,
    speechSpeed,
    setSpeechSpeed,
    vibrationEnabled,
    setVibrationEnabled,
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
    paddingHorizontal: LAYOUT.spacing.screen,
    paddingTop: Platform.OS === 'android' ? 40 : 24,
    paddingBottom: 56,
  },
  screenTitle: {
    fontSize: LAYOUT.font.title + 4,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: LAYOUT.spacing.section + 8,
    lineHeight: LAYOUT.lineHeight.title + 6,
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: LAYOUT.spacing.section + 8,
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.radius.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: LAYOUT.settings.cardPadding,
  },
  sectionLabel: {
    fontSize: LAYOUT.font.settingsSection,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    lineHeight: LAYOUT.lineHeight.heading + 6,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 16,
  },
  langButton: {
    flex: 1,
    minHeight: LAYOUT.settings.langButtonMinHeight,
    paddingVertical: 20,
    borderRadius: LAYOUT.radius.button,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonActive: {
    backgroundColor: COLORS.accentMuted,
    borderColor: COLORS.accent,
  },
  langButtonText: {
    color: COLORS.textSecondary,
    fontSize: LAYOUT.font.heading,
    fontWeight: '700',
    lineHeight: LAYOUT.lineHeight.heading,
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
    fontSize: LAYOUT.font.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  speedButton: {
    width: LAYOUT.settings.speedButton,
    height: LAYOUT.settings.speedButton,
    borderRadius: LAYOUT.radius.button,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonDisabled: {
    opacity: 0.5,
  },
  speedButtonText: {
    fontSize: LAYOUT.font.control + 4,
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
    width: LAYOUT.settings.speedDot,
    height: LAYOUT.settings.speedDot,
    borderRadius: LAYOUT.settings.speedDot / 2,
    backgroundColor: COLORS.border,
  },
  speedDotActive: {
    backgroundColor: COLORS.accent,
  },
  speedLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  speedEndLabel: {
    fontSize: LAYOUT.font.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 20,
  },
  toggleSubtext: {
    color: COLORS.textSecondary,
    marginTop: 8,
    fontSize: LAYOUT.font.body,
    fontWeight: '500',
    lineHeight: LAYOUT.lineHeight.body,
  },
  toggleWrapper: {
    padding: 8,
    minWidth: LAYOUT.touch.settings,
    minHeight: LAYOUT.touch.settings,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrack: {
    width: LAYOUT.settings.toggleWidth,
    height: LAYOUT.settings.toggleHeight,
    borderRadius: LAYOUT.settings.toggleHeight / 2,
    backgroundColor: COLORS.toggleTrackOff,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  toggleTrackOn: {
    backgroundColor: COLORS.toggleTrackOn,
  },
  toggleThumb: {
    width: LAYOUT.settings.toggleThumb,
    height: LAYOUT.settings.toggleThumb,
    borderRadius: LAYOUT.settings.toggleThumb / 2,
    backgroundColor: COLORS.toggleThumb,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
});
