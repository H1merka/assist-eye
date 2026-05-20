import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppStatus } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';

interface StatusFeedbackProps {
  message: string;
  status: AppStatus;
  transcript?: string;
}

const STATUS_COLORS: Record<AppStatus, string> = {
  idle: COLORS.statusIdle,
  listening: COLORS.statusListening,
  processing: COLORS.statusProcessing,
  ready: COLORS.statusReady,
};

export default function StatusFeedback({ message, status, transcript }: StatusFeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [message, fadeAnim]);

  useEffect(() => {
    if (status === 'listening' || status === 'processing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(dotAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      dotAnim.stopAnimation();
      dotAnim.setValue(0);
    }
  }, [status, dotAnim]);

  const indicatorColor = STATUS_COLORS[status];

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      accessibilityLabel={`${message}${transcript ? `. Слышу: ${transcript}` : ''}`}
    >
      <View style={styles.row}>
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: indicatorColor },
            (status === 'listening' || status === 'processing') && {
              opacity: dotAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{message}</Text>
          {status === 'listening' && transcript && (
            <Text style={styles.transcript} numberOfLines={1}>{transcript}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 80,
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  transcript: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
