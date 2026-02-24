import { Component, h, Prop, State } from '@stencil/core';
import IButton from './types/IButton';
import { STATES, StyleModifiers } from '@/types';
import { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './types/enum';
import { CORE_COLORS } from '@/types/coreColors';

/**
 *  Button component for user interactions, form submissions, supporting various styles, sizes, and states.
 *
 * @element bds-button
 *
 * @summary A versatile button component that can be customized with different colors, sizes, variants, and states to fit various use cases in the application.
 * @slot - The content of the button, typically text or an icon.
 *
 * @attr {string} label - The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes.
 * @attr {boolean} disabled - Disables the button when true, preventing user interaction and applying disabled styles.
 * @attr {string} name - The name attribute for the button, useful for form submissions.
 * @attr {string} type - The type of the button, which can be 'button', 'submit', or 'reset'. Default is 'button'.
 * @attr {string} color - The color theme of the button, which can be 'default', 'primary', 'success', or 'danger'. Default is 'default'.
 * @attr {string} variant - The visual style of the button, which can be 'default', 'outline', or 'text'. Default is 'default'.
 * @attr {string} size - The size of the button, which can be 'small', 'medium', or 'large'. Default is 'medium'.
 * @attr {string} status - The state of the button, which can be 'default', 'hover', 'active', 'focus', 'disabled', or 'loading'. Default is 'default'.
 *
 * @property {string} label - The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes.
 * @property {boolean} disabled - Disables the button when true, preventing user interaction and applying disabled styles.
 * @property {string} name - The name attribute for the button, useful for form submissions.
 * @property {string} type - The type of the button, which can be 'button', 'submit', or 'reset'. Default is 'button'.
 * @property {string} color - The color theme of the button, which can be 'default', 'primary', 'success', or 'danger'. Default is 'default'.
 * @property {string} variant - The visual style of the button, which can be 'default', 'outline', or 'text'. Default is 'default'.
 * @property {string} size - The size of the button, which can be 'small', 'medium', or 'large'. Default is 'medium'.
 * @property {string} status - The state of the button, which can be 'default', 'hover', 'active', 'focus', 'disabled', or 'loading'. Default is 'default'.
 *
 * @default 'button' - Default type value
 * @default 'default' - Default color value
 * @default 'default' - Default variant value
 * @default 'medium' - Default size value
 * @default 'default' - Default status value
 * @default false - Default disabled value
 * @default '' - Default label value
 * @default '' - Default name value
 */
@Component({
  tag: 'bds-button',
  styleUrl: 'bds-button.scss',
  formAssociated: true,
})
export class BdsButton implements IButton {
  /** State to manage the button status */
  @State() status: IButton['status'] = STATES.DEFAULT;

  /* Props to manage the button attributes */
  /** aria-label is important for accessibility, it should be provided by the user */
  @Prop() readonly label: IButton['label'] = '';

  /** disabled is a boolean attribute, it should be false by default */
  @Prop() readonly disabled: IButton['disabled'] = false;

  /** name is a string attribute, it should be empty by default */
  @Prop() readonly name: IButton['name'] = '';

  /** type is a string attribute, it should be 'button' by default */
  @Prop() readonly type: IButton['type'] = BUTTON_TYPES.BUTTON;

  /** color is a string attribute, it should be 'default' by default */
  @Prop() readonly color: IButton['color'] = CORE_COLORS.DEFAULT;

  /** variant is a string attribute, it should be 'default' by default */
  @Prop() readonly variant: IButton['variant'] = BUTTON_VARIANTS.DEFAULT;

  /** size is a string attribute, it should be 'medium' by default */
  @Prop() readonly size: IButton['size'] = BUTTON_SIZES.MEDIUM;

  /* Method to get the class map for the button based on the props */
  private getClassMap(): StyleModifiers {
    return {
      'bds-button': true,
      'bds-button--disabled': this.disabled,
      [`bds-button--${this.color}`]: true,
      [`bds-button--var-${this.variant}`]: true,
      [`bds-button--size-${this.size}`]: true,
    };
  }

  /* render button depends on variant */
  render() {
    return (
      <button
        class={this.getClassMap()}
        type={this.type}
        disabled={this.disabled}
        role="button"
        aria-label={this.label || 'Button component'}
      >
        <slot></slot>
      </button>
    );
  }
}
