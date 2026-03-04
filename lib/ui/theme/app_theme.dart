import 'package:flutter/material.dart';

/// Тема приложения (§4.4 ТЗ: высокий контраст, доступность).
///
/// Поддерживает:
/// - Светлую и тёмную тему
/// - Системное масштабирование шрифтов
/// - Режим высокой контрастности
/// - Минимальный touch-target 48×48 dp
class AppTheme {
  AppTheme._();

  /// Светлая тема.
  static ThemeData get light {
    // TODO: Настроить цвета с высоким контрастом (≥ 4.5:1)
    // TODO: Установить минимальные размеры интерактивных элементов
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorSchemeSeed: Colors.blue,
      // Минимальный размер кнопок для доступности
      materialTapTargetSize: MaterialTapTargetSize.padded,
    );
  }

  /// Тёмная тема.
  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorSchemeSeed: Colors.blue,
      materialTapTargetSize: MaterialTapTargetSize.padded,
    );
  }
}
