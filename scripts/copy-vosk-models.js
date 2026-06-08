const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = path.join(__dirname, '..');
const srcModels = path.join(projectRoot, 'assets', 'models');
const destAssets = path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets');

function ensureUuidFile(modelDir) {
  const uuidPath = path.join(modelDir, 'uuid');
  if (!fs.existsSync(uuidPath)) {
    fs.writeFileSync(uuidPath, `${crypto.randomUUID()}\n`, 'utf8');
    console.log(`[copy-vosk-models] Created uuid in ${path.basename(modelDir)}`);
  }
}

function cleanStaleAssetFiles() {
  if (!fs.existsSync(destAssets)) {
    return;
  }

  const staleEntries = ['am', 'conf', 'graph', 'ivector', 'README'];
  for (const entry of staleEntries) {
    const entryPath = path.join(destAssets, entry);
    if (fs.existsSync(entryPath) && fs.statSync(entryPath).isDirectory()) {
      fs.rmSync(entryPath, { recursive: true, force: true });
      console.log(`[copy-vosk-models] Removed stale assets/${entry}`);
    }
  }
}

if (!fs.existsSync(srcModels)) {
  console.error('[copy-vosk-models] Missing assets/models directory');
  process.exit(1);
}

fs.mkdirSync(destAssets, { recursive: true });
cleanStaleAssetFiles();

const models = fs
  .readdirSync(srcModels)
  .filter(name => name.startsWith('vosk-model'))
  .filter(name => fs.statSync(path.join(srcModels, name)).isDirectory());

if (models.length === 0) {
  console.error('[copy-vosk-models] No vosk-model-* folders found in assets/models');
  process.exit(1);
}

for (const model of models) {
  const modelSrc = path.join(srcModels, model);
  const modelDest = path.join(destAssets, model);

  ensureUuidFile(modelSrc);
  fs.cpSync(modelSrc, modelDest, { recursive: true, force: true });
  ensureUuidFile(modelDest);
  console.log(`[copy-vosk-models] Copied ${model}`);
}

console.log('[copy-vosk-models] Done. Rebuild Android app: npm run android');
