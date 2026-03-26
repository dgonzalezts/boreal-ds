import { Component, Element, Host, Mixin, Prop, h } from '@stencil/core';
import { anchoredMixin } from '@/mixins/anchored.mixin';
import { FloatingMixinOptions } from '@/services/floating/interfaces/Floating';
import { PositioningResult } from '@/services/floating/interfaces/Positioning';
import { EVENTS } from '@/utils/constants/common/Events';
import { IPopover } from './types/IBdsPopover';
import { AnchoredHooks } from '@/services';
import { BUTTON_SIZES } from '@/components/actions/bds-button/types/enum';

@Component({
  tag: 'bds-popover',
  styleUrl: 'bds-popover.scss',
  shadow: false,
})
export class BdsPopover extends Mixin(anchoredMixin) implements IPopover {
  /**
   * Override default options for the floating mixin.
   * This can be overridden by passing a different object to the `floatingOptions` prop.
   */
  @Prop() readonly floatingOptions: IPopover['floatingOptions'] = {};

  /**
   * If true, disables the popover.
   * @default false
   */
  @Prop() readonly disabled?: IPopover['disabled'] = false;

  /**
   * Width of the popover content.
   * - number: width in pixels (e.g. 320 → "320px")
   * - 'full': 100% of the trigger/parent width
   * - 'auto': fits the content
   * @default 320
   */
  @Prop() readonly width?: IPopover['width'] = 320;

  /**
   * If true, allows multiline content in the popover.
   * @default false
   */
  @Prop() readonly trigger?: IPopover['trigger'];

  /**
   * If true, allows multiline content in the popover.
   * @default false
   */
  @Prop() readonly hasHeader?: IPopover['hasHeader'] = false;

  /**
   * If true, allows multiline content in the popover.
   * @default false
   */
  @Prop() readonly hasFooter?: IPopover['hasFooter'] = false;

  /**
   * If true, allows multiline content in the popover.
   * @default false
   */
  @Prop() readonly showClose?: IPopover['showClose'] = false;

  @Element() el!: HTMLBdsPopoverElement;

  private boundClickOutside!: (e: MouseEvent) => void;

  private arrowElement!: HTMLElement;

  /**
   * Returns the resolved options for the floating mixin, merging `floatingOptions`
   * prop values with their defaults.
   */
  get options(): FloatingMixinOptions {
    return {
      placement: this.floatingOptions.placement ?? 'bottom',
      offset: this.floatingOptions.offset ?? 8,
      arrow: this.floatingOptions.hideArrow ? undefined : this.arrowElement,
      strategy: 'fixed',
      shift: true,
      flip: true,
    };
  }
  /**
   * Returns the popover width based on the `width` prop.
   * If `width` is 'full', returns '100%'.
   * If `width` is 'auto', returns 'auto'.
   * Otherwise, returns the provided width in pixels.
   */
  get popoverWidth(): string {
    if (this.width === 'full') return '100%';
    if (this.width === 'auto') return 'auto';
    return `${this.width}px`;
  }

  /**
   * Returns the lifecycle hooks consumed by the anchored mixin to control
   * tooltip visibility and positioning.
   * @override anchoredMixin.hooks
   */
  get hooks(): AnchoredHooks {
    return {
      onPositionUpdate: result => this.handlePosition(result),
      onBeforeShow: () => !this.disabled,
      onAfterShow: () => this.attachClickOutside(),
      onAfterHide: () => this.detachClickOutside(),
      onBeforeLoad: () => this.attachTrigger(),
      subscribeToTrigger: el => this.subscribe(el),
    };
  }

  /**
   * Attaches a click outside listener to the document.
   * If `closeOnClickOutside` is true, the popover will close when the user clicks outside.
   */
  private attachClickOutside() {
    if (this.floatingOptions.closeOnClickOutside) return;

    this.boundClickOutside = (e: MouseEvent) => this.handleClickOutside(e);
    document.addEventListener(EVENTS.Click, this.boundClickOutside);
  }

  /**
   * Detaches the click outside listener from the document.
   * If `closeOnClickOutside` is true, the popover will close when the user clicks outside.
   */
  private detachClickOutside() {
    if (this.boundClickOutside !== null) {
      document.removeEventListener(EVENTS.Click, this.boundClickOutside);
      this.boundClickOutside = undefined;
    }
  }

