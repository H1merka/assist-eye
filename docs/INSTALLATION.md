# Installation

This document describes environment prerequisites and steps to set up the project for development and testing.

Prerequisites
- Node.js >= 18
- npm (or Yarn) installed
- Java JDK (for Android builds) and Android SDK (API 26+). Configure `ANDROID_HOME`/`local.properties` as required.
- Xcode 14+ for iOS builds (macOS only)
- Android emulator or physical device (ARM64 recommended)
- CocoaPods (for native dependency installation on iOS)

Clone and install
```bash
git clone <repo-url>
cd assist-eye
npm install
```

Typecheck, lint, format, tests
```bash
npm run typecheck
npm run lint
npm run format:fix
npm test
```

Run in development (Metro + Android)
```bash
npm start
npm run android
```

iOS (macOS only)
```bash
cd ios
pod install
cd ..
npm run ios # if configured or use Xcode to run the workspace
```

Notes on models and assets
- ML models may be large and are kept under `assets/models/` or delivered on-demand. See `docs/ARCHITECTURE.md` -> Models for hosting and deferred download strategy.
- If models are not present the app has feature-flag fallbacks and user prompts to download models.

Running on-device tests and accessibility checks
- Use real devices for ASR/OCR/CV verification. The `npm run test:accessibility` runs component-level accessibility checks (Jest + @testing-library/react-native).

Building release APK / IPA
- Android release: use Gradle in `android/` (`./gradlew assembleRelease`) or rely on CI. Configure keystore and signing configs.
- iOS release: build archive in Xcode and manage provisioning profiles.

Troubleshooting
- If native modules fail to link, run a clean install and rebuild native projects:
```bash
npm run clean
npm install
cd android && ./gradlew clean
```
- On iOS, try `pod install` and clean the build folder in Xcode.
