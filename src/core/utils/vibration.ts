import { Vibration, Platform } from 'react-native';

/**
 * Vibration Service
 *
 * Provides methods for haptic feedback, respecting the user's vibration settings.
 */
export const Haptics = {
  /**
   * Short vibration for light feedback (e.g. button tap)
   */
  selection: (enabled: boolean = true) => {
    if (!enabled) {
      return;
    }
    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    } else {
      Vibration.vibrate(); // Default for iOS
    }
  },

  /**
   * Notification vibration for success
   */
  success: (enabled: boolean = true) => {
    if (!enabled) {
      return;
    }
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 10, 50, 10]);
    } else {
      Vibration.vibrate();
    }
  },

  /**
   * Notification vibration for error
   */
  error: (enabled: boolean = true) => {
    if (!enabled) {
      return;
    }
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 50, 100, 50]);
    } else {
      Vibration.vibrate();
    }
  },

  /**
   * Sustained vibration for long processes
   */
  long: (enabled: boolean = true) => {
    if (!enabled) {
      return;
    }
    Vibration.vibrate(400);
  },

  /**
   * Stop any ongoing vibration
   */
  cancel: () => {
    Vibration.cancel();
  },
};
