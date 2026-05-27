import { create } from 'zustand';
import { CommandType, parseCommand } from '../domain/command';
import { Logger } from '@core/utils/logger';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { CommandProcessorDependencies } from '../domain/commandProcessorDependencies';
import { createDefaultDependencies } from '../data/commandProcessorDependencyFactory';
import {
  BANKNOTE_INPUT_SIZE,
  PROCESSING_FEEDBACK_DELAY_MS,
  SPEECH_RATE_STEPS,
  YOLO_INPUT_SIZE,
} from '@core/constants/appConstants';
import i18n from '@i18n/i18n';
import { AudioFeedback } from '@core/utils/audio';
import {
  BANKNOTE_LOW_CONFIDENCE,
  CAMERA_INIT_FAILED,
  CAMERA_PERMISSION_DENIED,
  DETECTION_MODEL_FAILED,
  DETECTION_MODEL_NOT_LOADED,
  DETECTION_NO_OBJECTS,
  NAVIGATION_API_KEY_MISSING,
  NAVIGATION_GEOCODE_FAILED,
  NAVIGATION_OFFLINE,
  NAVIGATION_ROUTE_FAILED,
  OCR_NO_TEXT,
  OCR_PROCESSING_FAILED,
} from '@core/errors/errorCodes';

export type ProcessorState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

interface CommandProcessorState {
  state: ProcessorState;
  lastResult: string | null;
  lastResultType: string | null;
  lastResultAt: number | null;
  errorMessage: string | null;
  processVoiceInput: (text: string) => Promise<void>;
  requestStop: () => void;
  requestRepeat: () => void;
}

let dependenciesInstance: CommandProcessorDependencies | null = null;
let activeRequestId = 0;

const ERROR_CODE_TO_I18N_KEY: Record<string, string> = {
  [CAMERA_PERMISSION_DENIED]: 'errors.cameraPermission',
  [CAMERA_INIT_FAILED]: 'errors.generic',
  [OCR_NO_TEXT]: 'errors.noText',
  [OCR_PROCESSING_FAILED]: 'errors.generic',
  [DETECTION_NO_OBJECTS]: 'errors.noObjects',
  [DETECTION_MODEL_FAILED]: 'errors.generic',
  [DETECTION_MODEL_NOT_LOADED]: 'errors.modelNotLoaded',
  [BANKNOTE_LOW_CONFIDENCE]: 'errors.banknoteLowConfidence',
  [NAVIGATION_API_KEY_MISSING]: 'errors.navigationApiKeyMissing',
  [NAVIGATION_GEOCODE_FAILED]: 'errors.navigationRouteFailed',
  [NAVIGATION_OFFLINE]: 'errors.navigationOffline',
  [NAVIGATION_ROUTE_FAILED]: 'errors.navigationRouteFailed',
};

const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

function resolveErrorMessage(errorCode?: string, fallback?: string): string {
  if (errorCode === NAVIGATION_ROUTE_FAILED && fallback) {
    return fallback;
  }
  if (errorCode && ERROR_CODE_TO_I18N_KEY[errorCode]) {
    return t(ERROR_CODE_TO_I18N_KEY[errorCode]);
  }
  if (fallback) {
    return fallback;
  }
  return t('errors.generic');
}

function getClosestSpeechStepIndex(value: number): number {
  let closestIndex = 0;
  let closestDelta = Number.POSITIVE_INFINITY;
  SPEECH_RATE_STEPS.forEach((step, index) => {
    const delta = Math.abs(step - value);
    if (delta < closestDelta) {
      closestDelta = delta;
      closestIndex = index;
    }
  });
  return closestIndex;
}

function getNextSpeechStep(value: number, direction: 'up' | 'down') {
  const currentIndex = getClosestSpeechStepIndex(value);
  const nextIndex =
    direction === 'up'
      ? Math.min(currentIndex + 1, SPEECH_RATE_STEPS.length - 1)
      : Math.max(currentIndex - 1, 0);
  return {
    currentIndex,
    nextIndex,
    nextValue: SPEECH_RATE_STEPS[nextIndex],
  };
}

