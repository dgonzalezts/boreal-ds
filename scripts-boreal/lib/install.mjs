import fs from 'node:fs';
import path from 'node:path';
import { Cmd } from './cmd.mjs';
import { Logger } from './logger.mjs';

const nodeModulesPath = (cwd) => path.join(cwd, 'node_modules');

export const hasNodeModules = (cwd) => fs.existsSync(nodeModulesPath(cwd));

export const ensureNodeModules = async (cwd) => {
  if (hasNodeModules(cwd)) return;

  Logger.log('info', `Installing dependencies in ${path.basename(cwd)}...`);
  await Cmd.run('npm', ['install'], cwd);
  Logger.log('success', `Dependencies installed in ${path.basename(cwd)}`);
};

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
