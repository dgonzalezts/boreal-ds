// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stencil from '@stencil/eslint-plugin';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  stencil.configs.flat.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Stencil-specific rules
      '@stencil/async-methods': 'error',
      '@stencil/decorators-context': 'error',
      '@stencil/element-type': 'error',
      '@stencil/no-unused-watch': 'error',
      '@stencil/methods-must-be-public': 'error',
      '@stencil/props-must-be-readonly': 'error',
      '@stencil/required-jsdoc': 'error',
      '@stencil/strict-mutable': 'error',
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
];