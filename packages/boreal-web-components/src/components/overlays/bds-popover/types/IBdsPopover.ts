import { FloatingPopoverProp } from '@/services';
import { PopoverWidth } from './width';

export interface IPopover {
  floatingOptions: Partial<FloatingPopoverProp>;
  disabled?: boolean;
  width?: PopoverWidth;
  hasHeader?: boolean;
  hasFooter?: boolean;
  showClose?: boolean;
}
