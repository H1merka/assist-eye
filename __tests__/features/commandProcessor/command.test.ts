/**
 * Тесты парсинга голосовых команд.
 */

import {parseCommand, CommandType} from '../../src/features/commandProcessor/domain/command';

describe('parseCommand', () => {
  describe('русские команды', () => {
    it('распознаёт «прочитай»', () => {
      expect(parseCommand('Прочитай').type).toBe(CommandType.Read);
      expect(parseCommand('прочти текст').type).toBe(CommandType.Read);
    });

    it('распознаёт «опиши» / «что это»', () => {
      expect(parseCommand('Опиши').type).toBe(CommandType.Describe);
      expect(parseCommand('Что это').type).toBe(CommandType.Describe);
    });

    it('распознаёт «купюра»', () => {
      expect(parseCommand('Купюра').type).toBe(CommandType.Banknote);
      expect(parseCommand('какие деньги').type).toBe(CommandType.Banknote);
    });

    it('распознаёт «помощь»', () => {
      expect(parseCommand('Помощь').type).toBe(CommandType.Help);
    });

    it('распознаёт «повтори»', () => {
      expect(parseCommand('Повтори').type).toBe(CommandType.Repeat);
      expect(parseCommand('ещё раз').type).toBe(CommandType.Repeat);
    });

    it('распознаёт «стоп»', () => {
      expect(parseCommand('стоп').type).toBe(CommandType.Stop);
    });
  });

  describe('английские команды', () => {
    it('распознаёт «read»', () => {
      expect(parseCommand('Read this').type).toBe(CommandType.Read);
    });

    it('распознаёт «describe» / «what is»', () => {
      expect(parseCommand('Describe').type).toBe(CommandType.Describe);
      expect(parseCommand("What's this").type).toBe(CommandType.Describe);
    });

    it('распознаёт «stop»', () => {
      expect(parseCommand('Stop').type).toBe(CommandType.Stop);
    });
  });

  describe('нераспознанные команды', () => {
    it('возвращает Unknown для произвольного текста', () => {
      expect(parseCommand('привет мир').type).toBe(CommandType.Unknown);
      expect(parseCommand('blah blah').type).toBe(CommandType.Unknown);
    });

    it('сохраняет rawText', () => {
      const cmd = parseCommand('  Прочитай  ');
      expect(cmd.rawText).toBe('  Прочитай  ');
    });
  });

  describe('приоритет команд', () => {
    it('«стоп» приоритетнее других', () => {
      // «стоп» первый в списке паттернов — при совпадении с несколькими
      expect(parseCommand('стоп прочитай').type).toBe(CommandType.Stop);
    });
  });
});
