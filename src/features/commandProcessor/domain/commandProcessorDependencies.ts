/**
 * Dependency injection container for CommandProcessor.
 *
 * Separates concerns: services are instantiated outside the store,
 * enabling testability and configuration flexibility.
 */

import { TtsService } from '@features/tts/domain/ttsService';
import { ObjectDetector } from '@features/objectDetection/domain/objectDetector';
import { BanknoteClassifier } from '@features/banknoteClassifier/domain/banknoteClassifier';
import { OcrService } from '@features/ocr/domain/ocrService';
import { SpatialNavigationService } from '@features/spatialNavigation/domain/spatialNavigationService';
import { HistoryRepository } from '@features/storage/domain/historyRepository';

/**
 * Service container for command processing.
 * Inject real implementations in production, mocks in tests.
 */
export interface CommandProcessorDependencies {
  tts: TtsService;
  objectDetector: ObjectDetector;
  banknoteClassifier: BanknoteClassifier;
  ocr: OcrService;
  spatialNavigation: SpatialNavigationService;
  history: HistoryRepository;
  /**
   * Camera frame tensor capture function.
   * @param width Target width
   * @param height Target height
   * @param timeoutMs Optional timeout in milliseconds
   * @returns RGB tensor as Uint8Array
   */
  captureFrameTensor: (
    width: number,
    height: number,
    timeoutMs?: number,
  ) => Promise<{ok: boolean; data?: Uint8Array; userMessage?: string}>;
  /**
   * Camera photo capture function.
   * @returns {ok, data} where data is file path on success
   */
  capturePhoto: () => Promise<{ok: boolean; data?: string; userMessage?: string}>;
}
