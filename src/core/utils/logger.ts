/**
 * Structured JSON-логгер.
 *
 * - Пишет в файл через react-native-fs
 * - НЕ содержит PII (персональных данных)
 * - Ротация при достижении LOG_MAX_FILE_SIZE_BYTES
 * - Хранит LOG_MAX_FILES последних файлов
 *
 * Формат записи:
 * { level, timestamp, component, message, ?details }
 */

import {LOG_MAX_FILE_SIZE_BYTES, LOG_MAX_FILES} from '@core/constants/appConstants';

// TODO: Подключить react-native-fs для записи в файл.
// В текущей реализации — упрощённый вывод в console (только dev).

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  component: string;
  message: string;
  details?: unknown;
}

function formatEntry(
  level: LogLevel,
  component: string,
  message: string,
  details?: unknown,
): LogEntry {
  return {
    level,
    timestamp: new Date().toISOString(),
    component,
    message,
    details,
  };
}

async function writeLog(entry: LogEntry): Promise<void> {
  // TODO: Реализовать запись в файл + ротацию.
  //   1. Прочитать размер текущего лог-файла (react-native-fs stat)
  //   2. Если >= LOG_MAX_FILE_SIZE_BYTES → ротация
  //   3. Записать JSON.stringify(entry) + '\n'
  //
  // Лимиты: LOG_MAX_FILE_SIZE_BYTES, LOG_MAX_FILES

  if (__DEV__) {
    const prefix = `[${entry.level.toUpperCase()}][${entry.component}]`;
    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.details ?? '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.details ?? '');
        break;
      default:
        console.log(prefix, entry.message, entry.details ?? '');
    }
  }
}

export const Logger = {
  debug: (component: string, message: string, details?: unknown): void => {
    writeLog(formatEntry('debug', component, message, details));
  },

  info: (component: string, message: string, details?: unknown): void => {
    writeLog(formatEntry('info', component, message, details));
  },

  warn: (component: string, message: string, details?: unknown): void => {
    writeLog(formatEntry('warn', component, message, details));
  },

  error: (component: string, message: string, details?: unknown): void => {
    writeLog(formatEntry('error', component, message, details));
  },
} as const;
