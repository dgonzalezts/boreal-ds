
import chalk from 'chalk';

export class Logger {
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