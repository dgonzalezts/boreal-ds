/**
 * Configuration constants for Boreal Design System
 */

/**
 * Prefix for CSS custom properties
 * Can be modified if needed (e.g., --boreal-, --br-, etc.)
 */
export const CSS_VAR_PREFIX = '--boreal-';

/**
 * Available themes
 */
export const THEMES = {
  PROXIMUS: 'proximus',
  ENGAGE: 'engage',
  PROTECT: 'protect',
  CONNECT: 'connect',
} as const;

/**
 * Default theme
 */
export const DEFAULT_THEME = THEMES.PROXIMUS;

/**
 * Output paths
 */
export const PATHS = {
  dist: 'dist',
  css: 'dist/css',
  scss: {
    root: 'dist/scss',
    variables: 'dist/scss/variables',
    maps: 'dist/scss/maps',
  },
  tokens: {
    primitives: 'src/tokens/primitives/primitives.json',
    themes: 'src/tokens/theme',
    usage: 'src/tokens/usage/colors-themes.json',
  },
} as const;
