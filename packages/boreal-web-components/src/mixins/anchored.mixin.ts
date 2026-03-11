import { IFloatingAdapter, PositioningEngine } from '@/services/floating/positioning.service';
import { ComponentInterface, Element, MixedInCtor } from '@stencil/core';
import { floatingMixin } from './floating.mixin';
import { Logger } from '@/services/logger/Logger';
import { autoUpdate } from '@floating-ui/dom';
import { KEYBOARD } from '@/utils/constants/common/Keys';
import { EVENTS } from '@/utils/constants/common/Events';
import { FloatingMixinOptions } from '@/services/floating/interfaces/Floating';
import { AnchoredHooks } from '@/services/floating/interfaces/Anchored';

/**
 * Positioning and trigger mixin for anchor-based floating elements.
 *
 * Extends `floatingMixin` with two additional responsibilities:
 * - **Positioning** — computes and maintains the position of the floating element
 *   relative to a trigger element using `IFloatingAdapter` (wraps Floating UI).
 *   Position is kept in sync via `autoUpdate` while the element is visible.
 * - **Triggers** — manages DOM event listeners on the trigger element
 *   (focus/blur, click) to show and hide the floating element.
 *
 * Use this mixin for components whose floating element must be anchored
 * to a specific DOM element: `Tooltip`, `Popover`, `Dropdown`.
 *
 * For viewport-relative components (Dialog, Drawer, Toast),
 * use `backdropMixin` instead.
 *
 * ## Lifecycle flow
 * ```
 * showElement() → showPopover() + startAutoUpdate()
 * hideElement() → hidePopover() + stopAutoUpdate()
 * ```
 *
 * ## Required by the component
 * - `triggerSlot` — must be assigned to the trigger element before `show()` is called.
 * - `floatingContent` — must be assigned via `ref` in the render method.
 * - `options` — override this getter to customize placement, offset and strategy.
 *
 * @example
 * ```typescript
 * import { Component, Element, Mixin, Prop, h } from '@stencil/core';
 * import { anchoredMixin } from '@/mixins/anchored.mixin';
 * import { FloatingHooks, FloatingMixinOptions } from '@/services/floating/interfaces/Floating';
 *
 * @Component({ tag: 'bds-tooltip' })
 * export class BdsTooltip extends Mixin(anchoredMixin) {
 *
 *   get options(): FloatingMixinOptions {
 *     return { placement: 'bottom', offset: 8, strategy: 'fixed' };
 *   }
 *
 *   get hooks(): FloatingHooks {
 *     return {
 *       onBeforeShow: () => !this.disabled,
 *       onPositionUpdate: result => this.handlePosition(result),
 *     };
 *   }
 *
 *   componentDidLoad() {
 *     const trigger = document.getElementById(this.trigger);
 *     if (trigger) {
 *       this.triggerSlot = trigger;
 *       trigger.addEventListener('click', () => this.toggle());
 *     }
 *   }
 *
 *   render() {
 *     return (
 *       <Host>
 *         <div
 *           popover="manual"
 *           ref={el => (this.floatingContent = el as HTMLElement)}
 *         />
 *       </Host>
 *     );
 *   }
 * }
 * ```
 *
 * @see floatingMixin - base lifecycle mixin
 * @see IFloatingAdapter - positioning adapter interface
 * @see FloatingMixinOptions - positioning configuration interface
 * @see FloatingHooks - lifecycle hook interface, includes `onPositionUpdate`
 */
