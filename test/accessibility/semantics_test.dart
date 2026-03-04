@Tags(['accessibility'])

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:assist_eye/ui/screens/home_screen.dart';

/// Тесты доступности: проверка Semantics на всех экранах (§4.4, §6.4 ТЗ).
///
/// Запуск: `flutter test --tags=accessibility`
///
/// Все интерактивные виджеты ОБЯЗАНЫ иметь:
/// - Semantics label (описание для screen reader)
/// - Минимальный touch-target 48×48 dp
void main() {
  group('Accessibility — HomeScreen', () {
    testWidgets('все интерактивные элементы имеют Semantics labels', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );

      // Проверяем, что Semantics-дерево не пустое
      final semantics = tester.getSemantics(find.byType(HomeScreen));
      expect(semantics, isNotNull);

      // TODO: Проверить конкретные Semantics labels:
      // - Кнопка голосовой активации
      // - Кнопка настроек
      // - Кнопка истории
    });

    testWidgets('кнопки имеют минимальный размер 48×48 dp', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );

      // TODO: Найти все кнопки, проверить размеры через tester.getSize()
      // expect(size.width, greaterThanOrEqualTo(48));
      // expect(size.height, greaterThanOrEqualTo(48));
    });
  });

  // TODO: Аналогичные тесты для SettingsScreen и HistoryScreen
}
