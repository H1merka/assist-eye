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
// import { ttsService } from '@features/tts/data/ttsService';
// import { cameraService } from '@features/camera/data/cameraService';
// import { historyRepository } from '@features/storage/data/databaseHelper';

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
          // TODO: Реализовать:
          //   1. cameraService.capture()
          //   2. imagePreprocessing.autoAdjustBrightnessContrast(photo)
          //   3. ocrService.recognize(processedPhoto)
          //   4. if ok → ttsService.speak(result) + сохранить в историю
          //   5. if fail → ttsService.speak(userMessage)
          set({state: 'success', lastResult: 'TODO: OCR результат'});
          break;

        case CommandType.Describe:
          // TODO: Реализовать:
          //   1. cameraService.capture()
          //   2. objectDetector.detect(photo)
          //   3. Сформировать «Вижу: объект1, объект2» (топ-3)
          //   4. ttsService.speak(result)
          set({state: 'success', lastResult: 'TODO: Detection результат'});
          break;

        case CommandType.Banknote:
          // TODO: Проверить isFeatureEnabled('banknoteClassifier')
          //   Если false → «Функция пока недоступна»
          //   Иначе: capture → crop → classify → speak
          set({state: 'success', lastResult: 'TODO: Banknote результат'});
          break;

        case CommandType.Help:
          // TODO: Озвучить список команд через TTS
          set({state: 'success', lastResult: 'Доступные команды: Прочитай, Опиши, Купюра, Помощь, Повтори, Стоп'});
          break;

        case CommandType.Repeat:
          get().requestRepeat();
          return;

        case CommandType.Stop:
          get().requestStop();
          return;

        case CommandType.Unknown:
          // TODO: ttsService.speak('Не понял — скажите ещё раз')
          // TODO: haptic.trigger('notificationError')
          set({state: 'error', errorMessage: 'Не понял — скажите ещё раз'});
          break;
      }
    } catch (error) {
      Logger.error('CommandProcessor', 'Необработанная ошибка', error);
      set({
        state: 'error',
        errorMessage: 'Произошла ошибка — попробуйте ещё раз',
      });
      // TODO: ttsService.speak('Произошла ошибка — попробуйте ещё раз')
    }
  },

  requestStop: () => {
    // TODO: ttsService.stop() — очистить очередь TTS
    Logger.info('CommandProcessor', 'Остановка по команде');
    set({state: 'idle'});
  },

  requestRepeat: () => {
    const {lastResult} = get();
    if (lastResult) {
      // TODO: ttsService.speak(lastResult)
      Logger.info('CommandProcessor', 'Повтор последнего результата');
      set({state: 'success'});
    } else {
      // TODO: ttsService.speak('Нет предыдущего результата')
      set({state: 'error', errorMessage: 'Нет предыдущего результата'});
    }
  },
}));
