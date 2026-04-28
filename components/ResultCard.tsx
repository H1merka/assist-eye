import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface ResultCardProps {
  resultText: string;
  repeatLabel: string;
  closeLabel: string;
  onRepeat: () => void;
  onClose: () => void;
}

export default function ResultCard({
  resultText,
  repeatLabel,
  closeLabel,
  onRepeat,
  onClose,
}: ResultCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.resultText} accessibilityRole="text" accessibilityLabel={resultText}>
        {resultText}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onRepeat}
          accessibilityRole="button"
          accessibilityLabel={repeatLabel}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.secondaryText}>{repeatLabel}</Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.primaryText}>{closeLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  resultText: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: {
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
