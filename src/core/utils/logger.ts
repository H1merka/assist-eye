import {LOG_MAX_FILE_SIZE_BYTES, LOG_MAX_FILES} from '@core/constants/appConstants';
import * as RNFS from 'react-native-fs';
import {sanitizeForLogging, LOG_RETENTION_DAYS} from './privacyUtils';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  component: string;
  message: string;
  details?: unknown;
}

const LOG_FILE_PATH = `${RNFS.DocumentDirectoryPath}/app.log`;

let logQueue: string[] = [];
let isWriting = false;

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

async function processLogQueue(): Promise<void> {
  if (isWriting || logQueue.length === 0) return;
  isWriting = true;

  try {
    const logsToWrite = logQueue.join('');
    logQueue = [];
    
    const fileExists = await RNFS.exists(LOG_FILE_PATH);
    if (fileExists) {
      const stats = await RNFS.stat(LOG_FILE_PATH);
      if (stats.size >= LOG_MAX_FILE_SIZE_BYTES) {
        await rotateLogs();
      }
    }

    await RNFS.appendFile(LOG_FILE_PATH, logsToWrite, 'utf8');
  } catch (error) {
    if (__DEV__) console.error('[Logger] Queue processing failed:', error);
  } finally {
    isWriting = false;
    if (logQueue.length > 0) {
      processLogQueue();
    }
  }
}

async function rotateLogs(): Promise<void> {
  try {
    for (let i = LOG_MAX_FILES - 1; i >= 1; i--) {
      const currPath = i === 1 ? LOG_FILE_PATH : `${LOG_FILE_PATH}.${i - 1}`;
      const nextPath = `${LOG_FILE_PATH}.${i}`;
      if (await RNFS.exists(currPath)) {
        if (await RNFS.exists(nextPath)) {
          await RNFS.unlink(nextPath);
        }
        await RNFS.moveFile(currPath, nextPath);
      }
    }
  } catch (error) {
    if (__DEV__) console.error('[Logger] Rotation failed:', error);
  }
}

async function writeLog(entry: LogEntry): Promise<void> {
  // Sanitize details for privacy
  const sanitizedEntry: LogEntry = {
    ...entry,
    details: entry.details ? sanitizeForLogging(entry.details) : undefined,
  };

  const stringified = JSON.stringify(sanitizedEntry);
  logQueue.push(stringified + '\n');
  
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

  processLogQueue();
}

async function cleanupOldLogs(): Promise<void> {
  try {
    const cutoffTime = Date.now() - LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    for (let i = 1; i <= LOG_MAX_FILES; i++) {
      const logPath = i === 1 ? LOG_FILE_PATH : `${LOG_FILE_PATH}.${i - 1}`;
      if (await RNFS.exists(logPath)) {
        const stats = await RNFS.stat(logPath);
        const modifiedTime = Math.floor(new Date(stats.mtime!).getTime());
        if (modifiedTime < cutoffTime) {
          await RNFS.unlink(logPath);
        }
      }
    }
  } catch (error) {
    if (__DEV__) console.error('[Logger] Cleanup failed:', error);
  }
}

export const Logger = {
  debug: (component: string, message: string, details?: unknown): void => {
    void writeLog(formatEntry('debug', component, message, details));
  },

  info: (component: string, message: string, details?: unknown): void => {
    void writeLog(formatEntry('info', component, message, details));
  },

  warn: (component: string, message: string, details?: unknown): void => {
    void writeLog(formatEntry('warn', component, message, details));
  },

  error: (component: string, message: string, details?: unknown): void => {
    void writeLog(formatEntry('error', component, message, details));
  },

  /**
   * Manually trigger cleanup of old logs.
   * (Auto-cleanup could be added to AppContext on app startup.)
   */
  cleanupOldLogs: (): Promise<void> => cleanupOldLogs(),
} as const;
