import type { TagElement, State, Variant, Alignment, Size } from './types';

export interface ITypography {
  element: TagElement;
  variant: Variant;
  align: Alignment;
  ellipsis: boolean;
  maxLines: number;
  tooltip: string;

  // Depending on variant
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
}
