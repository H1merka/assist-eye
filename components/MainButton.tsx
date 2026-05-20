import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  AccessibilityRole,
} from 'react-native';
import { COLORS } from '@/constants/Colors';

interface MainButtonProps {
  label: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  onPressIn: () => void;
  onPressOut: () => void;
  isActive?: boolean;
}

export default function MainButton({
  label,
  accessibilityLabel,
  accessibilityHint,
  onPressIn,
  onPressOut,
  isActive = false,
}: MainButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.wrapper}>
      {isActive && (
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.08],
                outputRange: [0.35, 0],
              }),
            },
          ]}
        />
      )}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={() => {
            handlePressIn();
            onPressIn();
          }}
          onPressOut={() => {
            handlePressOut();
            onPressOut();
          }}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole={'button' as AccessibilityRole}
          accessibilityState={{ selected: isActive }}
          style={({ pressed }) => [
            styles.button,
            isActive && styles.buttonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const BUTTON_SIZE = 200;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_SIZE + 80,
    height: BUTTON_SIZE + 80,
  },
  ring: {
    position: 'absolute',
    width: BUTTON_SIZE + 60,
    height: BUTTON_SIZE + 60,
    borderRadius: (BUTTON_SIZE + 60) / 2,
    backgroundColor: COLORS.accent,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonActive: {
    backgroundColor: COLORS.accentActive,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.buttonText,
    letterSpacing: 1,
  },
  labelActive: {
    color: COLORS.buttonText,
  },
});
