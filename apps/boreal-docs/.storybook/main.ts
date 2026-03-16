import type { StorybookConfig } from '@storybook/web-components-vite';
import type { BuildOptions } from 'vite';
import remarkGfm from 'remark-gfm';

type RollupOnWarn = NonNullable<NonNullable<BuildOptions['rollupOptions']>['onwarn']>;
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageDir = (id: string) => dirname(fileURLToPath(import.meta.resolve(id)));

const wcCssDir = packageDir('@telesign/boreal-style-guidelines');
const wcStencilDistDir = packageDir('@telesign/boreal-web-components');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: '@storybook/web-components-vite',
  staticDirs: [
    './static',
    './styles',
    { from: wcCssDir, to: '/boreal-tokens' },
    { from: wcStencilDistDir, to: '/boreal-wc' },
  ],
  docs: {
    defaultName: 'Overview',
  },
  managerHead: head => `
    ${head}
    <link rel="stylesheet" type="text/css" href="/boreal-tokens/boreal.css" />
    <link rel="stylesheet" type="text/css" href="manager.css" />
  `,
  previewHead: head => `
    ${head}
    <link rel="stylesheet" type="text/css" href="preview.css" />
    <script type="module" src="boreal-wc/boreal-web-components.esm.js"></script>
    <script type="text/javascript">
      window.global = window;
    </script>
  `,
  async viteFinal(config) {
    const { mergeConfig, createLogger } = await import('vite');
    const logger = createLogger(config.logLevel);
    const originalWarn = logger.warn.bind(logger);
    logger.warn = (msg, options) => {
      if (msg.includes('esm-es5') && msg.includes('dynamic import')) return;
      originalWarn(msg, options);
    };

    return mergeConfig(config, {
      customLogger: logger,
      resolve: {
        alias: [
          { find: '@', replacement: resolve(__dirname, '../src') },
          { find: '@root', replacement: resolve(__dirname, '..') },
          {
            find: /^@telesign\/boreal-web-components\/css\/(.+)$/,
            replacement: `${wcCssDir}/$1`,
          },
        ],
      },
      build: {
        rollupOptions: {
          onwarn: ((warning, warn) => {
            if (warning.plugin === 'vite:import-analysis' && warning.id?.includes('esm-es5')) {
              return;
            }
            warn(warning);
          }) satisfies RollupOnWarn,
        },
      },
    });
  },
};
export default config;
