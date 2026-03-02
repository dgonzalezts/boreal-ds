'use strict';

const { cpSync } = require('fs');
const { resolve } = require('path');

const src = resolve(__dirname, '../dist');

cpSync(`${src}/css`, 'dist/css', { recursive: true });
cpSync(`${src}/scss`, 'dist/scss', { recursive: true });

console.log('Styles copied from @telesign/boreal-web-components.');
