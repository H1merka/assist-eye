import 'models/history_entry.dart';

/// Репозиторий истории распознаваний (§4.5 ТЗ).
///
/// Хранит последние 50 записей в SQLite.
/// Изображения НЕ сохраняются по умолчанию.
abstract class HistoryRepository {
  /// Добавляет запись в историю.
  ///
  /// Если записей > 50, удаляет самую старую.
  Future<void> addEntry(HistoryEntry entry);

  /// Возвращает последнюю запись (для команды «Повтори»).
  Future<HistoryEntry?> getLastEntry();

  /// Возвращает все записи (для экрана истории).
  Future<List<HistoryEntry>> getAllEntries();

  /// Очищает всю историю (по запросу пользователя).
  Future<void> clearHistory();
}
