import { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './enum';

export type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
export type ButtonTypes = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];
export type ButtonSizes = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
