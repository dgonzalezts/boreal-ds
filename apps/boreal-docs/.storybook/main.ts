import type { StorybookConfig } from '@storybook/web-components-vite';
import type { BuildOptions } from 'vite';
import remarkGfm from 'remark-gfm';

type RollupOnWarn = NonNullable<NonNullable<BuildOptions['rollupOptions']>['onwarn']>;
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  staticDirs: ['./static', './styles'],
  docs: {
    defaultName: 'Overview',
  },
  managerHead: head => `
    ${head}
    <link rel="stylesheet" type="text/css" href="manager.css" />
  `,
  previewHead: head => `
    ${head}
    <link rel="stylesheet" type="text/css" href="preview.css" />
    <script type="text/javascript">
      window.global = window;
    </script>
  `,
  async viteFinal(config) {
    const { mergeConfig, createLogger } = await import('vite');
    // Suppress warnings about dynamic imports of ESM modules in Storybook's Vite setup during development
    const logger = createLogger(config.logLevel);
    const originalWarn = logger.warn.bind(logger);
    logger.warn = (msg, options) => {
      if (msg.includes('esm-es5') && msg.includes('dynamic import')) return;
      originalWarn(msg, options);
    };

    return mergeConfig(config, {
      customLogger: logger,
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
          '@root': resolve(__dirname, '..'),
        },
      },
      build: {
        rollupOptions: {
          // Suppress warnings about dynamic imports of ESM modules in Storybook's Vite setup during production builds
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
