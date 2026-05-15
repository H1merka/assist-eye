import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import MainButton from '@/components/MainButton';
import StatusFeedback from '@/components/StatusFeedback';
import { COLORS } from '@/constants/Colors';
import { speechRecognizer } from '@features/voiceInterface/data/voskSpeechRecognizer';
import { useCommandProcessor } from '@features/commandProcessor/store/commandStore';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

async function ensureMicPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await check(PERMISSIONS.IOS.MICROPHONE);
  if (status === RESULTS.GRANTED) {
    return true;
  }
  const next = await request(PERMISSIONS.IOS.MICROPHONE);
  return next === RESULTS.GRANTED;
}

export default function MainScreen() {
  const { status, setStatus, t, language } = useApp();
  const processVoiceInput = useCommandProcessor(state => state.processVoiceInput);

  useEffect(() => {
    let isActive = true;

    const initVosk = async () => {
      const ok = await ensureMicPermission();
      if (!ok || !isActive) {
        return;
      }
      const lang = language === 'EN' ? 'en' : 'ru';
      await speechRecognizer.initialize(lang);
    };

    initVosk();

    speechRecognizer.onResult(text => {
      setStatus('processing');
      processVoiceInput(text);
    });

    speechRecognizer.onError(() => {
      setStatus('idle');
    });

    return () => {
      isActive = false;
      speechRecognizer.stopListening();
    };
  }, [language, processVoiceInput, setStatus]);

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

  const handlePress = async () => {
    if (status === 'listening') {
      await speechRecognizer.stopListening();
      setStatus('idle');
      return;
    }

    setStatus('listening');
    await speechRecognizer.startListening();
  };

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
            onPress={handlePress}
            isActive={status === 'listening'}
          />
        </View>

        <View style={styles.statusArea}>
          <StatusFeedback message={statusMessage} status={status} />
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  buttonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusArea: {
    width: '100%',
    marginBottom: 8,
  },
});
