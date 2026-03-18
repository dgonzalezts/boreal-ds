import { TEXT_FIELD_TYPES, TEXT_FIELD_VARIANTS, TEXT_FIELD_VALIDATION_TIMING } from './enum';

export type TextFieldType = (typeof TEXT_FIELD_TYPES)[keyof typeof TEXT_FIELD_TYPES];
export type TextFieldVariant = (typeof TEXT_FIELD_VARIANTS)[keyof typeof TEXT_FIELD_VARIANTS];
export type TextFieldValidationTiming =
  (typeof TEXT_FIELD_VALIDATION_TIMING)[keyof typeof TEXT_FIELD_VALIDATION_TIMING];
