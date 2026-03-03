import { CoreColors } from '@/types/coreColors';
import { ButtonSizes, ButtonTypes, ButtonVariant } from './types';
import { State } from '@/types';

export default interface IButton {
  label: string;
  disabled: boolean;
  name: string;
  type: ButtonTypes;
  color: CoreColors;
  variant: ButtonVariant;
  size: ButtonSizes;
  currentState: State;
  isLoading: boolean;
  hasDisclosure: boolean;

  form?: string;
}
