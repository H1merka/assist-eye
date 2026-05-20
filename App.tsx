import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppProvider } from '@/context/AppContext';
import { initI18n } from '@i18n/i18n';
import { initDatabase } from '@features/storage/data/databaseHelper';
import RootNavigator from '@navigation/RootNavigator';
import { CameraHost } from '@features/camera/ui/CameraHost';
import { COLORS } from '@/constants/Colors';
import StartupPermissions from '@/components/StartupPermissions';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const results = await Promise.allSettled([initI18n(), initDatabase()]);

      const rejected = results.filter(result => result.status === 'rejected');
      if (rejected.length > 0) {
        rejected.forEach(result => {
          if (result.status === 'rejected') {
            console.error('[App] Startup initialization failed:', result.reason);
          }
        });
      }

      if (mounted) {
        setReady(true);
      }
    };

    void init();

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
      <StartupPermissions />
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
