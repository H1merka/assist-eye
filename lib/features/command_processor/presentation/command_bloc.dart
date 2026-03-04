import 'package:flutter_bloc/flutter_bloc.dart';

import 'command_event.dart';
import 'command_state.dart';

/// BLoC для обработки голосовых команд (§8.2 ТЗ).
///
/// Центральный оркестратор приложения:
/// 1. Получает текст от ASR (VoiceCommandReceived)
/// 2. Парсит команду (regex)
/// 3. Диспатчит в соответствующий модуль (OCR / CV / Banknote / Storage)
/// 4. Передаёт результат в TTS
///
/// Error Boundary: каждый модуль обёрнут в try/catch
/// с fallback-сообщением и логированием.
class CommandBloc extends Bloc<CommandEvent, CommandState> {
  CommandBloc() : super(const CommandInitial()) {
    // TODO: Принять зависимости через конструктор:
    //   - SpeechRecognizer
    //   - OcrService
    //   - ObjectDetector
    //   - BanknoteClassifier
    //   - TtsService
    //   - CameraService
    //   - HistoryRepository
    //   - SettingsRepository

    on<VoiceCommandReceived>(_onVoiceCommandReceived);
    on<StopRequested>(_onStopRequested);
    on<RepeatRequested>(_onRepeatRequested);
  }

  Future<void> _onVoiceCommandReceived(
    VoiceCommandReceived event,
    Emitter<CommandState> emit,
  ) async {
    // TODO: Распарсить команду
    // TODO: Emit CommandProcessing
    // TODO: Диспатчить в нужный модуль
    // TODO: Emit CommandSuccess или CommandError
    // TODO: Сохранить результат в историю
    // TODO: Передать результат в TTS
  }

  Future<void> _onStopRequested(
    StopRequested event,
    Emitter<CommandState> emit,
  ) async {
    // TODO: Очистить очередь TTS, вызвать tts.stop()
  }

  Future<void> _onRepeatRequested(
    RepeatRequested event,
    Emitter<CommandState> emit,
  ) async {
    // TODO: Достать последний результат из SQLite-истории
    // TODO: Озвучить через TTS
  }
}
