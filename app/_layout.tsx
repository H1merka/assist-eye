import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/context/AppContext';
import { useEffect } from 'react';
import { initDatabase } from '@features/storage/data/databaseHelper';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
    </AppProvider>
  );
}
