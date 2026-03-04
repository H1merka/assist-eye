# 📁 AssistEye — Структура проекта

> Справочник для разработчиков: назначение каждого файла и директории.

**Смежная документация:**
- [Техническое задание](specification.md)
- [Руководство по разработке](../extra/CLAUDE.md)

---

## Корневые файлы

| Файл | Назначение |
|------|-----------|
| `package.json` | Зависимости React Native, npm-скрипты (lint, test, format) |
| `tsconfig.json` | Конфигурация TypeScript (strict mode, path aliases) |
| `babel.config.js` | Babel preset для RN + `module-resolver` для алиасов путей |
| `metro.config.js` | Конфигурация Metro bundler |
| `jest.config.js` | Конфигурация Jest (preset, path mappings, transform) |
| `jest.setup.ts` | Моки нативных модулей для тестов (tts, camera, keychain, sqlite) |
| `.eslintrc.js` | ESLint: `@react-native` + strict TypeScript + accessibility rules |
| `.prettierrc.js` | Prettier: single quotes, trailing comma, 100 символов |
| `index.js` | Точка входа `AppRegistry.registerComponent` |
| `App.tsx` | Корневой компонент: `SafeAreaProvider`, `NavigationContainer`, bootstrap |
| `.env.example` | Шаблон переменных окружения (feature flags) |
| `.gitignore` | Правила игнорирования для Git (RN + Python + ML-модели) |
| `requirements.txt` | Python-зависимости для ML-скриптов (TensorFlow, Black, flake8) |
| `README.md` | Документация проекта: стек, быстрый старт, команды |
| `LICENSE` | Лицензия проекта |

---

## Корневые директории

| Директория | Содержимое |
|-----------|-----------|
| `src/` | Исходный код приложения (TypeScript + React) |
| `__tests__/` | Тесты (unit, component, accessibility) |
| `assets/` | Ресурсы: ML-модели, звуковые файлы |
| `scripts/` | Вспомогательные скрипты (обучение ML-моделей, Python) |
| `extra/` | Документация проекта (ТЗ, гайд разработки) |
| `docs/` | Описание структуры и спецификация (Markdown) |
| `.github/` | GitHub: CI/CD workflows, copilot-instructions |

---

## `src/` — Исходный код приложения

### `src/core/` — Ядро (общие утилиты, константы, типы)

#### `src/core/constants/`

| Файл | Описание |
|------|---------|
| `appConstants.ts` | Все «магические числа» из ТЗ: пороги confidence (`0.45`, `0.35`, `0.6`), таймауты (`30 с` камера, `5 с` ASR, `60 с` модели), размеры изображений (`300×300`, `224×224`), лимиты (`50` записей, `5 МБ` лог), скорость TTS (`0.5×`–`2.0×`), touch target (`48 dp`). |

#### `src/core/config/`

| Файл | Описание |
|------|---------|
| `featureFlags.ts` | Feature flags для незавершённых функций (купюры, онбординг, позиции объектов). Когда flag = `false` — функция скрыта из UI. |

#### `src/core/errors/`

| Файл | Описание |
|------|---------|
| `result.ts` | Discriminated union `Result<T>` = `Success<T>` \| `Failure`. Фабрики `success()` / `failure()`. Проверка через `result.ok`. |
| `errorCodes.ts` | Строковые коды ошибок по модулям (`CAMERA_BUSY`, `OCR_NO_TEXT`, `ASR_TIMEOUT` и т.д.). |

#### `src/core/utils/`

| Файл | Описание |
|------|---------|
| `logger.ts` | Structured JSON-логгер без PII. В `__DEV__` — `console.*`, в production — TODO запись в файл с ротацией при 5 МБ. |
| `imagePreprocessing.ts` | Утилиты предобработки изображений: downscale, brightness/contrast, crop центра, resize. TODO-стабы. |

#### `src/core/index.ts`

| Файл | Описание |
|------|---------|
| `index.ts` | Barrel-export всех core-модулей. |

---

### `src/features/` — Модули (feature-based архитектура)

