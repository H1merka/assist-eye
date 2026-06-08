import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, AccessibilityRole } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';

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
    borderRadius: LAYOUT.radius.card,
    paddingVertical: 20,
    paddingHorizontal: LAYOUT.spacing.screen,
    marginBottom: LAYOUT.item,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
    minHeight: LAYOUT.touch.min + 16,
    justifyContent: 'center',
  },
  mainText: {
    fontSize: LAYOUT.font.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: LAYOUT.lineHeight.body,
  },
  secondaryText: {
    fontSize: LAYOUT.font.caption,
    color: COLORS.textSecondary,
    fontWeight: '400',
    lineHeight: LAYOUT.lineHeight.caption,
  },
});
