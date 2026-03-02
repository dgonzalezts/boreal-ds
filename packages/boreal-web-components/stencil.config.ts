import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import reactOutputTarget from './targets/react-output-target';
import vueOutputTarget from './targets/vue-output-target';
import { testingConfig } from './testing.config';

export const config: Config = {
  namespace: 'boreal-web-components',
  minifyJs: true,
  minifyCss: true,
  sourceMap: false,
  buildEs5: 'prod',
  globalStyle: 'src/styles/main.scss',
  extras: {
    experimentalSlotFixes: true,
    experimentalScopedSlotChanges: true,
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      dir: 'dist',
      empty: true,
      copy: [
        {
          src: 'node_modules/@telesign/boreal-style-guidelines/dist/css',
          dest: 'css',
        },
        {
          src: 'node_modules/@telesign/boreal-style-guidelines/dist/scss',
          dest: 'scss',
        },
      ],
    },
    {
      type: 'dist-custom-elements',
      externalRuntime: false,
      dir: './components-build',
      generateTypeDeclarations: true,
    },
    {
      type: 'docs-custom-elements-manifest',
      file: 'custom-elements.json',
    },
    reactOutputTarget(),
    vueOutputTarget(),
  ],
  plugins: [
    sass({
      includePaths: ['node_modules'],
      // Prepends the stencil SCSS tokens to every component SCSS file so that
      // $boreal-* variables are available without a per-file import.
      additionalData: `@import '@telesign/boreal-style-guidelines/dist/stencil/index';`,
    }),
  ],
  testing: testingConfig,
  tsconfig: 'tsconfig.build.json',
};
