// @ts-check
import { configs } from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stencil from '@stencil/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';

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
      'coverage/',
      'targets',
      'components-build/',
      'loader',
      'scripts/',
      'eslint.config.ts',
      'stencil.config.ts',
      'src/**/*.d.ts',
      '*.config.ts',
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
    plugins: { jsdoc },
    settings: {
      jsdoc: {
        tagNamePreference: {
          internal: false,
          ignore: false,
          function: 'method',
          template: 'typeParam',
        },
      },
    },
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: [
            'slot',
            'csspart',
            'cssprop',
            'cssproperty',
            'cssState',
            'summary',
            'attr',
            'attribute',
            'fires',
            'event',
            'tag',
            'tagname',
            'default',
            'typeParam',
          ],
        },
      ],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',

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
      'stencil/strict-mutable': 'warn', // Allow mutable props but warn about them
      'stencil/strict-boolean-conditions': 'warn', // Allow non-boolean conditions but warn about them
      'react/jsx-no-bind': 'off', // Allow inline functions in JSX for Stencil components
    },
  },
  {
    // Test files - relaxed rules
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'stencil/strict-boolean-conditions': 'off',
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
