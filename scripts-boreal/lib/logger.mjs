import chalk from 'chalk';

/**
 * Minimal console logger with consistent styling.
 */
export class Logger {
  /**
   * Log a styled message.
   * @param {'title'|'info'|'warn'|'error'|'success'} level
   * @param {string} message
   * @param {...unknown} args
   */
  static log(level, message, ...args) {
    const icons = {
      title: '\u{1F4D6} ',
      info: '\u2139\uFE0F  ',
      warn: '\u26A0\uFE0F ',
      error: '\u274C ',
      success: '\u2705 '
    };

    const styles = {
      info: chalk.blue,
      warn: chalk.yellow,
      error: chalk.red,
      success: chalk.green,
      title: chalk.bold.bgBlue,
    };

    const styler = styles[level];
    const msg = `${icons[level]}${String(message).replace(/^\n+/, '')}`;
    console.log(styler(msg), ...args);
  }
}
