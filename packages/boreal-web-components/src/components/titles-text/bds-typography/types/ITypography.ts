import type { Alignment } from '@/types/alignment';
import type { TagElement, Variant } from './types';
import type { ComponentState } from '@/types/states';
import type { Size } from '@/types/size';

export interface ITypography {
  element: TagElement;
  variant: Variant;
  align: Alignment;
  ellipsis: boolean;
  maxLines: number;
  tooltipText: string;

  // Applies to some variants
  state: ComponentState;
  size: Size;

  // Label
  isRequired: boolean;
  htmlFor: string | undefined;

  // Link
  href: string | null;
  target: '_blank' | '_parent' | '_self' | '_top' | '' | null;
  isDownloadable: boolean;
  filename: string;

  sanitizedHref: string;
}
