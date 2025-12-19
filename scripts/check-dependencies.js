// #region agent log
const fs = require('fs');
const path = require('path');

const logData = {
  sessionId: 'debug-session',
  runId: 'run1',
  timestamp: Date.now(),
  location: 'check-dependencies.js:start',
  message: 'Checking dependencies installation status'
};

fetch('http://127.0.0.1:7246/ingest/bfb24e18-70ed-49d0-87f8-12f2e8728fe0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logData)
}).catch(() => {});
// #endregion

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

// #region agent log
const logData2 = {
  sessionId: 'debug-session',
  runId: 'run1',
  hypothesisId: 'A',
  timestamp: Date.now(),
  location: 'check-dependencies.js:before-check',
  message: 'Checking if node_modules exists',
  data: { nodeModulesExists: fs.existsSync(nodeModulesPath) }
};

fetch('http://127.0.0.1:7246/ingest/bfb24e18-70ed-49d0-87f8-12f2e8728fe0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logData2)
}).catch(() => {});
// #endregion

const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});

const missing = [];
const installed = [];

dependencies.forEach(dep => {
  const depPath = path.join(nodeModulesPath, dep);
  if (fs.existsSync(depPath)) {
    installed.push(dep);
  } else {
    missing.push(dep);
  }
});

// #region agent log
const logData3 = {
  sessionId: 'debug-session',
  runId: 'run1',
  hypothesisId: 'A',
  timestamp: Date.now(),
  location: 'check-dependencies.js:after-check',
  message: 'Dependency check results',
  data: { 
    totalDependencies: dependencies.length,
    installed: installed.length,
    missing: missing.length,
    missingPackages: missing
  }
};

fetch('http://127.0.0.1:7246/ingest/bfb24e18-70ed-49d0-87f8-12f2e8728fe0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logData3)
}).catch(() => {});
// #endregion

console.log('Installed:', installed.length);
console.log('Missing:', missing.length);
if (missing.length > 0) {
  console.log('Missing packages:', missing.join(', '));
}

