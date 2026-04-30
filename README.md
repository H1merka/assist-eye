# AssistEye

AssistEye — mobile app (React Native + TypeScript) that helps visually impaired users by providing on-device voice-driven assistance: OCR, object detection, banknote classification (feature-flagged), and step-by-step navigation.

Key points
- Cross-platform: Android + iOS (React Native + TypeScript)
- Offline-first: ASR (Vosk), OCR (ML Kit), CV (TFLite), TTS (system) run on-device
- Primary interaction: voice commands ("Read", "Describe", "Banknote", "Navigate", "Help", "Repeat", "Stop")

Repository structure (high level)
- `src/` — application source (features, core, i18n, components)
- `assets/models/` — bundled or deferred ML models
- `project_docs/` — original specification and project notes
- `docs/` — user/developer docs (INSTALLATION, ARCHITECTURE)

Quick scripts
- Install deps: `npm install`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Run tests: `npm test`
- Start Metro: `npm start`
- Run on Android (device/emulator): `npm run android`

See `docs/INSTALLATION.md` for environment and device setup and `docs/ARCHITECTURE.md` for architectural details.

License
- See `LICENSE` in the repository root.
