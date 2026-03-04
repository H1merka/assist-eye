import 'package:flutter/material.dart';

/// Экран настроек (§4.5 ТЗ).
///
/// Настройки:
/// - Язык интерфейса / ASR (RU / EN)
/// - Голос TTS (выбор из системных)
/// - Скорость речи (0.5×–2.0×)
/// - Громкость TTS
/// - Очистка истории
///
/// Все элементы управления с [Semantics] labels.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Загрузить текущие настройки из SettingsRepository
    // TODO: Реализовать переключатели с Semantics
    // TODO: Сохранять изменения при каждом переключении
    return Scaffold(
      appBar: AppBar(
        title: Semantics(
          header: true,
          child: const Text('Настройки'),
        ),
      ),
      body: const Placeholder(), // TODO: Список настроек
    );
  }
}
