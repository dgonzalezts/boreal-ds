import { html } from 'lit/static-html.js';
import { createElement } from 'react';
import type { Preview, WebComponentsRenderer } from '@storybook/web-components-vite';
import type { DecoratorFunction, StoryContext } from 'storybook/internal/types';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { toKebabCase } from '@/utils/formatters';
import type { StylesOptions, DocsContainerPropsWithStore } from './types/config';

import '@/styles/tokens-fallback.css';
import 'highlight.js/styles/atom-one-dark.css';

const DATA_THEME_ATTRIBUTE = 'data-theme';
const BODY_SELECTOR = 'body.sb-show-main';
const DEFAULT_THEME = 'telesign';

hljs.registerLanguage('javascript', javascript);

/**
 * Generates a CSS style string from the provided style options.
 *
 * @param options - Optional configuration object containing style properties
 * @param options.__sb - Object containing style key-value pairs where keys are in camelCase
 *
 * @returns A string of CSS styles in kebab-case format, with each style separated by a space.
 *          Returns an empty string if no styles are provided or if __sb is undefined.
 *
 * @example
 * ```typescript
 * getStyles({ __sb: { backgroundColor: 'red', fontSize: '16px' } })
 * // returns: "background-color: red; font-size: 16px;"
 * ```
 */
const getStyles = (options?: StylesOptions): string => {
  const styles = options?.__sb;
  if (!styles) return '';

  return Object.entries(styles)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
    .join(' ');
};

/**
 * Decorator function for Storybook that applies a theme to the story.
 * This function retrieves the theme from the globals context and sets it as a data attribute on the body element.
 *
 * @param story - The story function to be decorated
 * @param context - The context object containing globals information, including the theme
 * @returns The result of the story function execution
 *
 * @example
 */
export const withThemeProvider: DecoratorFunction<WebComponentsRenderer> = (
  story,
  context: StoryContext<WebComponentsRenderer>
) => {
  const {
    globals: { theme },
  } = context;
  const body = document.querySelector(BODY_SELECTOR);
  if (!(body instanceof HTMLElement)) return story();

  body.setAttribute(DATA_THEME_ATTRIBUTE, theme || DEFAULT_THEME);
  return story();
};

/**
 * A decorator function that applies custom styling to a Storybook story.
 *
 * This decorator wraps the story output in a div with styles determined by the
 * context parameters provided by Storybook. It uses the `getStyles` function to
 * convert parameters into CSS style attributes.
 *
 * @param story - The story function to be decorated
 * @param context - The Storybook context object containing parameters
 * @returns An HTML template result with custom styling applied
 */
export const withCustomStyling: DecoratorFunction<WebComponentsRenderer> = (
  story,
  context: StoryContext<WebComponentsRenderer>
) => {
  return html` <div style=${getStyles(context.parameters)}>${story()}</div> `;
};

const preview: Preview = {
  parameters: {
    controls: { expanded: true, hideNoControlsWarning: true },
    options: {
      storySort: {
        //TODO: add custom story order based on design system structure
        order: [],
      },
    },
    docs: {
      container: (props: DocsContainerPropsWithStore) => {
        const { theme } = props.context.store.userGlobals.globals;
        const body = document.querySelector(BODY_SELECTOR);

        if (!(body instanceof HTMLElement)) {
          return createElement(DocsContainer, props as never);
        }

        const themeValue = theme ? theme.toLowerCase() : DEFAULT_THEME;
        body.setAttribute(DATA_THEME_ATTRIBUTE, themeValue);

        return createElement(DocsContainer, props as never);
      },
    },
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#333' },
        light: { name: 'Light', value: '#fff' },
        figma: { name: 'Figma', value: '#e5e5e5' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'figma' },
  },
  decorators: [withThemeProvider, withCustomStyling],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme for Boreal components',
      defaultValue: 'telesign',
      toolbar: {
        icon: 'globe',
        //TODO: add other themes when available
        items: [{ value: 'telesign', title: 'Theme: Telesign' }],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
