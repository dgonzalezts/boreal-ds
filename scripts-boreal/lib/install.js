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
    await Cmd.run('pnpm', ['remove', uninstallName], cwd);
  }

  Logger.log('info', `Installing ${pack}...`);
  await Cmd.run('pnpm', ['add', pack], cwd);
};
