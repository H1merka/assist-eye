/**
 * AccessibleButton — переиспользуемая кнопка с гарантией accessibility.
 *
 * - Всегда имеет accessibilityLabel
 * - Минимальный размер 48×48 dp
 * - Поддержка TalkBack / VoiceOver
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import {AccessibilityStyles, Colors, Typography} from '../theme/appTheme';

interface AccessibleButtonProps {
  /** Текст на кнопке */
  label: string;

  /** Accessibility label (озвучивается TalkBack/VoiceOver) */
  accessibilityLabel: string;

  /** Accessibility hint — краткое описание действия */
  accessibilityHint?: string;

  /** Обработчик нажатия */
  onPress: () => void;

  /** Кнопка неактивна */
  disabled?: boolean;

  /** Дополнительные стили контейнера */
  style?: StyleProp<ViewStyle>;

  /** Дополнительные стили текста */
  labelStyle?: StyleProp<TextStyle>;
}

export function AccessibleButton({
  label,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  disabled = false,
  style,
  labelStyle,
}: AccessibleButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled}}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        AccessibilityStyles.touchTarget,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, disabled && styles.disabledLabel, labelStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: Colors.light.outline,
    opacity: 0.6,
  },
  label: {
    ...Typography.labelLarge,
    color: Colors.light.onPrimary,
  },
  disabledLabel: {
    color: Colors.light.onSurface,
  },
});
