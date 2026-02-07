import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import reactOutputTarget from './targets/react-output-target';
import vueOutputTarget from './targets/vue-output-target';

export const config: Config = {
  namespace: 'boreal-web-components',
  minifyJs: true,
  minifyCss: true,
  sourceMap: false,
  buildEs5: 'prod',
  extras: {
    experimentalSlotFixes: true,
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
    },
    {
      type: 'dist-custom-elements',
      externalRuntime: false,
      dir: './components-build',
      generateTypeDeclarations: true
    },
    reactOutputTarget(),
    vueOutputTarget(),
  ],
  plugins: [
    sass({
      includePaths: ['node_modules']
    })
  ],
  testing: {
    browserHeadless: "shell",
  },
};
