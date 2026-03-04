import 'package:equatable/equatable.dart';

/// Перечисление всех поддерживаемых голосовых команд (§4.1, §5.1 ТЗ).
enum CommandType {
  /// «Прочитай» — OCR + TTS.
  read,

  /// «Опиши» / «Что это» — детекция объектов.
  describe,

  /// «Купюра» — классификатор банкнот (Should-have, feature flag).
  banknote,

  /// «Помощь» — озвучить список доступных команд.
  help,

  /// «Повтори» — повторно озвучить последний результат из истории.
  repeat,

  /// «Стоп» — прервать текущее озвучивание TTS.
  stop,

  /// Команда не распознана.
  unknown,
}

/// Распознанная голосовая команда.
class Command extends Equatable {
  const Command({
    required this.type,
    required this.rawText,
  });

  /// Тип команды, определённый по ключевым словам.
  final CommandType type;

  /// Исходный текст, полученный от ASR.
  final String rawText;

  @override
  List<Object?> get props => [type, rawText];
}
