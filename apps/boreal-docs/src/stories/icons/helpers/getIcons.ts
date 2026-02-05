import type { Icon } from '../types/Icon.type';
import Icons from './icons.json';

/**
 * Retrieves the icon data source.
 *
 * This function currently mocks an asynchronous fetch call
 * and resolves with the local `Icons` dataset.
 * It is designed to be easily replaceable by a real API call
 * in the future without changing the consumer logic.
 *
 * @returns A promise that resolves with the icons dataset
 *
 * @example
 * ```ts
 * const icons = await getData();
 * // returns Icons from resource
 * ```
 */
const getData = async (): Promise<Icon[]> => {
  try {
    // Mocking the fetch call
    return new Promise(res => {
      res(Icons);
    });
  } catch (e) {
    console.log('Error getting icons:', e);
    return [];
  }
};

/**
 * Creates and returns the icon data used by Storybook.
 *
 * This function acts as a public abstraction layer over the data source,
 * allowing Storybook stories and helpers to consume icon data without
 * depending directly on the data retrieval implementation.
 *
 * In case of an error, it logs the issue and returns an empty array
 * to prevent Storybook from breaking.
 *
 * @returns A promise that resolves with the icon data array
 *
 * @example
 * ```ts
 * const icons = await createIconData();
 * // returns an array of icon metadata
 * ```
 */
export const createIconData = async (): Promise<Icon[]> => {
  try {
    // Here will be placed the real logic to transform the data to JSON
    return getData();
  } catch (error) {
    console.error('Error creating icon data:', error);
    return [];
  }
};
