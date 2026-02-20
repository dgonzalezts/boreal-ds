/**
 * Type definitions for Boreal Design System
 */

export type ThemeName = 'proximus' | 'masiv' | 'telesign' | 'bics';

export interface TokenValue {
  value: string | number;
  type: string;
  description?: string;
}

export interface TokenObject {
  [key: string]: TokenValue | TokenObject;
}

export interface PrimitiveTokens {
  color: {
    telesign: TokenObject;
    masiv: TokenObject;
    bics: TokenObject;
    proximus: TokenObject;
    white: TokenValue;
  };
  spacing: TokenObject;
  layout: TokenObject;
  icons: TokenObject;
  radius: TokenObject;
}

export interface ThemeTokens {
  [key: string]: TokenValue | TokenObject;
}

export interface GeneratorOptions {
  outputDir: string;
  cssVarPrefix: string;
  minify?: boolean;
  sourceMap?: boolean;
}

export interface FlattenedTokens {
  [key: string]: string;
}
