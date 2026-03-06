import { Component, Element, Event, EventEmitter, Host, JSX, Method, Prop, State, h } from '@stencil/core';

import type { IBanner } from './types/IBanner';
import { STATUS_VARIANT } from '@/types';
import { Attributes, inheritAriaAttributes } from '@/utils/a11y/attributes';
import { getBaseAttributes } from '@/utils/helpers/common/BaseAttributes';

/**
 * Banner component used to display important messages with different status variants.
 *
 * @summary Displays a dismissible banner with an icon, title, body content, and optional actions.
 *
 * @slot title - Slot for the banner title text.
 * @slot - Default slot for the main body content of the banner.
 * @slot actions - Slot for action buttons or links displayed at the end of the banner.
 *
 * @attr {"info"|"success"|"warning"|"danger"} variant - Status variant of the banner, affects color and icon. Defaults to "info".
 * @attr {boolean} enable-close - When true, renders a close button that triggers the close event.
 * @attr {string} idComponent - Unique identifier for the banner element.
 *
 * @property {string} idComponent - Unique identifier for the banner element.
 * @property {"info"|"success"|"warning"|"danger"} variant - Visual style variant: 'info', 'success', 'warning', or 'danger'. Defaults to "info".
 * @property {boolean} enableClose - Shows a close button that allows users to dismiss the banner. Defaults to false.
 *
 * @fires close - Emitted when the banner is closed via the close button or `closeBanner` method.
 *
 * @method closeBanner - Programmatic method to close the banner and emit the `close` event.
 *
 */
@Component({
  tag: 'bds-banner',
  styleUrl: 'bds-banner.scss',
})
export class BdsBanner implements IBanner {
  private inheritedAttributes: Attributes = {};
  /**
   * Reference to the host element.
   */
  @Element() el!: HTMLBdsBannerElement;

  /**
   * Internal state tracking the banner's closing animation.
   */
  @State() isClosing: boolean = false;

  /**
   * Controls the visibility of the banner. Set to false to hide the banner.
   */
  @State() isOpen: boolean = true;

  /**
   * Unique identifier for the banner element.
   */
  @Prop() readonly idComponent: string = '';

  /**
   * Visual style variant: 'info', 'success', 'warning', or 'danger'.
   * @default "info"
   */
  @Prop() readonly variant: IBanner['variant'] = STATUS_VARIANT.INFO;

  /**
   * Shows a close button that allows users to dismiss the banner.
   * @default false
   */
  @Prop() readonly enableClose: IBanner['enableClose'] = false;

  /**
   * Emitted when the banner is closed via the close button or handleClose method.
   */
  @Event() close!: EventEmitter<void>;

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...getBaseAttributes(this),
    };
  }

  /**
   * Programmatic method to close the banner and emit the `close` event
   */
  @Method()
  async closeBanner() {
    this.handleCloseBanner();
  }

  private handleCloseBanner(e?: Event) {
    if (e !== undefined) e.preventDefault();
    this.isClosing = true;
    this.close.emit();
  }

  private handleEscapeKeyClose(e: KeyboardEvent) {
    if (!this.enableClose) return;
    if (e.key === 'Escape') this.handleCloseBanner();
  }

  private handleAnimationEnd = () => {
    if (this.isClosing)
      requestAnimationFrame(() => {
        this.isClosing = false;
        this.isOpen = false;
      });
  };

  private getIconName() {
    const iconMap = {
      info: 'bds-icon-info-circle-fill',
      success: 'bds-icon-check-circle-fill',
      warning: 'bds-icon-info-major-triangle-up-fill',
      danger: 'bds-icon-alert-circle-fill',
    };

    if (iconMap[this.variant] === undefined) return iconMap['info'];
    return iconMap[this.variant];
  }

  private getAttributes() {
    return {
      ...this.inheritedAttributes,
      role: 'alert',
      'aria-describedby': this.isOpen ? 'bds-banner__content' : null,
      'aria-live': 'polite',
      'aria-hidden': `${!this.isOpen}`,
      tabIndex: this.isOpen ? 0 : -1,
    };
  }

  private getStyles() {
    return {
      'bds-banner': true,
      [`bds-banner--${this.variant}`]: true,
      'bds-banner--closing': this.isClosing,
    };
  }

  private renderCloseIcon(): JSX.Element {
    return (
      // TODO how to pass this inner aria attr from outside?
      <button
        role="close-button"
        class="bds-banner__close-icon"
        aria-label="Alert close button"
        onClick={e => this.handleCloseBanner(e)}
      >
        <em class="bds-icon-close"></em>
      </button>
    );
  }

  render() {
    if (!this.isOpen) return;
    const closeIcon = this.renderCloseIcon();

    const classes = this.getStyles();
    const iconName = this.getIconName();

    return (
      <Host
        class={classes}
        {...this.getAttributes()}
        onTransitionEnd={this.handleAnimationEnd}
        onKeyDown={(e: KeyboardEvent) => this.handleEscapeKeyClose(e)}
      >
        <div class="bds-banner__vertical-line"></div>
        <div class="bds-banner__container">
          <div class="bds-banner__status-icon" role="status" aria-live="polite" aria-label={`status ${this.variant}`}>
            <em aria-hidden="true" class={iconName}></em>
          </div>
          <div class="bds-banner__content">
            <div class="bds-banner__title">
              <slot name="title"></slot>
            </div>
            <div class="bds-banner__body">
              <slot></slot>
            </div>
            <div class="bds-banner__actions">
              <slot name="actions"></slot>
            </div>
          </div>
          {this.enableClose && closeIcon}
        </div>
      </Host>
    );
  }
}
