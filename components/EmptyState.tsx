import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={message}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.radius.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: LAYOUT.spacing.screen,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: LAYOUT.font.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: LAYOUT.lineHeight.body,
    fontWeight: '500',
  },
});
