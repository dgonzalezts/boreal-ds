/**
 * Token helper functions for extracting token names from the main library
 *
 * This file provides utility functions to extract token names from the
 * @telesign/colibri tokens object, replacing the need for hardcoded constants.
 */

import themes from '../stories/foundations/colors/constants/themes';
import primitives from '../../../../packages/boreal-styleguidelines/src/tokens/primitives/primitives.json';
import UI from '../../../../packages/boreal-styleguidelines/src/tokens/usage/colors-themes.json';

/**
 * Extracts all keys from a nested object, flattening the structure
 * @param obj - Object to extract keys from
 * @param prefix - Optional prefix to add to keys
 * @returns Array of flattened keys
 */
function extractKeys(obj: any, prefix: string = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Extracts keys from a category and filters them
 * @param category - The category object to extract from
 * @param filter - Optional filter function
 * @returns Array of filtered keys
 */
function extractCategoryKeys(category: any, filter?: (key: string) => boolean): string[] {
  if (!category) return [];

  const keys = extractKeys(category);
  const normalizedKeys = keys.map(key => key.replace(/(\-value)/g, ''));
  return filter ? normalizedKeys.filter(filter) : normalizedKeys;
}

/**
 * Extracts theme color names from all available themes
 * @param filter - Optional filter function
 * @returns Array of unique color names across all themes
 */
function extractThemeColorNames(filter?: (key: string) => boolean): string[] {
  const colorNames = new Set<string>();

  // Extract color names from all themes
  Object.values(themes).forEach(theme => {
    Object.keys(theme).forEach(key => {
      // Skip font definitions
      if (!key.includes('font')) {
        colorNames.add(key);
      }
    });
  });

  const uniqueNames = Array.from(colorNames);
  return filter ? uniqueNames.filter(filter) : uniqueNames;
}

/**
 * Creates a regex-based filter for precise color matching
 * @param patterns - Array of regex patterns to match
 * @returns Filter function
 */
function createColorFilter(...patterns: RegExp[]): (key: string) => boolean {
  return (key: string) => patterns.some(pattern => pattern.test(key));
}

/**
 * Creates a prefix-based filter for exact color group matching
 * @param prefixes - Array of exact prefixes to match
 * @returns Filter function
 */
function createPrefixFilter(...prefixes: string[]): (key: string) => boolean {
  return (key: string) => prefixes.some(prefix => key === prefix || key.startsWith(`${prefix}-`));
}

// Theme color extractors (from themes, not tokens)
const defaultTheme = themes.telesign || {};
const themeKeys = Object.keys(defaultTheme);
const isFontToken = (key: string) => key.includes('font');

// Precise color filters using regex patterns and prefix matching
export const PRIMARY_COLORS = themeKeys
  .filter(createPrefixFilter('primary'))
  .filter(key => !isFontToken(key));

export const ACCENT_COLORS = themeKeys
  .filter(createPrefixFilter('accent'))
  .filter(key => !isFontToken(key));

export const BASE = themeKeys.filter(createPrefixFilter('base')).filter(key => !isFontToken(key));
export const NEUTRAL = themeKeys.filter(createColorFilter(/^neutral-\d+$/, /^neutral$/));
export const BLACK_WHITE = themeKeys.filter(createColorFilter(/^black$/, /^white$/));
export const SUCCESS = themeKeys
  .filter(createPrefixFilter('success'))
  .filter(key => !isFontToken(key));
export const WARNING = themeKeys
  .filter(createPrefixFilter('warning'))
  .filter(key => !isFontToken(key));
export const DANGER = themeKeys
  .filter(createPrefixFilter('danger'))
  .filter(key => !isFontToken(key));
export const INFORMATION = themeKeys
  .filter(createPrefixFilter('information'))
  .filter(key => !isFontToken(key));
export const FOCUS = themeKeys.filter(createColorFilter(/^focus$/));

// Semantic colors (from themes)
export const SUCCESS_SEMANTIC = extractThemeColorNames(key => key.includes('success'));
export const WARNING_SEMANTIC = extractThemeColorNames(key => key.includes('warning'));
export const DANGER_SEMANTIC = extractThemeColorNames(key => key.includes('danger'));
export const INFORMATION_SEMANTIC = extractThemeColorNames(key => key.includes('information'));
export const FOCUS_SEMANTIC = extractThemeColorNames(key => key.includes('focus'));

// UI color categories (from tokens)
export const UI_COLORS = extractCategoryKeys(UI['ui (components)'], key => !key.includes('type'));
export const TEXT_COLORS = extractCategoryKeys(UI.text, key => !key.includes('type'));
export const BACKGROUND_COLORS = extractCategoryKeys(
  UI['bg (layout)'],
  key => !key.includes('type')
);
export const ICON_COLORS = extractCategoryKeys(UI.icon, key => !key.includes('type'));
export const STROKE_COLORS = extractCategoryKeys(UI.stroke, key => !key.includes('type'));
export const ALPHA_COLORS = extractCategoryKeys(UI.alpha, key => !key.includes('type'));
export const EXTENDED_COLORS = extractCategoryKeys(UI.extended, key => !key.includes('type'));

// Other token categories
export const SPACING = primitives.spacing;
export const LAYOUT = primitives.layout;
export const RADIUS = primitives.radius;
/* export const TYPOGRAPHY = primitives.typography['font-size']; // Pendiente*/
