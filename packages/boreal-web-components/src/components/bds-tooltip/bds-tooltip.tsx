import { Component, Element, Host, Mixin, Prop, h } from '@stencil/core';
import { ITooltip } from './types/IBdsTooltip';
import { PositioningResult } from '@/services/floating/interfaces/Positioning';
import { anchoredMixin } from '@/mixins/anchored.mixin';
import { ANCHORED_TOOLTIP } from '@/utils/constants/floating/anchored/AnchoredTooltip';
import { FloatingTooltipProp } from '@/services/floating/interfaces/Props';
import { FloatingHooks, FloatingMixinOptions } from '@/services/floating/interfaces/Floating';

@Component({
  tag: 'bds-tooltip',
  styleUrl: 'bds-tooltip.scss',
  shadow: false,
})
export class BdsTooltip extends Mixin(anchoredMixin) implements ITooltip {
  /**
   * If true, allows multiline content in the tooltip.
   * @default false
   */
  @Prop() readonly multiline?: boolean;

  /**
   * If true, disables the tooltip.
   * @default false
   */
  @Prop() readonly disabled?: boolean = false;

  /**
   * Override default options for the floating mixin.
   * This can be overridden by passing a different object to the `floatingOptions` prop.
   */
  @Prop() readonly floatingOptions: FloatingTooltipProp = {
    ...ANCHORED_TOOLTIP,
  };

  // Refs en Stencil se obtienen con el atributo ref en el render
  private arrowElement!: HTMLElement;

  @Element() el!: HTMLBdsTooltipElement;

  get options(): FloatingMixinOptions {
    return {
      placement: this.floatingOptions.placement ?? 'bottom',
      offset: this.floatingOptions.offset ?? 8,
      arrow: this.floatingOptions.hideArrow ? undefined : this.arrowElement,
      strategy: 'fixed',
    };
  }
  // --- Lifecycle ---
  get hooks(): FloatingHooks {
    return {
      onPositionUpdate: result => this.handlePosition(result),
      onBeforeShow: () => this.validateShow(),
      onBeforeHide: (target: HTMLElement) => this.validateHide(target),
    };
  }
  private validateShow() {
    return !this.disabled;
  }
  private validateHide(target: HTMLElement): boolean {
    if (this.floatingOptions.stayOnHover && target) {
      const goingToFloating = this.floatingContent.contains(target) || this.floatingContent === target;
      if (goingToFloating) return false;
    }
    return true;
  }
  private handlePosition(result: PositioningResult) {
    this.floatingContent.setAttribute('data-placement', result.placement);
    this.setArrowPosition(result);
  }
  private setArrowPosition(result: PositioningResult) {
    if (result.middlewareData?.arrow && this.arrowElement) {
      const { x: arrowX, y: arrowY } = result.middlewareData.arrow;
      Object.assign(this.arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
      });
    }
  }
  private onKeyDown = (e: KeyboardEvent) => {
    this.handleKeydown(
      e,
      () => this.show(),
      () => this.hide(),
    );
  };
  private onSlotChange = (e: KeyboardEvent) => {
    this.handleSlotChange(
      e,
      () => this.show(),
      () => this.hide(),
    );
  };

  // --- Render ---
  render() {
    return (
      <Host
        class="tooltip"
        onMouseEnter={() => this.show()}
        onMouseLeave={(e: MouseEvent) => this.hide(e.target as HTMLElement)}
      >
        <span
          part="tooltip"
          role="button"
          tabindex="0"
          aria-describedby="tooltip-content"
          aria-expanded={this.isVisible ? 'true' : 'false'}
          onMouseEnter={() => this.show()}
          onKeyDown={() => this.onKeyDown}
          ref={el => (this.triggerSlot = el)}
        >
          <slot onSlotchange={this.onSlotChange}></slot>
        </span>
        <div
          part="tooltip-content"
          class="tooltip-content"
          popover="manual"
          role="tooltip"
          aria-hidden={this.isVisible ? 'false' : 'true'}
          data-position={this.floatingOptions.placement}
          data-multiLine={this.multiline}
          data-hidearrow={this.floatingOptions.hideArrow}
          ref={el => (this.floatingContent = el as HTMLElement)}
        >
          {!this.floatingOptions.hideArrow && (
            <div class="tooltip-arrow" part="arrow" ref={el => (this.arrowElement = el as HTMLElement)} />
          )}
          <slot name="tooltip-content" />
        </div>
      </Host>
    );
  }
}

declare global {
  interface HTMLElement {
    showPopover(): void;
    hidePopover(): void;
    togglePopover(force?: boolean): void;
  }
}
