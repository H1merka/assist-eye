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
  [CommandType.Stop, /\b(стоп|stop|хватит|enough)\b/i],
  [CommandType.Read, /\b(прочитай|прочти|читай|read|text)\b/i],
  [CommandType.Describe, /\b(опиши|что это|что вижу|describe|what is|what's this)\b/i],
  [CommandType.Banknote, /\b(купюра|деньги|банкнот|banknote|money|bill)\b/i],
  [CommandType.Help, /\b(помощь|помоги|help)\b/i],
  [CommandType.Repeat, /\b(повтори|repeat|ещё раз|again)\b/i],
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
