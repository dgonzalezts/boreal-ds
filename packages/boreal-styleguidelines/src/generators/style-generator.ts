import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { TokenProcessor } from './token-processor';
import type { GeneratorOptions, ThemeName } from '../config/types';

/**
 * Style Generator
 * Generates CSS and SCSS files from design tokens
 */
export class StyleGenerator {
  private processor: TokenProcessor;

  constructor(
    private readonly options: GeneratorOptions,
    private readonly primitiveTokens: any
  ) {
    this.processor = new TokenProcessor(
      primitiveTokens,
      options.cssVarPrefix
    );
  }

  /**
   * Ensure output directories exist
   */
  async ensureDirectories(): Promise<void> {
    await mkdir(this.options.outputDir, { recursive: true });
    await mkdir(join(this.options.outputDir, 'css'), { recursive: true });
    await mkdir(join(this.options.outputDir, 'scss', 'variables'), {
      recursive: true,
    });
    await mkdir(join(this.options.outputDir, 'scss', 'maps'), {
      recursive: true,
    });
  }

  /**
   * Generate global CSS file with primitive tokens
   */
  async generateGlobalCSS(): Promise<void> {
    const flattenedPrimitives =
      this.processor.flattenPrimitiveTokens(this.primitiveTokens);
    const cssProperties =
      this.processor.generateCSSProperties(flattenedPrimitives);

    const css = `:root {\n${cssProperties}\n}`;

    await this.writeFile(
      join(this.options.outputDir, 'css', 'global.css'),
      css
    );

    console.log('✓ Generated global.css');
  }

  /**
   * Generate theme CSS file with data-theme selector
   */
  async generateThemeCSS(
    themeName: ThemeName,
    themeTokens: any,
    usageTokens?: any
  ): Promise<void> {
    // First process theme-specific tokens
    const flattenedTheme = this.processor.flattenThemeTokens(themeTokens);

    // Then process usage tokens if provided
    const flattenedUsage = usageTokens
      ? this.processor.flattenThemeTokens(usageTokens)
      : {};

    // Combine both
    const allTokens = { ...flattenedTheme, ...flattenedUsage };

    const cssProperties = this.processor.generateCSSProperties(allTokens);

    const css = `[data-theme="${themeName}"] {\n${cssProperties}\n}`;

    await this.writeFile(
      join(this.options.outputDir, 'css', `theme-${themeName}.css`),
      css
    );

    console.log(`✓ Generated theme-${themeName}.css`);
  }

  /**
   * Generate SCSS variables file
   */
  async generateSCSSVariables(
    name: string,
    tokens: any,
    isTheme: boolean = false
  ): Promise<void> {
    const flattened = isTheme
      ? this.processor.flattenThemeTokens(tokens)
      : this.processor.flattenPrimitiveTokens(tokens);

    const scssVariables = this.processor.generateSCSSVariables(flattened);

    await this.writeFile(
      join(this.options.outputDir, 'scss', 'variables', `_${name}.scss`),
      scssVariables
    );

    console.log(`✓ Generated scss/variables/_${name}.scss`);
  }

  /**
   * Generate SCSS map file
   */
  async generateSCSSMap(
    name: string,
    tokens: any,
    mapName: string,
    isTheme: boolean = false
  ): Promise<void> {
    const flattened = isTheme
      ? this.processor.flattenThemeTokens(tokens)
      : this.processor.flattenPrimitiveTokens(tokens);

    const scssMap = this.processor.generateSCSSMap(flattened, mapName);

    await this.writeFile(
      join(this.options.outputDir, 'scss', 'maps', `_${name}.scss`),
      scssMap
    );

    console.log(`✓ Generated scss/maps/_${name}.scss`);
  }

  /**
   * Generate index file for SCSS modules
   */
  async generateSCSSIndex(
    dir: 'variables' | 'maps',
    files: string[]
  ): Promise<void> {
    const imports = files
      .map((file) => `@forward '${file.replace('.scss', '')}';`)
      .join('\n');

    await this.writeFile(
      join(this.options.outputDir, 'scss', dir, '_index.scss'),
      imports
    );

    console.log(`✓ Generated scss/${dir}/_index.scss`);
  }

  /**
   * Generate complete CSS bundle with all themes
   */
  async generateCSSBundle(
    themes: { name: ThemeName; tokens: any; usage?: any }[]
  ): Promise<void> {
    const primitives =
      this.processor.flattenPrimitiveTokens(this.primitiveTokens);
    const globalCSS = `:root {\n${this.processor.generateCSSProperties(primitives)}\n}`;

    const themesCSS = themes
      .map(({ name, tokens, usage }) => {
        const flattenedTheme = this.processor.flattenThemeTokens(tokens);
        const flattenedUsage = usage
          ? this.processor.flattenThemeTokens(usage)
          : {};
        const allTokens = { ...flattenedTheme, ...flattenedUsage };
        return `[data-theme="${name}"] {\n${this.processor.generateCSSProperties(allTokens)}\n}`;
      })
      .join('\n\n');

    const bundleCSS = `${globalCSS}\n\n${themesCSS}`;

    await this.writeFile(
      join(this.options.outputDir, 'css', 'boreal.css'),
      bundleCSS
    );

    console.log('✓ Generated boreal.css (complete bundle)');
  }

  /**
   * Write file to disk
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    await writeFile(filePath, content, 'utf-8');
  }
}
