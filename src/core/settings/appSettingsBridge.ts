export type AppLanguage = 'EN' | 'RU';

export type AppSettingsSnapshot = {
  language: AppLanguage;
  speechSpeed: number;
  vibrationEnabled: boolean;
};

export type AppSettingsBridge = {
  getState: () => AppSettingsSnapshot;
  setLanguage: (lang: AppLanguage) => void;
  setSpeechSpeed: (speed: number) => void;
  setVibrationEnabled: (enabled: boolean) => void;
};

let bridge: AppSettingsBridge | null = null;

export function registerAppSettingsBridge(next: AppSettingsBridge): void {
  bridge = next;
}

export function clearAppSettingsBridge(): void {
  bridge = null;
}

export function getAppSettingsBridge(): AppSettingsBridge | null {
  return bridge;
}
