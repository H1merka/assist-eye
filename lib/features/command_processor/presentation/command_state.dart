import 'package:equatable/equatable.dart';

import '../domain/command.dart';

/// Состояния для [CommandBloc].
sealed class CommandState extends Equatable {
  const CommandState();

  @override
  List<Object?> get props => [];
}

/// Начальное состояние — приложение готово принимать команду.
class CommandInitial extends CommandState {
  const CommandInitial();
}

/// Идёт запись голоса через ASR.
class CommandListening extends CommandState {
  const CommandListening();
}

/// Команда распознана, идёт обработка модулем (OCR / CV / ...).
/// Если обработка > 1.5 с — показать «Обрабатываю…» (§5.2 ТЗ).
class CommandProcessing extends CommandState {
  const CommandProcessing(this.command);

  final Command command;

  @override
  List<Object?> get props => [command];
}

/// Успешный результат — текст готов к озвучиванию.
class CommandSuccess extends CommandState {
  const CommandSuccess({
    required this.resultText,
    required this.command,
  });

  final String resultText;
  final Command command;

  @override
  List<Object?> get props => [resultText, command];
}

/// Ошибка — пользователю озвучивается понятное сообщение.
class CommandError extends CommandState {
  const CommandError({
    required this.userMessage,
    required this.errorCode,
  });

  final String userMessage;
  final String errorCode;

  @override
  List<Object?> get props => [userMessage, errorCode];
}
