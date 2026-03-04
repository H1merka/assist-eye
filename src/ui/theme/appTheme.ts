/**
 * Тема приложения — Material Design 3.
 *
 * - Светлая и тёмная тема
 * - Высокий контраст для доступности
 * - Минимальный touch-target 48×48 dp
 */

import {StyleSheet} from 'react-native';
import {MIN_TOUCH_TARGET} from '@core/constants/appConstants';

export const Colors = {
  light: {
    primary: '#1565C0',
    onPrimary: '#FFFFFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    onSurface: '#1C1B1F',
    error: '#B3261E',
    onError: '#FFFFFF',
    outline: '#79747E',
    success: '#2E7D32',
  },
  dark: {
    primary: '#90CAF9',
    onPrimary: '#003258',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#E6E1E5',
    error: '#F2B8B5',
    onError: '#601410',
    outline: '#938F99',
    success: '#81C784',
  },
} as const;

export const Typography = StyleSheet.create({
  headlineLarge: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});

/** Общие стили для accessibility */
export const AccessibilityStyles = StyleSheet.create({
  /** Минимальный touch target по WCAG / ТЗ */
  touchTarget: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
  },
});
