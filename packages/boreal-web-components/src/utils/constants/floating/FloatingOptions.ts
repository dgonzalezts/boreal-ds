import { FloatingProp } from '@/services/positioning/interfaces/Positioning';

/**
 * Default options for the floating mixin.
 * This can be overridden by passing a different object to the `floatingOptions` prop.
 * Add methods to the `onBeforeShow`, `onAfterShow`, `onBeforeHide`, and `onAfterHide` to add custom logic.
 */
export const FLOATING_OPTIONS: FloatingProp = {
  placement: 'bottom',
  offset: 8,
  showOnClick: false,
  hideOnClick: false,
  disabled: false,
  onBeforeShow: () => {},
  onAfterShow: () => {},
  onBeforeHide: () => {},
  onAfterHide: () => {},
};
