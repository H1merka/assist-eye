import { Asset } from 'expo-asset';
import RNFS from 'react-native-fs';
import { Logger } from '@core/utils/logger';

function stripFileScheme(uri: string): string {
  return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
}

export async function getAssetFileUrl(moduleId: number): Promise<string> {
  const asset = Asset.fromModule(moduleId);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  return asset.localUri ?? asset.uri;
}

export async function getAssetFilePath(moduleId: number): Promise<string> {
  const asset = Asset.fromModule(moduleId);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }

  const uri = asset.localUri ?? asset.uri;
  const path = stripFileScheme(uri);

  try {
    const exists = await RNFS.exists(path);
    if (!exists) {
      Logger.warn('AssetUtils', 'Asset file missing', { path, uri });
    }
  } catch (error) {
    Logger.warn('AssetUtils', 'Asset file check failed', error);
  }

  return path;
}