> Каждый модуль содержит:
> - **`domain/`** — TypeScript-интерфейсы и модели данных (контракты)
> - **`data/`** — Конкретные реализации (работа с нативными модулями)
> - **`store/`** — Zustand-хранилище (если модуль управляет состоянием)

#### 🎙 `voiceInterface/` — ASR (распознавание речи)

| Файл | Описание |
|------|---------|
| `domain/speechRecognizer.ts` | TypeScript-интерфейс ASR: `initialize`, `startListening`, `stopListening`, `dispose`, `onResult` callback |
| `data/voskSpeechRecognizer.ts` | Реализация на **Vosk** (`react-native-vosk`). Модели ~45 МБ (RU) + ~40 МБ (EN), скачиваются при первом использовании. |

#### 🧠 `commandProcessor/` — Центральный оркестратор (Zustand)

| Файл | Описание |
|------|---------|
| `domain/command.ts` | Enum `CommandType` (`Read`, `Describe`, `Banknote`, `Help`, `Repeat`, `Stop`, `Unknown`) + `parseCommand()` с regex для RU/EN с приоритетами |
| `store/commandStore.ts` | **Zustand store**: `ProcessorState` (Idle / Listening / Processing / Success / Error), действия: `processVoiceInput`, `requestStop`, `requestRepeat` |

#### 📝 `ocr/` — Распознавание текста (OCR)

| Файл | Описание |
|------|---------|
| `domain/ocrService.ts` | TypeScript-интерфейс: `recognizeText(imageUri) → Promise<Result<string>>` |
| `data/mlKitOcrService.ts` | Основная реализация: **ML Kit** (`@react-native-ml-kit/text-recognition`). Офлайн, кириллица + латиница. |
| `data/tesseractOcrService.ts` | Fallback для устройств без GMS (Huawei) |

#### 👁 `objectDetection/` — Детекция объектов

| Файл | Описание |
|------|---------|
| `domain/detectionResult.ts` | Модель: `label`, `confidence`, `boundingBox` |
| `domain/objectDetector.ts` | TypeScript-интерфейс: `detect(imageUri) → Promise<Result<DetectionResult[]>>` |
| `data/tfliteObjectDetector.ts` | **TFLite SSD MobileNet v2 INT8** через `react-native-fast-tflite` (JSI). NMS (IoU=0.45), фильтрация (≥0.45 обычные, ≥0.35 безопасность). NNAPI (Android), Core ML (iOS). |

#### 💵 `banknoteClassifier/` — Классификатор купюр *(за feature flag!)*

| Файл | Описание |
|------|---------|
| `domain/banknoteClassifier.ts` | TypeScript-интерфейс: `classifyBanknote(imageUri) → Promise<Result<string>>` |
| `data/tfliteBanknoteClassifier.ts` | **MobileNet v3-Small**, fine-tuned. Pipeline: crop 60% → resize 224×224 → inference. Confidence < 0.6 → «Не уверен». |

#### 🔊 `tts/` — Синтез речи (TTS)

| Файл | Описание |
|------|---------|
| `domain/ttsService.ts` | TypeScript-интерфейс: `speak`, `stop`, `setRate`, `getAvailableVoices` |
| `data/reactNativeTtsService.ts` | Реализация через `react-native-tts`. FIFO-очередь сообщений. «Стоп» очищает очередь. Скорость 0.5×–2.0×. |

#### 📷 `camera/` — Сервис камеры

| Файл | Описание |
|------|---------|
| `data/cameraService.ts` | **Singleton** на основе `react-native-vision-camera`. Авто-отключение через 30 с бездействия. Один кадр на команду. |

#### 💾 `storage/` — Хранилище данных

| Файл | Описание |
|------|---------|
| `domain/historyEntry.ts` | Модель записи истории (`type`, `resultText`, `createdAt`). |
| `domain/historyRepository.ts` | Интерфейс: `addEntry`, `getLastEntry`, `getAllEntries`, `clearHistory`. Лимит 50 записей. |
| `domain/settingsRepository.ts` | Интерфейс key-value: `getString`, `setString`, `getNumber`, `setBool`. |
| `data/databaseHelper.ts` | SQLite через `react-native-sqlite-storage`. Таблицы: `settings` (key-value), `history` (id, type, result_text, created_at). Экспортирует `historyRepository` и `settingsRepository`. |
| `data/secureStorageService.ts` | `react-native-keychain` (AES-256). Android Keystore / iOS Keychain. |

