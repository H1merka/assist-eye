#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function log(...args) {
  console.log('[fix-sqlite-config]', ...args);
}

try {
  const packageRoot = path.resolve(__dirname, '..', 'node_modules', 'react-native-sqlite-storage');
  const configPath = path.join(packageRoot, 'react-native.config.js');
  const pkgPath = path.join(packageRoot, 'package.json');
  let changed = false;

  if (!fs.existsSync(packageRoot)) {
    log('package not found at', packageRoot, '- nothing to patch');
    process.exit(0);
  }

  if (fs.existsSync(configPath)) {
    const rawConfig = fs.readFileSync(configPath, 'utf8');
    const updatedConfig = rawConfig.replace(
      /\n\s*ios:\s*\{\s*\n\s*project:\s*'\.\/platforms\/ios\/SQLite\.xcodeproj'\s*\n\s*\},?/m,
      '\n'
    );

    if (updatedConfig !== rawConfig) {
      fs.writeFileSync(configPath, updatedConfig, 'utf8');
      changed = true;
      log('Removed invalid ios.project entry from react-native.config.js');
    }
  }

  if (fs.existsSync(pkgPath)) {
    const rawPkg = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(rawPkg);
    let pkgChanged = false;

    if (pkg.dependency && pkg.dependency.platforms && pkg.dependency.platforms.ios && 'project' in pkg.dependency.platforms.ios) {
      delete pkg.dependency.platforms.ios.project;
      pkgChanged = true;
      log('Removed dependency.platforms.ios.project from package.json');
    }

    if (pkgChanged) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      changed = true;
    }
  }

  log(changed ? 'Patch applied' : 'No changes required');
} catch (err) {
  console.error('[fix-sqlite-config] error:', err && err.stack ? err.stack : err);
  process.exit(0);
}
