import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useApp, Language } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';

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
    Alert.alert(t('clearHistory'), t('confirmClear'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('confirm'),
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
        <Text
          style={styles.screenTitle}
          accessibilityRole={'header' as AccessibilityRole}
        >
          {t('settingsTitle')}
        </Text>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('language')}</Text>
          <View style={styles.languageRow}>
            {(['EN', 'RU'] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                accessibilityLabel={lang === 'EN' ? 'English' : 'Russian'}
                accessibilityHint={`Switch language to ${lang === 'EN' ? 'English' : 'Russian'}`}
                accessibilityRole={'button' as AccessibilityRole}
                accessibilityState={{ selected: language === lang }}
                style={[
                  styles.langButton,
                  language === lang && styles.langButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    language === lang && styles.langButtonTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Speech Speed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{t('speechSpeed')}</Text>
            <Text style={styles.speedValue}>{SPEED_LABELS[speechSpeed]}</Text>
          </View>

          <View style={styles.speedRow}>
            <TouchableOpacity
              onPress={decreaseSpeed}
              disabled={currentSpeedIndex === 0}
              accessibilityLabel={t('slowLabel')}
              accessibilityHint="Decrease speech speed"
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityState={{ disabled: currentSpeedIndex === 0 }}
              style={[
                styles.speedButton,
                currentSpeedIndex === 0 && styles.speedButtonDisabled,
              ]}
            >
              <Minus
                size={26}
                color={currentSpeedIndex === 0 ? COLORS.textMuted : COLORS.textPrimary}
                strokeWidth={2.5}
              />
            </TouchableOpacity>

            <View style={styles.speedTrack}>
              {SPEED_STEPS.map((step, i) => (
                <View
                  key={step}
                  style={[
                    styles.speedDot,
                    i <= currentSpeedIndex && styles.speedDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={increaseSpeed}
              disabled={currentSpeedIndex === SPEED_STEPS.length - 1}
              accessibilityLabel={t('fastLabel')}
              accessibilityHint="Increase speech speed"
              accessibilityRole={'button' as AccessibilityRole}
              accessibilityState={{ disabled: currentSpeedIndex === SPEED_STEPS.length - 1 }}
              style={[
                styles.speedButton,
                currentSpeedIndex === SPEED_STEPS.length - 1 && styles.speedButtonDisabled,
              ]}
            >
              <Plus
                size={26}
                color={currentSpeedIndex === SPEED_STEPS.length - 1 ? COLORS.textMuted : COLORS.textPrimary}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.speedLabels}>
            <Text style={styles.speedEndLabel}>{t('slowLabel')}</Text>
            <Text style={styles.speedEndLabel}>{t('fastLabel')}</Text>
          </View>
        </View>

        {/* Vibration */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.sectionLabel}>{t('vibration')}</Text>
              <Text style={styles.toggleSubtext}>
                {vibrationEnabled ? t('on') : t('off')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVibrationEnabled(!vibrationEnabled)}
              accessibilityLabel={t('vibration')}
              accessibilityHint={`Vibration feedback is currently ${vibrationEnabled ? 'on' : 'off'}. Tap to toggle.`}
              accessibilityRole={'switch' as AccessibilityRole}
              accessibilityState={{ checked: vibrationEnabled }}
              style={styles.toggleWrapper}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toggleTrack,
                  vibrationEnabled && styles.toggleTrackOn,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    vibrationEnabled && styles.toggleThumbOn,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleClearHistory}
            disabled={history.length === 0}
            accessibilityLabel={t('clearHistory')}
            accessibilityHint={t('confirmClear')}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityState={{ disabled: history.length === 0 }}
            style={[
              styles.clearButton,
              history.length === 0 && styles.clearButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.clearButtonText,
                history.length === 0 && styles.clearButtonTextDisabled,
              ]}
            >
              {t('clearHistory')}
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
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  // Language
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  langButtonActive: {
    backgroundColor: COLORS.accentMuted,
    borderColor: COLORS.accent,
  },
  langButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langButtonTextActive: {
    color: COLORS.accent,
  },
  // Speed
  speedValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: 16,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  speedButtonDisabled: {
    opacity: 0.4,
  },
  speedTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    marginTop: 12,
    paddingHorizontal: 4,
  },
  speedEndLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: -8,
  },
  toggleWrapper: {
    padding: 4,
  },
  toggleTrack: {
    width: 64,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.toggleTrackOff,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    backgroundColor: COLORS.toggleTrackOn,
  },
  toggleThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.toggleThumb,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  clearButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonDisabled: {
    borderColor: COLORS.border,
    opacity: 0.55,
  },
  clearButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.danger,
  },
  clearButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});
