import type { CSSProperties, ReactNode } from 'react';

/**
 * Configuration options for customizing styles in Storybook.
 * Used to apply custom styling via the __sb property.
 */
export interface StylesOptions {
  /**
   * Custom styles that override the default settings.
   * Keys should be in camelCase and will be converted to kebab-case CSS properties.
   */
  __sb?: CSSProperties;
}

/**
 * Extended props interface for DocsContainer that includes access to Storybook's internal store.
 * This interface describes the actual runtime structure of props passed to the docs container,
 * including the internal `store` API that is not exposed in Storybook's public types.
 *
 * @remarks
 * The `store.userGlobals.globals` path is part of Storybook's internal API and may change
 * in future versions. Use with caution and consider this when upgrading Storybook versions.
 */
export interface DocsContainerPropsWithStore {
  children?: ReactNode;
  context: {
    store: {
      userGlobals: {
        globals: {
          theme?: string;
          [key: string]: unknown;
        };
      };
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
