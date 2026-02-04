import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { Logger } from './logger.mjs'

/**
 * Shell command helpers used by Boreal scripts.
 */
export class Cmd {
  /**
   * Run a command in a specific working directory.
   * @param {string} command
   * @param {string[]} args
   * @param {string} cwd
   * @returns {Promise<void>}
   */
  static async run(command, args, cwd) {
    try {
      Logger.log('info', `\nRunning command in ${path.basename(cwd)}:`);
      await execa(command, args, { cwd, stdio: 'inherit' });
    } catch (error) {
      Logger.log('error', `Failed to run command: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pack a directory and return the generated tgz filename.
   * @param {string} sourceDir
   * @returns {Promise<string>}
   */
  static async tgzName(sourceDir) {
    try {
      const { stdout } = await execa('npm', ['pack', '--silent'], { cwd: sourceDir });
      const tgzName = stdout.trim();
      return tgzName;
    } catch (error) {
      Logger.log('error', `Failed to pack ${path.basename(sourceDir)}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pack a directory and move the tgz to a target directory.
   * @param {string} sourceDir
   * @param {string} targetDir
   * @returns {Promise<{ to: string, tgzName: string }>}
   */
  static async packTo(sourceDir, targetDir) {
    try {
      Logger.log('info', `\nPacking from ${path.basename(sourceDir)} to ${path.basename(targetDir)}`);
      const tgzName = await Cmd.tgzName(sourceDir);
      const from = path.join(sourceDir, tgzName);
      const to = path.join(targetDir, tgzName);
      if (fs.existsSync(to)) fs.rmSync(to);
      fs.renameSync(from, to);
      Logger.log('success', `Packed & Moved to -> ${path.basename(targetDir)}/${tgzName}`);
      return { to, tgzName };
    } catch (error) {
      Logger.log('error', `Failed to pack and move: ${error.message}`);
      throw error;
    }
  }
}
