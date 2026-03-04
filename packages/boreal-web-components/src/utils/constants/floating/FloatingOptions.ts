import { FloatingProp } from '@/services/floating/interfaces/Props';

/**
 * Default options for the floating mixin.
 * This can be overridden by passing a different object to the `floatingOptions` prop.
 * Add methods to the `onBeforeShow`, `onAfterShow`, `onBeforeHide`, and `onAfterHide` to add custom logic.
 */
export const DEFAULT_FLOATING: FloatingProp = {
  placement: 'bottom',
  offset: 8,
  showOnClick: false,
  flip: true,
};