---

### `src/ui/` — Пользовательский интерфейс

#### `src/ui/theme/`

| Файл | Описание |
|------|---------|
| `appTheme.ts` | Светлая и тёмная цветовая палитра, типографика, accessibility-стили (min touch target 48×48). |

#### `src/ui/screens/`

| Файл | Описание |
|------|---------|
| `HomeScreen.tsx` | Главный экран: кнопка голоса 200×200 (центр) + статус с `accessibilityLiveRegion="polite"`. Навигация в настройки и историю. |
| `SettingsScreen.tsx` | Настройки: язык, голос TTS, скорость, очистка |
| `HistoryScreen.tsx` | FlatList последних 50 распознаваний с empty state |

#### `src/ui/components/`

| Файл | Описание |
|------|---------|
| `AccessibleButton.tsx` | Переиспользуемая кнопка с `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, `accessibilityState`, min 48×48 dp |

---

### `src/navigation/` — Навигация

| Файл | Описание |
|------|---------|
| `RootNavigator.tsx` | `@react-navigation/native-stack`: Home (без заголовка), Settings, History |

---

### `src/i18n/` — Интернационализация

| Файл | Описание |
|------|---------|
| `i18n.ts` | Инициализация `i18next` с auto-detect языка через `react-native-localize`, fallback `ru` |
| `locales/en.json` | Английские строки интерфейса |
| `locales/ru.json` | Русские строки интерфейса: команды, статусы, ошибки, настройки |

---

## `__tests__/` — Тесты

| Файл | Описание |
|------|---------|
| `core/result.test.ts` | Unit-тесты для `Result<T>` (Success, Failure, discriminated union) |
| `features/commandProcessor/command.test.ts` | Тесты парсинга команд: RU/EN, приоритет «стоп», fallback Unknown |
| `features/ocr/ocrService.test.ts` | Тесты OCR-интерфейса (стаб) |
| `features/objectDetection/objectDetector.test.ts` | Тесты CV: `isReady()`, detect без init, initialize, dispose |
| `features/storage/databaseHelper.test.ts` | Тесты SQLite: пустая история, дефолтные настройки |
| `ui/HomeScreen.test.tsx` | Component-тест: `HomeScreen` рендерится с мокнутой навигацией + i18n |
| `accessibility/semantics.test.tsx` | Тесты доступности: `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, состояние disabled |

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
| `scripts/ml/train_banknote_classifier.py` | Python: обучение классификатора купюр (MobileNet v3-Small, fine-tuning) |
| `scripts/ml/convert_tflite.py` | Python: конвертация моделей в TFLite INT8 (post-training quantization) |

---

## `.github/` — CI/CD и настройки GitHub

| Файл | Описание |
|------|---------|
| `workflows/ci.yml` | CI на каждый PR: `tsc` → `lint` → `format` → `test` → `accessibility test` → `debug APK` |
| `workflows/release.yml` | Release при теге `v*`: `tsc` → `test` → `release APK` → GitHub Release |
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
   npx react-native init AssistEye --directory .
   ```
   Или используйте `npx react-native-community/cli init`.

2. **ML-модели не включены в репозиторий** (см. `.gitignore`) — скачиваются при первом использовании или размещаются вручную в `assets/models/`.

3. Все файлы в `src/features/` содержат **TODO-комментарии** с описанием того, что нужно реализовать.

4. **Feature flags** находятся в `src/core/config/featureFlags.ts` — купюры и онбординг по умолчанию **отключены**.

5. **Запуск тестов:**
   ```bash
   npm test                       # все тесты
   npm run test:accessibility     # только тесты доступности
   ```

6. **Перед коммитом:**
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run format
   ```
