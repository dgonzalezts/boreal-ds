import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { TokenProcessor } from "./token-processor";
import type { GeneratorOptions } from "../config/types";

/**
 * SCSS Generator
 * Generates SCSS variables, maps, and stencil files from design tokens
 */
export class SCSSGenerator {
  private processor: TokenProcessor;

  constructor(
    private readonly options: GeneratorOptions,
    private readonly primitiveTokens: any,
  ) {
    this.processor = new TokenProcessor(primitiveTokens, options.cssVarPrefix);
  }

  /** Create output directories */
  async ensureDirectories(): Promise<void> {
    await mkdir(join(this.options.outputDir, "scss", "variables"), {
      recursive: true,
    });
    await mkdir(join(this.options.outputDir, "scss", "maps"), {
      recursive: true,
    });
    await mkdir(join(this.options.outputDir, "stencil"), {
      recursive: true,
    });
  }

  /** Generate SCSS variables file */
  async generateSCSSVariables(
    name: string,
    tokens: any,
    isTheme: boolean = false,
    usageTokens?: any,
    clearThemeCache: boolean = false,
  ): Promise<void> {
    if (clearThemeCache) {
      this.processor.clearThemeTokens();
    }

    let flattened: any;

    if (isTheme && usageTokens) {
      const themeFlattened = this.processor.flattenThemeTokensForSCSS(tokens);
      const usageFlattened =
        this.processor.flattenThemeTokensForSCSS(usageTokens);
      flattened = { ...themeFlattened, ...usageFlattened };
    } else if (isTheme) {
      flattened = this.processor.flattenThemeTokensForSCSS(tokens);
    } else {
      flattened = this.processor.flattenPrimitiveTokens(tokens);
    }

    const scssVariables = this.processor.generateSCSSVariables(flattened);
    await this.writeFile(
      join(this.options.outputDir, "scss", "variables", `_${name}.scss`),
      scssVariables,
    );
    console.log(`✓ Generated scss/variables/_${name}.scss`);
  }

  /** Generate SCSS map file */
  async generateSCSSMap(
    name: string,
    tokens: any,
    mapName: string,
    isTheme: boolean = false,
    usageTokens?: any,
  ): Promise<void> {
    let flattened: any;

    if (isTheme && usageTokens) {
      const themeFlattened = this.processor.flattenThemeTokensForSCSS(tokens);
      const usageFlattened =
        this.processor.flattenThemeTokensForSCSS(usageTokens);
      flattened = { ...themeFlattened, ...usageFlattened };
    } else if (isTheme) {
      flattened = this.processor.flattenThemeTokensForSCSS(tokens);
    } else {
      flattened = this.processor.flattenPrimitiveTokens(tokens);
    }

    const scssMap = this.processor.generateSCSSMap(flattened, mapName);
    await this.writeFile(
      join(this.options.outputDir, "scss", "maps", `_${name}.scss`),
      scssMap,
    );
    console.log(`✓ Generated scss/maps/_${name}.scss`);
  }

  /** Generate SCSS index file */
  async generateSCSSIndex(
    dir: "variables" | "maps",
    files: string[],
  ): Promise<void> {
    const imports = files
      .map((file) => `@forward '${file.replace(".scss", "")}';`)
      .join("\n");
    await this.writeFile(
      join(this.options.outputDir, "scss", dir, "_index.scss"),
      imports,
    );
    console.log(`✓ Generated scss/${dir}/_index.scss`);
  }

  /** Generate stencil primitives (SCSS vars that reference CSS vars) */
  async generateStencilPrimitives(tokens: any): Promise<void> {
    const flattened = this.processor.flattenPrimitiveTokens(tokens);
    const stencilVariables = this.generateStencilVariables(flattened);
    await this.writeFile(
      join(this.options.outputDir, "stencil", "_primitives.scss"),
      stencilVariables,
    );
    console.log("✓ Generated stencil/_primitives.scss");
  }

  /** Generate stencil theme (SCSS vars that reference CSS vars) */
  async generateStencilTheme(
    themeTokens: any,
    usageTokens?: any,
  ): Promise<void> {
    this.processor.clearThemeTokens();

    const flattenedTheme =
      this.processor.flattenThemeTokensForSCSS(themeTokens);
    const flattenedUsage = usageTokens
      ? this.processor.flattenThemeTokensForSCSS(usageTokens)
      : {};
    const allTokens = { ...flattenedTheme, ...flattenedUsage };

    const stencilVariables = this.generateStencilVariables(allTokens);
    await this.writeFile(
      join(this.options.outputDir, "stencil", "_theme.scss"),
      stencilVariables,
    );
    console.log("✓ Generated stencil/_theme.scss");
  }

  /** Generate stencil index file */
  async generateStencilIndex(): Promise<void> {
    const imports = ["@forward 'primitives';", "@forward 'theme';"].join("\n");
    await this.writeFile(
      join(this.options.outputDir, "stencil", "_index.scss"),
      imports,
    );
    console.log("✓ Generated stencil/_index.scss");
  }

  /** Generate SCSS variables that reference CSS custom properties */
  private generateStencilVariables(tokens: Record<string, string>): string {
    return Object.keys(tokens)
      .map((key) => {
        const scssVarName = `$${this.options.cssVarPrefix.replace(/^--/, "")}${key}`;
        const cssVarName = `${this.options.cssVarPrefix}${key}`;
        return `${scssVarName}: var(${cssVarName});`;
      })
      .join("\n");
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    await writeFile(filePath, content, "utf-8");
  }
}
