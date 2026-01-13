import type { TokenObject, TokenValue, FlattenedTokens } from '../config/types';

/**
 * Token Processor
 * Handles token resolution and flattening
 */
export class TokenProcessor {
  private primitiveTokens: Map<string, string> = new Map();
  private themeTokens: Map<string, string> = new Map();

  constructor(
    private readonly primitives: any,
    private readonly cssVarPrefix: string
  ) {
    this.processPrimitiveTokens(this.primitives);
  }

  /**
   * Process primitive tokens and store them for reference resolution
   */
  private processPrimitiveTokens(obj: any, path: string[] = []): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];

      if (this.isTokenValue(value)) {
        const tokenPath = currentPath.join('.');
        this.primitiveTokens.set(tokenPath, String(value.value));
      } else if (typeof value === 'object' && value !== null) {
        this.processPrimitiveTokens(value, currentPath);
      }
    }
  }

  /**
   * Check if an object is a TokenValue
   */
  private isTokenValue(obj: any): obj is TokenValue {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'value' in obj &&
      'type' in obj
    );
  }

  /**
   * Resolve token reference (e.g., "{color.proximus.mint.mint-70}")
   */
  resolveReference(value: string): string {
    if (typeof value !== 'string') {
      return String(value);
    }

    // Check if it's a reference
    const refMatch = value.match(/^\{(.+)\}$/);
    if (!refMatch) {
      return value;
    }

    const refPath = refMatch[1];

    // Try to resolve from theme tokens first
    if (this.themeTokens.has(refPath)) {
      return this.themeTokens.get(refPath)!;
    }

    // Then try primitives
    if (this.primitiveTokens.has(refPath)) {
      return this.primitiveTokens.get(refPath)!;
    }

    // Return as CSS variable reference for theme-level tokens
    const cssVarName = this.tokenPathToCSSVar(refPath);
    return `var(${cssVarName})`;
  }

  /**
   * Sanitize a token key name to be valid for CSS
   * Removes parentheses, spaces, and normalizes the name
   */
  private sanitizeTokenKey(key: string): string {
    return key
      .replace(/\s*\([^)]*\)\s*/g, '') // Remove content in parentheses with surrounding spaces
      .replace(/\s+/g, '-') // Replace remaining spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .toLowerCase();
  }

  /**
   * Convert token path to CSS variable name
   */
  private tokenPathToCSSVar(path: string): string {
    // Handle special cases
    if (path === 'white') {
      return `${this.cssVarPrefix}white`;
    }

    // Convert path like "color.proximus.mint.mint-70" to "--boreal-color-proximus-mint-70"
    const normalized = path
      .replace(/\./g, '-')
      .replace(/\s+/g, '-')
      .replace(/\(|\)/g, '')
      .toLowerCase();

    return `${this.cssVarPrefix}${normalized}`;
  }

  /**
   * Flatten theme tokens to key-value pairs
   */
  flattenThemeTokens(
    themeTokens: any,
    parentKey: string = ''
  ): FlattenedTokens {
    const result: FlattenedTokens = {};

    for (const [key, value] of Object.entries(themeTokens)) {
      const sanitizedKey = this.sanitizeTokenKey(key);
      const currentKey = parentKey ? `${parentKey}-${sanitizedKey}` : sanitizedKey;

      if (this.isTokenValue(value)) {
        const resolvedValue = this.resolveReference(String(value.value));
        result[currentKey] = resolvedValue;
        // Store for later reference resolution (use original key for lookups)
        this.themeTokens.set(key, resolvedValue);
        this.themeTokens.set(currentKey, resolvedValue);
      } else if (typeof value === 'object' && value !== null) {
        const nested = this.flattenThemeTokens(value, currentKey);
        Object.assign(result, nested);
      }
    }

    return result;
  }

  /**
   * Flatten primitive tokens for global CSS
   */
  flattenPrimitiveTokens(
    primitives: any,
    parentKey: string = ''
  ): FlattenedTokens {
    const result: FlattenedTokens = {};

    for (const [key, value] of Object.entries(primitives)) {
      const sanitizedKey = this.sanitizeTokenKey(key);
      const currentKey = parentKey ? `${parentKey}-${sanitizedKey}` : sanitizedKey;

      if (this.isTokenValue(value)) {
        result[currentKey] = String(value.value);
      } else if (typeof value === 'object' && value !== null) {
        const nested = this.flattenPrimitiveTokens(value, currentKey);
        Object.assign(result, nested);
      }
    }

    return result;
  }

  /**
   * Generate CSS custom properties
   */
  generateCSSProperties(tokens: FlattenedTokens): string {
    return Object.entries(tokens)
      .map(([key, value]) => {
        const cssVarName = `${this.cssVarPrefix}${key}`;
        // Add unit for numeric values (assumed to be px for spacing, layout, etc.)
        const finalValue = this.addUnitIfNeeded(value, key);
        return `  ${cssVarName}: ${finalValue};`;
      })
      .join('\n');
  }

  /**
   * Add unit (px) if the value is a number and needs it
   */
  private addUnitIfNeeded(value: string, key: string): string {
    // Check if it's a pure number
    if (/^\d+(\.\d+)?$/.test(value)) {
      // Add px for spacing, layout, icons, radius
      if (
        key.includes('spacing') ||
        key.includes('layout') ||
        key.includes('icon') ||
        key.includes('radius')
      ) {
        return `${value}px`;
      }
    }
    return value;
  }

  /**
   * Generate SCSS variables
   */
  generateSCSSVariables(tokens: FlattenedTokens): string {
    return Object.entries(tokens)
      .map(([key, value]) => {
        const scssVarName = `$${this.cssVarPrefix.replace(/^--/, '')}${key}`;
        const finalValue = this.addUnitIfNeeded(value, key);
        return `${scssVarName}: ${finalValue};`;
      })
      .join('\n');
  }

  /**
   * Generate SCSS map
   */
  generateSCSSMap(tokens: FlattenedTokens, mapName: string): string {
    const entries = Object.entries(tokens)
      .map(([key, value]) => {
        const finalValue = this.addUnitIfNeeded(value, key);
        return `  '${key}': ${finalValue}`;
      })
      .join(',\n');

    return `$${mapName}: (\n${entries}\n);`;
  }
}