  /**
   * Applies the arrow element's `x` and `y` coordinates calculated by the
   * floating middleware. Skips the update when the arrow element is not
   * connected to the DOM or when middleware data is absent.
   *
   * @param result - The positioning result that may contain `middlewareData.arrow`
   * with the computed `x` and `y` offsets for the arrow element.
   */
  private setArrowPosition(result: PositioningResult) {
    if (result.middlewareData?.arrow && !this.disabled && this.arrowElement?.isConnected) {
      const { x: arrowX, y: arrowY } = result.middlewareData.arrow;
      Object.assign(this.arrowElement.style, {
        left: arrowX != null ? `${arrowX - arrowX / 1.2}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
      });
    }
  }

  /**
   *  Handles the click outside event.
   *  If the click is inside the trigger or the floating content, it will not close the popover.
   * @param e - Mouse event with the click coordinates.
   */
  private handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const clickedInsideTrigger = this.el.contains(target);
    const clickedInsideFloating = this.floatingContent.contains(target) || this.floatingContent === target;

    if (!clickedInsideTrigger && !clickedInsideFloating) {
      this.hide();
    }
  }

  /**
   * Handles the click event on the floating content.
   * If `closeOnClick` is true, the popover will close when the user clicks inside the floating content.
   */
  private handleFloatingClick() {
    if (this.floatingOptions.closeOnClick) this.hide();
  }

  /**
   *  Handles the position update event.
   *  Updates the position of the floating content and the arrow element.
   * @param result - Positioning result with the position and the placement.
   */
  private handlePosition(result: PositioningResult) {
    this.floatingContent.setAttribute('data-placement', result.placement);
    this.setArrowPosition(result);

    if (this.width === 'full' && this.triggerSlot !== null && this.triggerSlot !== undefined) {
      const realTrigger = this.triggerSlot.parentElement ?? this.triggerSlot;
      const newWidth = realTrigger.getBoundingClientRect().width;
      const currentWidth = this.floatingContent.getBoundingClientRect().width;

      if (Math.round(currentWidth) !== Math.round(newWidth)) {
        this.floatingContent.style.width = `${newWidth}px`;
      }
      void this.updatePosition(this.triggerSlot, this.floatingContent, this.options, r => {
        this.floatingContent.setAttribute('data-placement', r.placement);
        this.setArrowPosition(r);
      });
    } else if (this.width === 'auto') {
      this.floatingContent.style.width = '';
    }
  }

  /**
   *  Attaches the trigger to the popover.
   *  If the trigger is not set, it will return.
   * @returns
   */
  private attachTrigger() {
    if (this.trigger !== null && this.trigger !== undefined) return;
  }

  /**
   *  Subscribes the trigger to the popover.
   *  If the trigger is not a button, input, or select element, it will return.
   * @param trigger - The trigger element to subscribe.
   */
  private subscribe(trigger: HTMLElement): void {
    trigger.setAttribute('part', 'popover-trigger');
    trigger.setAttribute('ariaDescribedBy', 'popover-content');
    const parentBds = trigger.closest('bds-button, bds-input, bds-select');

    if (parentBds !== null && parentBds !== undefined) {
      const nativeEl = parentBds.querySelector('button, input') ?? parentBds.shadowRoot?.querySelector('button, input');
      const listenTarget = nativeEl ?? parentBds;

      listenTarget.addEventListener(EVENTS.Click, (evt: MouseEvent) => this.handleShow(evt));
    } else {
      trigger.addEventListener(EVENTS.Click, (evt: MouseEvent) => this.handleShow(evt));
    }
  }
  /**
   *  Handles the show event.
   *  If the event is not a click event, it will stop the propagation.
   * @param evt - Mouse event with the click coordinates.
   */
  private handleShow(evt: MouseEvent) {
    evt.stopPropagation();
    this.toggle();
  }

  /**
   *  Returns true if the arrow should be shown, false otherwise.
   * @returns - True if the arrow should be shown, false otherwise.
   */
  get canShowArrow(): boolean {
    return !this.floatingOptions.hideArrow || false;
  }
  /**
   *  Returns the placement of the popover.
   * @returns - The placement of the popover.
   */
  get getPlacement(): string {
    return this.floatingOptions.placement || 'bottom';
  }
  /**
   *  Returns true if the header slot is present, false otherwise.
   * @returns - True if the header slot is present, false otherwise.
   */
  get hasHeaderSlot(): boolean {
    return this.el.querySelector('[slot="header"]') !== null;
  }
  /**
   *  Returns true if the footer slot is present, false otherwise.
   * @returns - True if the footer slot is present, false otherwise.
   */
  get hasFooterSlot(): boolean {
    return this.el.querySelector('[slot="footer"]') !== null;
  }

  render() {
    return (
      <Host>
        <div
          class="popover"
          style={{ width: this.popoverWidth }}
          ref={el => (this.floatingContent = el as HTMLElement)}
          popover="manual"
          role="tooltip"
          data-placement={this.getPlacement}
          data-hidearrow={this.canShowArrow}
          aria-hidden={this.isVisible ? 'false' : 'true'}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {this.hasHeader && (
            <div class="popover-header">
              <div class="popover-header__content">
                <span class="popover-header__icon">
                  <slot name="header-icon"></slot>
                </span>
                <span class="popover-header__title">
                  <slot name="header-title"></slot>
                </span>
              </div>
              {this.showClose && (
                <bds-button class="popover-header__close" size={BUTTON_SIZES.SMALL} onBdsClick={() => this.hide()}>
                  <em slot="icon" class="bds-icon-close"></em>
                </bds-button>
              )}
            </div>
          )}
          {this.canShowArrow && (
            <div class="popover-arrow" part="arrow" ref={el => (this.arrowElement = el as HTMLElement)} />
          )}
          <div class="popover-content" part="popover-content" onClick={() => this.handleFloatingClick()}>
            <slot></slot>
          </div>
          {this.hasFooter && (
            <div class="popover-footer">
              <slot name="footer-helper"></slot>
              <slot name="footer-button"></slot>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
