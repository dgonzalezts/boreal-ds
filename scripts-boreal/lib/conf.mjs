
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
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
