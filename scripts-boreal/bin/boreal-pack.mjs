#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cmd } from '../lib/cmd.mjs';
import { Logger } from '../lib/logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publishPath = path.resolve(__dirname, './publish.mjs');

const framework = process.argv[2];
const environment = process.argv[3] || 'dev';

if (!framework || !['vue', 'react', 'angular'].includes(framework)) {
  Logger.log('error', '\n Please provide a valid framework: vue, react, angular \n');
  process.exit(1);
}

Logger.log('info', `\nRunning pack pipeline for ${framework} (${environment})\n`);
await Cmd.run('node', [publishPath, framework, environment], process.cwd());
