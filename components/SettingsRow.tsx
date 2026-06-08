import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';

interface SettingsRowProps {
  label: string;
  control: React.ReactNode;
  hint?: string;
}

export default function SettingsRow({ label, control, hint }: SettingsRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelSection}>
        <Text style={styles.label}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <View style={styles.controlSection}>{control}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.radius.card,
    paddingVertical: LAYOUT.settings.cardPadding,
    paddingHorizontal: LAYOUT.spacing.screen,
    marginBottom: LAYOUT.spacing.item,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: LAYOUT.touch.settings,
  },
  labelSection: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: LAYOUT.font.settingsSection,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: LAYOUT.lineHeight.heading + 6,
  },
  hint: {
    fontSize: LAYOUT.font.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginTop: 6,
    lineHeight: LAYOUT.lineHeight.caption,
  },
  controlSection: {
    flexShrink: 1,
  },
});
