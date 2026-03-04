import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

// TODO: import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import 'ui/screens/home_screen.dart';
import 'ui/theme/app_theme.dart';

/// Корневой виджет приложения.
///
/// Оборачивает дерево в [MultiBlocProvider] для предоставления
/// BLoC-ов (Command Processor и др.) всему дереву виджетов.
class AssistEyeApp extends StatelessWidget {
  const AssistEyeApp({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Обернуть в MultiBlocProvider с CommandBloc и др.
    return MaterialApp(
      title: 'AssistEye',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,

      // --- Локализация (RU / EN) ---
      // TODO: Раскомментировать после генерации l10n:
      // localizationsDelegates: const [
      //   AppLocalizations.delegate,
      //   GlobalMaterialLocalizations.delegate,
      //   GlobalWidgetsLocalizations.delegate,
      //   GlobalCupertinoLocalizations.delegate,
      // ],
      // supportedLocales: const [
      //   Locale('ru'),
      //   Locale('en'),
      // ],

      home: const HomeScreen(),
    );
  }
}
