/**
 * Тесты Storage (databaseHelper).
 */

import {historyRepository, settingsRepository} from '../../../src/features/storage/data/databaseHelper';

describe('historyRepository', () => {
  it('возвращает null при пустой истории', async () => {
    const entry = await historyRepository.getLastEntry();
    expect(entry).toBeNull();
  });

  it('возвращает пустой массив при пустой истории', async () => {
    const entries = await historyRepository.getAllEntries();
    expect(entries).toEqual([]);
  });

  // TODO: После реализации SQLite — тесты:
  // - addEntry + getLastEntry
  // - Лимит HISTORY_MAX_ENTRIES (50)
  // - clearHistory
  // - Порядок записей: новые первыми
});

describe('settingsRepository', () => {
  it('getString возвращает null для несуществующего ключа', async () => {
    const value = await settingsRepository.getString('nonexistent');
    expect(value).toBeNull();
  });

  // TODO: После реализации — тесты:
  // - setString + getString
  // - setBool + getBool
  // - setNumber + getNumber
  // - remove
  // - clear
});
