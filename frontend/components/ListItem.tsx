import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, AccessibilityRole } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface ListItemProps {
  mainText: string;
  secondaryText: string;
  onPress?: () => void;
}

export default function ListItem({ mainText, secondaryText, onPress }: ListItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={mainText}
      accessibilityHint={secondaryText}
      accessibilityRole={'button' as AccessibilityRole}
    >
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.secondaryText}>{secondaryText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    minHeight: 72,
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 24,
  },
  secondaryText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});
