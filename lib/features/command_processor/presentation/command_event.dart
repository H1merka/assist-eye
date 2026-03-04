import 'package:equatable/equatable.dart';

/// События для [CommandBloc].
sealed class CommandEvent extends Equatable {
  const CommandEvent();

  @override
  List<Object?> get props => [];
}

/// Получен текст голосовой команды от ASR.
class VoiceCommandReceived extends CommandEvent {
  const VoiceCommandReceived(this.rawText);

  final String rawText;

  @override
  List<Object?> get props => [rawText];
}

/// Пользователь запросил остановку (команда «Стоп»).
class StopRequested extends CommandEvent {
  const StopRequested();
}

/// Пользователь запросил повтор (команда «Повтори»).
class RepeatRequested extends CommandEvent {
  const RepeatRequested();
}

/// Кнопка активации нажата — начать запись голоса.
class ListenRequested extends CommandEvent {
  const ListenRequested();
}
