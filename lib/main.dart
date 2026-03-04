import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'app.dart';

/// Точка входа в приложение assist-eye.
///
/// Инициализирует необходимые сервисы перед запуском UI:
/// - WidgetsFlutterBinding (обязательно до любых плагинов)
/// - Логгер
/// - БД (SQLite)
/// - Secure Storage
///
/// ML-модели НЕ загружаются здесь — используется lazy loading
/// при первом вызове соответствующей команды (§8.3 ТЗ).
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // TODO: Инициализировать AppLogger
  // TODO: Инициализировать DatabaseHelper (SQLite)
  // TODO: Инициализировать SecureStorageService
  // TODO: Загрузить пользовательские настройки (язык, скорость TTS и т.д.)

  runApp(const AssistEyeApp());
}
