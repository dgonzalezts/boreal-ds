import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { ITooltip } from './types/IBdsTooltip';
import { autoUpdate, Placement } from '@floating-ui/dom';
import { PositioningEngine } from '@/services/positioning/positioning.service';
import { Logger } from '@/services/logger/Logger';

@Component({
  tag: 'bds-tooltip',
  styleUrl: 'bds-tooltip.scss',
  shadow: false,
})
export class BdsTooltip implements ITooltip {
  /**
   * If true, hides the tooltip arrow.
   * @default false
   */
  @Prop({ reflect: true }) readonly hideArrow: boolean = false;

  /**
   * If true, disables the tooltip (it will not show).
   * @default false;
   */
  @Prop({ reflect: true }) readonly disabled: boolean = false;

  /**
   * Tooltip position relative to the trigger element.
   * Accepts values like 'top', 'bottom', 'left', 'right', etc. (from Floating UI Placement)
   * @default 'top'
   */
  @Prop() readonly position: Placement = 'top';

  /**
   * Width of the tooltip in pixels.
   * @default 200
   */
  @Prop() readonly width: number = 200;

  /**
   * If true, allows multiline content in the tooltip.
   * @default false
   */
  @Prop() readonly multiline: boolean = false;

  /**
   * Distance in pixels between the tooltip and the trigger element.
   * @default 8
   */
  @Prop() readonly distance: number = 8;

  /**
   * If true, tooltip is shown/hidden on click instead of hover/focus.
   * @default false
   */
  @Prop({ reflect: true }) readonly showOnClick: boolean = false;

  /**
   * Whether the tooltip is currently visible.
   * @internal
   */
  @State() isVisible: boolean = false;

  private cleanupAutoUpdate: () => void;
  private previousTrigger: HTMLElement;
  private positionEngine: PositioningEngine = new PositioningEngine();
  private logger: Logger = new Logger();

  // Refs en Stencil se obtienen con el atributo ref en el render
  private tooltipContent!: HTMLElement;
  private arrowElement!: HTMLElement;
  private triggerSlot!: HTMLElement;

  @Element() el!: HTMLBdsTooltipElement;

  // --- Lifecycle ---

  componentDidLoad() {
    this.hide();
    this.el.style.setProperty('--tooltip-width', `${this.width}px`);
  }

  @Watch('width')
  onWidthChange(newValue: number) {
    this.el.style.setProperty('--tooltip-width', `${newValue}px`);
  }

  disconnectedCallback() {
    if (this.previousTrigger) {
      this.previousTrigger.removeEventListener('focus', this.show);
      this.previousTrigger.removeEventListener('blur', this.hide);
      if (this.showOnClick) {
        this.previousTrigger.removeEventListener('click', this.toggleTooltip);
      }
    }
    this.cleanupAutoUpdate?.();
  }

  // --- Handlers ---

  private handleSlotChange = (e: Event) => {
    const newTrigger = e.target as HTMLElement;

    if (this.previousTrigger) {
      this.previousTrigger.removeEventListener('focus', this.show);
      this.previousTrigger.removeEventListener('blur', this.hide);
      if (this.showOnClick) {
        this.previousTrigger.removeEventListener('click', this.toggleTooltip);
      }
    }

    if (newTrigger) {
      newTrigger.addEventListener('focus', this.show);
      newTrigger.addEventListener('blur', this.hide);
      if (this.showOnClick) {
        newTrigger.addEventListener('click', this.toggleTooltip);
      }
      this.previousTrigger = newTrigger;
    }
  };

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') this.show();
    if (e.key === 'Escape') this.hide();
  };

  // --- Tooltip control ---

  private show = () => {
    if (this.disabled) return;

    this.isVisible = true;
    if (!this.tooltipContent || !this.triggerSlot) return;

    const triggerElement = this.triggerSlot;
    if (!triggerElement) {
      this.logger.warn('BDS-Tooltip', 'No trigger element found in tooltip slot');
      return;
    }

    this.tooltipContent.showPopover();

    const updatePosition = async () => {
      const result = await this.positionEngine.computePosition(triggerElement, this.tooltipContent, {
        placement: this.position,
        offset: this.distance,
        flip: true,
        shift: true,
        arrow: this.hideArrow ? undefined : this.arrowElement,
        strategy: 'fixed',
      });

      this.positionEngine.applyPosition(this.tooltipContent, result);

      if (result.middlewareData?.arrow && this.arrowElement) {
        const { x: arrowX, y: arrowY } = result.middlewareData.arrow;
        Object.assign(this.arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
        });
      }

      this.tooltipContent.setAttribute('data-placement', result.placement);
    };
    const updatePositionSync = () => {
      void updatePosition();
    };

    updatePositionSync();
    this.cleanupAutoUpdate = autoUpdate(triggerElement, this.tooltipContent, updatePositionSync);
  };

  private hide = () => {
    this.isVisible = false;
    if (!this.tooltipContent) return;

    this.cleanupAutoUpdate?.();
    this.cleanupAutoUpdate = undefined;

    this.tooltipContent.hidePopover?.();
  };

  private toggleTooltip = () => {
    if (this.isVisible) this.hide();
    else this.show();
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
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          onKeyDown={this.handleKeydown}
          ref={el => (this.triggerSlot = el)}
        >
          <slot onSlotchange={this.handleSlotChange}></slot>
        </span>
        <div
          part="tooltip-content"
          class="tooltip-content"
          popover="manual"
          role="tooltip"
          aria-hidden={this.isVisible ? 'false' : 'true'}
          data-position={this.position}
          data-multiLine={this.multiline}
          data-hidearrow={this.hideArrow}
          ref={el => (this.tooltipContent = el as HTMLElement)}
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
