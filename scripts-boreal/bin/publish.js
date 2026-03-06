import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { CONFIG } from '../lib/conf.js';
import { Logger } from '../lib/logger.js';
import { Cmd } from '../lib/cmd.js';
import { installPack } from '../lib/install.js';

const run = Cmd.run;
const packTo = Cmd.packTo;

/**
 * Restore git-tracked files to their committed state and remove generated tgz artifacts.
 * @param {string[]} tgzPaths - Absolute paths to tgz files created during the pipeline run.
 * @param {string[]} dirtyFiles - Workspace-relative paths of files mutated by pnpm (package.json, pnpm-lock.yaml).
 * @param {string} root - Absolute path to the workspace root.
 * @returns {Promise<void>}
 */
const cleanup = async (tgzPaths, dirtyFiles, root) => {
  Logger.log('info', '\nCleaning up pipeline artifacts...');

  for (const tgzPath of tgzPaths) {
    if (fs.existsSync(tgzPath)) {
      fs.rmSync(tgzPath);
      Logger.log('info', `Removed ${path.basename(tgzPath)} from ${path.basename(path.dirname(tgzPath))}`);
    }
  }

  if (dirtyFiles.length > 0) {
    try {
      await execa('git', ['checkout', 'HEAD', '--', ...dirtyFiles], { cwd: root, stdio: 'inherit' });
      Logger.log('success', 'Restored package.json and pnpm-lock.yaml to committed state');
    } catch {
      Logger.log('error', 'Could not restore git-tracked files — please run: git checkout HEAD -- ' + dirtyFiles.join(' '));
    }
  }
};

/**
 * Create a tgz pack for web components and copy it to wrapper/app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<{ tgzName: string, tgzPaths: string[] }>}
 */
const createPackWebComponent = async framework => {
  Logger.log('info', '\nCreating Pack for Web Components Library');
  const { tgzName, to: toWrapper } = await packTo(
    CONFIG.webcomponents.wrapperRoute,
    CONFIG[framework].wrapperRoute
  );
  const { to: toApp } = await packTo(CONFIG.webcomponents.wrapperRoute, CONFIG[framework].app);

  Logger.log('success', 'Creating Pack for Web Components Library');
  return { tgzName, tgzPaths: [toWrapper, toApp] };
};

/**
 * Install web components pack and build the framework wrapper.
 * @param {string} tgzNameComponent
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<void>}
 */
const buildWrapper = async (tgzNameComponent, framework) => {
  await installPack(
    CONFIG[framework].wrapperRoute,
    tgzNameComponent,
    CONFIG.webcomponents.wrapperName
  );

  Logger.log('info', 'Building Wrapper Library...');
  await run('pnpm', ['build'], CONFIG[framework].wrapperRoute);

  Logger.log('success', 'Building Wrapper Library...');
};

/**
 * Create a tgz pack for the framework wrapper and move it to the demo app.
 * @param {'vue'|'react'|'angular'} framework
 * @returns {Promise<{ tgzNameWrapper: string, tgzPath: string }>}
 */
const createPackWrapper = async framework => {
  Logger.log('info', 'Packing Wrapper');
  const { tgzName: tgzNameWrapper, to: tgzPath } = await packTo(
    CONFIG[framework].wrapperRoute,
    CONFIG[framework].app
  );

  Logger.log('success', 'OK create pack for Wrapper');
  return { tgzNameWrapper, tgzPath };
};

/**
 * Install the wrapper pack in the demo app and run dev or build depending on mode.
 * @param {string} tgzNameWrapper
 * @param {'vue'|'react'|'angular'} framework
 * @param {boolean} isCi
 * @returns {Promise<void>}
 */
const installWrapperApp = async (tgzNameWrapper, framework, isCi) => {
  await installPack(CONFIG[framework].app, tgzNameWrapper, CONFIG[framework].wrapperName);

  Logger.log('success', 'Installed wrapper in app');

  if (isCi) {
    Logger.log('info', 'Running build validation...');
    await run('pnpm', ['build'], CONFIG[framework].app);
    Logger.log('success', 'Pipeline completed successfully — artifact validation passed');
  } else {
    Logger.log('success', 'Pipeline completed successfully — starting demo app...');
    await run('pnpm', ['dev'], CONFIG[framework].app);
  }
};

(async () => {
  const framework = process.argv[2];
  const isCi = process.argv.includes('--ci');

  if (!framework || !CONFIG[framework]) {
    Logger.log('error', '\n Please provide a valid framework: vue, react, angular \n');
    process.exit(1);
  }

  const ROOT = path.resolve(import.meta.dirname, '../../');
  const artifactPaths = [];
  const dirtyFiles = [
    path.relative(ROOT, path.join(CONFIG[framework].wrapperRoute, 'package.json')),
    path.relative(ROOT, path.join(CONFIG[framework].app, 'package.json')),
    'pnpm-lock.yaml',
  ];

  await execa('git', ['checkout', 'HEAD', '--', ...dirtyFiles], { cwd: ROOT, stdio: 'inherit' }).catch(() => {});

  const viteCache = path.join(CONFIG[framework].app, 'node_modules', '.vite');
  if (fs.existsSync(viteCache)) {
    fs.rmSync(viteCache, { recursive: true, force: true });
    Logger.log('info', 'Cleared Vite dep cache');
  }

  try {
    Logger.log('title', `\n Validate Pack for Boreal DS Web Components \n`);

    const { tgzName, tgzPaths: wcTgzPaths } = await createPackWebComponent(framework);
    artifactPaths.push(...wcTgzPaths);

    await buildWrapper(tgzName, framework);

    const { tgzNameWrapper, tgzPath: wrapperTgzPath } = await createPackWrapper(framework);
    artifactPaths.push(wrapperTgzPath);

    await installWrapperApp(tgzNameWrapper, framework, isCi);
  } catch (error) {
    Logger.log('error', '\n Pipeline failed. Stopping execution.', error);
    if (error.shortMessage) Logger.log('error', error.shortMessage);
    await cleanup(artifactPaths, dirtyFiles, ROOT);
    process.exit(1);
  }

  await cleanup(artifactPaths, dirtyFiles, ROOT);
})();
