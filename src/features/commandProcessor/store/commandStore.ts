import { create } from 'zustand';
import { CommandType, parseCommand } from '../domain/command';
import { Logger } from '@core/utils/logger';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { CommandProcessorDependencies } from '../domain/commandProcessorDependencies';
import { createDefaultDependencies } from '../data/commandProcessorDependencyFactory';
import { SPEECH_RATE_STEPS } from '@core/constants/appConstants';

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
    Logger.info('CommandProcessor', `Команда: ${command.type}`, { raw: text });

    set({ state: 'processing', errorMessage: null });

    try {
      switch (command.type) {
      case CommandType.Read:
        if (!isFeatureEnabled('onboarding')) {
          // Note: 'Read' doesn't require feature flag, it's core functionality
        }
        await deps.tts.speak(
          'Читаю текст перед вами. Поднесите текст к камере и дважды нажмите на экран для снимка.',
        );
        if (isCancelled()) {
          return;
        }
        {
          const photoResult = await deps.capturePhoto();
          if (isCancelled()) {
            return;
          }
          if (!photoResult.ok) {
            await deps.tts.speak(photoResult.userMessage || 'Ошибка камеры');
            set({ state: 'error', errorMessage: photoResult.userMessage || 'Ошибка камеры' });
            break;
          }

          const ocrResult = await deps.ocr.recognize(photoResult.data!);
          if (isCancelled()) {
            return;
          }
          if (!ocrResult.ok) {
            await deps.tts.speak(ocrResult.userMessage);
            set({ state: 'error', errorMessage: ocrResult.userMessage });
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
        await deps.tts.speak(
          'Опишу сцену. Наведите камеру и дважды нажмите на экран для снимка.',
        );
        if (isCancelled()) {
          return;
        }

        if (!deps.objectDetector.isReady()) {
          await deps.objectDetector.initialize();
          if (isCancelled()) {
            return;
          }
        }

        const photoResult = await deps.capturePhoto();
        if (isCancelled()) {
          return;
        }
        if (!photoResult.ok) {
          await deps.tts.speak(photoResult.userMessage || 'Ошибка камеры');
          set({ state: 'error', errorMessage: photoResult.userMessage || 'Ошибка камеры' });
          break;
        }

        const detectResult = await deps.objectDetector.detect(photoResult.data!);
        if (isCancelled()) {
          return;
        }
        if (!detectResult.ok) {
          const failMsg = detectResult.userMessage || 'Объекты не найдены';
          await deps.tts.speak(failMsg);
          set({ state: 'error', errorMessage: failMsg });
        } else if (detectResult.data.length > 0) {
          const labelsStr = detectResult.data.map(r => r.label).join(', ');
          const resultMsg = `Вижу: ${labelsStr}`;
          await deps.tts.speak(resultMsg);
          set({
            state: 'success',
            lastResult: resultMsg,
            lastResultType: 'detection',
            lastResultAt: Date.now(),
          });
        } else {
          const failMsg = 'Объекты не найдены';
          await deps.tts.speak(failMsg);
          set({ state: 'error', errorMessage: failMsg });
        }
        break;
      }

      case CommandType.Banknote: {
        if (!isFeatureEnabled('banknoteClassifier')) {
          await deps.tts.speak('Функция пока недоступна');
          set({ state: 'error', errorMessage: 'Функция пока недоступна' });
          break;
        }

        await deps.tts.speak(
          'Определяю купюру. Поднесите купюру к камере и дважды нажмите на экран для снимка.',
        );
        if (isCancelled()) {
          return;
        }

        if (!deps.banknoteClassifier.isReady()) {
          await deps.banknoteClassifier.initialize();
          if (isCancelled()) {
            return;
          }
        }

        const photoResult = await deps.capturePhoto();
        if (isCancelled()) {
          return;
        }
        if (!photoResult.ok) {
          await deps.tts.speak(photoResult.userMessage || 'Ошибка камеры');
          set({
            state: 'error',
            errorMessage: photoResult.userMessage || 'Ошибка камеры',
          });
          break;
        }

        const banknoteResult = await deps.banknoteClassifier.classify(photoResult.data!);
        if (isCancelled()) {
          return;
        }
        if (banknoteResult.ok) {
          const finalMsg = `Определено: ${banknoteResult.data}`;
          await deps.tts.speak(finalMsg);
          set({
            state: 'success',
            lastResult: finalMsg,
            lastResultType: 'banknote',
            lastResultAt: Date.now(),
          });
        } else {
          await deps.tts.speak(banknoteResult.userMessage);
          set({ state: 'error', errorMessage: banknoteResult.userMessage });
        }
        break;
      }

      case CommandType.Navigate:
        const mockDestination =
            text.replace(/навигация|маршрут|веди/gi, '').trim() || 'Ближайшая аптека';

        const navigationResult = await deps.spatialNavigation.buildRoute(mockDestination);
        if (isCancelled()) {
          return;
        }
        if (navigationResult.ok) {
          await deps.tts.speak(
            `Построен маршрут. Направление: ${mockDestination}. Начните движение.`,
          );
          if (isCancelled()) {
            return;
          }
          deps.spatialNavigation.startNavigation(navigationResult.data, instruction => {
            void deps.tts.speak(instruction);
            Logger.info('SpatialNavigation', instruction);
          });
          set({
            state: 'success',
            lastResult: `Маршрут до ${mockDestination} построен`,
            lastResultType: 'navigation',
            lastResultAt: Date.now(),
          });
        } else {
          await deps.tts.speak(navigationResult.userMessage);
          set({ state: 'error', errorMessage: navigationResult.userMessage });
        }
        break;

      case CommandType.Help:
        const helpStr =
            'Доступные команды: Прочитай, Опиши, Купюра, Навигация, Помощь, Повтори, Стоп, Быстрее, Медленнее, Включи вибрацию, Выключи вибрацию, Русский язык, Английский язык';
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const settingsState = deps.settings.getState();
        if (!settingsState) {
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const { currentIndex, nextIndex, nextValue } = getNextSpeechStep(
          settingsState.speechSpeed,
          'up',
        );
        if (nextIndex === currentIndex) {
          const msg = 'Скорость речи уже максимальная';
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
        const msg = `Скорость речи увеличена до ${nextValue}x`;
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const settingsState = deps.settings.getState();
        if (!settingsState) {
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const { currentIndex, nextIndex, nextValue } = getNextSpeechStep(
          settingsState.speechSpeed,
          'down',
        );
        if (nextIndex === currentIndex) {
          const msg = 'Скорость речи уже минимальная';
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
        const msg = `Скорость речи уменьшена до ${nextValue}x`;
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setVibrationEnabled(true);
        const msg = 'Вибрация включена';
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        if (isCancelled()) {
          return;
        }
        deps.settings.setVibrationEnabled(false);
        const msg = 'Вибрация выключена';
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const msg = 'Переключаю язык на русский';
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
          const msg = 'Настройки недоступны';
          await deps.tts.speak(msg);
          set({ state: 'error', errorMessage: msg });
          break;
        }
        const msg = 'Переключаю язык на английский';
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
        await deps.tts.speak('Не понял, скажите ещё раз');
        if (isCancelled()) {
          return;
        }
        set({ state: 'error', errorMessage: 'Не понял — скажите ещё раз' });
        break;
      }
    } catch (error) {
      Logger.error('CommandProcessor', 'Необработанная ошибка', error);
      await deps.tts.speak('Произошла ошибка, попробуйте ещё раз');
      set({
        state: 'error',
        errorMessage: 'Произошла ошибка — попробуйте ещё раз',
      });
    }
  },

  requestStop: () => {
    const deps = getDependencies();
    activeRequestId += 1;
    deps.spatialNavigation.stopNavigation();
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
        void deps.tts.speak('Нет предыдущего результата');
        set({ state: 'error', errorMessage: 'Нет предыдущего результата' });
      }
    });
  },
}));
