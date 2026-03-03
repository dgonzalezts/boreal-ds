import type { TAG_ELEMENT, VARIANT_TYPOGRAPHY } from './enum';

export type TagElement = (typeof TAG_ELEMENT)[keyof typeof TAG_ELEMENT];
export type Variant = (typeof VARIANT_TYPOGRAPHY)[keyof typeof VARIANT_TYPOGRAPHY];
