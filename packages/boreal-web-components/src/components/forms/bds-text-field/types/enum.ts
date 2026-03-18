export const TEXT_FIELD_TYPES = {
  TEXT: 'text',
  PASSWORD: 'password',
} as const;

export const TEXT_FIELD_VARIANTS = {
  OUTLINE: 'outline',
  PLAIN: 'plain',
} as const;

export const TEXT_FIELD_VALIDATION_TIMING = {
  BLUR: 'blur',
  CHANGE: 'change',
  INPUT: 'input',
  SUBMIT: 'submit',
} as const;
