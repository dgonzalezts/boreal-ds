import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { Logger } from './logger.mjs'

export class Cmd {
  static async run(command, args, cwd) {
    try {
      Logger.log('info', `\nRunning command in ${path.basename(cwd)}:`);
      await execa(command, args, { cwd, stdio: 'inherit' });
    } catch (error) {
      Logger.log('error', `Failed to run command: ${error.message}`);
      throw error;
    }
  }

  static async tgzName(sourceDir) {
    console.log('Getting tgz name from', sourceDir);
    try {
      const { stdout } = await execa('npm', ['pack', '--silent'], { cwd: sourceDir });
      const tgzName = stdout.trim();
      return tgzName;
    } catch (error) {
      Logger.log('error', `Failed to pack ${path.basename(sourceDir)}: ${error.message}`);
      throw error;
    }
  }

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
