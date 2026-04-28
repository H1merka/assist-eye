import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import ResultCard from '@/components/ResultCard';

type CameraPhase = 'preview' | 'processing' | 'result';

const MOCK_OBJECT_SETS = [
  ['bottle', 'book', 'cup'],
  ['phone', 'keyboard', 'mouse'],
  ['chair', 'table', 'lamp'],
  ['backpack', 'wallet', 'keys'],
  ['monitor', 'notebook', 'pen'],
];

function getMockResult(prefix: string): string {
  const randomSet = MOCK_OBJECT_SETS[Math.floor(Math.random() * MOCK_OBJECT_SETS.length)];
  return `${prefix}: ${randomSet.join(', ')}`;
}

export default function CameraScreen() {
  const router = useRouter();
  const { addToHistory, setStatus, t } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCaptureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<CameraPhase>('preview');
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    if (permission?.granted && phase === 'preview' && !isCapturing) {
      autoCaptureTimerRef.current = setTimeout(() => {
        void handleCapture();
      }, 1300);
    }

    return () => {
      if (autoCaptureTimerRef.current) {
        clearTimeout(autoCaptureTimerRef.current);
      }
    };
  }, [permission?.granted, phase, isCapturing]);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
      if (autoCaptureTimerRef.current) clearTimeout(autoCaptureTimerRef.current);
      setStatus('idle');
    };
  }, [setStatus]);

  const handleCapture = async () => {
    if (phase !== 'preview' || isCapturing) return;

    setIsCapturing(true);
    setPhase('processing');
    setStatus('processing');

    try {
      if (cameraRef.current) {
        await cameraRef.current.takePictureAsync({
          quality: 0.5,
          skipProcessing: true,
        });
      }
    } catch {
      // We still continue with simulated processing for MVP flow.
    }

    processingTimerRef.current = setTimeout(() => {
      const generated = getMockResult(t('detectedPrefix'));
      setResultText(generated);
      addToHistory(generated);
      setStatus('ready');
      setPhase('result');
      setIsCapturing(false);
    }, 1400);
  };

  const handleRepeat = () => {
    setResultText('');
    setStatus('idle');
    setPhase('preview');
    setIsCapturing(false);
  };

  const handleClose = () => {
    setStatus('idle');
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  };

  if (!permission) {
    return <View style={styles.blackScreen} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.blackScreen, styles.permissionContainer]}>
        <Text style={styles.permissionText}>{t('cameraPermissionRequired')}</Text>
        <Pressable
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel={t('requestCameraPermission')}
          style={({ pressed }) => [styles.permissionButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.permissionButtonText}>{t('requestCameraPermission')}</Text>
        </Pressable>
        <Pressable
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel={t('close')}
          style={({ pressed }) => [styles.permissionCloseButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.permissionCloseText}>{t('close')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        {phase !== 'result' && (
          <Text style={styles.prompt} accessibilityRole="text" accessibilityLabel={t('cameraPrompt')}>
            {t('cameraPrompt')}
          </Text>
        )}

        {phase === 'preview' && (
          <Pressable
            onPress={() => void handleCapture()}
            accessibilityRole="button"
            accessibilityLabel={t('capture')}
            style={({ pressed }) => [styles.captureButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.captureText}>{t('capture')}</Text>
          </Pressable>
        )}

        {phase === 'processing' && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText} accessibilityRole="text" accessibilityLabel={t('processingCamera')}>
              {t('processingCamera')}
            </Text>
          </View>
        )}

        {phase === 'result' && (
          <View style={styles.resultContainer}>
            <ResultCard
              resultText={resultText}
              repeatLabel={t('repeat')}
              closeLabel={t('close')}
              onRepeat={handleRepeat}
              onClose={handleClose}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 72,
    paddingBottom: 42,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  prompt: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  captureButton: {
    alignSelf: 'center',
    minWidth: 168,
    height: 54,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  captureText: {
    color: COLORS.buttonText,
    fontSize: 19,
    fontWeight: '800',
  },
  processingContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  processingText: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  resultContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    minWidth: 220,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '700',
  },
  permissionCloseButton: {
    minWidth: 220,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionCloseText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  blackScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
