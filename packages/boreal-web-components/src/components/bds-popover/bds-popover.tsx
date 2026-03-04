import { Component, ComponentInterface, Element, Host, Mixin, Prop, h } from '@stencil/core';
import { anchoredMixin } from '@/mixins/anchored.mixin';
import { FloatingHooks, FloatingMixinOptions } from '@/services/floating/interfaces/Floating';
import { PositioningResult } from '@/services/floating/interfaces/Positioning';
import { FloatingPopoverProp } from '@/services/floating/interfaces/Props';
import { ANCHORED_TOOLTIP } from '@/utils/constants/floating/anchored/AnchoredTooltip';
import { EVENTS } from '@/utils/constants/common/Events';

@Component({
  tag: 'bds-popover',
  styleUrl: 'bds-popover.scss',
  shadow: false,
})
export class BdsPopover extends Mixin(anchoredMixin) implements ComponentInterface {
  /**
   * Override default options for the floating mixin.
   * This can be overridden by passing a different object to the `floatingOptions` prop.
   */
  @Prop() readonly floatingOptions: FloatingPopoverProp = { ...ANCHORED_TOOLTIP };

  /**
   * If true, disables the popover.
   * @default false
   */
  @Prop() readonly disabled?: boolean = false;

  /**
   * If true, allows multiline content in the popover.
   * @default false
   */
  @Prop() readonly trigger?: string;

  @Element() el!: HTMLBdsPopoverElement;

  private boundClickOutside!: (e: MouseEvent) => void;

  get options(): FloatingMixinOptions {
    return {
      placement: this.floatingOptions.placement ?? 'bottom',
      offset: this.floatingOptions.offset ?? 8,
      strategy: 'fixed',
      shift: true,
      flip: true,
    };
  }

  get hooks(): FloatingHooks {
    return {
      onPositionUpdate: result => this.handlePosition(result),
      onBeforeShow: () => !this.disabled,
      onAfterShow: () => this.attachClickOutside(),
      onAfterHide: () => this.detachClickOutside(),
    };
  }

  // --- clickOutside ---
  private attachClickOutside() {
    if (this.floatingOptions.clickOutside) return;

    // Esperar a que el click actual termine de propagarse
    setTimeout(() => {
      this.boundClickOutside = (e: MouseEvent) => this.handleClickOutside(e);
      document.addEventListener(EVENTS.Click, this.boundClickOutside);
    });
  }

  private detachClickOutside() {
    if (this.boundClickOutside) {
      document.removeEventListener(EVENTS.Click, this.boundClickOutside);
      this.boundClickOutside = undefined;
    }
  }

  private handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const clickedInsideTrigger = this.el.contains(target);
    const clickedInsideFloating = this.floatingContent.contains(target) || this.floatingContent === target;

    if (!clickedInsideTrigger && !clickedInsideFloating) {
      this.hide();
    }
  }

  // --- closeOnClick (click dentro del floating cierra) ---
  private handleFloatingClick() {
    if (this.floatingOptions.closeOnClick) this.hide();
  }

  // --- position ---
  private handlePosition(result: PositioningResult) {
    this.floatingContent.setAttribute('data-placement', result.placement);
  }

  componentDidLoad() {
    if (!this.trigger) return;

    const triggerEl = document.getElementById(this.trigger);
    if (!triggerEl) {
      console.warn(`bds-popover: no element found with id "${this.trigger}"`);
      return;
    }

    this.triggerSlot = triggerEl;
    this.isVisible = false;
    triggerEl.addEventListener(EVENTS.Click, () => this.show());
  }

  render() {
    return (
      <Host>
        <div
          class="popover"
          onClick={() => this.handleFloatingClick()}
          ref={el => (this.floatingContent = el as HTMLElement)}
          popover="manual"
          role="dialog"
          aria-hidden={this.isVisible ? 'false' : 'true'}
        >
          <div part="popover-content" class="popover-header">
            Header content
            <span onClick={() => this.hide()}>X</span>
          </div>
          <div class="popover-content">
            <slot></slot>
          </div>
          <div class="popover-footer">Footer content</div>
        </div>
      </Host>
    );
  }
}
