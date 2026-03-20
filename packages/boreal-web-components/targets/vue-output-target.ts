import { vueOutputTarget } from '@stencil/vue-output-target';

export default () => {
  return vueOutputTarget({
    componentCorePackage: '@telesign/boreal-web-components',
    proxiesFile: '../boreal-vue/lib/components.ts',
    includeImportCustomElements: true,
    includePolyfills: false,
    includeDefineCustomElements: false,
    componentModels: [
      {
        elements: ['bds-text-field'],
        event: 'valueChange',
        targetAttr: 'value',
      },
    ],
  });
};