function getDependencies(): CommandProcessorDependencies {
  if (!dependenciesInstance) {
    dependenciesInstance = createDefaultDependencies();
  }
  return dependenciesInstance;
}

function createProcessingLoop() {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isPlaying = false;

  const schedule = () => {
    if (timeoutId || isPlaying) {
      return;
    }
    timeoutId = setTimeout(() => {
      isPlaying = true;
      AudioFeedback.playLoop('processing');
    }, PROCESSING_FEEDBACK_DELAY_MS);
  };

  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (isPlaying) {
      AudioFeedback.stop('processing');
      isPlaying = false;
    }
  };

  return { schedule, stop };
}

/**
 * For testing: inject custom dependencies.
 * @internal
 */
export function setCommandProcessorDependencies(deps: CommandProcessorDependencies): void {
  dependenciesInstance = deps;
}

export const useCommandProcessor = create<CommandProcessorState>((set, get) => ({
  state: 'idle',
  lastResult: null,
  lastResultType: null,
  lastResultAt: null,
  errorMessage: null,

  processVoiceInput: async (text: string) => {
    const deps = getDependencies();
    const command = parseCommand(text);
    const requestId = activeRequestId + 1;
    activeRequestId = requestId;
    const isCancelled = () => requestId !== activeRequestId;
    const processingLoop = createProcessingLoop();
    Logger.info('CommandProcessor', `Команда: ${command.type}`, { raw: text });

    set({ state: 'processing', errorMessage: null });

    try {
      switch (command.type) {
      case CommandType.Read:
        if (!isFeatureEnabled('onboarding')) {
          // Note: 'Read' doesn't require feature flag, it's core functionality
        }
        await deps.tts.speak(t('voice.readPrompt'));
        if (isCancelled()) {
          return;
        }
        {
          const photoResult = await deps.capturePhoto();
          if (isCancelled()) {
            return;
          }
          if (!photoResult.ok) {
            const message = resolveErrorMessage(photoResult.errorCode, photoResult.userMessage);
            await deps.tts.speak(message);
            set({ state: 'error', errorMessage: message });
            break;
          }

          processingLoop.schedule();
          const ocrResult = await deps.ocr.recognize(photoResult.data!);
          processingLoop.stop();
          if (isCancelled()) {
            return;
          }
          if (!ocrResult.ok) {
            const message = resolveErrorMessage(ocrResult.errorCode, ocrResult.userMessage);
            await deps.tts.speak(message);
            set({ state: 'error', errorMessage: message });
            break;
          }

          await deps.tts.speak(ocrResult.data);
          if (isCancelled()) {
            return;
          }
          set({
            state: 'success',
            lastResult: ocrResult.data,
            lastResultType: 'ocr',
            lastResultAt: Date.now(),
          });
        }
        break;

      case CommandType.Describe: {
        await deps.tts.speak(t('voice.describePrompt'));
        if (isCancelled()) {
          return;
        }

        if (!deps.objectDetector.isReady()) {
          const initResult = await deps.objectDetector.initialize();
          if (isCancelled()) {
            return;
          }
          if (!initResult.ok) {
            const message = resolveErrorMessage(initResult.errorCode, initResult.userMessage);
            await deps.tts.speak(message);
            set({ state: 'error', errorMessage: message });
            break;
          }
        }

        const frameResult = await deps.captureFrameTensor(
          YOLO_INPUT_SIZE,
          YOLO_INPUT_SIZE,
          12000,
        );
        if (isCancelled()) {
          return;
        }
        if (!frameResult.ok) {
          const message = resolveErrorMessage(frameResult.errorCode, frameResult.userMessage);
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
          break;
        }

        processingLoop.schedule();
        const detectResult = await deps.objectDetector.detect(frameResult.data!);
        processingLoop.stop();
        if (isCancelled()) {
          return;
        }
        if (!detectResult.ok) {
          const message = resolveErrorMessage(detectResult.errorCode, detectResult.userMessage);
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
        } else if (detectResult.data.length > 0) {
          const labelsStr = detectResult.data.map(r => r.label).join(', ');
          const resultMsg = t('voice.detected', { labels: labelsStr });
          await deps.tts.speak(resultMsg);
          set({
            state: 'success',
            lastResult: resultMsg,
            lastResultType: 'detection',
            lastResultAt: Date.now(),
          });
        } else {
          const message = t('errors.noObjects');
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
        }
        break;
      }

      case CommandType.Banknote: {
        if (!isFeatureEnabled('banknoteClassifier')) {
          const message = t('errors.featureDisabled');
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
          break;
        }

        await deps.tts.speak(t('voice.banknotePrompt'));
        if (isCancelled()) {
          return;
        }

          Logger.info('CommandProcessor', 'Banknote: requesting frame tensor');

        if (!deps.banknoteClassifier.isReady()) {
          const initResult = await deps.banknoteClassifier.initialize();
          if (isCancelled()) {
            return;
          }
          if (!initResult.ok) {
            const message = resolveErrorMessage(initResult.errorCode, initResult.userMessage);
            await deps.tts.speak(message);
            set({ state: 'error', errorMessage: message });
            break;
          }
        }

        const frameResult = await deps.captureFrameTensor(
          BANKNOTE_INPUT_SIZE,
          BANKNOTE_INPUT_SIZE,
          4000,
        );
        Logger.info('CommandProcessor', 'Banknote: frameResult', { ok: frameResult.ok, length: frameResult.data ? frameResult.data.length : 0 });
        if (isCancelled()) {
          return;
        }
        if (!frameResult.ok) {
          const message = resolveErrorMessage(frameResult.errorCode, frameResult.userMessage);
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
          break;
        }

        processingLoop.schedule();
        const banknoteResult = await deps.banknoteClassifier.classify(frameResult.data!);
        Logger.info('CommandProcessor', 'Banknote: classifier returned', banknoteResult.ok ? { ok: true } : { ok: false, errorCode: banknoteResult.errorCode });
        processingLoop.stop();
        if (isCancelled()) {
          return;
        }
        if (banknoteResult.ok) {
          const finalMsg = t('voice.banknoteDetected', { label: banknoteResult.data });
          await deps.tts.speak(finalMsg);
          set({
            state: 'success',
            lastResult: finalMsg,
            lastResultType: 'banknote',
            lastResultAt: Date.now(),
          });
        } else {
          const message = resolveErrorMessage(
            banknoteResult.errorCode,
            banknoteResult.userMessage,
          );
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
        }
        break;
      }

      case CommandType.Navigate:
        const mockDestination =
            text.replace(/навигация|маршрут|веди/gi, '').trim() || t('voice.defaultDestination');

        processingLoop.schedule();
        Logger.info('CommandProcessor', 'Navigate: building route', { destination: mockDestination });
        const navigationResult = await deps.spatialNavigation.buildRoute(mockDestination);
        Logger.info('CommandProcessor', 'Navigate: buildRoute result', navigationResult.ok ? { ok: true } : { ok: false, errorCode: navigationResult.errorCode });
        processingLoop.stop();
        if (isCancelled()) {
          return;
        }
        if (navigationResult.ok) {
          await deps.tts.speak(t('voice.navigationStart', { destination: mockDestination }));
          if (isCancelled()) {
            return;
          }
          deps.spatialNavigation.startNavigation(navigationResult.data, instruction => {
            void deps.tts.speak(instruction);
            Logger.info('SpatialNavigation', instruction);
          });
          set({
            state: 'success',
            lastResult: t('voice.navigationSummary', { destination: mockDestination }),
            lastResultType: 'navigation',
            lastResultAt: Date.now(),
          });
        } else {
          const message = resolveErrorMessage(
            navigationResult.errorCode,
            navigationResult.userMessage,
          );
          await deps.tts.speak(message);
          set({ state: 'error', errorMessage: message });
        }
        break;

      case CommandType.Help:
        const helpStr = t('voice.help');
        await deps.tts.speak(helpStr);
        if (isCancelled()) {
          return;
        }
        set({
          state: 'success',
          lastResult: helpStr,
          lastResultType: 'system',
          lastResultAt: Date.now(),
        });
        break;

      case CommandType.SpeechFaster: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const settingsState = deps.settings.getState();
        if (!settingsState) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const { currentIndex, nextIndex, nextValue } = getNextSpeechStep(
          settingsState.speechSpeed,
          'up',
        );
        if (nextIndex === currentIndex) {
          const msg = t('voice.speechRateMax');
          await deps.tts.speak(msg);
          if (isCancelled()) {
            return;
          }
          set({
            state: 'success',
            lastResult: msg,
            lastResultType: 'settings',
            lastResultAt: Date.now(),
          });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setSpeechSpeed(nextValue);
        const msg = t('voice.speechRateUp', { value: nextValue });
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.SpeechSlower: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const settingsState = deps.settings.getState();
        if (!settingsState) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const { currentIndex, nextIndex, nextValue } = getNextSpeechStep(
          settingsState.speechSpeed,
          'down',
        );
        if (nextIndex === currentIndex) {
          const msg = t('voice.speechRateMin');
          await deps.tts.speak(msg);
          if (isCancelled()) {
            return;
          }
          set({
            state: 'success',
            lastResult: msg,
            lastResultType: 'settings',
            lastResultAt: Date.now(),
          });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setSpeechSpeed(nextValue);
        const msg = t('voice.speechRateDown', { value: nextValue });
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.VibrationOn: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setVibrationEnabled(true);
        const msg = t('voice.vibrationOn');
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.VibrationOff: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setVibrationEnabled(false);
        const msg = t('voice.vibrationOff');
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.LanguageRu: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const msg = t('voice.languageRu');
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        deps.settings.setLanguage('RU');
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.LanguageEn: {
        if (!deps.settings.isReady()) {
          const msg = t('voice.settingsUnavailable');
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const msg = t('voice.languageEn');
        await deps.tts.speak(msg);
        if (isCancelled()) {
          return;
        }
        deps.settings.setLanguage('EN');
        set({
          state: 'success',
          lastResult: msg,
          lastResultType: 'settings',
          lastResultAt: Date.now(),
        });
        break;
      }

      case CommandType.Repeat:
        get().requestRepeat();
        return;

      case CommandType.Stop:
        get().requestStop();
        return;

      case CommandType.Unknown:
        await deps.tts.speak(t('errors.notUnderstood'));
        if (isCancelled()) {
          return;
        }
        set({ state: 'error', errorMessage: t('errors.notUnderstood') });
        break;
      }
    } catch (error) {
      Logger.error('CommandProcessor', 'Необработанная ошибка', error);
      processingLoop.stop();
      await deps.tts.speak(t('errors.generic'));
      set({
        state: 'error',
        errorMessage: t('errors.generic'),
      });
    } finally {
      processingLoop.stop();
    }
  },

  requestStop: () => {
    const deps = getDependencies();
    activeRequestId += 1;
    deps.spatialNavigation.stopNavigation();
    AudioFeedback.stop('processing');
    void deps.tts.stop();
    Logger.info('CommandProcessor', 'Остановка по команде');
    set({ state: 'idle' });
  },

  requestRepeat: () => {
    const deps = getDependencies();
    deps.history.getLastEntry().then(entry => {
      if (entry?.resultText) {
        void deps.tts.speak(entry.resultText);
        Logger.info('CommandProcessor', 'Повтор последнего результата');
        set({ state: 'success' });
      } else {
        const message = t('voice.noPreviousResult');
        void deps.tts.speak(message);
        set({ state: 'error', errorMessage: message });
      }
    });
  },
}));
