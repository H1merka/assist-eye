/**
 * Command Processor — центральный оркестратор приложения.
 *
 * Zustand store, управляющий потоком:
 *   ASR текст → parseCommand → dispatch в модуль → результат → TTS
 *
 * Error Boundary: каждый модуль обёрнут в try/catch,
 * при исключении — озвучивается понятное сообщение.
 */

import {create} from 'zustand';
import {CommandType, parseCommand} from '../domain/command';
import {Logger} from '@core/utils/logger';
import type {Result} from '@core/errors/result';

// TODO: Импортировать реальные сервисы после реализации
// import { ocrService } from '@features/ocr/data/mlKitOcrService';
// import { objectDetector } from '@features/objectDetection/data/tfliteObjectDetector';
import { ttsService } from '@features/tts/data/reactNativeTtsService';
// import { cameraService } from '@features/camera/data/cameraService';
// import { historyRepository } from '@features/storage/data/databaseHelper';

import { spatialNavigationService } from '@features/spatialNavigation/data/expoSpatialNavigationService';

export type ProcessorState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

interface CommandProcessorState {
  /** Текущее состояние обработки */
  state: ProcessorState;

  /** Последний результат (для команды «Повтори») */
  lastResult: string | null;

  /** Текст последней ошибки */
  errorMessage: string | null;

  /** Обработать текст, полученный от ASR */
  processVoiceInput: (text: string) => Promise<void>;

  /** Запросить остановку текущей операции */
  requestStop: () => void;

  /** Повторить последний результат */
  requestRepeat: () => void;
}

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
          ttsService.speak('Описываю окружение...');
          set({state: 'success', lastResult: 'Вижу: монитор, мышь, стол'});
          break;

        case CommandType.Banknote:
          ttsService.speak('Распознаю купюру...');
          set({state: 'success', lastResult: 'Сто рублей'});
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
