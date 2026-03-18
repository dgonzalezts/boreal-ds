import { TEXT_FIELD_TYPES, TEXT_FIELD_VARIANTS } from './enum';

export type TextFieldType = (typeof TEXT_FIELD_TYPES)[keyof typeof TEXT_FIELD_TYPES];
export type TextFieldVariant = (typeof TEXT_FIELD_VARIANTS)[keyof typeof TEXT_FIELD_VARIANTS];
