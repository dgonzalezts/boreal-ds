import type { OutputTargetCustom } from '@stencil/core/internal/stencil-public-compiler';
import { reactOutputTarget } from '@stencil/react-output-target';

export default (): OutputTargetCustom => {
  return reactOutputTarget({
    stencilPackageName: '@boreal-ds/web-components',
    customElementsDir: 'components',
    outDir: '../boreal-react/lib/components',
  });
};
