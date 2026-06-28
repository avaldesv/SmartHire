#!/usr/bin/env node
/**
 * Production static server for multi-locale Angular builds without URL locale prefix.
 * Reads sh_portal_locale session cookie and serves the matching bundle; /login always uses es-MX.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.join(__dirname, '..', 'dist', 'smarthire-recruiter-portal', 'browser');
const DEFAULT_LOCALE = 'es-MX';
const SUPPORTED = new Set(['es-MX', 'es-ES', 'en-US']);
const PORT = Number(process.env.PORT || 8080);
const LOCALE_COOKIE = 'sh_portal_locale';

function readLocaleFromCookie(cookieHeader) {
  if (!cookieHeader) {
    return DEFAULT_LOCALE;
  }
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [name, ...rest] = part.trim().split('=');
    if (name === LOCALE_COOKIE) {
      const value = decodeURIComponent(rest.join('=')).trim();
      return SUPPORTED.has(value) ? value : DEFAULT_LOCALE;
    }
  }
  return DEFAULT_LOCALE;
}

function resolveLocaleDir(locale) {
  if (locale === DEFAULT_LOCALE) {
    return ROOT;
  }
  const localized = path.join(ROOT, locale);
  return fs.existsSync(path.join(localized, 'index.html')) ? localized : ROOT;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };
  return map[ext] || 'application/octet-stream';
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
  });
}

function resolveRequestLocale(req, reqPath) {
  if (reqPath === '/login' || reqPath.startsWith('/login/')) {
    return DEFAULT_LOCALE;
  }
  return readLocaleFromCookie(req.headers.cookie);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/');
  let reqPath = decodeURIComponent(parsed.pathname || '/');
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  const locale = resolveRequestLocale(req, reqPath);
  const localeDir = resolveLocaleDir(locale);
  const relative = reqPath.replace(/^\//, '');
  const candidate = path.join(localeDir, relative);

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    sendFile(res, candidate);
    return;
  }

  const fallback = path.join(localeDir, 'index.html');
  if (fs.existsSync(fallback)) {
    sendFile(res, fallback);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

if (!fs.existsSync(ROOT)) {
  console.error(`serve-spa: missing build output at ${ROOT}. Run npm run build first.`);
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`serve-spa: listening on ${PORT}, root=${ROOT}`);
});
