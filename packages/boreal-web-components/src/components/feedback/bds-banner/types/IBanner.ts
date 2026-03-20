import type { StatusVariant } from '@/types';
import type { EventEmitter } from '@stencil/core/internal';

export interface IBanner {
  variant: StatusVariant;
  enableClose: boolean;
  closeButtonLabel: string;
  idComponent: string;

  /* Events */
  bdsClose: EventEmitter<void>;
}
