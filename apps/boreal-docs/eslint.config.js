import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import storybook from 'eslint-plugin-storybook';
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      js
    },
    extends: [
      "js/recommended",
    ],
    languageOptions: {
      globals: globals.browser,
    },
    ignores: ['!.storybook'],
  },
  tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-vars': 'off',
    },
  },
]);
