# Architecture Overview

This file summarizes high-level architecture and implementation details relevant for developers.

Layers
- UI (React Native + TypeScript): accessibility-aware components, screens under `src/screens/` and `components/`.
- Command Processor: single orchestration layer implemented with `zustand` (`src/features/commandProcessor`) that parses voice commands and dispatches to feature modules.
- Voice Interface: Vosk ASR integration via `react-native-vosk` (on-device). Implemented in `src/features/voiceInterface`.
- TTS: system TTS via `react-native-tts` with a small FIFO wrapper (`src/features/tts`).
- Camera Service: `react-native-vision-camera` is used for frame capture; camera lifecycle and auto-release handled in `src/features/camera`.
- OCR: Google ML Kit via `@react-native-ml-kit/text-recognition` (`src/features/ocr`).
- Object Detection / Banknote Classifier: TensorFlow Lite via `react-native-fast-tflite` (JSI); YOLO11n for scene recognition and EfficientNetB0 for banknotes; see `src/features/objectDetection` and `src/features/banknoteClassifier`.
- Spatial Navigation: Yandex Maps APIs (Geocoder + Router) for route building; see `src/features/spatialNavigation`.
- Storage: local SQLite via `react-native-sqlite-storage` (`src/features/storage`) for settings and history.

ML Models & Inference
- Models live in `assets/models/` and are loaded lazily on demand.
- CV inference uses JSI-based native calls (NNAPI on Android / Core ML on iOS) for performance.

Feature Flags
- Feature flags are in `src/core/config/featureFlags.ts`. Critical optional features (e.g., banknote classifier, onboarding) are gated.

Accessibility & I18n
- UI strings use `i18next` (`src/i18n`). Accessibility attributes should be present on interactive components. Verify `accessibilityRole`/`accessibilityLabel` in UI components before release.

Camera & Resource Management
- Camera activated only on-demand; auto-release after inactivity timeout (`CAMERA_INACTIVITY_TIMEOUT_MS`).
- ML models are cached in memory and disposed on background/low-memory events.

Error handling pattern
- Modules return `Result<T>` (success/failure) objects (`src/core/errors/result.ts`). Command Processor logs errors and speaks user-friendly messages.

Testing & CI
- Unit and component tests with Jest and @testing-library/react-native. Accessibility tests via `npm run test:accessibility`.
- CI is not required for MVP but the specification suggests GitHub Actions for PR checks.
