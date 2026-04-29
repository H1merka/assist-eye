import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import MainButton from '@/components/MainButton';
import StatusFeedback from '@/components/StatusFeedback';
import { COLORS } from '@/constants/Colors';
import { speechRecognizer } from '@features/voiceInterface/data/voskSpeechRecognizer';
import { useCommandProcessor } from '@features/commandProcessor/store/commandStore';

export default function MainScreen() {
  const router = useRouter();
  const { status, setStatus, t } = useApp();
  const processVoiceInput = useCommandProcessor((state) => state.processVoiceInput);

  useEffect(() => {
    const initVosk = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("User rejected RECORD_AUDIO permission.");
          return;
        }
      }
      await speechRecognizer.initialize('ru');
    };
    initVosk();
    
    speechRecognizer.onResult((text) => {
        setStatus('processing');
        processVoiceInput(text);
    });

    return () => {
        speechRecognizer.stopListening();
    };
  }, []);

  const statusMessage = (() => {
    switch (status) {
      case 'idle': return t('statusIdle');
      case 'listening': return t('statusListening');
      case 'processing': return t('statusProcessing');
      case 'ready': return t('statusReady');
    }
  })();

  const buttonLabel = t('start');
  const buttonA11yLabel = t('start');
  const buttonA11yHint = t('startHint');

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
            accessibilityLabel={t('mainTitle')}
          >
            {t('mainTitle')}
          </Text>
          <Text
            style={styles.appSubtitle}
            accessibilityRole="text"
          >
            {t('mainSubtitle')}
          </Text>
        </View>

        <View style={styles.buttonArea}>
          <MainButton
            label={buttonLabel}
            accessibilityLabel={buttonA11yLabel}
            accessibilityHint={buttonA11yHint}
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
