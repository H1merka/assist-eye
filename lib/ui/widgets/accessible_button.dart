import 'package:flutter/material.dart';

/// Доступная кнопка с обязательным Semantics label (§4.4 ТЗ).
///
/// Гарантирует:
/// - Минимальный touch-target 48×48 dp
/// - Semantics label для TalkBack/VoiceOver
/// - Поддержка системного масштабирования шрифтов
class AccessibleButton extends StatelessWidget {
  const AccessibleButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.minSize = 48.0,
  });

  /// Текст кнопки (также используется как Semantics label).
  final String label;

  /// Callback при нажатии.
  final VoidCallback onPressed;

  /// Опциональная иконка.
  final IconData? icon;

  /// Минимальный размер кнопки (dp). По умолчанию 48 (§4.4).
  final double minSize;

  @override
  Widget build(BuildContext context) {
    // TODO: Реализовать с высоким контрастом и Semantics
    return Semantics(
      label: label,
      button: true,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: minSize,
          minHeight: minSize,
        ),
        child: ElevatedButton(
          onPressed: onPressed,
          child: icon != null
              ? Icon(icon, semanticLabel: label)
              : Text(label),
        ),
      ),
    );
  }
}
