import { reactOutputTarget } from '@stencil/react-output-target';

export default () => {
    return reactOutputTarget({
        stencilPackageName: '@boreal-ds/web-components',
        customElementsDir: 'components',
        outDir: '../boreal-react/lib/components',
    });
}

