/**
 * Root lint-staged configuration — Boreal DS monorepo.
 *
 * Uses () => 'command' functions (not plain strings) to prevent lint-staged
 * from appending matched file paths to `pnpm --filter` commands, which would
 * produce invalid CLI syntax. The package's own scripts handle file scope.
 *
 * Intentionally excluded: boreal-react, boreal-vue, boreal-styleguidelines
 * (no independent lint/format toolchain configured in those packages).
 */
export default {
  'packages/boreal-web-components/src/**/*.{ts,tsx}': [
    () => 'pnpm --filter @telesign/boreal-web-components run lint:fix',
    () => 'pnpm --filter @telesign/boreal-web-components run format',
  ],

  'packages/boreal-web-components/src/**/*.{css,scss}': [
    () => 'pnpm --filter @telesign/boreal-web-components run format',
  ],

  'apps/boreal-docs/**/*.{ts,tsx}': [
    () => 'pnpm --filter @telesign/boreal-docs run lint:fix',
    () => 'pnpm --filter @telesign/boreal-docs run format',
  ],

  'apps/boreal-docs/**/*.{js,json,css,md,mdx}': [
    () => 'pnpm --filter @telesign/boreal-docs run format',
  ],
};
