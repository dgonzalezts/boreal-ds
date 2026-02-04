import fs from 'node:fs';
import path from 'node:path';
import { Cmd } from './cmd.mjs';
import { Logger } from './logger.mjs';

/**
 * Resolve the node_modules path for a given directory.
 * @param {string} cwd
 * @returns {string}
 */
const nodeModulesPath = (cwd) => path.join(cwd, 'node_modules');

/**
 * Check whether node_modules exists in a directory.
 * @param {string} cwd
 * @returns {boolean}
 */
export const hasNodeModules = (cwd) => fs.existsSync(nodeModulesPath(cwd));

/**
 * Ensure dependencies are installed for a directory.
 * @param {string} cwd
 * @returns {Promise<void>}
 */
export const ensureNodeModules = async (cwd) => {
  if (hasNodeModules(cwd)) return;

  Logger.log('info', `Installing dependencies in ${path.basename(cwd)}...`);
  await Cmd.run('npm', ['install'], cwd);
  Logger.log('success', `Dependencies installed in ${path.basename(cwd)}`);
};

/**
 * Install a local pack into a directory, optionally uninstalling a package name first.
 * @param {string} cwd
 * @param {string} pack
 * @param {string} [uninstallName]
 * @returns {Promise<void>}
 */
export const installPack = async (cwd, pack, uninstallName) => {
  if (!hasNodeModules(cwd)) {
    await ensureNodeModules(cwd);
  } else if (uninstallName) {
    Logger.log('info', `Uninstall pack ${uninstallName}...`);
    await Cmd.run('npm', ['uninstall', uninstallName], cwd);
  }

  Logger.log('info', `Install pack ${pack}...`);
  await Cmd.run('npm', ['install', pack], cwd);
};
