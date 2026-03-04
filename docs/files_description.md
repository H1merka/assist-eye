# 📁 AssistEye — Структура проекта

> Справочник для разработчиков: назначение каждого файла и директории.

**Смежная документация:**
- [Техническое задание](specification.md)
- [Руководство по разработке](../extra/CLAUDE.md)

---

## Корневые файлы

| Файл | Назначение |
|------|-----------|
| `pubspec.yaml` | Flutter-зависимости, метаданные проекта, конфигурация ассетов |
| `analysis_options.yaml` | Правила статического анализа (`flutter_lints` + доп. ужесточения) |
| `l10n.yaml` | Конфигурация генерации локализации (RU/EN, ARB-файлы) |
| `.gitignore` | Правила игнорирования для Git (Flutter + Python + ML-модели) |
| `.env.example` | Шаблон переменных окружения (скопировать в `.env`) |
| `requirements.txt` | Python-зависимости для ML-скриптов (TensorFlow, Black, flake8) |
| `README.md` | Документация проекта: стек, быстрый старт, команды сборки |
| `LICENSE` | Лицензия проекта |

---

## Корневые директории

| Директория | Содержимое |
|-----------|-----------|
| `lib/` | Исходный код Flutter-приложения (Dart) |
| `test/` | Тесты (unit, widget, accessibility) |
| `assets/` | Ресурсы: ML-модели, звуковые файлы |
| `scripts/` | Вспомогательные скрипты (обучение ML-моделей, Python) |
| `extra/` | Документация проекта (ТЗ, гайд разработки) |
| `docs/` | Описание структуры и спецификация (Markdown) |
| `.github/` | GitHub: CI/CD workflows, copilot-instructions |

---

## `lib/` — Исходный код приложения

### Точки входа

| Файл | Описание |
|------|---------|
| `lib/main.dart` | Точка входа. Инициализация сервисов (logger, БД, хранилище), запуск `AssistEyeApp`. ML-модели **не** загружаются здесь (lazy loading). |
| `lib/app.dart` | Корневой виджет `MaterialApp`. Конфигурация темы, локализации, `MultiBlocProvider` для внедрения зависимостей. |

---

### `lib/core/` — Ядро (общие утилиты, константы, типы)

#### `lib/core/constants/`

| Файл | Описание |
|------|---------|
| `app_constants.dart` | Все «магические числа» из ТЗ: пороги confidence (`0.45`, `0.35`, `0.6`), таймауты (`30 с` камера, `5 с` ASR, `60 с` модели), размеры изображений (`300×300`, `224×224`), лимиты (`50` записей истории, `5 МБ` лог). |

#### `lib/core/config/`

| Файл | Описание |
|------|---------|
| `feature_flags.dart` | Feature flags для незавершённых функций (купюры, онбординг, описание позиций объектов). Когда flag = `false` — функция скрыта из UI и возвращает _«Функция пока недоступна»_. |

#### `lib/core/errors/`

| Файл | Описание |
|------|---------|
| `result.dart` | `Result<T>` = `Success(data)` \| `Failure(errorCode, userMessage)`. Sealed class — единый контракт возврата для всех модулей. Command Processor использует pattern matching. |
| `error_codes.dart` | Строковые коды ошибок по модулям (`CAMERA_BUSY`, `OCR_NO_TEXT`, `ASR_TIMEOUT` и т.д.). |

#### `lib/core/utils/`

| Файл | Описание |
|------|---------|
| `logger.dart` | Structured JSON-логгер. Пишет в файл, **не содержит PII**. Ротация при 5 МБ, хранит 3 последних файла. |
| `image_preprocessing.dart` | Утилиты предобработки изображений: коррекция яркости/контраста, ресайз, crop центра, downscale. Вызывается через `compute()`. |

---

### `lib/features/` — Модули (feature-based архитектура)

> Каждый модуль содержит:
> - **`domain/`** — Абстрактные интерфейсы и модели данных (контракты)
> - **`data/`** — Конкретные реализации (работа с библиотеками)
> - **`presentation/`** — BLoC, виджеты (если модуль имеет свой UI)

#### 🎙 `voice_interface/` — ASR (распознавание речи)

| Файл | Описание |
|------|---------|
| `domain/speech_recognizer.dart` | Абстрактный интерфейс ASR |
| `data/vosk_speech_recognizer.dart` | Реализация на **Vosk**. Работает в отдельном Dart Isolate (`SendPort`/`ReceivePort`). Модели ~45 МБ (RU) + ~40 МБ (EN), скачиваются при первом выборе языка. |
| `presentation/voice_button_widget.dart` | Кнопка активации ≥ 48×48 dp с `Semantics` |

