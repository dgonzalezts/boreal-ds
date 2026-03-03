import { AnyHTMLElement } from '@stencil/core/internal';

/**
 * Returns inner element of hydrated component
 */
export const getInner = (root: AnyHTMLElement | undefined) => root?.firstElementChild as HTMLElement;
