import 'package:flutter_test/flutter_test.dart';

// TODO: import DatabaseHelper, HistoryEntry, HistoryRepository, SettingsRepository

/// Тесты для Storage-модуля: SQLite БД (§4.5, §8.2 ТЗ).
///
/// Покрываемые случаи:
/// - CRUD настроек (key-value)
/// - Добавление записей в историю
/// - Лимит 50 записей — удаление самой старой при превышении
/// - Получение последней записи (для команды «Повтори»)
/// - Очистка истории
void main() {
  group('DatabaseHelper', () {
    test('создаёт таблицы settings и history при инициализации', () {
      // TODO: Использовать sqflite_ffi для тестирования
    });

    test('сохраняет и читает настройки', () {
      // Arrange — setString('language', 'ru')
      // Act — getString('language')
      // Assert — 'ru'
      // TODO: Реализовать
    });
  });

  group('HistoryRepository', () {
    test('добавляет запись и читает последнюю', () {
      // TODO: addEntry → getLastEntry → сравнить
    });

    test('ограничивает историю 50 записями', () {
      // Arrange — добавить 51 запись
      // Assert — getAllEntries().length == 50, самая старая удалена
      // TODO: Реализовать
    });

    test('очищает всю историю', () {
      // TODO: clearHistory → getAllEntries → пустой список
    });
  });
}
