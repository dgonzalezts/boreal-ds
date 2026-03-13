import { FloatingHooks } from '@/services/floating/interfaces/Floating';
import { FloatingAnchoredProp } from '@/services/floating/interfaces/Props';
import { MixedInCtor, State } from '@stencil/core';

/**
 * Core lifecycle mixin for all floating elements in the design system.
 *
 * Provides a unified lifecycle contract (`show`, `hide`, `toggle`, `isVisible`)
 * and an extension mechanism via `FloatingHooks` that allows each component
 * to inject its own logic at specific lifecycle points without modifying the mixin.
 *
 * This mixin is the base for all floating components. It does not handle
 * positioning or triggers — use `anchoredMixin` for components that need
 * to be anchored to a DOM element (Tooltip, Popover),
 * or `backdropMixin` for viewport-relative components (Dialog, Drawer, Toast).
 *
 * ## Extension points
 *
 * Override `showElement` / `hideElement` to control how the element
 * mounts and unmounts (e.g. `showPopover()`, `showModal()`, CSS animations).
 *
 * Override `hooks` to inject logic at lifecycle points:
 * - `onBeforeShow` / `onBeforeHide` — return `false` to cancel the action
 * - `onAfterShow` / `onAfterHide` — side effects after the action completes
 * - `mounted` / `unmounted` — called after the element is shown or hidden
 *
 * ## Lifecycle flow
 * ```
 * show(): onBeforeShow() → showElement() → onAfterShow()
 * hide(): onBeforeHide() → hideElement() → onAfterHide()
 * ```
 *
 * @example
 * ```typescript
 * import { Component, Mixin, Prop } from '@stencil/core';
 * import { floatingMixin } from '@/mixins/floating.mixin';
 * import { FloatingHooks } from '@/services/floating/interfaces/Floating';
 *
 * @Component({ tag: 'bds-dialog' })
 * export class BdsDialog extends Mixin(floatingMixin) {
 *   private dialogElement!: HTMLDialogElement;
 *
 *   // Override showElement/hideElement to use the native <dialog> API
 *   showElement(): void {
 *     this.dialogElement.showModal();
 *     this.isVisible = true;
 *   }
 *   hideElement(): void {
 *     this.dialogElement.close();
 *     this.isVisible = false;
 *   }
 *
 *   // Inject component-specific logic via hooks
 *   get hooks(): FloatingHooks {
 *     return {
 *       onBeforeShow: () => !this.disabled,
 *       onAfterShow: () => this.lockScroll(),
 *       onAfterHide: () => this.unlockScroll(),
 *     };
 *   }
 * }
 * ```
 */
export const floatingMixin = <B extends MixedInCtor>(Base: B) => {
  class Floating extends Base {
    /**
     * Configuration prop passed by the consumer component.
     * Allows external control over lifecycle hooks and floating behavior.
     */
    floatingOptions: FloatingAnchoredProp;

    /**
     * Reference to the floating element in the DOM.
     * Must be assigned via `ref` in the component's render method.
     *
     * @example
     * ```tsx
     * <div ref={el => (this.floatingContent = el as HTMLElement)} />
     * ```
     */
    floatingContent!: HTMLElement;

    /**
     * Tracks the visibility state of the floating element.
     * Triggers a re-render when changed.
     */
    @State() isVisible: boolean;

    /**
     * Lifecycle hooks provided by the component.
     * Override this getter to inject component-specific logic
     * into the floating lifecycle without modifying the mixin.
     *
     * @returns FloatingHooks — an object with optional lifecycle callbacks
     */
    get hooks(): FloatingHooks {
      return {};
    }

    /**
     * Called before the element is shown.
     * Aggregates both the component `hooks` and `floatingOptions` controls.
     * If either returns `false`, the show action is cancelled.
     *
     * @param target - Optional element that triggered the show action
     * @returns `true` if the element can be shown, `false` to cancel
     */
    onBeforeShow(target?: HTMLElement): boolean {
      const hookControl = this.hooks.onBeforeShow?.(target) ?? true;
      const propControl = this.floatingOptions?.onBeforeShow?.(target) ?? true;

      return hookControl && propControl;
    }

    /**
     * Called before the element is hidden.
     * Aggregates both the component `hooks` and `floatingOptions` controls.
     * If either returns `false`, the hide action is cancelled.
     *
     * @param target - Optional element the mouse moved to (used for stayOnHover logic)
     * @returns `true` if the element can be hidden, `false` to cancel
     */
    onBeforeHide(target?: HTMLElement): boolean {
      const hookControl = this.hooks.onBeforeHide?.(target) ?? true;
      const propControl = this.floatingOptions?.onBeforeHide?.(target) ?? true;
      return hookControl && propControl;
    }

    /**
     * Mounts the floating element into the visible DOM.
     * Override in subclasses to use a different mount strategy
     * (e.g. `showPopover()`, `showModal()`, CSS class toggle).
     */
    showElement() {
      this.isVisible = true;
      this.hooks.mounted?.(this.floatingContent);
    }

    /**
     * Unmounts the floating element from the visible DOM.
     * Override in subclasses to use a different unmount strategy.
     */
    hideElement() {
      this.isVisible = false;
      this.hooks.unmounted?.(this.floatingContent);
    }

    /**
     * Shows the floating element if not already visible.
     * Runs the full lifecycle: `onBeforeShow` → `showElement` → `onAfterShow`.
     *
     * @param target - Optional element that triggered the action
     */
    show(target?: HTMLElement) {
      if (this.isVisible) return;

      if (!this.onBeforeShow(target)) return;

      this.showElement();
      this.onAfterShow(target);
    }

    /**
     * Hides the floating element if currently visible.
     * Runs the full lifecycle: `onBeforeHide` → `hideElement` → `onAfterHide`.
     *
     * @param target - Optional element the mouse moved to
     */
    hide(target?: HTMLElement) {
      if (!this.isVisible) return;
      if (!this.onBeforeHide(target)) return;

      this.hideElement();

      this.onAfterHide(target);
    }

    /**
     * Toggles the floating element visibility.
     *
     * @param target - Optional element that triggered the action
     */
    toggle(target?: HTMLElement) {
      this.isVisible ? this.hide(target) : this.show();
    }

    /**
     * Called after the element is shown.
     * Notifies both `hooks` and `floatingOptions` consumers.
     *
     * @param target - Optional element that triggered the action
     */
    onAfterShow(target?: HTMLElement): void {
      this.hooks.onAfterShow?.(target);
      this.floatingOptions?.onAfterShow?.(target);
    }

    /**
     * Called after the element is hidden.
     * Notifies both `hooks` and `floatingOptions` consumers.
     *
     * @param target - Optional element that triggered the action
     */
    onAfterHide(target?: HTMLElement): void {
      this.hooks.onAfterHide?.(target);
      this.floatingOptions?.onAfterHide?.(target);
    }
  }
  return Floating;
};
