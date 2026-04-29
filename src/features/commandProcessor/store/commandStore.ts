import {create} from 'zustand';
import {CommandType, parseCommand} from '../domain/command';
import {Logger} from '@core/utils/logger';

import { ttsService } from '@features/tts/data/reactNativeTtsService';
import { TfliteObjectDetector } from '@features/objectDetection/data/tfliteObjectDetector';
import { TfliteBanknoteClassifier } from '@features/banknoteClassifier/data/tfliteBanknoteClassifier';
import { capturePhoto } from '@features/camera/data/cameraService';
import { spatialNavigationService } from '@features/spatialNavigation/data/expoSpatialNavigationService';

export type ProcessorState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

interface CommandProcessorState {
  state: ProcessorState;
  lastResult: string | null;
  errorMessage: string | null;
  processVoiceInput: (text: string) => Promise<void>;
  requestStop: () => void;
  requestRepeat: () => void;
}

const objectDetector = new TfliteObjectDetector();
const banknoteClassifier = new TfliteBanknoteClassifier();

export const useCommandProcessor = create<CommandProcessorState>((set, get) => ({
  state: 'idle',
  lastResult: null,
  errorMessage: null,

  processVoiceInput: async (text: string) => {
    const command = parseCommand(text);
    Logger.info('CommandProcessor', `Команда: ${command.type}`, {raw: text});

    set({state: 'processing', errorMessage: null});

    try {
      switch (command.type) {
        case CommandType.Read:
          ttsService.speak('Читаю текст перед вами...');
          set({state: 'success', lastResult: 'OCR результат: Привет, мир!'});
          break;

        case CommandType.Describe:
          ttsService.speak('Делаю снимок для описания...');
          
          if (!objectDetector.isReady()) await objectDetector.initialize();
          
          const cameraResultObj = await capturePhoto();
          if (!cameraResultObj.ok) {
            ttsService.speak(cameraResultObj.userMessage);
            set({state: 'error', errorMessage: cameraResultObj.userMessage});
            break;
          }

          const detectResult = await objectDetector.detect(cameraResultObj.data);
          if (!detectResult.ok) {
             const failMsg = detectResult.userMessage || 'Объекты не найдены';
             ttsService.speak(failMsg);
             set({state: 'error', errorMessage: failMsg});
          } else if (detectResult.data.length > 0) {
             const labelsStr = detectResult.data.map(r => r.label).join(', ');
             const resultMsg = `Вижу: ${labelsStr}`;
             ttsService.speak(resultMsg);
             set({state: 'success', lastResult: resultMsg});
          } else {
             const failMsg = 'Объекты не найдены';
             ttsService.speak(failMsg);
             set({state: 'error', errorMessage: failMsg});
          }
          break;

        case CommandType.Banknote:
          ttsService.speak('Анализирую купюру...');
          
          if (!banknoteClassifier.isReady()) await banknoteClassifier.initialize();
          
          const cameraResultBank = await capturePhoto();
          if (!cameraResultBank.ok) {
            ttsService.speak(cameraResultBank.userMessage);
            set({state: 'error', errorMessage: cameraResultBank.userMessage});
            break;
          }

          const banknoteResult = await banknoteClassifier.classify(cameraResultBank.data);
          if (banknoteResult.ok) {
            const finalMsg = `Определено: ${banknoteResult.data}`;
            ttsService.speak(finalMsg);
            set({state: 'success', lastResult: finalMsg});
          } else {
            ttsService.speak(banknoteResult.userMessage);
            set({state: 'error', errorMessage: banknoteResult.userMessage});
          }
          break;

        case CommandType.Navigate:
          const mockDestination = text.replace(/навигация|маршрут|веди/gi, '').trim() || 'Ближайшая аптека';
          
          const navigationResult = await spatialNavigationService.buildRoute(mockDestination);
          if (navigationResult.ok) {
            ttsService.speak(`Построен маршрут. Направление: ${mockDestination}. Начните движение.`);
            spatialNavigationService.startNavigation(navigationResult.data, (instruction) => {
              ttsService.speak(instruction);
              Logger.info('SpatialNavigation', instruction);
            });
            set({state: 'success', lastResult: `Маршрут до ${mockDestination} построен`});
          } else {
            ttsService.speak(navigationResult.userMessage);
            set({state: 'error', errorMessage: navigationResult.userMessage});
          }
          break;

        case CommandType.Help:
          const helpStr = 'Доступные команды: Прочитай, Опиши, Купюра, Навигация, Помощь, Повтори, Стоп';
          ttsService.speak(helpStr);
          set({state: 'success', lastResult: helpStr});
          break;

        case CommandType.Repeat:
          get().requestRepeat();
          return;

        case CommandType.Stop:
          get().requestStop();
          return;

        case CommandType.Unknown:
          ttsService.speak('Не понял, скажите ещё раз');
          set({state: 'error', errorMessage: 'Не понял — скажите ещё раз'});
          break;
      }
    } catch (error) {
      Logger.error('CommandProcessor', 'Необработанная ошибка', error);
      ttsService.speak('Произошла ошибка, попробуйте ещё раз');
      set({
        state: 'error',
        errorMessage: 'Произошла ошибка — попробуйте ещё раз',
      });
    }
  },

  requestStop: () => {
    ttsService.stop();
    Logger.info('CommandProcessor', 'Остановка по команде');
    set({state: 'idle'});
  },

  requestRepeat: () => {
    const {lastResult} = get();
    if (lastResult) {
      ttsService.speak(lastResult);
      Logger.info('CommandProcessor', 'Повтор последнего результата');
      set({state: 'success'});
    } else {
      ttsService.speak('Нет предыдущего результата');
      set({state: 'error', errorMessage: 'Нет предыдущего результата'});
    }
  },
}));
