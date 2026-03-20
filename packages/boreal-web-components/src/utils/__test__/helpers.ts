import { AnyHTMLElement } from '@stencil/core/internal';

/**
 * Returns inner element of hydrated component
 */
export const getInner = (root: AnyHTMLElement | undefined) => root?.firstElementChild as HTMLElement;

/**
 * Verify if exist an element and throw an error if it doesn't exist.
 *
 * @param condition The element or condition to evaluate.
 * @param message Custom error message.
 * @throws {Error} If the condition is false, null, or undefined.
 */
export function assertExists<T>(condition: T | null | undefined, message: string): asserts condition is T {
  if (condition === null || condition === undefined) {
    throw new Error(message);
  }
}
