import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';

interface HistoryItemProps {
  result: string;
  timestamp: number;
}

export default function HistoryItem({ result, timestamp }: HistoryItemProps) {
  const readableTime = new Date(timestamp).toLocaleString();

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={`${result}. ${readableTime}`}>
      <Text style={styles.result}>{result}</Text>
      <Text style={styles.time}>{readableTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.radius.card,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: LAYOUT.spacing.item,
    minHeight: LAYOUT.touch.min,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  result: {
    color: COLORS.textPrimary,
    fontSize: LAYOUT.font.body,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: LAYOUT.lineHeight.body,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: LAYOUT.font.caption,
    fontWeight: '500',
    lineHeight: LAYOUT.lineHeight.caption,
  },
});
