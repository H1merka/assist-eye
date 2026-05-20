import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useCameraPermission } from 'react-native-vision-camera';

async function requestMicPermission(): Promise<void> {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    return;
  }

  const status = await check(PERMISSIONS.IOS.MICROPHONE);
  if (status === RESULTS.GRANTED) {
    return;
  }

  await request(PERMISSIONS.IOS.MICROPHONE);
}

async function requestCameraPermission(): Promise<void> {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  }
}

export default function StartupPermissions() {
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    void requestMicPermission();
    void requestCameraPermission();
  }, []);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return null;
}
