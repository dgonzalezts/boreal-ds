import { type ComponentState, COMPONENT_STATES } from '@/types/states';
import { type Size, SIZES } from '@/types/size';
import type { Variant } from '../types/types';
import type { ITypography } from '../types/ITypography';

/*
 * LINK consts
 */
export const FILENAME = 'download';

/*
 * VARIANT CONFIG
 */

type VariantSettings = {
  readonly states?: ComponentState[];
  readonly isRequired?: boolean;
  readonly size?: Size[];
  readonly canUseTooltip?: boolean;
};

/*
 * Variant map to apply size, state, etc, styles based on variant type
 */
export const VARIANT_CONFIG: Partial<Record<Variant, VariantSettings>> = {
  link: {
    states: [COMPONENT_STATES.DISABLED /* STATES.VISITED, STATES.HOVER, STATES.ACTIVE, STATES.FOCUS */],
    size: [SIZES.S, SIZES.M],
  },
  label: {
    states: [COMPONENT_STATES.DISABLED],
    isRequired: true,
    canUseTooltip: true,
  },
  heading: { canUseTooltip: true },
  subheading: { canUseTooltip: true },
  helper: { states: [COMPONENT_STATES.ERROR] },
  display: { size: [SIZES.XS, SIZES.S, SIZES.M, SIZES.L, SIZES.XL] },
} as const;

/*
 * ATTRIBUTE MAP
 */

export const getAttributesByTag = (comp: ITypography, tagName: string): Record<string, unknown> => {
  const ATTR_MAP: Record<string, Record<string, unknown>> = {
    a: {
      href: comp.state !== COMPONENT_STATES.DISABLED ? comp.sanitizedHref : null,
      target: comp.target,
      download: comp.isDownloadable ? comp.filename : null,
      rel: comp.target === '_blank' ? 'noopener noreferrer' : undefined,
    },
    label: {
      htmlFor: comp.htmlFor,
    },
  };

  return ATTR_MAP[tagName] || {};
};
