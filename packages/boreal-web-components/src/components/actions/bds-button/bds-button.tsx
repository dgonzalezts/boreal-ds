import { AttachInternals, Component, Element, h, Prop, State } from '@stencil/core';
import IButton from './types/IButton';
import { STATES, StyleModifiers } from '@/types';
import { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './types/enum';
import { CORE_COLORS } from '@/types/coreColors';
import { Validate } from '@/utils/decorators/validate.decorate';
import { emitEvent } from '@/utils/helpers/eventEmitter';

/**
 *  Button component for user interactions, form submissions, supporting various styles, sizes, and states.
 *
 * @summary A versatile button component that can be customized with different colors, sizes, variants and states to fit various use cases in the application.
 * @slot - The content of the button, typically text or an icon.
 * @slot icon - Content to show button at the begining of the button
 * @slot badge - Slot to place a badge component
 *
 * @attr {string} label - The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes.
 * @attr {boolean} disabled - Disables the button when true, preventing user interaction and applying disabled styles.
 * @attr {string} name - The name attribute for the button, useful for form submissions.
 * @attr {string} type - The type of the button, which can be 'button', 'submit', or 'reset'. Default is 'button'.
 * @attr {string} color - The color theme of the button, which can be 'default', 'primary', 'success', or 'danger'. Default is 'default'.
 * @attr {string} variant - The visual style of the button, which can be 'default', 'outline', or 'plain'. Default is 'default'.
 * @attr {string} size - The size of the button, which can be 'small', 'medium', or 'large'. Default is 'medium'.
 * @attr {boolean} loading - Indicates whether the button is in a loading state, which can be used to show a loading spinner and disable the button. Default is false.
 * @attr {boolean} disclosure - Indicates if the button should show a chevron down at the end of the content.
 *
 * @property {string} label - The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes.
 * @property {boolean} disabled - Disables the button when true, preventing user interaction and applying disabled styles.
 * @property {string} name - The name attribute for the button, useful for form submissions.
 * @property {string} type - The type of the button, which can be 'button', 'submit', or 'reset'. Default is 'button'.
 * @property {string} color - The color theme of the button, which can be 'default', 'primary', 'success', or 'danger'. Default is 'default'.
 * @property {string} variant - The visual style of the button, which can be 'default', 'outline', or 'plain'. Default is 'default'.
 * @property {string} size - The size of the button, which can be 'small', 'medium', or 'large'. Default is 'medium'.
 * @property {boolean} loading - Indicates whether the button is in a loading state, which can be used to show a loading spinner and disable the button. Default is false.
 * @property {boolean} disclosure - Indicates if the button should show a chevron down at the end of the content.
 *
 * @default 'button' - Default type value
 * @default 'default' - Default color value
 * @default 'default' - Default variant value
 * @default 'medium' - Default size value
 * @default 'default' - Default status value
 * @default false - Default disabled value
 * @default '' - Default label value
 * @default '' - Default name value
 * @default false - Default loading value
 * @default false - Default disclosure value
 */
@Component({
  tag: 'bds-button',
  styleUrl: 'bds-button.scss',
  formAssociated: true,
})
export class BdsButton implements IButton {
  /** State to manage states */
  @State() currentState: IButton['currentState'] = STATES.DEFAULT;
  /* Props to manage the button attributes */
  /** The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes. */
  @Prop() readonly label: IButton['label'] = '';

  /** disabled is a boolean attribute. Disables the button when true, preventing user interaction and applying disabled styles. */
  @Prop() readonly disabled: IButton['disabled'] = false;

  /** name is a string attribute. The name attribute for the button, useful for form submissions. */
  @Prop() readonly name: IButton['name'] = '';

  /** type is a string attribute. The type of the button, which can be 'button', 'submit', or 'reset'. Default is 'button'. */
  @Prop() @Validate(Object.values(BUTTON_TYPES), BUTTON_TYPES.BUTTON) readonly type: IButton['type'] =
    BUTTON_TYPES.BUTTON;

  /** color is a string attribute. The color theme of the button, which can be 'default', 'primary', 'success', or 'danger'. Default is 'default'. */
  @Prop() @Validate(Object.values(CORE_COLORS), CORE_COLORS.DEFAULT) readonly color: IButton['color'] =
    CORE_COLORS.DEFAULT;

  /** variant is a string attribute. The visual style of the button, which can be 'default', 'outline', or 'plain'. Default is 'default'.*/
  @Prop() @Validate(Object.values(BUTTON_VARIANTS), BUTTON_VARIANTS.DEFAULT) readonly variant: IButton['variant'] =
    BUTTON_VARIANTS.DEFAULT;

  /** size is a string attribute. The size of the button, which can be 'small', 'medium', or 'large'. Default is 'medium'. */
  @Prop() @Validate(Object.values(BUTTON_SIZES), BUTTON_SIZES.MEDIUM) readonly size: IButton['size'] =
    BUTTON_SIZES.MEDIUM;

  /** loading is a boolean attribute. Indicates whether the button is in a loading state, which can be used to show a loading spinner and disable the button. Default is false. */
  @Prop() readonly loading: IButton['loading'] = false;

  /** disclosure is a boolean attribute. Used to show a chevron down at the of the content */
  @Prop() readonly disclosure: IButton['disclosure'] = false;

  /** variable to store local HTMLElement */
  @Element() el!: HTMLBdsButtonElement;

  /** variable to attach internal form if exist */
  @AttachInternals() internals!: ElementInternals;
  private internalForm!: HTMLFormElement | undefined;

  /** After component rendered */
  componentDidLoad() {
    this.setupFormAssociation();
  }

  /** Event for listen keydown from button, make navigation easier */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this.currentState = STATES.ACTIVE;
      event.preventDefault();
      this.el.click();
    }
  };

  /** reset status on keyup */
  private handleKeyUp = () => {
    this.currentState = STATES.DEFAULT;
  };

  /** Select closest form or internal form from ElementInternals */
  private setupFormAssociation() {
    const closestForm = this.el.closest('form');
    const intForm = this.internals && 'form' in this.internals ? this.internals.form : null;
    this.internalForm = intForm || closestForm || undefined;
  }

  /** Method to handle custom click events */
  private handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled || this.loading) return;

    if (this.type === BUTTON_TYPES.SUBMIT || this.type === BUTTON_TYPES.RESET) {
      this.proccessFormClick();
    } else {
      emitEvent('click', this.el, { event }, event);
    }
  };

  /** Decide which form action to perform based on button type */
  private proccessFormClick() {
    if (this.internalForm === undefined) {
      console.warn(
        '[BorealDS Button] No form found for submit/reset action. Please ensure the button is within a form or that the form is properly associated.',
      );
      return;
    }
    const events: Record<string, () => void> = {
      [BUTTON_TYPES.SUBMIT]: () => {
        if (typeof this.internalForm?.requestSubmit === 'function') {
          this.internalForm.requestSubmit();
        } else {
          this.internalForm?.submit();
        }
      },
      [BUTTON_TYPES.RESET]: () => this.internalForm?.reset(),
    };
    const action = events[this.type];

    if (typeof action === 'function') {
      action();
    }
    return;
  }

  /* Method to get the class map for the button based on the props */
  private get getClassMap(): StyleModifiers {
    return {
      'bds-button': true,
      'bds-button--is-disabled': this.disabled,
      'bds-button--is-loading': this.loading,
      [`bds-button--state-${this.currentState}`]: true,
      [`bds-button--${this.color}`]: true,
      [`bds-button--var-${this.variant}`]: true,
      [`bds-button--size-${this.size}`]: true,
    };
  }

  /* render button depends on variant */
  render() {
    return (
      <button
        name={this.name}
        class={this.getClassMap}
        type={this.type}
        disabled={this.disabled}
        role="button"
        aria-label={this.label || 'Button component'}
        aria-disabled={this.disabled}
        tabIndex={this.disabled ? -1 : 0}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      >
        <div class="bds-button__content">
          <span class="bds-button__content-icon bds-button__content-icon--start">
            <slot name="icon"></slot>
          </span>
          <slot></slot>
          <span class="bds-button__content-badge">
            <slot name="badge"></slot>
          </span>
          {this.disclosure && (
            <span class="bds-button__content-icon">
              <i class="bds-icon-chevron-down"></i>
            </span>
          )}
        </div>
      </button>
    );
  }
}
