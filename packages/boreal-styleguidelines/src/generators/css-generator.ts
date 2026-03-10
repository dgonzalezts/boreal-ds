import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { TokenProcessor } from './token-processor';
import type { GeneratorOptions, ThemeName } from '../config/types';

/**
 * CSS Generator
 * Generates CSS custom properties from design tokens
 */
export class CSSGenerator {
  private processor: TokenProcessor;

  constructor(
    private readonly options: GeneratorOptions,
    private readonly primitiveTokens: any
  ) {
    this.processor = new TokenProcessor(primitiveTokens, options.cssVarPrefix);
  }

  /** Create output directories */
  async ensureDirectories(): Promise<void> {
    await mkdir(join(this.options.outputDir, 'css'), { recursive: true });
  }

  /** Generate global CSS with primitives */
  async generateGlobalCSS(additionalStyles?: string): Promise<void> {
    const flattenedPrimitives = this.processor.flattenPrimitiveTokens(this.primitiveTokens);
    const cssProperties = this.processor.generateCSSProperties(flattenedPrimitives);
    const rootBlock = `:root {\n${cssProperties}\n}`;

    let css = rootBlock;
    if (additionalStyles) {
      const { imports, rest } = this.splitImports(additionalStyles);
      css = [imports, rootBlock, rest].filter(Boolean).join('\n\n');
    }

    await this.writeFile(join(this.options.outputDir, 'css', 'global.css'), css);
    console.log('✓ Generated global.css');
  }

  /** Generate theme CSS with data-theme selector */
  async generateThemeCSS(
    themeName: ThemeName,
    themeTokens: any,
    usageTokens?: any
  ): Promise<void> {
    this.processor.clearThemeTokens();

    const flattenedTheme = this.processor.flattenThemeTokensForCSS(themeTokens);
    const flattenedUsage = usageTokens ? this.processor.flattenThemeTokensForCSS(usageTokens) : {};
    const allTokens = { ...flattenedTheme, ...flattenedUsage };
    const cssProperties = this.processor.generateCSSProperties(allTokens);
    const css = `[data-theme="${themeName}"] {\n${cssProperties}\n}`;

    await this.writeFile(join(this.options.outputDir, 'css', `theme-${themeName}.css`), css);
    console.log(`✓ Generated theme-${themeName}.css`);
  }

  /** Generate complete CSS bundle with all themes */
  async generateCSSBundle(themes: { name: ThemeName; tokens: any; usage?: any }[], additionalStyles?: string): Promise<void> {
    const primitives = this.processor.flattenPrimitiveTokens(this.primitiveTokens);
    const rootBlock = `:root {\n${this.processor.generateCSSProperties(primitives)}\n}`;

    // Split @import from other global styles so imports go first
    let imports = '';
    let globalUtilityStyles = '';
    if (additionalStyles) {
      const split = this.splitImports(additionalStyles);
      imports = split.imports;
      globalUtilityStyles = split.rest;
    }

    const themesCSS = themes
      .map(({ name, tokens, usage }) => {
        this.processor.clearThemeTokens();
        const flattenedTheme = this.processor.flattenThemeTokensForCSS(tokens);
        const flattenedUsage = usage ? this.processor.flattenThemeTokensForCSS(usage) : {};
        const allTokens = { ...flattenedTheme, ...flattenedUsage };
        return `[data-theme="${name}"] {\n${this.processor.generateCSSProperties(allTokens)}\n}`;
      })
      .join('\n\n');

    // Order: @imports → :root → [data-theme] → global utility styles
    const bundleCSS = [imports, rootBlock, themesCSS, globalUtilityStyles]
      .filter(Boolean)
      .join('\n\n');
    await this.writeFile(join(this.options.outputDir, 'css', 'boreal.css'), bundleCSS);
    console.log('✓ Generated boreal.css (complete bundle)');
  }

  /** Split @import statements from other CSS to ensure correct ordering */
  private splitImports(css: string): { imports: string; rest: string } {
    const lines = css.split('\n');
    const importLines: string[] = [];
    const otherLines: string[] = [];

    for (const line of lines) {
      if (line.trimStart().startsWith('@import ')) {
        importLines.push(line);
      } else {
        otherLines.push(line);
      }
    }

    return {
      imports: importLines.join('\n'),
      rest: otherLines.join('\n').trim(),
    };
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    await writeFile(filePath, content, 'utf-8');
  }
}
