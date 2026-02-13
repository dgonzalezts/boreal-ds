import { Alignment } from '@/types/alignment';
import type { TagElement, Variant } from './types';
import { State } from '@/types/states';
import { Size } from '@/types/size';

export interface ITypography {
  element: TagElement;
  variant: Variant;
  align: Alignment;
  ellipsis: boolean;
  maxLines: number;
  tooltip: string;

  // Applies to some variants
  state: State;
  size: Size;

  // Label
  isRequired: boolean;
  htmlFor: string;

  // Link
  href: string;
  target: '_blank' | '_parent' | '_self' | '_top';
  isDownloadable: boolean;
  filename: string;

  sanitizedHref: string;
}
