const { withInfoPlist, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withVosk(config) {
  config = withInfoPlist(config, config => {
    config.modResults.NSMicrophoneUsageDescription =
      config.modResults.NSMicrophoneUsageDescription || 'Требуется для распознавания речи';
    return config;
  });

  // Warning: copying large model files to iOS bundle must be validated locally.
  // Provide a hook to warn the user after prebuild.
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const modelsSrc = path.join(projectRoot, 'assets', 'models', 'vosk-model-small-en-us');
      const marker = path.join(projectRoot, 'ios', '.vosk_copy_marker');
      if (fs.existsSync(modelsSrc) && !fs.existsSync(marker)) {
        console.warn('[vosk-plugin] Found vosk models in assets; ensure they are properly added to iOS bundle resources.');
        try {
          fs.writeFileSync(marker, 'ok');
        } catch (e) {
          // ignore
        }
      }
      return config;
    }
  ]);

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const srcModels = path.join(projectRoot, 'assets', 'models');
      const destAssets = path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets');
      
      if (fs.existsSync(srcModels)) {
        const models = fs.readdirSync(srcModels).filter(name => name.startsWith('vosk-model'));
        fs.mkdirSync(destAssets, { recursive: true });
        for (const model of models) {
          const modelSrc = path.join(srcModels, model);
          const modelDest = path.join(destAssets, model);
          if (fs.statSync(modelSrc).isDirectory()) {
            const uuidPath = path.join(modelSrc, 'uuid');
            if (!fs.existsSync(uuidPath)) {
              fs.writeFileSync(uuidPath, `${Date.now()}\n`, 'utf8');
            }
            fs.cpSync(modelSrc, modelDest, { recursive: true, force: true });
            console.log(`[vosk-plugin] Copied model ${model} to Android assets`);
          }
        }
      }
      return config;
    }
  ]);

  return config;
};
