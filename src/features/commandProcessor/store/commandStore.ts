import { create } from 'zustand';
import { CommandType, parseCommand } from '../domain/command';
import { Logger } from '@core/utils/logger';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { CommandProcessorDependencies } from '../domain/commandProcessorDependencies';
import { createDefaultDependencies } from '../data/commandProcessorDependencyFactory';
import { BANKNOTE_INPUT_SIZE, YOLO_INPUT_SIZE } from '@core/constants/appConstants';

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
    Logger.info('CommandProcessor', `Команда: ${command.type}`, { raw: text });

    set({ state: 'processing', errorMessage: null });

    try {
      switch (command.type) {
      case CommandType.Read:
        if (!isFeatureEnabled('onboarding')) {
          // Note: 'Read' doesn't require feature flag, it's core functionality
        }
        await deps.tts.speak('Читаю текст перед вами...');
        {
          const photoResult = await deps.capturePhoto();
          if (!photoResult.ok) {
            await deps.tts.speak(photoResult.userMessage || 'Ошибка камеры');
            set({ state: 'error', errorMessage: photoResult.userMessage || 'Ошибка камеры' });
            break;
          }

          const ocrResult = await deps.ocr.recognize(photoResult.data!);
          if (!ocrResult.ok) {
            await deps.tts.speak(ocrResult.userMessage);
            set({ state: 'error', errorMessage: ocrResult.userMessage });
            break;
          }

          await deps.tts.speak(ocrResult.data);
          set({
            state: 'success',
            lastResult: ocrResult.data,
            lastResultType: 'ocr',
            lastResultAt: Date.now(),
          });
        }
        break;

      case CommandType.Describe:
        await deps.tts.speak('Делаю снимок для описания...');

        if (!deps.objectDetector.isReady()) {
          await deps.objectDetector.initialize();
        }

        const tensorResult = await deps.captureFrameTensor(YOLO_INPUT_SIZE, YOLO_INPUT_SIZE);
        if (!tensorResult.ok) {
          await deps.tts.speak(tensorResult.userMessage || 'Ошибка камеры');
          set({ state: 'error', errorMessage: tensorResult.userMessage || 'Ошибка камеры' });
          break;
        }

        const detectResult = await deps.objectDetector.detect(tensorResult.data!);
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

      case CommandType.Banknote:
        if (!isFeatureEnabled('banknoteClassifier')) {
          await deps.tts.speak('Функция пока недоступна');
          set({ state: 'error', errorMessage: 'Функция пока недоступна' });
          break;
        }

        await deps.tts.speak('Анализирую купюру...');

        if (!deps.banknoteClassifier.isReady()) {
          await deps.banknoteClassifier.initialize();
        }

        const tensorResultBanknote = await deps.captureFrameTensor(
          BANKNOTE_INPUT_SIZE,
          BANKNOTE_INPUT_SIZE,
        );
        if (!tensorResultBanknote.ok) {
          await deps.tts.speak(tensorResultBanknote.userMessage || 'Ошибка камеры');
          set({
            state: 'error',
            errorMessage: tensorResultBanknote.userMessage || 'Ошибка камеры',
          });
          break;
        }

        const banknoteResult = await deps.banknoteClassifier.classify(tensorResultBanknote.data!);
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

      case CommandType.Navigate:
        const mockDestination =
            text.replace(/навигация|маршрут|веди/gi, '').trim() || 'Ближайшая аптека';

        const navigationResult = await deps.spatialNavigation.buildRoute(mockDestination);
        if (navigationResult.ok) {
          await deps.tts.speak(
            `Построен маршрут. Направление: ${mockDestination}. Начните движение.`,
          );
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
            'Доступные команды: Прочитай, Опиши, Купюра, Навигация, Помощь, Повтори, Стоп';
        await deps.tts.speak(helpStr);
        set({
          state: 'success',
          lastResult: helpStr,
          lastResultType: 'system',
          lastResultAt: Date.now(),
        });
        break;

      case CommandType.Repeat:
        get().requestRepeat();
        return;

      case CommandType.Stop:
        get().requestStop();
        return;

      case CommandType.Unknown:
        await deps.tts.speak('Не понял, скажите ещё раз');
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
