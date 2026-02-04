/*
import path from 'node:path';
import { fileURLToPath } from 'node:url'; */
//import chalk from 'chalk';
/* 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(process.cwd(), '../../');
console.log('ROOT', ROOT);
export const CONFIG = {
  webcomponents: {
    wrapperRoute: path.resolve(ROOT, "boreral-ds/packages/boreal-web-components"),
    wrapperName: '@boreal-ds/web-components'
  },
  vue: {
    wrapperRoute: path.resolve(ROOT, "packages/boreal-vue"),
    wrapperName: '@boreal-ds/vue',
    app: path.resolve(ROOT, "examples/app-vue-vite")
  },
  react: {
    wrapperRoute: path.resolve(ROOT, "packages/boreal-react"),
    wrapperName: '@boreal-ds/react',
    app: path.resolve(ROOT, "examples/react-testapp")
  },
  angular: {
    wrapperRoute: path.resolve(ROOT, "packages/boreal-angular"),
    wrapperName: '@boreal-ds/angular',
    app: path.resolve(ROOT, "examples/app-angular")
  }
}; */

/* export const createLogger = (level, msg, ...args) => {
  const styles = {
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
    success: chalk.green,
    title: chalk.bold.bgBlue,
  };

  const styler = styles[level];

  const icons = {
    title: '\u{1F4D6} ',
    info: '\u2139\uFE0F  ',
    warn: '\u26A0\uFE0F ',
    error: '\u274C ',
    success: '\u2705 '
  };

  msg = `${icons[level]}${String(msg).replace(/^\n+/, '')}`;
  console.log(styler(msg), ...args);
} */
