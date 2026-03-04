import 'package:flutter/material.dart';

/// Экран истории распознаваний (§4.5 ТЗ).
///
/// Отображает последние 50 результатов:
/// - Тип (OCR / детекция / купюра)
/// - Текст результата
/// - Временная метка
///
/// Пользователь может очистить историю.
class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Загрузить записи из HistoryRepository
    // TODO: ListView с Semantics labels для каждого элемента
    // TODO: Кнопка «Очистить историю» с подтверждением
    return Scaffold(
      appBar: AppBar(
        title: Semantics(
          header: true,
          child: const Text('История'),
        ),
        actions: [
          Semantics(
            label: 'Очистить историю',
            child: IconButton(
              icon: const Icon(Icons.delete_outline),
              onPressed: () {
                // TODO: Показать диалог подтверждения, очистить
              },
            ),
          ),
        ],
      ),
      body: const Placeholder(), // TODO: ListView с историей
    );
  }
}
