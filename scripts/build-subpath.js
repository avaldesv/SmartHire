#!/usr/bin/env node
/**
 * Production build for a deploy subpath (IIS virtual directory, etc.).
 *
 * Usage:
 *   npm run build:subpath -- /via/
 *   npm run build:subpath -- /abcxyz/
 *   node scripts/build-subpath.js /via/
 *
 * Equivalent to:
 *   ng build --base-href <base>/ && DEPLOY_BASE_HREF=<base>/ node scripts/postbuild-i18n.js
 */
const { spawnSync } = require('child_process');
const path = require('path');

function normalizeDeployBase(value) {
  let base = (value == null || value === '' ? '/' : String(value)).trim() || '/';
  if (!base.startsWith('/')) {
    base = `/${base}`;
  }
  if (!base.endsWith('/')) {
    base = `${base}/`;
  }
  return base;
}

const raw = process.argv[2];
if (!raw) {
  console.error('Usage: npm run build:subpath -- /via/');
  process.exit(1);
}

const deployBase = normalizeDeployBase(raw);
const root = path.join(__dirname, '..');
const ng = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log(`build-subpath: base href ${deployBase}`);

const build = spawnSync(ng, ['ng', 'build', `--base-href=${deployBase}`], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});
if (build.status !== 0) {
  process.exit(build.status || 1);
}

const post = spawnSync(process.execPath, [path.join(__dirname, 'postbuild-i18n.js'), deployBase], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, DEPLOY_BASE_HREF: deployBase },
});
process.exit(post.status || 0);
