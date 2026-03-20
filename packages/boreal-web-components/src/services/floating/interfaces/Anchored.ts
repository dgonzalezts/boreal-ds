import { FloatingHooks } from './Floating';

export interface AnchoredHooks extends FloatingHooks {
  onBeforeLoad?: (el?: HTMLElement) => void;
  onAfterLoad?: (el?: HTMLElement) => void;
}
