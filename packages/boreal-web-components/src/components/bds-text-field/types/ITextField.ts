import type { IFormValidator, ValidationTiming } from '@/types/form';
import type { TextFieldType, TextFieldVariant } from './types';

export interface ITextField {
  name: string;
  value: string;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
  error: boolean;
  errorMessage: string;
  customValidators: IFormValidator[];
  type: TextFieldType;
  variant: TextFieldVariant;
  placeholder: string;
  autocomplete: string;
  pattern: string;
  minLength: number;
  maxLength: number;
  label: string;
  sublabel: string;
  helperText: string;
  info: string;
  clearable: boolean;
  clearOnHover: boolean;
  disclosure: boolean;
  validationTiming: ValidationTiming;
  charCount: number;
  counter: boolean;
  customWidth: string;
}
