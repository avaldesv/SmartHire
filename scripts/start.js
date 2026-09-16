#!/usr/bin/env node
/**
 * Unified entrypoint for Railway (npm start) and local development.
 * - Production/Railway: serve dist with cookie-based locale routing (serve-spa.js)
 * - Local dev: ng serve (single dev bundle)
 *
 * Force production locally: SERVE_DIST=1 npm start
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist', 'smarthire-recruiter-portal', 'browser', 'index.html');

function shouldServeDist() {
  if (!fs.existsSync(DIST_INDEX)) {
    return false;
  }
  if (process.env.SERVE_DIST === '1' || process.env.SERVE_DIST === 'true') {
    return true;
  }
  if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  return false;
}

function runNodeScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const child = spawn(process.execPath, [scriptPath], {
    stdio: 'inherit',
    env: process.env,
    cwd: PROJECT_ROOT,
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

function runNgServe(extraArgs) {
  const ngBin = path.join(PROJECT_ROOT, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
  const child = spawn(process.execPath, [ngBin, 'serve', ...extraArgs], {
    stdio: 'inherit',
    env: process.env,
    cwd: PROJECT_ROOT,
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

const extraArgs = process.argv.slice(2);

if (shouldServeDist()) {
  console.log('start: production → serve-spa (multi-locale via cookie, no URL prefix)');
  runNodeScript('serve-spa.js');
} else {
  console.log('start: development → ng serve');
  runNgServe(extraArgs);
}
