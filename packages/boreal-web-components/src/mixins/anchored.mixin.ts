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
    previousTrigger: HTMLElement | undefined;
    cleanupAutoUpdate: (() => void) | undefined;
    positionEngine: PositioningEngine;
    logger: Logger;

    get options(): FloatingMixinOptions {
      return { placement: 'bottom', offset: 8, strategy: 'fixed' };
    }

    triggerSlot!: HTMLElement;

    showElement(): void {
      this.floatingContent.showPopover();
      this.isVisible = true;

      this.startAutoUpdate(this.triggerSlot, this.floatingContent, this.options, result => {
        this.hooks.onPositionUpdate?.(result);
      });
    }
    onBeforeShow(target?: HTMLElement): boolean {
      if (this.triggerSlot === null) {
        this.logger.error('AnchoredMixin.show', 'triggerSlot is required');
        return false;
      }
      return super.onBeforeShow(target);
    }
    hideElement(): void {
      this.stopAutoUpdate();
      this.floatingContent?.hidePopover();
      this.isVisible = false;
    }

    handleSlotChange(e: Event, showFn: (this: void) => void, hideFn: (this: void) => void) {
      const newTrigger = e.target as HTMLElement;

      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn);
      }
      if (newTrigger !== undefined || newTrigger !== null) {
        this.attachTriggerListeners(newTrigger, showFn, hideFn);
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

    attachTriggerListeners(trigger: HTMLElement, showFn: (this: void) => void, hideFn: (this: void) => void) {
      trigger.addEventListener(EVENTS.Focus, showFn);
      trigger.addEventListener(EVENTS.Blur, hideFn);
    }

    componentWillLoad() {
      this.toggle = this.toggle.bind(this) as typeof this.toggle;
      this.show = this.show.bind(this) as typeof this.show;
      this.hide = this.hide.bind(this) as typeof this.hide;

      this.positionEngine = new PositioningEngine();
      this.logger = new Logger();
      this.cleanupAutoUpdate = undefined;
      this.previousTrigger = undefined;
    }

    detachTriggerListeners(trigger: HTMLElement, showFn: (this: void) => void, hideFn: (this: void) => void) {
      trigger.removeEventListener(EVENTS.Focus, showFn);
      trigger.removeEventListener(EVENTS.Blur, hideFn);
    }
    floatingDisconnect(showFn: (this: void) => void, hideFn: (this: void) => void) {
      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
        this.detachTriggerListeners(this.previousTrigger, showFn, hideFn);
      }
      this.stopAutoUpdate();
    }
    disconnectedCallback() {
      if (this.previousTrigger !== undefined || this.previousTrigger !== null) {
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
