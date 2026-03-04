import { PositioningEngine } from '@/services/floating/positioning.service';
import { MixedInCtor } from '@stencil/core';
import { floatingMixin } from './floating.mixin';
import { Logger } from '@/services/logger/Logger';
import { autoUpdate } from '@floating-ui/dom';
import { KEYBOARD } from '@/utils/constants/common/Keys';
import { EVENTS } from '@/utils/constants/common/Events';
import { FloatingMixinOptions } from '@/services/floating/interfaces/Floating';

export const anchoredMixin = <B extends MixedInCtor>(Base: B) => {
  class Anchored extends floatingMixin(Base) {
    triggerSlot!: HTMLElement;
    previousTrigger: HTMLElement | undefined;
    cleanupAutoUpdate: (() => void) | undefined;
    positionEngine: PositioningEngine;
    logger: Logger;

    get options(): FloatingMixinOptions {
      return { placement: 'bottom', offset: 8, strategy: 'fixed' };
    }

    showElement(): void {
      this.floatingContent.showPopover();
      this.isVisible = true;
      this.startAutoUpdate(this.triggerSlot, this.floatingContent, this.options, result => {
        this.hooks.onPositionUpdate?.(result);
      });
    }
    onBeforeShow(target?: HTMLElement): boolean {
      if (this.triggerSlot !== undefined || this.triggerSlot !== null) {
        this.logger.error('anchoredMixin.show', 'triggerSlot is required');
        return false;
      }
      return super.onBeforeShow(target);
    }
    onBeforeHide(target?: HTMLElement): boolean {
      return super.onBeforeHide(target);
    }
    hideElement(): void {
      this.stopAutoUpdate();
      this.floatingContent?.hidePopover();
      this.isVisible = false;
    }

    handleSlotChange(
      e: Event,
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      const newTrigger = e.target as HTMLElement;

      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn, toggleFn, showOnClick);
      }
      if (newTrigger !== undefined || newTrigger !== null) {
        this.attachTriggerListeners(newTrigger, showFn, hideFn, toggleFn, showOnClick);
        this.previousTrigger = newTrigger;
      }
    }

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

    componentWillLoad() {
      super.componentWillLoad(); // inicializa floatingMixin
      this.positionEngine = new PositioningEngine();
      this.logger = new Logger();
      this.cleanupAutoUpdate = undefined;
      this.previousTrigger = undefined;
    }

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
    floatingDisconnect(
      showFn: (this: void) => void,
      hideFn: (this: void) => void,
      toggleFn: (this: void) => void,
      showOnClick: boolean,
    ) {
      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn, toggleFn, showOnClick);
      }
      this.stopAutoUpdate();
    }
    disconnectedCallback() {
      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
        this.floatingDisconnect(
          () => this.show(),
          () => this.hide(),
          () => this.toggle(),
          this.floatingOptions.showOnClick ?? false,
        );
      }
      this.stopAutoUpdate();
      this.hide();
    }
  }
  return Anchored;
};
