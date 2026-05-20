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
  SpeechFaster = 'speech_faster',
  SpeechSlower = 'speech_slower',
  VibrationOn = 'vibration_on',
  VibrationOff = 'vibration_off',
  LanguageRu = 'language_ru',
  LanguageEn = 'language_en',
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
  [CommandType.Stop, /(стоп|stop|хватит|enough|закончи|прекрати)/i],
  [CommandType.Read, /(прочитай|прочти|читай|текст|read|text|что тут написано)/i],
  [
    CommandType.Describe,
    /(опиши|что это|что вижу|обстановка|describe|what is|what's this|what do you see)/i,
  ],
  [CommandType.Banknote, /(купюра|деньги|банкнот|номинал|banknote|money|bill|cash)/i],
  [CommandType.Navigate, /(маршрут|навигация|веди|куда идти|route|navigate|navigation)/i],
  [CommandType.Help, /(помощь|помоги|что ты умеешь|команды|help|commands)/i],
  [CommandType.Repeat, /(повтори|repeat|ещё раз|again|что ты сказал)/i],
  [CommandType.SpeechFaster, /(быстрее|ускор(ь|и)|увелич(ь|и) скорость|faster|speed up)/i],
  [
    CommandType.SpeechSlower,
    /(медленнее|медленее|медленей|замедл(и|ить)|уменьш(и|ить) скорость|slower|slow down)/i,
  ],
  [CommandType.VibrationOn, /(включи вибраци(ю|я)|vibration on|вибрация включи)/i],
  [CommandType.VibrationOff, /(выключи вибраци(ю|я)|vibration off|вибрация выключи)/i],
  [CommandType.LanguageRu, /(русский язык|русский|russian)/i],
  [CommandType.LanguageEn, /(английский язык|английский|english)/i],
];

/**
 * Парсить текст ASR в команду.
 * Возвращает первое совпадение (приоритет: порядок в COMMAND_PATTERNS).
 */
export function parseCommand(text: string): Command {
  const normalized = text.trim().toLowerCase();

  for (const [type, pattern] of COMMAND_PATTERNS) {
    if (pattern.test(normalized)) {
      return { type, rawText: text };
    }
  }

  return { type: CommandType.Unknown, rawText: text };
}
