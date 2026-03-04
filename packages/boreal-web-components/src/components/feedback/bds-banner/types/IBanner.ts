import type { StatusVariant } from '@/types';
import type { EventEmitter } from '@stencil/core/internal';

export interface IBanner {
  variant: StatusVariant;
  enableClose: boolean;

  /* State */
  isOpen: boolean;
  isClosing: boolean;

  /* Events */
  close: EventEmitter<void>;
}
