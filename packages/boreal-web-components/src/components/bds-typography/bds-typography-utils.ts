import { Size, State, Variant } from './types/types';

type VariantSettings = {
  readonly states?: State[];
  readonly isRequired?: boolean;
  readonly size?: Size[];
  readonly canUseTooltip?: boolean;
};

export const VARIANT_CONFIG: Partial<Record<Variant, VariantSettings>> = {
  link: {
    states: ['disabled', 'visited', 'hover', 'active', 'focus'],
    size: ['s', 'm'],
  },
  label: {
    states: ['disabled'],
    isRequired: true,
    canUseTooltip: true,
  },
  heading: { canUseTooltip: true },
  subheading: { canUseTooltip: true },
  helper: { states: ['error'] },
  display: { size: ['xs', 's', 'm', 'l', 'xl'] },
} as const;
