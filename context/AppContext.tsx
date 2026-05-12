import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommandProcessor } from '@features/commandProcessor/store/commandStore';
import { historyRepository, settingsRepository } from '@features/storage/data/databaseHelper';
import { ttsService } from '@features/tts/data/reactNativeTtsService';
import { setYandexApiKey as setYandexApiKeyRuntime } from '@features/spatialNavigation/data/yandexSpatialNavigationService';
import { TTS_RATE_DEFAULT, TTS_RATE_MAX, TTS_RATE_MIN } from '@core/constants/appConstants';

export type Language = 'EN' | 'RU';
export type AppStatus = 'idle' | 'listening' | 'processing' | 'ready';

export interface HistoryItem {
  id: string;
  result: string;
  timestamp: number;
  type: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  speechSpeed: number;
  setSpeechSpeed: (speed: number) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
  history: HistoryItem[];
  clearHistory: () => void;
  yandexApiKey: string;
  setYandexApiKey: (key: string) => void;
  t: (key: string) => string;
}

const SETTINGS_KEYS = {
  language: 'language',
  speechRate: 'tts_rate',
  vibration: 'vibration',
  volume: 'tts_volume',
  yandexApiKey: 'yandex_api_key',
} as const;

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const processorState = useCommandProcessor((s) => s.state);
  const lastResult = useCommandProcessor((s) => s.lastResult);
  const lastResultType = useCommandProcessor((s) => s.lastResultType);
  const lastResultAt = useCommandProcessor((s) => s.lastResultAt);

  const language = (i18n.language === 'en' ? 'EN' : 'RU') as Language;
  const [speechSpeed, setSpeechSpeedState] = useState<number>(TTS_RATE_DEFAULT);
  const [vibrationEnabled, setVibrationEnabledState] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [yandexApiKey, setYandexApiKeyState] = useState<string>('');

  useEffect(() => {
    const loadSettings = async () => {
      const savedLanguage = await settingsRepository.getString(SETTINGS_KEYS.language);
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }

      const savedRate = await settingsRepository.getNumber(SETTINGS_KEYS.speechRate);
      if (typeof savedRate === 'number') {
        const clamped = Math.min(Math.max(savedRate, TTS_RATE_MIN), TTS_RATE_MAX);
        setSpeechSpeedState(clamped);
        await ttsService.setRate(clamped);
      }

      const savedVolume = await settingsRepository.getNumber(SETTINGS_KEYS.volume);
      if (typeof savedVolume === 'number') {
        setVolumeState(savedVolume);
        await ttsService.setVolume(savedVolume);
      }

      const savedVibration = await settingsRepository.getBool(SETTINGS_KEYS.vibration);
      if (typeof savedVibration === 'boolean') {
        setVibrationEnabledState(savedVibration);
      }

      const savedKey = await settingsRepository.getString(SETTINGS_KEYS.yandexApiKey);
      if (savedKey) {
        setYandexApiKeyState(savedKey);
        setYandexApiKeyRuntime(savedKey);
      }
    };

    const loadHistory = async () => {
      const entries = await historyRepository.getAllEntries();
      const mapped = entries.map((entry) => ({
        id: String(entry.id ?? `${entry.createdAt}-${entry.type}`),
        result: entry.resultText,
        timestamp: Date.parse(entry.createdAt),
        type: entry.type,
      }));
      setHistory(mapped);
    };

    void loadSettings();
    void loadHistory();
  }, [i18n]);

  useEffect(() => {
    if (processorState === 'processing') setStatus('processing');
    else if (processorState === 'error') setStatus('idle');
    else if (processorState === 'success') setStatus('ready');
    else if (processorState === 'listening') setStatus('listening');
    else setStatus('idle');
  }, [processorState]);

  useEffect(() => {
    const addEntry = async () => {
      if (!lastResult || !lastResultType || !lastResultAt) return;
      const createdAt = new Date(lastResultAt).toISOString();
      await historyRepository.addEntry({
        type: lastResultType,
        resultText: lastResult,
        createdAt,
      });
      setHistory((prev) => [
        {
          id: String(lastResultAt),
          result: lastResult,
          timestamp: lastResultAt,
          type: lastResultType,
        },
        ...prev,
      ]);
    };

    void addEntry();
  }, [lastResultAt, lastResult, lastResultType]);

  const setLanguage = (lang: Language) => {
    const next = lang.toLowerCase();
    i18n.changeLanguage(next);
    settingsRepository.setString(SETTINGS_KEYS.language, next);
    const ttsLang = next === 'en' ? 'en-US' : 'ru-RU';
    ttsService.setLanguage(ttsLang);
  };

  const setSpeechSpeed = (speed: number) => {
    const clamped = Math.min(Math.max(speed, TTS_RATE_MIN), TTS_RATE_MAX);
    setSpeechSpeedState(clamped);
    settingsRepository.setNumber(SETTINGS_KEYS.speechRate, clamped);
    ttsService.setRate(clamped);
  };

  const setVibrationEnabled = (enabled: boolean) => {
    setVibrationEnabledState(enabled);
    settingsRepository.setBool(SETTINGS_KEYS.vibration, enabled);
  };

  const setVolume = (vol: number) => {
    const clamped = Math.min(Math.max(vol, 0), 1);
    setVolumeState(clamped);
    settingsRepository.setNumber(SETTINGS_KEYS.volume, clamped);
    ttsService.setVolume(clamped);
  };

  const setYandexApiKey = (key: string) => {
    const normalized = key.trim();
    setYandexApiKeyState(normalized);
    settingsRepository.setString(SETTINGS_KEYS.yandexApiKey, normalized);
    setYandexApiKeyRuntime(normalized);
  };

  const clearHistory = () => {
    setHistory([]);
    historyRepository.clearHistory();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        speechSpeed,
        setSpeechSpeed,
        vibrationEnabled,
        setVibrationEnabled,
        volume,
        setVolume,
        status,
        setStatus,
        history,
        clearHistory,
        yandexApiKey,
        setYandexApiKey,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