#### 🧠 `command_processor/` — Центральный оркестратор (BLoC)

| Файл | Описание |
|------|---------|
| `domain/command.dart` | Enum `CommandType` (`read`, `describe`, `banknote`, `help`, `repeat`, `stop`, `unknown`) и класс `Command` |
| `domain/command_processor.dart` | Абстрактный интерфейс: парсинг (regex) + выполнение |
| `presentation/command_bloc.dart` | **BLoC**: текст от ASR → парсинг → dispatch в модуль → результат → TTS. Error Boundary: каждый модуль обёрнут в `try/catch` |
| `presentation/command_event.dart` | События: `VoiceCommandReceived`, `StopRequested`, `RepeatRequested`, `ListenRequested` |
| `presentation/command_state.dart` | Состояния: `Initial`, `Listening`, `Processing`, `Success`, `Error` |

#### 📝 `ocr/` — Распознавание текста (OCR)

| Файл | Описание |
|------|---------|
| `domain/ocr_service.dart` | Абстрактный интерфейс: `imageBytes → Result<String>` |
| `data/ml_kit_ocr_service.dart` | Основная реализация: **Google ML Kit Text Recognition v2**. Офлайн, кириллица + латиница. Вызывается из main isolate (Platform Channel). |
| `data/tesseract_ocr_service.dart` | Fallback для устройств без GMS (Huawei) |

#### 👁 `object_detection/` — Детекция объектов

| Файл | Описание |
|------|---------|
| `domain/detection_result.dart` | Модель: `label`, `confidence`, `boundingBox` |
| `domain/object_detector.dart` | Абстрактный интерфейс: `imageBytes → Result<List<DetectionResult>>` |
| `data/tflite_object_detector.dart` | **TFLite SSD MobileNet v2 INT8** (~4 МБ, 80 COCO-классов). Inference в отдельном Isolate. NMS (IoU=0.45), фильтрация (≥0.45 обычные, ≥0.35 безопасность). Делегаты: NNAPI (Android), Core ML (iOS). |

#### 💵 `banknote_classifier/` — Классификатор купюр *(за feature flag!)*

| Файл | Описание |
|------|---------|
| `domain/banknote_classifier.dart` | Абстрактный интерфейс: `imageBytes → Result<String>` |
| `data/tflite_banknote_classifier.dart` | **MobileNet v3-Small**, fine-tuned. Купюры: ₽ (50–5000) и $ (1–100). Pipeline: crop 60% → resize 224×224 → inference. Confidence < 0.6 → _«Не уверен»_. |

#### 🔊 `tts/` — Синтез речи (TTS)

| Файл | Описание |
|------|---------|
| `domain/tts_service.dart` | Абстрактный интерфейс: `speak`, `stop`, `setRate`, `setVolume`, `setVoice`, `getAvailableVoices` |
| `data/flutter_tts_service.dart` | Реализация через `flutter_tts`. Очередь сообщений FIFO. «Стоп» очищает очередь. Скорость 0.5×–2.0×. |

#### 📷 `camera/` — Сервис камеры

| Файл | Описание |
|------|---------|
| `data/camera_service.dart` | **Singleton**. Разрешение макс. 1280×960. Авто-отключение через 30 с бездействия. Один кадр на команду (не видеопоток). |

#### 💾 `storage/` — Хранилище данных

| Файл | Описание |
|------|---------|
| `domain/models/history_entry.dart` | Модель записи истории (`type`, `resultText`, `createdAt`). Включает `fromMap`/`toMap` для SQLite. |
| `domain/history_repository.dart` | Интерфейс: `addEntry`, `getLastEntry`, `getAllEntries`, `clearHistory`. Лимит 50 записей. |
| `domain/settings_repository.dart` | Интерфейс key-value: `getString`, `setString`, `getDouble`, `setBool`. Ключи: `language`, `tts_voice` и др. |
| `data/database_helper.dart` | SQLite через `sqflite`. Таблицы: `settings` (key-value), `history` (id, type, result_text, created_at). Миграции через `onCreate`/`onUpgrade`. |
| `data/secure_storage_service.dart` | `flutter_secure_storage` (AES-256). Android Keystore / iOS Keychain. |

---

### `lib/ui/` — Пользовательский интерфейс

#### `lib/ui/theme/`

