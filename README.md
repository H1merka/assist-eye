# AssistEye

Мобильное приложение (React Native + TypeScript) для помощи слабовидящим и незрячим пользователям. Голосовое управление, распознавание текста (OCR), детекция объектов и определение купюр — **всё работает офлайн**, без передачи данных на сервер.

## Возможности (MVP)

| Команда | Описание |
|---------|----------|
| **«Прочитай»** | OCR — распознавание печатного текста (RU/EN) |
| **«Опиши» / «Что это»** | Детекция бытовых объектов (SSD MobileNet v2) |
| **«Купюра»** | Определение банкнот ₽ и $ *(feature flag)* |
| **«Помощь»** | Список доступных команд |
| **«Повтори»** | Повторное озвучивание последнего результата |
| **«Стоп»** | Остановка озвучивания |

## Технологический стек

- **Framework:** React Native 0.76+ (TypeScript 5.6+)
- **ASR:** Vosk (офлайн, RU + EN) — `react-native-vosk`
- **OCR:** Google ML Kit Text Recognition v2 — `@react-native-ml-kit/text-recognition` (fallback: Tesseract)
- **CV:** TensorFlow Lite — SSD MobileNet v2 INT8 — `react-native-fast-tflite` (JSI)
- **TTS:** Системные голоса — `react-native-tts`
- **State management:** Zustand
- **Storage:** SQLite (`react-native-sqlite-storage`) + Keychain (`react-native-keychain`)
- **Camera:** `react-native-vision-camera` v4.6+ (Frame Processors)
- **Navigation:** `@react-navigation/native` + `@react-navigation/native-stack` v7
- **i18n:** `i18next` + `react-i18next` + `react-native-localize`
- **ML-скрипты:** Python 3.10+, TensorFlow
