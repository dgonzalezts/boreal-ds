'use strict';

const { cpSync, existsSync } = require('fs');
const { resolve } = require('path');

// Primary source: boreal-web-components dist (populated by the Stencil build copy task).
// Fallback source: boreal-styleguidelines dist (always available as a direct dependency).
const wcDist = resolve(__dirname, '../dist');
const sgDist = resolve(__dirname, '../node_modules/@telesign/boreal-style-guidelines/dist');

const src = existsSync(`${wcDist}/css`) ? wcDist : sgDist;
const label = src === wcDist ? '@telesign/boreal-web-components' : '@telesign/boreal-style-guidelines';

cpSync(`${src}/css`, 'dist/css', { recursive: true });
cpSync(`${src}/scss`, 'dist/scss', { recursive: true });

console.log(`Styles copied from ${label}.`);
