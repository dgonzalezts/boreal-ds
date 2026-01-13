import { readFile } from 'fs/promises';
import { join } from 'path';
import { PATHS } from '../config/constants';

/**
 * Validation script to ensure generated tokens are valid
 */

interface ValidationError {
  file: string;
  line: number;
  error: string;
  value: string;
}

const CSS_VAR_PATTERN = /--[a-z0-9-]+/g;
const SCSS_VAR_PATTERN = /\$[a-z0-9-]+/g;
const INVALID_CHARS_PATTERN = /[^a-z0-9-]/;

async function validateCSSFile(filePath: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for CSS custom properties
    const cssVarMatch = line.match(/^\s*(--[^\s:]+):/);
    if (cssVarMatch) {
      const varName = cssVarMatch[1];

      // Check for invalid characters (spaces, parentheses, etc.)
      if (varName.match(/[\s()]/)) {
        errors.push({
          file: filePath,
          line: index + 1,
          error: 'CSS variable contains invalid characters (spaces or parentheses)',
          value: varName,
        });
      }

      // Check if it matches the expected pattern
      if (!varName.match(/^--[a-z0-9-]+$/)) {
        errors.push({
          file: filePath,
          line: index + 1,
          error: 'CSS variable name format is invalid',
          value: varName,
        });
      }
    }
  });

  return errors;
}

async function validateSCSSFile(filePath: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for SCSS variables
    const scssVarMatch = line.match(/^(\$[^\s:]+):/);
    if (scssVarMatch) {
      const varName = scssVarMatch[1];

      // Check for invalid characters (spaces, parentheses, etc.)
      if (varName.match(/[\s()]/)) {
        errors.push({
          file: filePath,
          line: index + 1,
          error: 'SCSS variable contains invalid characters (spaces or parentheses)',
          value: varName,
        });
      }

      // Check if it matches the expected pattern
      if (!varName.match(/^\$[a-z0-9-]+$/)) {
        errors.push({
          file: filePath,
          line: index + 1,
          error: 'SCSS variable name format is invalid',
          value: varName,
        });
      }
    }
  });

  return errors;
}

async function main() {
  console.log('🔍 Validating generated tokens...\n');

  const allErrors: ValidationError[] = [];

  // Validate CSS files
  const cssFiles = [
    'css/global.css',
    'css/boreal.css',
    'css/theme-proximus.css',
    'css/theme-masiv.css',
    'css/theme-telesign.css',
    'css/theme-bics.css',
  ];

  for (const file of cssFiles) {
    const filePath = join(process.cwd(), PATHS.dist, file);
    try {
      const errors = await validateCSSFile(filePath);
      allErrors.push(...errors);

      if (errors.length === 0) {
        console.log(`✓ ${file} - Valid`);
      } else {
        console.log(`✗ ${file} - ${errors.length} errors found`);
      }
    } catch (error) {
      console.warn(`⚠ Could not validate ${file}`);
    }
  }

  // Validate SCSS files
  const scssFiles = [
    'scss/variables/_primitives.scss',
    'scss/variables/_theme-proximus.scss',
    'scss/variables/_theme-masiv.scss',
    'scss/variables/_theme-telesign.scss',
    'scss/variables/_theme-bics.scss',
  ];

  for (const file of scssFiles) {
    const filePath = join(process.cwd(), PATHS.dist, file);
    try {
      const errors = await validateSCSSFile(filePath);
      allErrors.push(...errors);

      if (errors.length === 0) {
        console.log(`✓ ${file} - Valid`);
      } else {
        console.log(`✗ ${file} - ${errors.length} errors found`);
      }
    } catch (error) {
      console.warn(`⚠ Could not validate ${file}`);
    }
  }

  // Print errors
  if (allErrors.length > 0) {
    console.log('\n❌ Validation failed with the following errors:\n');
    allErrors.forEach((error) => {
      console.log(
        `${error.file}:${error.line} - ${error.error}\n  Found: "${error.value}"\n`
      );
    });
    process.exit(1);
  }

  console.log('\n✅ All tokens are valid!');
}

main();
