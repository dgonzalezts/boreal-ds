import { vueOutputTarget } from "@stencil/vue-output-target";

export default () => {
    return vueOutputTarget({
        componentCorePackage: '@boreal-ds/web-components',
        proxiesFile: '../boreal-vue/lib/components.ts',
        includeImportCustomElements: true,
        includePolyfills: false,
        includeDefineCustomElements: false,
    });
}
