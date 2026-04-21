import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  result: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 24,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
