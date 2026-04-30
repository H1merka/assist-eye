/**
 * Типы команд и парсинг.
 *
 * Набор фиксированных голосовых команд из ТЗ.
 * Парсинг по ключевым словам (regex) — русский и английский.
 */

export enum CommandType {
  Read = 'read',
  Describe = 'describe',
  Banknote = 'banknote',
  Navigate = 'navigate',
  Help = 'help',
  Repeat = 'repeat',
  Stop = 'stop',
  Unknown = 'unknown',
}

export interface Command {
  type: CommandType;
  rawText: string;
}

/**
 * Regex-паттерны для команд (регистронезависимые).
 * Русский + английский.
 */
const COMMAND_PATTERNS: ReadonlyArray<[CommandType, RegExp]> = [
  // NOTE: JS \b плохо работает с кириллицей, поэтому используем простой contains-match.
  [CommandType.Stop, /(стоп|stop|хватит|enough)/i],
  [CommandType.Read, /(прочитай|прочти|читай|read|text)/i],
  [CommandType.Describe, /(опиши|что это|что вижу|describe|what is|what's this)/i],
  [CommandType.Banknote, /(купюра|деньги|банкнот|banknote|money|bill)/i],
  [CommandType.Navigate, /(маршрут|навигация|веди|navigate|route)/i],
  [CommandType.Help, /(помощь|помоги|help)/i],
  [CommandType.Repeat, /(повтори|repeat|ещё раз|again)/i],
];

/**
 * Парсить текст ASR в команду.
 * Возвращает первое совпадение (приоритет: порядок в COMMAND_PATTERNS).
 */
export function parseCommand(text: string): Command {
  const normalized = text.trim().toLowerCase();

  for (const [type, pattern] of COMMAND_PATTERNS) {
    if (pattern.test(normalized)) {
      return {type, rawText: text};
    }
  }

  return {type: CommandType.Unknown, rawText: text};
}
