import { readFile } from 'fs/promises';
import { join } from 'path';
import { StyleGenerator } from './style-generator';
import { CSS_VAR_PREFIX, PATHS, THEMES } from '../config/constants';
import type { ThemeName } from '../config/types';

/**
 * Main generation script
 */
async function main() {
  try {
    console.log('🚀 Starting Boreal Style Guidelines generation...\n');

    // Load primitive tokens
    const primitivesPath = join(process.cwd(), PATHS.tokens.primitives);
    const primitives = JSON.parse(await readFile(primitivesPath, 'utf-8'));

    // Load usage tokens (colors-themes)
    const usagePath = join(process.cwd(), PATHS.tokens.usage);
    const usage = JSON.parse(await readFile(usagePath, 'utf-8'));

    // Initialize generator
    const generator = new StyleGenerator(
      {
        outputDir: PATHS.dist,
        cssVarPrefix: CSS_VAR_PREFIX,
      },
      primitives
    );

    // Ensure directories exist
    await generator.ensureDirectories();

    console.log('📦 Generating global styles...');
    await generator.generateGlobalCSS();
    await generator.generateSCSSVariables('primitives', primitives);
    await generator.generateSCSSMap('primitives', primitives, 'boreal-primitives');

    console.log('\n🎨 Generating theme styles...');

    const themeConfigs: {
      name: ThemeName;
      tokens: any;
      usage: any;
    }[] = [];

    // Process each theme
    for (const [key, themeName] of Object.entries(THEMES)) {
      const themePath = join(
        process.cwd(),
        PATHS.tokens.themes,
        `${themeName}.json`
      );

      try {
        const themeTokens = JSON.parse(await readFile(themePath, 'utf-8'));

        // Generate theme CSS with data-theme selector
        // Pass theme tokens and usage tokens separately to resolve references properly
        await generator.generateThemeCSS(themeName, themeTokens, usage);

        // Generate SCSS files for the theme
        // Pass theme tokens and usage tokens separately to resolve references properly
        // Clear theme cache before processing each theme
        await generator.generateSCSSVariables(
          `theme-${themeName}`,
          themeTokens,
          true,
          usage,
          true // clearThemeCache
        );
        await generator.generateSCSSMap(
          `theme-${themeName}`,
          themeTokens,
          `boreal-theme-${themeName}`,
          true,
          usage
        );

        themeConfigs.push({
          name: themeName,
          tokens: themeTokens,
          usage,
        });

        console.log(`  ✓ ${key} theme processed`);
      } catch (error) {
        console.warn(`  ⚠ Could not load theme: ${themeName}`);
      }
    }

    console.log('\n📦 Generating complete CSS bundle...');
    await generator.generateCSSBundle(themeConfigs);

    console.log('\n📝 Generating SCSS index files...');
    const scssVariableFiles = [
      '_primitives.scss',
      ...themeConfigs.map((t) => `_theme-${t.name}.scss`),
    ];
    const scssMapFiles = [
      '_primitives.scss',
      ...themeConfigs.map((t) => `_theme-${t.name}.scss`),
    ];

    await generator.generateSCSSIndex('variables', scssVariableFiles);
    await generator.generateSCSSIndex('maps', scssMapFiles);

    console.log('\n✅ Generation completed successfully!');
    console.log('\n📁 Output files:');
    console.log('  - dist/css/global.css');
    console.log('  - dist/css/boreal.css (complete bundle)');
    themeConfigs.forEach((t) => {
      console.log(`  - dist/css/theme-${t.name}.css`);
    });
    console.log('  - dist/scss/variables/_index.scss');
    console.log('  - dist/scss/maps/_index.scss');
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
