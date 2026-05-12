import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppProvider } from '@/context/AppContext';
import { initI18n } from '@i18n/i18n';
import { initDatabase } from '@features/storage/data/databaseHelper';
import RootNavigator from '@navigation/RootNavigator';
import { CameraHost } from '@features/camera/ui/CameraHost';
import { COLORS } from '@/constants/Colors';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await initI18n();
      await initDatabase();
      if (mounted) setReady(true);
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <AppProvider>
      <CameraHost />
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
