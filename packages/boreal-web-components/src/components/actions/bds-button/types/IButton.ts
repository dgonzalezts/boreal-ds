import { CoreColors } from '@/types/coreColors';
import { ButtonSizes, ButtonTypes, ButtonVariant } from './types';

export interface IButton {
  label: string;
  disabled: boolean;
  name: string;
  type: ButtonTypes;
  color: CoreColors;
  variant: ButtonVariant;
  size: ButtonSizes;
  loading: boolean;
  disclosure: boolean;
}
