import fs from 'node:fs';
import path from 'node:path';
import { Cmd } from './cmd.js';
import { Logger } from './logger.js';

/**
 * Install a local pack into a directory, optionally removing a package name first.
 * @param {string} cwd
 * @param {string} pack
 * @param {string} [uninstallName]
 * @returns {Promise<void>}
 */
export const installPack = async (cwd, pack, uninstallName) => {
  if (uninstallName) {
    Logger.log('info', `Removing ${uninstallName}...`);
    try {
      await Cmd.run('pnpm', ['remove', uninstallName], cwd);
    } catch {
      Logger.log('info', `${uninstallName} not found, skipping removal.`);
    }
    const packageDir = path.join(cwd, 'node_modules', uninstallName);
    if (fs.existsSync(packageDir)) {
      fs.rmSync(packageDir, { recursive: true, force: true });
      Logger.log('info', `Cleared ${uninstallName} from node_modules`);
    }
  }

  Logger.log('info', `Installing ${pack}...`);
  await Cmd.run('pnpm', ['add', `./${pack}`, '--force'], cwd);
};
