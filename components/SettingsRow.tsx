import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 72,
  },
  labelSection: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginTop: 4,
  },
  controlSection: {
    flexShrink: 1,
  },
});
