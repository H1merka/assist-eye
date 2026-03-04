import 'command.dart';

/// Парсер и маршрутизатор голосовых команд (§8.2 ТЗ).
///
/// Принимает текстовую команду от ASR, матчит по ключевым словам (regex),
/// диспатчит в нужный модуль, собирает результат, передаёт в TTS.
///
/// Error Boundary: при исключении любого модуля — возвращает
/// пользователю понятное голосовое сообщение об ошибке.
abstract class CommandProcessor {
  /// Определяет тип команды по тексту (regex-матчинг).
  ///
  /// Поддерживает русский и английский варианты ключевых слов:
  /// - «прочитай» / «read» → [CommandType.read]
  /// - «опиши» / «что это» / «describe» / «what is this» → [CommandType.describe]
  /// - «купюра» / «banknote» → [CommandType.banknote]
  /// - «помощь» / «help» → [CommandType.help]
  /// - «повтори» / «repeat» → [CommandType.repeat]
  /// - «стоп» / «stop» → [CommandType.stop]
  Command parseCommand(String rawText);

  /// Выполняет команду: диспатчит в соответствующий модуль,
  /// собирает результат и возвращает текст для TTS.
  ///
  /// Каждый вызов обёрнут в try/catch с fallback-сообщением.
  Future<String> executeCommand(Command command);
}
