import { FloatingPopoverProp } from '@/services';
import { PopoverWidth } from './width';

export interface IPopover {
  floatingOptions: Partial<FloatingPopoverProp>;
  disabled?: boolean;
  width?: PopoverWidth;
  trigger?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  showClose?: boolean;
}
