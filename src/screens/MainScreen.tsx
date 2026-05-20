import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import MainButton from '@/components/MainButton';
import StatusFeedback from '@/components/StatusFeedback';
import MapDisplay from '@/components/MapDisplay';
import { COLORS } from '@/constants/Colors';
import { speechRecognizer } from '@features/voiceInterface/data/voskSpeechRecognizer';
import { useCommandProcessor } from '@features/commandProcessor/store/commandStore';
import { Haptics } from '@core/utils/vibration';
import {
  onCaptureAwaitingChange,
  setCameraActive,
  signalUserCapture,
} from '@features/camera/data/cameraService';
import { AudioFeedback } from '@core/utils/audio';

export default function MainScreen() {
  const { status, setStatus, t, language, vibrationEnabled } = useApp();
  const processVoiceInput = useCommandProcessor(state => state.processVoiceInput);
  const requestStop = useCommandProcessor(state => state.requestStop);
  const resultReceived = React.useRef(false);
  const pressingRef = React.useRef(false);
  const pressIdRef = React.useRef(0);
  const lastCaptureTapRef = React.useRef(0);
  const [captureAwaiting, setCaptureAwaiting] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');

  useEffect(() => {
    let isActive = true;
    AudioFeedback.preload();

    const initVosk = async () => {
      const baseResult = await speechRecognizer.initialize('ru');
      if (!baseResult.ok && isActive) {
        Haptics.error(vibrationEnabled);
        return;
      }

      if (language === 'EN') {
        const enResult = await speechRecognizer.initialize('en');
        if (!enResult.ok && isActive) {
          Haptics.error(vibrationEnabled);
        }
      }
    };

    initVosk();

    speechRecognizer.onResult(text => {
      if (resultReceived.current) {
        return;
      }
      setTranscript(text);
      resultReceived.current = true;
      pressingRef.current = false;
      void speechRecognizer.stopListening();
      Haptics.success(vibrationEnabled);
      AudioFeedback.play('success');
      setStatus('processing');
      processVoiceInput(text);
    });

    speechRecognizer.onPartialResult(text => {
      setTranscript(text);
    });

    speechRecognizer.onError(() => {
      Haptics.error(vibrationEnabled);
      AudioFeedback.play('error');
      setStatus('idle');
    });

    return () => {
      isActive = false;
      speechRecognizer.stopListening();
      setCameraActive(false);
    };
  }, [language, processVoiceInput, setStatus, vibrationEnabled]);

  useEffect(() => {
    return onCaptureAwaitingChange(awaiting => {
      setCaptureAwaiting(awaiting);
    });
  }, []);

  const statusMessage = (() => {
    switch (status) {
    case 'idle':
      return t('status.ready');
    case 'listening':
      return t('status.listening');
    case 'processing':
      return t('status.processing');
    case 'ready':
      return t('status.ready');
    }
  })();

  const handlePressIn = async () => {
    pressingRef.current = true;
    const pressId = pressIdRef.current + 1;
    pressIdRef.current = pressId;
    requestStop();
    await speechRecognizer.stopListening();
    setTranscript('');
    resultReceived.current = false;
    Haptics.selection(vibrationEnabled);
    AudioFeedback.play('start');
    setStatus('listening');
    const result = await speechRecognizer.startListening();
    if (!pressingRef.current || pressId !== pressIdRef.current) {
      await speechRecognizer.stopListening();
      setStatus('idle');
      return;
    }
    if (!result.ok) {
      Haptics.error(vibrationEnabled);
      AudioFeedback.play('error');
      setStatus('idle');
    }
  };

  const handlePressOut = async () => {
    pressingRef.current = false;
    const pressId = pressIdRef.current;
    if (status === 'listening') {
      await speechRecognizer.stopListening();
      AudioFeedback.play('stop');
      setStatus('idle');

      // Если за время удержания результат не пришел — подаем сигнал предупреждения
      setTimeout(() => {
        if (!resultReceived.current && pressId === pressIdRef.current) {
          AudioFeedback.play('warning');
          setStatus('idle');
        }
      }, 100);
    }
  };

  const handleCaptureTap = () => {
    if (!captureAwaiting) {
      return;
    }
    const now = Date.now();
    if (now - lastCaptureTapRef.current <= 300) {
      lastCaptureTapRef.current = 0;
      signalUserCapture();
      Haptics.selection(vibrationEnabled);
      AudioFeedback.play('success');
      return;
    }
    lastCaptureTapRef.current = now;
  };

  if (captureAwaiting) {
    return (
      <SafeAreaView style={styles.captureSafe}>
        <Pressable
          style={styles.captureOverlay}
          onPress={handleCaptureTap}
          accessibilityRole="button"
          accessibilityLabel={t('status.capturePrompt')}
          accessibilityHint={t('status.capturePrompt')}
        >
          <View style={styles.captureHint}>
            <Text style={styles.captureHintText}>{t('status.capturePrompt')}</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={styles.appTitle}
            accessibilityRole="header"
            accessibilityLabel={t('home.screenLabel')}
          >
            {t('home.screenLabel')}
          </Text>
          <Text style={styles.appSubtitle} accessibilityRole="text">
            {t('home.voiceButtonHint')}
          </Text>
        </View>

        <View style={styles.buttonArea}>
          <MainButton
            label={t('home.voiceButton')}
            accessibilityLabel={t('home.voiceButtonA11y')}
            accessibilityHint={t('home.voiceButtonHint')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            isActive={status === 'listening'}
          />
        </View>

        <MapDisplay />

        <View style={styles.statusArea}>
          <StatusFeedback message={statusMessage} status={status} transcript={transcript} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  captureSafe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  captureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  captureHint: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  captureHintText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
    zIndex: 1,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  statusArea: {
    width: '100%',
    marginBottom: 8,
    zIndex: 1,
  },
});
