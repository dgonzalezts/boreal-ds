import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import storybook from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  {
    ignores: [
      'eslint.config.js',
      'vitest.config.ts',
      'plopfile.js',
      'storybook-static/**',
      'dist/**',
      '**/*.d.ts',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowWithName: 'Args$',
        },
      ],
    },
  },
  prettierConfig,
]);
