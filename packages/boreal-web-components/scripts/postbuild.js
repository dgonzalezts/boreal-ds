#!/usr/bin/env node
'use strict';

const { cpSync, rmSync, existsSync } = require('fs');
const { resolve } = require('path');

const distDir = resolve(__dirname, '../dist');
const namespacedDir = resolve(distDir, 'boreal-web-components');

for (const folder of ['css', 'scss']) {
  const src = resolve(namespacedDir, folder);
  const dest = resolve(distDir, folder);
  if (!existsSync(src)) {
    console.error(`postbuild: source not found: ${src}`);
    process.exit(1);
  }
  if (existsSync(dest)) rmSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

console.log('postbuild: css and scss promoted to dist/ root.');
