import { Logger } from '@/services/logger/Logger';
import { PositioningEngine } from '@/services/positioning/positioning.service';
import { autoUpdate, Placement, Strategy } from '@floating-ui/dom';
import { KEYBOARD } from '@/utils/constants/common/Keys';
import { EVENTS } from '@/utils/constants/common/Events';
import { FloatingHooks, FloatingProp } from '@/services/positioning/interfaces/Positioning';
import { ComponentInterface, MixedInCtor, Prop } from '@stencil/core';

export interface FloatingMixinOptions {
  placement: Placement;
  offset: number;
  flip?: boolean;
  shift?: boolean;
  arrow?: HTMLElement;
  strategy?: Strategy;
}
export interface IFloatingMixin extends FloatingHooks {
  floatingOptions: FloatingProp;

  get options(): FloatingMixinOptions;
}

export const floatingMixin = <B extends MixedInCtor>(Base: B) => {
  class Floating extends Base implements ComponentInterface {
    /**
     * Width of the popover in pixels.
     * @default 200
     */
    @Prop() readonly width?: number;
    /**
     * If true, allows multiline content in the tooltip.
     * @default false
     */
    @Prop() readonly multiline?: boolean;

    /**
     * If true, hides the tooltip arrow.
     * @default false
     */
    @Prop({ reflect: true, mutable: true }) disabled?: boolean;

    /**
     * Default options for the floating mixin.
     * This can be overridden by passing a different object to the `floatingOptions` prop.
     * Add methods to the `onBeforeShow`, `onAfterShow`, `onBeforeHide`, and `onAfterHide` to add custom logic.
     */
    floatingOptions: FloatingProp;

    cleanupAutoUpdate: (() => void) | undefined;
    previousTrigger: HTMLElement | undefined;
    positionEngine: PositioningEngine;
    logger: Logger;

    onPositionUpdate?(result: Awaited<ReturnType<PositioningEngine['computePosition']>>): void;

    // El componente DEBE proveer estos refs
    floatingContent!: HTMLElement;
    triggerSlot!: HTMLElement;

    get options(): FloatingMixinOptions {
      return {
        placement: 'bottom',
        offset: 8,
        strategy: 'fixed',
      };
    }
    get hooks(): FloatingHooks {
      return {};
    }
    show() {
      if (!this.floatingContent || !this.triggerSlot) {
        this.logger.error('TooltipMixin.show', 'Floating or trigger element is required for showing tooltip.');
        return;
      }

      this.floatingOptions.onBeforeShow?.(this.floatingContent);
      if (this.disabled) return;

      this.floatingContent.showPopover();
      this.startAutoUpdate(this.triggerSlot, this.floatingContent, this.options, result => {
        this.hooks.onPositionUpdate?.(result);
      });

      this.floatingOptions.onAfterShow?.(this.floatingContent);
    }

    hide() {
      const floating = this.floatingContent;

      this.floatingOptions.onBeforeHide?.(this.floatingContent);

      this.stopAutoUpdate();
      floating?.hidePopover();

      this.floatingOptions.onAfterHide?.(this.floatingContent);
    }

    toggle() {
      // El componente puede override isVisible o podemos rastrearlo aquí
      this.isVisible ? this.hide() : this.show();
    }

    // Tracking interno de visibilidad para el toggle
    isVisible: boolean;

    // --- Cleanup listeners ---

    detachTriggerListeners(
      trigger: HTMLElement,
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      if (showOnClick) {
        trigger.removeEventListener(EVENTS.Click, toggleFn);
      } else {
        trigger.removeEventListener(EVENTS.Focus, showFn);
        trigger.removeEventListener(EVENTS.Blur, hideFn);
      }
    }

    attachTriggerListeners(
      trigger: HTMLElement,
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      if (showOnClick) {
        // Solo click, no hover/focus
        trigger.addEventListener(EVENTS.Click, toggleFn);
      } else {
        // Hover/focus listeners
        trigger.addEventListener(EVENTS.Focus, showFn);
        trigger.addEventListener(EVENTS.Blur, hideFn);
      }
    }

    // --- Slot change handler ---

    handleSlotChange(
      e: Event,
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      const newTrigger = e.target as HTMLElement;

      if (this.previousTrigger) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn, toggleFn, showOnClick);
      }
      if (newTrigger) {
        this.attachTriggerListeners(newTrigger, showFn, hideFn, toggleFn, showOnClick);
        this.previousTrigger = newTrigger;
      }
    }

    // --- Keyboard handler ---

    handleKeydown(e: KeyboardEvent, showFn: (this: void) => void, hideFn: (this: void) => void) {
      if (e.key === KEYBOARD.Enter.key || e.key === ' ') showFn();
      if (e.key === KEYBOARD.Escape.key) hideFn();
    }

    // --- Position ---

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

    stopAutoUpdate() {
      this.cleanupAutoUpdate?.();
      this.cleanupAutoUpdate = undefined;
    }

    // --- Disconnect ---
    floatingDisconnect(
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      if (this.previousTrigger) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn, toggleFn, showOnClick);
      }
      this.stopAutoUpdate();
    }
    disconnectedCallback(): void {
      this.floatingDisconnect(
        () => this.show(),
        () => this.hide(),
        () => this.toggle(),
        this.floatingOptions.showOnClick ?? false,
      );
    }

    /**
     * That prevent the component to be rendered twice or the dependency will shared between the components.
     */
    componentWillLoad() {
      this.positionEngine = new PositioningEngine();
      this.logger = new Logger();

      this.cleanupAutoUpdate = undefined;
      this.previousTrigger = undefined;
      this.isVisible = false;

      this.show = this.show.bind(this) as typeof this.show;
      this.hide = this.hide.bind(this) as typeof this.hide;
      this.toggle = this.toggle.bind(this) as typeof this.toggle;
    }
  }

  return Floating;
};
