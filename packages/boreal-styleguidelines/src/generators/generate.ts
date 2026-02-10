import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { CSSGenerator } from './css-generator';
import { SCSSGenerator } from './scss-generator';
import { GlobalGenerator } from './global-generator';
import { CSS_VAR_PREFIX, PATHS, THEMES } from '../config/constants';
import type { ThemeName } from '../config/types';

/**
 * Main generation script - orchestrates CSS, SCSS, and Stencil output generation
 */
async function main() {
  try {
    console.log('🚀 Starting Boreal Style Guidelines generation...\n');

    // Load token files
    const primitivesPath = join(process.cwd(), PATHS.tokens.primitives);
    const primitives = JSON.parse(await readFile(primitivesPath, 'utf-8'));

    const usagePath = join(process.cwd(), PATHS.tokens.usage);
    const usage = JSON.parse(await readFile(usagePath, 'utf-8'));

    // Initialize generators
    const generatorOptions = {
      outputDir: PATHS.dist,
      cssVarPrefix: CSS_VAR_PREFIX,
    };

    const cssGenerator = new CSSGenerator(generatorOptions, primitives);
    const scssGenerator = new SCSSGenerator(generatorOptions, primitives);
    const globalGenerator = new GlobalGenerator();

    // Create output directories
    await mkdir(PATHS.dist, { recursive: true });
    await cssGenerator.ensureDirectories();
    await scssGenerator.ensureDirectories();

    // Compile global SCSS files
    console.log('🔨 Compiling global SCSS files...');
    const globalStyles = await globalGenerator.compileGlobalStyles();

    // Generate primitive/global styles
    console.log('📦 Generating global styles...');
    await cssGenerator.generateGlobalCSS(globalStyles);
    await scssGenerator.generateSCSSVariables('primitives', primitives);
    await scssGenerator.generateSCSSMap('primitives', primitives, 'boreal-primitives');
    await scssGenerator.generateStencilPrimitives(primitives);

    // Generate theme-specific styles
    console.log('\n🎨 Generating theme styles...');

    const themeConfigs: {
      name: ThemeName;
      tokens: any;
      usage: any;
    }[] = [];

    // Only generate stencil theme once (all themes have same structure)
    let stencilThemeGenerated = false;

    for (const [key, themeName] of Object.entries(THEMES)) {
      const themePath = join(process.cwd(), PATHS.tokens.themes, `${themeName}.json`);

      try {
        const themeTokens = JSON.parse(await readFile(themePath, 'utf-8'));

        await cssGenerator.generateThemeCSS(themeName, themeTokens, usage);
        await scssGenerator.generateSCSSVariables(`theme-${themeName}`, themeTokens, true, usage, true);
        await scssGenerator.generateSCSSMap(`theme-${themeName}`, themeTokens, `boreal-theme-${themeName}`, true, usage);

        if (!stencilThemeGenerated) {
          await scssGenerator.generateStencilTheme(themeTokens, usage);
          stencilThemeGenerated = true;
        }

        themeConfigs.push({
          name: themeName,
          tokens: themeTokens,
          usage,
        });

        console.log(`  ✓ ${key} theme processed`);
      } catch (error) {
        throw new Error(
            `Failed to process theme "${themeName}" (${key}): ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    console.log('\n📦 Generating complete CSS bundle...');
    await cssGenerator.generateCSSBundle(themeConfigs, globalStyles);

    console.log('\n📝 Generating SCSS index files...');
    const scssVariableFiles = [
      '_primitives.scss',
      ...themeConfigs.map((t) => `_theme-${t.name}.scss`),
    ];
    const scssMapFiles = [
      '_primitives.scss',
      ...themeConfigs.map((t) => `_theme-${t.name}.scss`),
    ];

    await scssGenerator.generateSCSSIndex('variables', scssVariableFiles);
    await scssGenerator.generateSCSSIndex('maps', scssMapFiles);
    await scssGenerator.generateStencilIndex();

    // Generate SCSS global files
    const globalScssFiles = await globalGenerator.generateSCSSGlobalFiles();
    await globalGenerator.generateGlobalSCSSIndex(globalScssFiles);

    // Generate main SCSS index
    await globalGenerator.generateMainSCSSIndex();

    console.log('\n✅ Generation completed successfully!');
    console.log('\n📁 Output files:');
    console.log('  - dist/css/global.css');
    console.log('  - dist/css/boreal.css (complete bundle)');
    themeConfigs.forEach((t) => {
      console.log(`  - dist/css/theme-${t.name}.css`);
    });
    console.log('  - dist/scss/_index.scss (main SCSS entry)');
    console.log('  - dist/scss/variables/_index.scss');
    console.log('  - dist/scss/maps/_index.scss');
    console.log('  - dist/scss/global/_index.scss');
    console.log('  - dist/stencil/_index.scss');
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
