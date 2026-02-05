import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { ArgTypes } from '@storybook/web-components-vite';

/**
 * Creates an argTypes configuration with disabled controls
 * @param baseArgTypes - The base argTypes object from the story meta.
 * @param keys - List of control keys to disable.
 * @returns An argTypes configuration object with specified controls disabled.
 */
export function disableControls<TArgs, T extends keyof TArgs & string = keyof TArgs & string>(
  baseArgTypes: Partial<ArgTypes<TArgs>>,
  ...keys: T[]
): Partial<ArgTypes<TArgs>> {
  const newArgTypes = keys.reduce(
    (acc, key) => {
      acc[key] = {
        ...baseArgTypes[key],
        control: { disable: true },
      };
      return acc;
    },
    {} as Partial<ArgTypes<TArgs>>
  );

  return { ...baseArgTypes, ...newArgTypes };
}

/**
 * Hides controls from both the controls panel and the props table
 * @param baseArgTypes - The base argTypes object from the story meta
 * @param keys - List of control keys to hide from table and controls
 * @returns An argTypes configuration object with specified controls hidden
 */
export function hideFromTable<TArgs, T extends keyof TArgs & string = keyof TArgs & string>(
  baseArgTypes: Partial<ArgTypes<TArgs>>,
  ...keys: T[]
): Partial<ArgTypes<TArgs>> {
  const hiddenArgTypes = keys.reduce(
    (acc, key) => {
      acc[key] = {
        ...baseArgTypes[key],
        control: false,
        table: {
          disable: true,
        },
      };
      return acc;
    },
    {} as Partial<ArgTypes<TArgs>>
  );

  return { ...baseArgTypes, ...hiddenArgTypes };
}

/**
 * Returns a list of disabled controls by subtracting the enabled ones from the full list.
 * @param allControls - The full list of controls.
 * @param enabledControls - The list of controls that should remain enabled.
 * @returns An array of control names to disable.
 */
export function getDisabledControls<T extends string>(allControls: T[], enabledControls: T[]): T[] {
  return allControls.filter(control => !enabledControls.includes(control));
}

export interface StoryWrapperConfig {
  containerClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  showContainer?: boolean;
}

/**
 * Wraps content with customizable story presentation elements
 * @param title - The title to display
 * @param content - The content to wrap
 * @param config - Configuration for wrapper classes and structure
 * @returns A TemplateResult with the wrapped content
 */
export function wrapStoryContent(
  title: string,
  content: (() => TemplateResult) | TemplateResult,
  config: StoryWrapperConfig & { description?: string } = {}
): TemplateResult {
  const {
    containerClass = 'story-section',
    titleClass = 'story-title',
    descriptionClass = 'story-description',
    showContainer = true,
    description,
  } = config;

  const renderedContent = typeof content === 'function' ? content() : content;

  if (!showContainer) {
    return html`
      <div class="${titleClass}">${title}</div>
      ${description ? html`<div class="${descriptionClass}">${unsafeHTML(description)}</div>` : ''}
      ${renderedContent}
    `;
  }

  return html`
    <div class="${containerClass}">
      <div class="${titleClass}">${title}</div>
      ${description ? html`<div class="${descriptionClass}">${unsafeHTML(description)}</div>` : ''}
      ${renderedContent}
    </div>
  `;
}

/**
 * Creates multiple story sections with consistent configuration
 * @param configs - Array of story configurations
 * @param globalConfig - Global wrapper configuration applied to all stories
 * @returns A TemplateResult containing all wrapped sections
 */
export function createStoryCollection(
  configs: Array<{
    title: string;
    content: (() => TemplateResult) | TemplateResult;
    description?: string;
    info?: string;
  }>,
  globalConfig: StoryWrapperConfig = {}
): TemplateResult {
  return html`${configs.map(config => {
    const description = [config.description, config.info].filter(Boolean).join(' - ');
    return wrapStoryContent(config.title, config.content, {
      ...globalConfig,
      description,
    });
  })}`;
}
