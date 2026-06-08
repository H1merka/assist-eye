import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import MainButton from '@/components/MainButton';
import StatusFeedback from '@/components/StatusFeedback';
import MapDisplay from '@/components/MapDisplay';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/Layout';
import { speechRecognizer } from '@features/voiceInterface/data/voskSpeechRecognizer';
import { useCommandProcessor } from '@features/commandProcessor/store/commandStore';
import { Haptics } from '@core/utils/vibration';
import {
  onCaptureAwaitingChange,
  onCameraActiveChange,
  setCameraActive,
  signalUserCapture,
} from '@features/camera/data/cameraService';
import { AudioFeedback } from '@core/utils/audio';
import { isFeatureEnabled } from '@core/config/featureFlags';

export default function MainScreen() {
  const { status, setStatus, t, language, vibrationEnabled } = useApp();
  const processVoiceInput = useCommandProcessor(state => state.processVoiceInput);
  const requestStop = useCommandProcessor(state => state.requestStop);
  const resultReceived = React.useRef(false);
  const pressingRef = React.useRef(false);
  const pressIdRef = React.useRef(0);
  const lastCaptureTapRef = React.useRef(0);
  const [captureAwaiting, setCaptureAwaiting] = React.useState(false);
  const [cameraPreviewVisible, setCameraPreviewVisible] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');

  useEffect(() => {
    let isActive = true;
    AudioFeedback.preload();

    const initVosk = async () => {
      const lang = language === 'EN' ? 'en' : 'ru';
      const initResult = await speechRecognizer.initialize(lang);
      if (!initResult.ok && isActive) {
        Haptics.error(vibrationEnabled);
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

  useEffect(() => {
    return onCameraActiveChange(active => {
      setCameraPreviewVisible(active);
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

  const testReadOnPress = isFeatureEnabled('testReadOnButtonPress');
  const readCommandText = language === 'EN' ? 'read' : 'прочитай';

  const triggerReadCommand = async () => {
    requestStop();
    await speechRecognizer.stopListening();
    setTranscript(readCommandText);
    resultReceived.current = true;
    Haptics.selection(vibrationEnabled);
    AudioFeedback.play('start');
    setStatus('processing');
    void processVoiceInput(readCommandText);
  };

  const handlePressIn = async () => {
    if (testReadOnPress) {
      await triggerReadCommand();
      return;
    }

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
    if (testReadOnPress) {
      return;
    }

    pressingRef.current = false;
    const pressId = pressIdRef.current;
    if (status === 'listening') {
      await speechRecognizer.stopListening();
      AudioFeedback.play('stop');

      // Vosk отдаёт финальный текст чуть позже stop()
      setTimeout(() => {
        if (!resultReceived.current && pressId === pressIdRef.current) {
          AudioFeedback.play('warning');
          setStatus('idle');
        }
      }, 900);
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

  if (cameraPreviewVisible) {
    return (
      <SafeAreaView style={styles.captureSafe} pointerEvents="box-none">
        <Pressable
          style={styles.captureOverlay}
          onPress={captureAwaiting ? handleCaptureTap : undefined}
          accessibilityRole="button"
          accessibilityLabel={
            captureAwaiting ? t('status.capturePrompt') : t('status.readCameraPrompt')
          }
          accessibilityHint={
            captureAwaiting ? t('status.capturePrompt') : t('status.readCameraPrompt')
          }
        >
          <View style={styles.captureHint} pointerEvents="none">
            <Text style={styles.captureHintText}>
              {captureAwaiting ? t('status.capturePrompt') : t('status.readCameraPrompt')}
            </Text>
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
            {testReadOnPress ? t('voice.readPrompt') : t('home.voiceButtonHint')}
          </Text>
        </View>

        <View style={styles.buttonArea}>
          <MainButton
            label={testReadOnPress ? t('commands.read') : t('home.voiceButton')}
            accessibilityLabel={
              testReadOnPress ? t('commands.read') : t('home.voiceButtonA11y')
            }
            accessibilityHint={
              testReadOnPress ? t('voice.readPrompt') : t('home.voiceButtonHint')
            }
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            isActive={!testReadOnPress && status === 'listening'}
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
    paddingHorizontal: LAYOUT.spacing.screen,
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  captureSafe: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 30,
    elevation: 30,
  },
  captureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  captureHint: {
    position: 'absolute',
    left: LAYOUT.spacing.screen,
    right: LAYOUT.spacing.screen,
    bottom: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: LAYOUT.radius.card,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  captureHintText: {
    color: COLORS.textPrimary,
    fontSize: LAYOUT.font.body,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: LAYOUT.lineHeight.body,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
    zIndex: 1,
  },
  appTitle: {
    fontSize: LAYOUT.font.title,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    lineHeight: LAYOUT.lineHeight.title,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appSubtitle: {
    fontSize: LAYOUT.font.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: LAYOUT.lineHeight.bodySmall,
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
