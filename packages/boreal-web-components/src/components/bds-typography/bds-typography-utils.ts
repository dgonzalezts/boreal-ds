import { STATES } from '@/types/states';
import { Size, State, Variant } from './types/types';
import { SIZES } from '@/types/size';

/*
 * LINK consts
 */
export const FILENAME = 'download';

type VariantSettings = {
  readonly states?: State[];
  readonly isRequired?: boolean;
  readonly size?: Size[];
  readonly canUseTooltip?: boolean;
};

/*
 * Variant config to apply size, state, etc, styles based on variant type
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
