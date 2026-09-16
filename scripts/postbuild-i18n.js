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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fixBaseHref(indexPath, locale) {
  if (!fs.existsSync(indexPath)) {
    return false;
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  const legacyBase = `/${locale}/`;
  const pattern = new RegExp(`<base href=["']${escapeRegex(legacyBase)}["']>`, 'g');
  const fixed = html.replace(pattern, '<base href="/">');
  if (fixed !== html) {
    fs.writeFileSync(indexPath, fixed, 'utf8');
    return true;
  }
  return false;
}

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
    fixBaseHref(path.join(ROOT, 'index.html'), DEFAULT_LOCALE);
    console.log(`postbuild-i18n: copied ${DEFAULT_LOCALE} to browser root (base href -> /)`);
  } else if (fixBaseHref(path.join(localeDir, 'index.html'), locale)) {
    console.log(`postbuild-i18n: fixed base href for ${locale} -> /`);
  }
}

const redirects = '/*    /index.html   200\n';
fs.writeFileSync(path.join(ROOT, '_redirects'), redirects, 'utf8');

const serveConfig = {
  public: '.',
  rewrites: [{ source: '/**', destination: '/index.html' }],
};
fs.writeFileSync(path.join(ROOT, 'serve.json'), `${JSON.stringify(serveConfig, null, 2)}\n`, 'utf8');
console.log('postbuild-i18n: wrote _redirects and serve.json');
