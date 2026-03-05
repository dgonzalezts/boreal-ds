import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { resolve } from 'path';
import reactOutputTarget from './targets/react-output-target';
import vueOutputTarget from './targets/vue-output-target';
import { testingConfig } from './testing.config';

const styleGuidelinesDir = resolve(
  __dirname,
  'node_modules/@telesign/boreal-style-guidelines/dist'
);

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
          src: `${styleGuidelinesDir}/css`,
          dest: 'css',
        },
        {
          src: `${styleGuidelinesDir}/scss`,
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
      // Injects the stencil SCSS tokens into every component SCSS file so that
      // $boreal-* variables are available without a per-file import.
      injectGlobalPaths: [
        require.resolve('@telesign/boreal-style-guidelines/stencil'),
        require.resolve('@telesign/boreal-style-guidelines'),
      ],
    }),
  ],
  testing: testingConfig,
  tsconfig: 'tsconfig.build.json',
};
