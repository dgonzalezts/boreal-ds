import { Component, Element, Host, Mixin, Prop, State, h } from '@stencil/core';
import { ITooltip } from './types/IBdsTooltip';
import { anchoredMixin } from '@/mixins/anchored.mixin';
import { StyleModifiers } from '@/types';
import { AnchoredHooks, FloatingMixinOptions, FloatingTooltipProp, PositioningResult } from '@/services';

/**
 * Tooltip component used to display contextual information on hover or focus.
 *
 * @summary Displays a floating tooltip anchored to a trigger element, with support
 * for placement, arrow, multiline content, and hover persistence.
 *
 * @slot - Default slot for the tooltip body content.
 *
 * @attr {boolean} multiline - When true, allows the tooltip content to wrap across multiple lines.
 * @attr {boolean} disabled - When true, prevents the tooltip from being shown.
 * @attr {FloatingTooltipProp} floatingOptions - Configuration object for floating behavior.
 *
 * @property {boolean} multiline - Allows multiline content in the tooltip. Defaults to false.
 * @property {boolean} disabled - Disables the tooltip, preventing it from showing. Defaults to false.
 * @property {FloatingTooltipProp} floatingOptions - Override default floating options.
 * @property {number} floatingOptions.offset - Distance in pixels between the tooltip and the trigger. Defaults to 8.
 * @property {boolean} floatingOptions.hideArrow - When true, hides the arrow element. Defaults to false.
 * @property {boolean} floatingOptions.stayOnHover - When true, keeps the tooltip visible while hovering over the tooltip content itself.
 *
 * @csspart tooltip-content - The main tooltip container element.
 * @csspart arrow - The arrow element pointing toward the trigger.
 *
 * @cssprop data-placement - Reflects the resolved placement on the tooltip-content element.
 * @cssprop data-multiline - Reflects the multiline prop on the tooltip-content element.
 * @cssprop data-hidearrow - Reflects the hideArrow option on the tooltip-content element.
 */
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
  @Prop() readonly multiline?: ITooltip['multiline'] = false;

  /**
   * If true, disables the tooltip.
   * @default false
   */
  @Prop() readonly disabled?: ITooltip['disabled'] = false;

  /**
   * Override default options for the floating mixin.
   * This can be overridden by passing a different object to the `floatingOptions` prop.
   */
  @Prop() readonly floatingOptions: Partial<FloatingTooltipProp> = {};

  @State() isVisible: boolean = false;

  // Refs en Stencil se obtienen con el atributo ref en el render
  private arrowElement!: HTMLElement;

  @Element() el!: HTMLBdsTooltipElement;

  /**
   * Returns the resolved options for the floating mixin, merging `floatingOptions`
   * prop values with their defaults.
   *
   * @returns {FloatingMixinOptions} Resolved configuration used by the anchored mixin
   * to position the tooltip.
   * @override anchoredMixin.options
   *
   * @example
   * // floatingOptions = { placement: 'top', hideArrow: true }
   * this.options
   * return { placement: 'top', offset: 8, arrow: undefined, strategy: 'fixed' }
   */
  get options(): FloatingMixinOptions {
    return {
      placement: this.floatingOptions.placement ?? 'bottom',
      offset: this.floatingOptions.offset ?? 8,
      arrow: this.floatingOptions.hideArrow ? undefined : this.arrowElement,
      strategy: 'fixed',
    };
  }

  /**
   * Returns the lifecycle hooks consumed by the anchored mixin to control
   * tooltip visibility and positioning.
   * @override anchoredMixin.hooks
   *
   * @returns {AnchoredHooks} Object containing the three hook callbacks:
   * - `onPositionUpdate` — called after each positioning calculation.
   * - `onBeforeShow` — called before the tooltip becomes visible; returning false cancels the show.
   * - `onBeforeHide` — called before the tooltip is hidden; returning false cancels the hide.
   */
  get hooks(): AnchoredHooks {
    return {
      onPositionUpdate: result => this.handlePosition(result),
      onBeforeShow: () => this.validateShow(),
      onBeforeHide: (target: HTMLElement) => this.validateHide(target),
    };
  }

  get canShowArrow(): boolean {
    return !this.floatingOptions.hideArrow || false;
  }
  get getPlacement(): string {
    return this.floatingOptions.placement || 'bottom';
  }

  /**
   * Guard called by `onBeforeShow` to determine whether the tooltip is allowed to show.
   *
   * @returns {boolean} `true` if the tooltip is not disabled and may be shown; `false` otherwise.
   */
  private validateShow() {
    return !this.disabled;
  }

  /**
   * Guard called by `onBeforeHide` to determine whether the tooltip is allowed to hide.
   * When `stayOnHover` is enabled, hides are cancelled if the pointer is moving
   * into the floating content element itself.
   *
   * @param target - The element the pointer is moving toward (relatedTarget of the mouseleave event).
   * @returns {boolean} `true` if the tooltip should hide; `false` if the hide should be cancelled.
   */
  private validateHide(target: HTMLElement): boolean {
    if (this.floatingOptions.stayOnHover && target.isConnected) {
      const goingToFloating = this.floatingContent.contains(target) || this.floatingContent === target;
      if (goingToFloating) return false;
    }
    return true;
  }

  /**
   * Callback for `onPositionUpdate`. Applies the resolved placement as a
   * `data-placement` attribute on the floating content element and delegates
   * arrow positioning to `setArrowPosition`.
   *
   * @param result - The positioning result produced by the floating middleware.
   */
  private handlePosition(result: PositioningResult) {
    this.floatingContent.setAttribute('data-placement', result.placement);
    this.setArrowPosition(result);
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
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
      });
    }
  }

  get tooltipStyles(): StyleModifiers {
    return {
      'tooltip-content': true,
      'tooltip-content--multiline': this.multiline,
    };
  }

  render() {
    const classes = this.tooltipStyles;

    return (
      <Host class="tooltip">
        <div
          id="tooltip-content"
          part="tooltip-content"
          class={classes}
          popover="manual"
          role="tooltip"
          aria-hidden={this.isVisible ? 'false' : 'true'}
          data-placement={this.getPlacement}
          data-multiline={this.multiline}
          data-hidearrow={this.canShowArrow}
          ref={el => (this.floatingContent = el as HTMLElement)}
        >
          {this.canShowArrow && (
            <div class="tooltip-arrow" part="arrow" ref={el => (this.arrowElement = el as HTMLElement)} />
          )}
          <slot />
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
