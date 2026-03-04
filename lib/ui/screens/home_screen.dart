import 'package:flutter/material.dart';

/// Главный экран приложения (§8.2 ТЗ: «главный — одна кнопка + статус»).
///
/// Минимальный UI:
/// - Крупная кнопка активации голоса (центр экрана)
/// - Текст текущего статуса (готов / слушает / обрабатывает / результат)
/// - Навигация в настройки и историю
///
/// Все виджеты ОБЯЗАНЫ иметь [Semantics] labels для TalkBack/VoiceOver (§4.4).
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Подключить CommandBloc через BlocBuilder
    // TODO: Реализовать VoiceButtonWidget (центр)
    // TODO: Отображать статус (CommandState)
    // TODO: Shake-to-activate через sensors_plus
    // TODO: Звуковая обратная связь (тоны начала записи, результата)
    // TODO: Вибрация при ошибке
    return Scaffold(
      appBar: AppBar(
        title: Semantics(
          header: true,
          child: const Text('AssistEye'),
        ),
        actions: [
          Semantics(
            label: 'История распознаваний',
            child: IconButton(
              icon: const Icon(Icons.history),
              onPressed: () {
                // TODO: Навигация на HistoryScreen
              },
            ),
          ),
          Semantics(
            label: 'Настройки',
            child: IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {
                // TODO: Навигация на SettingsScreen
              },
            ),
          ),
        ],
      ),
      body: const Center(
        child: Placeholder(), // TODO: Заменить на VoiceButtonWidget + StatusWidget
      ),
    );
  }
}
