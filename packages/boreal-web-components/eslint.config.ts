// @ts-check
import { configs } from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stencil from '@stencil/eslint-plugin';

export default defineConfig(
  configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  stencil.configs.flat.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
  },
  {
    ignores: [
      'dist/',
      'www/',
      'targets',
      'components-build/',
      'loader',
      'eslint.config.ts',
      'stencil.config.ts',
      'src/**/*.d.ts',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // Stencil-specific rules
      'stencil/async-methods': 'error',
      'stencil/ban-prefix': ['error', ['stencil', 'stnl', 'st']],
      'stencil/decorators-context': 'error',
      'stencil/decorators-style': [
        'error',
        {
          prop: 'inline',
          state: 'inline',
          element: 'inline',
          event: 'inline',
          method: 'multiline',
          watch: 'multiline',
          listen: 'multiline',
        },
      ],
      'stencil/element-type': 'error',
      'stencil/host-data-deprecated': 'error',
      'stencil/methods-must-be-public': 'error',
      'stencil/no-unused-watch': 'error',
      'stencil/own-methods-must-be-private': 'error',
      'stencil/own-props-must-be-private': 'error',
      'stencil/prefer-vdom-listener': 'error',
      'stencil/props-must-be-public': 'error',
      'stencil/props-must-be-readonly': 'error',
      'stencil/render-returns-host': 'error',
      'stencil/required-jsdoc': 'error',
      'stencil/reserved-member-names': 'error',
      'stencil/single-export': 'error',
      'stencil/strict-mutable': 'error',
    },
  },
  {
    // Test files - relaxed rules
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Type definition files
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
