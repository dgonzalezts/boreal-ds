import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');

/**
 * Shared locations and package names for Boreal DS scripts.
 * @type {{
 *   webcomponents: { wrapperRoute: string, wrapperName: string },
 *   vue: { wrapperRoute: string, wrapperName: string, app: string },
 *   react: { wrapperRoute: string, wrapperName: string, app: string },
 *   angular: { wrapperRoute: string, wrapperName: string, app: string }
 * }}
 */
export const CONFIG = {
  webcomponents: {
    wrapperRoute: path.resolve(ROOT, "packages/boreal-web-components"),
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
};
