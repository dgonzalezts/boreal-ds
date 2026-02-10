import type { TokenValue, FlattenedTokens } from '../config/types';

/**
 * Token Processor
 * Handles token resolution, flattening, and variable generation
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

  /** Clear theme tokens map for processing new theme */
  clearThemeTokens(): void {
    this.themeTokens.clear();
  }

  /** Process primitive tokens and store for reference resolution */
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

  /** Check if object is a TokenValue */
  private isTokenValue(obj: any): obj is TokenValue {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'value' in obj &&
      'type' in obj
    );
  }

  /** Resolve token reference for SCSS variables (preserves $var references) */
  private resolveSCSSReference(value: string, currentKey?: string): string {
    if (typeof value !== 'string') {
      return String(value);
    }

    const refMatch = value.match(/^\{(.+)\}$/);
    if (!refMatch) {
      return value;
    }

    const refPath = refMatch[1];
    const sanitizedPath = refPath
      .split('.')
      .map(segment => this.sanitizeTokenKey(segment))
      .join('-');

    if (currentKey && sanitizedPath === currentKey && this.themeTokens.has(sanitizedPath)) {
      return this.themeTokens.get(sanitizedPath)!;
    }

    return this.tokenPathToSCSSVar(refPath);
  }

  /** Resolve token reference for CSS custom properties (wraps in var()) */
  private resolveCSSReference(value: string, currentKey?: string): string {
    if (typeof value !== 'string') {
      return String(value);
    }

    const refMatch = value.match(/^\{(.+)\}$/);
    if (!refMatch) {
      return value;
    }

    const refPath = refMatch[1];
    const sanitizedPath = refPath
      .split('.')
      .map(segment => this.sanitizeTokenKey(segment))
      .join('-');

    if (currentKey && sanitizedPath === currentKey && this.themeTokens.has(sanitizedPath)) {
      return this.themeTokens.get(sanitizedPath)!;
    }

    const cssVarName = this.tokenPathToCSSVar(refPath);
    return `var(${cssVarName})`;
  }

  /** Sanitize token key for use in variable names */
  private sanitizeTokenKey(key: string): string {
    return key
      .replace(/\s*\([^)]*\)\s*/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  /** Convert token path to SCSS variable name */
  private tokenPathToSCSSVar(path: string): string {
    if (path === 'white') {
      return `$${this.cssVarPrefix.replace(/^--/, '')}white`;
    }

    const normalized = path
      .split('.')
      .map(segment => this.sanitizeTokenKey(segment))
      .join('-');

    return `$${this.cssVarPrefix.replace(/^--/, '')}${normalized}`;
  }

  /** Convert token path to CSS variable name */
  private tokenPathToCSSVar(path: string): string {
    if (path === 'white') {
      return `${this.cssVarPrefix}white`;
    }

    const normalized = path
      .split('.')
      .map(segment => this.sanitizeTokenKey(segment))
      .join('-');

    return `${this.cssVarPrefix}${normalized}`;
  }

  /** Flatten theme tokens for SCSS (preserves variable references) */
  flattenThemeTokensForSCSS(
    themeTokens: any,
    parentKey: string = ''
  ): FlattenedTokens {
    const result: FlattenedTokens = {};

    for (const [key, value] of Object.entries(themeTokens)) {
      const sanitizedKey = this.sanitizeTokenKey(key);
      const currentKey = parentKey ? `${parentKey}-${sanitizedKey}` : sanitizedKey;

      if (this.isTokenValue(value)) {
        const resolvedValue = this.resolveSCSSReference(String(value.value), currentKey);
        result[currentKey] = resolvedValue;
        this.themeTokens.set(currentKey, resolvedValue);
      } else if (typeof value === 'object' && value !== null) {
        const nested = this.flattenThemeTokensForSCSS(value, currentKey);
        Object.assign(result, nested);
      }
    }

    return result;
  }

  /** Flatten theme tokens for CSS (preserves var() references) */
  flattenThemeTokensForCSS(
    themeTokens: any,
    parentKey: string = ''
  ): FlattenedTokens {
    const result: FlattenedTokens = {};

    for (const [key, value] of Object.entries(themeTokens)) {
      const sanitizedKey = this.sanitizeTokenKey(key);
      const currentKey = parentKey ? `${parentKey}-${sanitizedKey}` : sanitizedKey;

      if (this.isTokenValue(value)) {
        const resolvedValue = this.resolveCSSReference(String(value.value), currentKey);
        result[currentKey] = resolvedValue;
        this.themeTokens.set(currentKey, resolvedValue);
      } else if (typeof value === 'object' && value !== null) {
        const nested = this.flattenThemeTokensForCSS(value, currentKey);
        Object.assign(result, nested);
      }
    }

    return result;
  }

  /** Flatten primitive tokens to key-value pairs */
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

  /** Generate CSS custom properties */
  generateCSSProperties(tokens: FlattenedTokens): string {
    return Object.entries(tokens)
      .map(([key, value]) => {
        const cssVarName = `${this.cssVarPrefix}${key}`;
        const finalValue = this.addUnitIfNeeded(value, key);
        return `  ${cssVarName}: ${finalValue};`;
      })
      .join('\n');
  }

  /** Add px unit to numeric values when needed */
  private addUnitIfNeeded(value: string, key: string): string {
    if (/^\d+(\.\d+)?$/.test(value)) {
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

  /** Generate SCSS variables */
  generateSCSSVariables(tokens: FlattenedTokens): string {
    return Object.entries(tokens)
      .map(([key, value]) => {
        const scssVarName = `$${this.cssVarPrefix.replace(/^--/, '')}${key}`;
        const finalValue = value.startsWith('$') ? value : this.addUnitIfNeeded(value, key);
        return `${scssVarName}: ${finalValue};`;
      })
      .join('\n');
  }

  /** Generate SCSS map */
  generateSCSSMap(tokens: FlattenedTokens, mapName: string): string {
    const entries = Object.entries(tokens)
      .map(([key, value]) => {
        const finalValue = value.startsWith('$') ? value : this.addUnitIfNeeded(value, key);
        return `  '${key}': ${finalValue}`;
      })
      .join(',\n');

    return `$${mapName}: (\n${entries}\n);`;
  }
}