export const anchoredMixin = <B extends MixedInCtor>(Base: B) => {
  class Anchored extends floatingMixin(Base) implements ComponentInterface, AnchoredHooks {
    /**
     * The previously registered trigger element.
     * Used to detach listeners when the trigger changes.
     */
    previousTrigger: HTMLElement | undefined;

    /**
     * Cleanup function returned by `autoUpdate`.
     * Call to stop position syncing when the element is hidden or disconnected.
     */
    cleanupAutoUpdate: (() => void) | undefined;

    /**
     * Adapter that wraps Floating UI to compute and apply positions.
     * Initialized in `componentWillLoad`.
     */
    positionEngine!: IFloatingAdapter;

    /**
     * Logger instance for error reporting.
     * Initialized in `componentWillLoad`.
     */
    logger!: Logger;

    /**
     * Default positioning options.
     * Override this getter in the component to customize placement,
     * offset, strategy, flip, shift, and arrow.
     */
    get options(): FloatingMixinOptions {
      return { placement: 'bottom', offset: 8, strategy: 'fixed' };
    }

    /**
     * Reference to the DOM element that triggers the floating element.
     * Must be assigned by the component before `show()` is called —
     * either via slot change handler or `componentDidLoad`.
     */
    triggerSlot!: HTMLElement;

    @Element() el!: HTMLElement;

    get hooks(): AnchoredHooks {
      return {
        ...this.hooks,
      };
    }

    /**
     * Shows the floating element using the Popover API
     * and starts position auto-update relative to `triggerSlot`.
     *
     * @override floatingMixin.showElement
     */
    showElement(): void {
      this.floatingContent.showPopover();
      this.isVisible = true;

      this.startAutoUpdate(this.triggerSlot, this.floatingContent, this.options, result => {
        this.hooks.onPositionUpdate?.(result);
      });
    }
    /**
     * Guards against showing without a valid trigger.
     * Delegates to `floatingMixin.onBeforeShow` if the guard passes.
     *
     * @override floatingMixin.onBeforeShow
     * @param target - Optional element that triggered the show action
     * @returns `false` if `triggerSlot` is not set, otherwise delegates to super
     */
    onBeforeShow(target?: HTMLElement): boolean {
      if (this.triggerSlot === null) {
        this.logger.error('AnchoredMixin.show', 'triggerSlot is required');
        return false;
      }
      return super.onBeforeShow(target);
    }

    /**
     * Hides the floating element using the Popover API
     * and stops position auto-update.
     *
     * @override floatingMixin.hideElement
     */
    hideElement(): void {
      this.stopAutoUpdate();
      this.floatingContent?.hidePopover();
      this.isVisible = false;
    }

    /**
     * Handles slot change events to update the trigger element reference
     * and re-attach event listeners to the new trigger.
     *
     * @param e - The slot change event
     * @param showFn - Bound show function to attach as listener
     * @param hideFn - Bound hide function to attach as listener
     */
    handleSlotChange(e: Event, showFn: (this: void) => void, hideFn: (this: void) => void) {
      const newTrigger = e.target as HTMLElement;

      if (this.previousTrigger !== undefined && this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn);
      }
      if (newTrigger !== undefined && newTrigger !== null) {
        this.attachTriggerListeners(newTrigger, showFn, hideFn);
        this.previousTrigger = newTrigger;
      }
    }

    /**
     * Handles keyboard events on the trigger element.
     * - `Enter` / `Space` — shows the floating element
     * - `Escape` — hides the floating element
     *
     * @param e - The keyboard event
     * @param showFn - Bound show function
     * @param hideFn - Bound hide function
     */
    handleKeydown(e: KeyboardEvent, showFn: (this: void) => void, hideFn: (this: void) => void) {
      if (e.key === KEYBOARD.Enter.key || e.key === ' ') showFn();
      if (e.key === KEYBOARD.Escape.key) hideFn();
    }

    /**
     * Computes the position of the floating element relative to the trigger
     * using `IFloatingAdapter` and applies the result to the floating element's style.
     *
     * @param triggerElement - The anchor element
     * @param floatingElement - The element to position
     * @param options - Positioning options (placement, offset, flip, shift, arrow)
     * @param onPositionUpdate - Optional callback invoked after each position update
     */
    async updatePosition(
      triggerElement: HTMLElement,
      floatingElement: HTMLElement,
      options: FloatingMixinOptions,
      onPositionUpdate?: (result: Awaited<ReturnType<PositioningEngine['computePosition']>>) => void,
    ) {
      const result = await this.positionEngine.computePosition(triggerElement, floatingElement, {
        placement: options.placement,
        offset: options.offset,
        flip: options.flip ?? true,
        shift: options.shift ?? true,
        arrow: options.arrow,
        strategy: options.strategy ?? 'fixed',
      });

      this.positionEngine.applyPosition(floatingElement, result);
      onPositionUpdate?.(result);

      return result;
    }

    /**
     * Starts automatic position synchronization between the trigger
     * and the floating element. Runs `updatePosition` once immediately,
     * then subscribes to DOM/scroll/resize changes via `autoUpdate`.
     *
     * @param triggerElement - The anchor element
     * @param floatingElement - The element to keep in sync
     * @param options - Positioning options
     * @param onPositionUpdate - Optional callback after each position update
     */
    startAutoUpdate(
      triggerElement: HTMLElement,
      floatingElement: HTMLElement,
      options: FloatingMixinOptions,
      onPositionUpdate?: Parameters<typeof this.updatePosition>[3],
    ) {
      const sync = () => {
        void this.updatePosition(triggerElement, floatingElement, options, onPositionUpdate);
      };
      sync(); // run once immediately
      this.cleanupAutoUpdate = autoUpdate(triggerElement, floatingElement, sync);
    }

    /**
     * Stops automatic position synchronization and clears the cleanup reference.
     */
    stopAutoUpdate() {
      this.cleanupAutoUpdate?.();
      this.cleanupAutoUpdate = undefined;
    }

    /**
     * Attaches focus and blur listeners to the trigger element.
     *
     * @param trigger - The trigger element
     * @param showFn - Bound show function
     * @param hideFn - Bound hide function
     */
    attachTriggerListeners(trigger: HTMLElement, showFn: (this: void) => void, hideFn: (this: void) => void) {
      trigger.addEventListener(EVENTS.Focus, showFn);
      trigger.addEventListener(EVENTS.Blur, hideFn);
    }

    /**
     * Detaches focus and blur listeners from the trigger element.
     *
     * @param trigger - The trigger element
     * @param showFn - Bound show function to remove
     * @param hideFn - Bound hide function to remove
     */
    detachTriggerListeners(trigger: HTMLElement, showFn: (this: void) => void, hideFn: (this: void) => void) {
      trigger.removeEventListener(EVENTS.Focus, showFn);
      trigger.removeEventListener(EVENTS.Blur, hideFn);
    }

    /**
     * Detaches trigger listeners and stops auto-update.
     * Call this when the component disconnects from the DOM.
     *
     * @param showFn - Bound show function to remove
     * @param hideFn - Bound hide function to remove
     */
    floatingDisconnect(showFn: (this: void) => void, hideFn: (this: void) => void) {
      if (this.previousTrigger !== undefined && this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn);
      }
      this.stopAutoUpdate();
    }

    subscribeToTrigger(trigger: Element) {
      const part = document.createAttribute('part');
      const ariaExpanded = document.createAttribute('aria-expanded');
      const ariaDescribedBy = document.createAttribute('aria-describedby');
      ariaExpanded.value = 'false';
      part.value = 'tooltip-trigger';
      ariaDescribedBy.value = 'tooltip-content';
      trigger.setAttributeNode(part);
      trigger.setAttributeNode(ariaExpanded);
      trigger.addEventListener('mouseenter', () => this.show());
      trigger.addEventListener('mouseleave', (e: MouseEvent) => this.hide(e.target as HTMLElement));
    }

    onBeforeLoad() {
      const parent = this.el.parentElement;
      const trigger = parent.querySelector('[bds-tooltip]') || parent;

      if (trigger.isConnected) {
        this.triggerSlot = trigger as HTMLElement;
        this.subscribeToTrigger(trigger);
      }
    }

    componentDidLoad() {
      this.onBeforeLoad();
      this.hooks.onBeforeLoad?.(this.el);
    }

    /**
     * Initializes the positioning engine, logger, and binds lifecycle methods
     * so they can be safely passed as event listener callbacks.
     *
     * @remarks `show`, `hide`, and `toggle` are bound here — not in `floatingMixin` —
     * to ensure they resolve to the `anchoredMixin` overrides at call time.
     */
    componentWillLoad() {
      this.toggle = this.toggle.bind(this) as typeof this.toggle;
      this.show = this.show.bind(this) as typeof this.show;
      this.hide = this.hide.bind(this) as typeof this.hide;

      this.positionEngine = new PositioningEngine();
      this.logger = new Logger();
      this.cleanupAutoUpdate = undefined;
      this.previousTrigger = undefined;
    }

    /**
     * Cleans up trigger listeners, stops auto-update, and hides the floating element
     * when the component is removed from the DOM.
     */
    disconnectedCallback() {
      if (this.previousTrigger !== undefined && this.previousTrigger !== null) {
        this.floatingDisconnect(
          () => this.show(),
          () => this.hide(),
        );
      }
      this.stopAutoUpdate();
      this.hide();
    }
  }
  return Anchored;
};
