import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { StylesOptions } from '@root/.storybook/types/config';

/**
 * Generic wrapper to add StylesOptions parameters to any type
 * @template T - The base type to extend
 * @template Required - Whether parameters is required (default: true)
 */
type WithStylesParams<T, Required extends boolean = true> = Required extends true
  ? T & { parameters: StylesOptions }
  : T & { parameters?: StylesOptions | undefined };

/**
 * Generic type for Boreal component stories meta configuration
 * @template T - The type of the story arguments
 */
export type BorealStoryMeta<T> = WithStylesParams<Meta<T>>;

/**
 * Generic type for Boreal component stories
 * @template T - The type of the story arguments
 */
export type BorealStory<T> = WithStylesParams<StoryObj<T>, false>;
