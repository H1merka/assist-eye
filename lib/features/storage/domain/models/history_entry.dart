import 'package:equatable/equatable.dart';

/// Запись в истории распознаваний (§4.5 ТЗ).
///
/// Хранится в SQLite, максимум [AppConstants.historyMaxEntries] записей.
class HistoryEntry extends Equatable {
  const HistoryEntry({
    this.id,
    required this.type,
    required this.resultText,
    required this.createdAt,
  });

  /// ID записи в БД (auto-increment).
  final int? id;

  /// Тип операции: 'ocr', 'detection', 'banknote'.
  final String type;

  /// Текст результата (то, что было озвучено).
  final String resultText;

  /// Время создания записи.
  final DateTime createdAt;

  /// Конвертация из Map (SQLite row).
  factory HistoryEntry.fromMap(Map<String, dynamic> map) {
    return HistoryEntry(
      id: map['id'] as int?,
      type: map['type'] as String,
      resultText: map['result_text'] as String,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  /// Конвертация в Map для записи в SQLite.
  Map<String, dynamic> toMap() {
    return {
      if (id != null) 'id': id,
      'type': type,
      'result_text': resultText,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [id, type, resultText, createdAt];
}