| Файл | Описание |
|------|---------|
| `app_theme.dart` | Светлая и тёмная тема. Material 3. Высокий контраст, минимальный touch-target 48×48. |

#### `lib/ui/screens/`

| Файл | Описание |
|------|---------|
| `home_screen.dart` | Главный экран: кнопка голоса (центр) + статус. Навигация в настройки и историю. Все виджеты с `Semantics` (TalkBack/VoiceOver). |
| `settings_screen.dart` | Настройки: язык, голос TTS, скорость, очистка |
| `history_screen.dart` | Список последних 50 распознаваний |

#### `lib/ui/widgets/`

| Файл | Описание |
|------|---------|
| `accessible_button.dart` | Переиспользуемая кнопка: гарантирует `Semantics` label и минимальный размер 48×48 dp |

---

### `lib/l10n/` — Локализация

| Файл | Описание |
|------|---------|
| `app_en.arb` | Английские строки интерфейса |
| `app_ru.arb` | Русские строки интерфейса. Содержат: команды, статусы, ошибки, настройки, подсказку «Помощь». Поддержка плейсхолдеров. |

---

## `test/` — Тесты

| Файл | Описание |
|------|---------|
| `core/errors/result_test.dart` | Unit-тесты для `Result<T>` (Success, Failure, sealed class pattern matching) |
| `features/command_processor/command_bloc_test.dart` | Тесты BLoC: парсинг команд, dispatch в модули, Error Boundary, «Стоп», «Повтори» |
| `features/ocr/ocr_service_test.dart` | Тесты OCR: успех, пустой текст, низкий confidence |
| `features/object_detection/object_detector_test.dart` | Тесты CV: топ-3, NMS, пороги confidence, пониженный порог для объектов безопасности |
| `features/storage/database_helper_test.dart` | Тесты SQLite: CRUD настроек, лимит 50 записей, получение последней записи, очистка |
| `ui/screens/home_screen_test.dart` | Widget-тест: `HomeScreen` рендерится без ошибок |
| `accessibility/semantics_test.dart` | Тесты доступности (тег `accessibility`): `Semantics` labels, минимальные размеры кнопок 48×48 dp. Запуск: `flutter test --tags=accessibility` |

---

## `assets/` — Ресурсы

| Директория | Содержимое |
|-----------|-----------|
| `assets/models/` | TFLite-модели (скачиваются отдельно): `ssd_mobilenet_v2_coco_int8.tflite`, `mobilenet_v3_banknote.tflite`, labelmap-файлы |
| `assets/sounds/` | Звуки обратной связи: `listen_start.wav`, `result_ready.wav`, `error.wav` |

---

## `scripts/` — Вспомогательные скрипты

| Файл | Описание |
|------|---------|
| `scripts/ml/train_banknote_classifier.py` | Python: обучение классификатора купюр (MobileNet v3-Small, fine-tuning, Google Colab) |
| `scripts/ml/convert_tflite.py` | Python: конвертация моделей в TFLite INT8 (post-training quantization) |

---

## `.github/` — CI/CD и настройки GitHub

| Файл | Описание |
|------|---------|
| `workflows/ci.yml` | CI на каждый PR: `format` → `analyze` → `test` → `accessibility test` → `debug APK` |
| `workflows/release.yml` | Release при теге `v*`: `analyze` → `test` → `release APK` → GitHub Release |
| `copilot-instructions.md` | Инструкции для AI-агентов (Copilot и др.) |

---

## `extra/` — Документация проекта

| Файл | Описание |
|------|---------|
| `Technical_Specification_Blind_Assist_MVP.txt` | Полное техническое задание (ТЗ) |
| `CLAUDE.md` | Руководство по стилю кода и разработке |

---

## ⚠️ Примечания для разработчиков

1. **`android/` и `ios/` отсутствуют** — сгенерируйте их командой:
   ```bash
   flutter create .
   ```

2. **ML-модели не включены в репозиторий** (см. `.gitignore`) — скачиваются при первом использовании или размещаются вручную в `assets/models/`.

3. Все файлы в `lib/features/` содержат **TODO-комментарии** с описанием того, что нужно реализовать. Читайте их как спецификацию задачи.

4. **Feature flags** находятся в `lib/core/config/feature_flags.dart` — купюры и онбординг по умолчанию **отключены**.

5. **Запуск тестов:**
   ```bash
   flutter test                       # все тесты
   flutter test --tags=accessibility  # только тесты доступности
   ```

6. **Перед коммитом:**
   ```bash
   dart format --set-exit-if-changed .
   flutter analyze --fatal-warnings
   ```
