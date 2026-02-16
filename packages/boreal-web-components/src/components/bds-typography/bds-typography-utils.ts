import { type State, STATES } from '@/types/states';
import { type Size, SIZES } from '@/types/size';
import type { Variant } from './types/types';
import { ITypography } from './types/ITypography';

/*
 * LINK consts
 */
export const FILENAME = 'download';

/*
 * VARIANT CONFIG
 */

type VariantSettings = {
  readonly states?: State[];
  readonly isRequired?: boolean;
  readonly size?: Size[];
  readonly canUseTooltip?: boolean;
};

/*
 * Variant map to apply size, state, etc, styles based on variant type
 */
export const VARIANT_CONFIG: Partial<Record<Variant, VariantSettings>> = {
  link: {
    states: [STATES.DISABLED, STATES.VISITED, STATES.HOVER, STATES.ACTIVE, STATES.FOCUS],
    size: [SIZES.S, SIZES.M],
  },
  label: {
    states: [STATES.DISABLED],
    isRequired: true,
    canUseTooltip: true,
  },
  heading: { canUseTooltip: true },
  subheading: { canUseTooltip: true },
  helper: { states: [STATES.ERROR] },
  display: { size: [SIZES.XS, SIZES.S, SIZES.M, SIZES.L, SIZES.XL] },
} as const;

/*
 * ATTRIBUTE MAP
 */

export const getAttributesByTag = (comp: ITypography, tagName: string): Record<string, unknown> => {
  const ATTR_MAP: Record<string, Record<string, unknown>> = {
    a: {
      href: comp.state !== STATES.DISABLED ? comp.sanitizedHref : null,
      target: comp.target,
      download: comp.isDownloadable ? comp.filename : null,
      rel: 'noopener noreferrer',
    },
    label: {
      htmlFor: comp.htmlFor,
    },
  };

  return ATTR_MAP[tagName] || {};
};
