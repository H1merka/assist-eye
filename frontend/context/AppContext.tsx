import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'RU';
export type AppStatus = 'idle' | 'listening' | 'processing' | 'ready';

export interface HistoryItem {
  id: string;
  result: string;
  timestamp: number;
}

export const LABELS: Record<Language, Record<string, string>> = {
  EN: {
    start: 'Start',
    startHint: 'Opens camera assistant',
    stop: 'Stop',
    stopHint: 'Stops voice input',
    statusIdle: 'Ready. Press Start to open camera.',
    statusListening: 'Listening...',
    statusProcessing: 'Processing...',
    statusReady: 'Result ready',
    settingsTitle: 'Settings',
    language: 'Language',
    speechSpeed: 'Speech Speed',
    vibration: 'Vibration Feedback',
    mainTitle: 'AssistEye',
    mainSubtitle: 'Voice Assistant',
    tabMain: 'Main',
    tabSettings: 'Settings',
    slowLabel: 'Slow',
    fastLabel: 'Fast',
    on: 'On',
    off: 'Off',
    history: 'History',
    historyEmpty: 'History is empty',
    clearHistory: 'Clear history',
    confirm: 'Confirm',
    cancel: 'Cancel',
    confirmClear: 'Are you sure you want to clear all history?',
    volume: 'Volume',
    tryAgain: 'Try again',
    error: 'Error',
    tabHistory: 'History',
    cameraPrompt: 'Point camera at object',
    capture: 'Capture',
    processingCamera: 'Processing...',
    detectedPrefix: 'Detected',
    repeat: 'Repeat',
    close: 'Close',
    requestCameraPermission: 'Allow Camera Access',
    cameraPermissionRequired: 'Camera permission is required to continue.',
  },
  RU: {
    start: 'Старт',
    startHint: 'Активирует голосовой ввод',
    stop: 'Стоп',
    stopHint: 'Останавливает голосовой ввод',
    statusIdle: 'Готово. Нажмите Старт.',
    statusListening: 'Слушаю...',
    statusProcessing: 'Обработка...',
    statusReady: 'Результат готов',
    settingsTitle: 'Настройки',
    language: 'Язык',
    speechSpeed: 'Скорость речи',
    vibration: 'Вибрация',
    mainTitle: 'AssistEye',
    mainSubtitle: 'Голосовой помощник',
    tabMain: 'Главная',
    tabSettings: 'Настройки',
    slowLabel: 'Медленно',
    fastLabel: 'Быстро',
    on: 'Вкл',
    off: 'Выкл',
    history: 'История',
    historyEmpty: 'История пуста',
    clearHistory: 'Очистить историю',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    confirmClear: 'Вы уверены, что хотите очистить всю историю?',
    volume: 'Громкость',
    tryAgain: 'Попробовать снова',
    error: 'Ошибка',
  },
};

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
  addToHistory: (result: string) => void;
  clearHistory: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (result: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      result,
      timestamp: Date.now(),
    };
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const t = (key: string): string => LABELS[language][key] ?? LABELS.EN[key] ?? key;

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
        addToHistory,
        clearHistory,
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
