import { Component, Element, Host, Mixin, Prop, State, h } from '@stencil/core';
import { ITooltip } from './types/IBdsTooltip';
import { floatingMixin, FloatingMixinOptions } from '@/mixins/floating.mixin';
import { FloatingHooks, FloatingProp, PositioningResult } from '@/services/positioning/interfaces/Positioning';
import { FLOATING_OPTIONS } from '@/utils/constants/floating/FloatingOptions';

@Component({
  tag: 'bds-tooltip',
  styleUrl: 'bds-tooltip.scss',
  shadow: false,
})
export class BdsTooltip extends Mixin(floatingMixin) implements ITooltip {
  /**
   * If true, hides the tooltip arrow.
   * @default false
   */
  @Prop({ reflect: true }) readonly hideArrow: boolean = false;

  /**
   * Override default options for the floating mixin.
   * This can be overridden by passing a different object to the `floatingOptions` prop.
   */
  @Prop() readonly floatingOptions: FloatingProp = {
    ...FLOATING_OPTIONS,
  };

  // Refs en Stencil se obtienen con el atributo ref en el render
  private arrowElement!: HTMLElement;
  @State() isVisible: boolean = false;

  @Element() el!: HTMLBdsTooltipElement;

  get options(): FloatingMixinOptions {
    return {
      placement: this.floatingOptions.placement ?? 'bottom',
      offset: this.floatingOptions.offset ?? 8,
      arrow: this.hideArrow ? undefined : this.arrowElement,
      strategy: 'fixed',
    };
  }
  // --- Lifecycle ---
  get hooks(): FloatingHooks {
    return {
      onPositionUpdate: result => this.handlePosition(result),
    };
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
      () => this.toggle(),
      this.floatingOptions.showOnClick,
    );
  };

  // --- Render ---
  render() {
    return (
      <Host class="tooltip">
        <span
          part="tooltip"
          role="button"
          tabindex="0"
          aria-describedby="tooltip-content"
          aria-expanded={this.isVisible ? 'true' : 'false'}
          onMouseEnter={() => this.show()}
          onMouseLeave={() => this.hide()}
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
          data-hidearrow={this.hideArrow}
          ref={el => (this.floatingContent = el as HTMLElement)}
        >
          {!this.hideArrow && (
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
