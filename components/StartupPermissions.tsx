import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useCameraPermission } from 'react-native-vision-camera';
import { settingsRepository } from '@features/storage/data/databaseHelper';

const STARTUP_PERMISSIONS_COMPLETED_KEY = 'startup_permissions_completed';

async function requestMicPermission(): Promise<void> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (!granted) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }
    return;
  }

  const status = await check(PERMISSIONS.IOS.MICROPHONE);
  if (status === RESULTS.GRANTED) {
    return;
  }

  await request(PERMISSIONS.IOS.MICROPHONE);
}

async function requestCameraPermission(
  hasPermission: boolean,
  requestPermission: () => Promise<boolean>,
): Promise<void> {
  if (hasPermission) {
    return;
  }

  await requestPermission();
}

async function requestLocationPermission(): Promise<void> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.status === Location.PermissionStatus.GRANTED) {
    return;
  }

  await Location.requestForegroundPermissionsAsync();
}

async function isStartupPermissionsCompleted(): Promise<boolean> {
  return (await settingsRepository.getBool(STARTUP_PERMISSIONS_COMPLETED_KEY)) === true;
}

async function markStartupPermissionsCompleted(): Promise<void> {
  await settingsRepository.setBool(STARTUP_PERMISSIONS_COMPLETED_KEY, true);
}

export default function StartupPermissions(): null {
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      if (await isStartupPermissionsCompleted()) {
        return;
      }

      await requestMicPermission();
      if (cancelled) {
        return;
      }

      await requestCameraPermission(hasPermission, requestPermission);
      if (cancelled) {
        return;
      }

      await requestLocationPermission();
      if (cancelled) {
        return;
      }

      await markStartupPermissionsCompleted();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [hasPermission, requestPermission]);

  return null;
}
