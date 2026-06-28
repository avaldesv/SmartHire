#!/usr/bin/env node
/**
 * After ng build with localize:true, Angular outputs per-locale folders under browser/.
 * Static hosts (Railway) expect index.html at browser/ root — copy default locale there
 * and keep sibling locale folders for language-switch reloads.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist', 'smarthire-recruiter-portal', 'browser');
const DEFAULT_LOCALE = 'es-MX';
const LOCALES = ['es-MX', 'es-ES', 'en-US'];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(ROOT)) {
  console.error(`postbuild-i18n: missing ${ROOT} — run ng build first`);
  process.exit(1);
}

const defaultDir = path.join(ROOT, DEFAULT_LOCALE);
if (!fs.existsSync(defaultDir)) {
  // Single-locale or non-i18n build — nothing to do
  console.log('postbuild-i18n: no locale subfolders, skipping');
  process.exit(0);
}

for (const locale of LOCALES) {
  const localeDir = path.join(ROOT, locale);
  if (!fs.existsSync(localeDir)) {
    console.warn(`postbuild-i18n: skip missing locale ${locale}`);
    continue;
  }
  if (locale === DEFAULT_LOCALE) {
    copyDir(localeDir, ROOT);
    const rootIndex = path.join(ROOT, 'index.html');
    if (fs.existsSync(rootIndex)) {
      const html = fs.readFileSync(rootIndex, 'utf8');
      const fixed = html
        .replace(/<base href="\/es-MX\/">/, '<base href="/">')
        .replace(/<base href='\/es-MX\/'>/, "<base href='/'>");
      fs.writeFileSync(rootIndex, fixed, 'utf8');
    }
    console.log(`postbuild-i18n: copied ${DEFAULT_LOCALE} to browser root (base href -> /)`);
  }
}

// SPA fallback for hosts that ignore npm start and serve dist/ as static files only.
// Multi-locale UI requires npm start → scripts/start.js → serve-spa.js (cookie routing).
const redirects = '/*    /index.html   200\n';
fs.writeFileSync(path.join(ROOT, '_redirects'), redirects, 'utf8');

const serveConfig = {
  public: '.',
  rewrites: [{ source: '/**', destination: '/index.html' }],
};
fs.writeFileSync(path.join(ROOT, 'serve.json'), `${JSON.stringify(serveConfig, null, 2)}\n`, 'utf8');
console.log('postbuild-i18n: wrote _redirects and serve.json');
