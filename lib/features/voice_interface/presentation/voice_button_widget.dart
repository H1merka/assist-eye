import 'package:flutter/material.dart';

/// Большая кнопка активации голосовой команды (§4.1 ТЗ).
///
/// Требования:
/// - Размер ≥ 48×48 dp (реально — значительно больше, центр экрана)
/// - [Semantics] label для TalkBack/VoiceOver
/// - Звуковая обратная связь: тон при начале записи
/// - Вибрация при ошибке
class VoiceButtonWidget extends StatelessWidget {
  const VoiceButtonWidget({
    super.key,
    required this.onPressed,
    required this.isListening,
  });

  final VoidCallback onPressed;
  final bool isListening;

  @override
  Widget build(BuildContext context) {
    // TODO: Реализовать крупную доступную кнопку
    // TODO: Добавить Semantics с описательным label
    // TODO: Анимация состояния «слушает» / «готов»
    // TODO: Поддержка системного масштабирования шрифтов
    return Semantics(
      label: isListening ? 'Идёт запись. Нажмите для остановки' : 'Нажмите и скажите команду',
      button: true,
      child: const Placeholder(), // TODO: Заменить на реальный виджет
    );
  }
}
