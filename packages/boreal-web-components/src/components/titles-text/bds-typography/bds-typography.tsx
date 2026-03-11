import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

import type { StyleModifiers } from '@/types/stylesMap';
import { ALIGNMENT } from '@/types/alignment';
import { SIZES } from '@/types/size';
import { STATES } from '@/types/states';
import { Attributes, inheritAriaAttributes } from '@/utils/a11y';

import type { ITypography } from './types/ITypography';
import { TAG_ELEMENT, VARIANT_TYPOGRAPHY } from './types/enum';
import { FILENAME, getAttributesByTag, VARIANT_CONFIG } from './utils/bds-typography-utils';

/**
 * Typography component for displaying text with various styles, sizes, and interactive features.
 *
 * @summary A comprehensive typography component that supports multiple text variants, sizes, alignments, states, and link functionality.
 *
 * @slot - The text displayed in the typography.
 *
 * @attr {string} variant - The variant of the typography for styling the text. Options: label, display, heading, subheading, helper, link, code, caption
 * @attr {string} element - Defines the HTML element. For `heading` variant, the text size adjusts to the HTML heading level (`h1` through `h6`).
 * @attr {string} state - The state of the typography. Only available for the `helper` and `label` variants. Options: default, error, disabled, hover, active, focus, visited
 * @attr {string} align - The text alignment. Options: start, center, end, inherit
 * @attr {string} size - The size of the typography. For `display` variant all options are available (`xl`, `lg`, `md`, `sm`), while for `link` variant only `md` and `sm` are available.
 * @attr {boolean} is-required - Shows a required indicator when used with `label` variant.
 * @attr {boolean} ellipsis - Truncates text with an ellipsis when it overflows.
 * @attr {number} max-lines - Maximum number of lines to show before truncating with ellipsis.
 * @attr {string} href - URL when the typography is an `a` element and a `link` variant.
 * @attr {string} target - Specifies where to open the link. Options: _self, _blank, _top, _parent
 * @attr {boolean} is-downloadable - Makes the `link` download a file.
 * @attr {string} filename - Suggested filename when downloading a file from the `link`.
 * @attr {string} html-for - The for attribute when rendered as a label
 * @attr {string} tooltip-text - Text to display inside the tooltip when hovering the info icon. Only applicable for `heading`, `subheading`, and `label` variants.
 * @attr {string} custom-class - Additional custom CSS class
 *
 * @property {string} variant - The variant of the typography for styling the text. Options: label, display, heading, subheading, helper, link, code, caption
 * @property {string} element - Defines the HTML element. For `heading` variant, the text size adjusts to the HTML heading level (`h1` through `h6`).
 * @property {string} state - The state of the typography. Only available for the `helper` and `label` variants. Options: default, error, disabled, hover, active, focus, visited
 * @property {string} align - The text alignment. Options: start, center, end, inherit
 * @property {string} size - The size of the typography. For `display` variant all options are available (`xl`, `lg`, `md`, `sm`), while for `link` variant only `md` and `sm` are available.
 * @property {boolean} isRequired - Shows a required indicator when used with `label` variant.
 * @property {boolean} ellipsis - Truncates text with an ellipsis when it overflows.
 * @property {number} maxLines - Maximum number of lines to show before truncating with ellipsis.
 * @property {string} href - URL when the typography is an `a` element and a `link` variant.
 * @property {string} target - Specifies where to open the link. Options: _self, _blank, _top, _parent
 * @property {boolean} isDownloadable - Makes the `link` download a file.
 * @property {string} filename - Suggested filename when downloading a file from the `link`.
 * @property {string} htmlFor - The for attribute when rendered as a label
 * @property {string} tooltipText - Text to display inside the tooltip when hovering the info icon. Only applicable for `heading`, `subheading`, and `label` variants.
 * @property {string} customClass - Additional custom CSS class
 *
 * @default 'display' - Default variant value
 * @default 'p' - Default element value
 * @default 'start' - Default align value
 * @default 'md' - Default size value
 * @default 'default' - Default state value
 * @default false - Default isRequired state
 * @default false - Default ellipsis state
 * @default 1 - Default maxLines value
 * @default '' - Default href value
 * @default '' - Default target value
 * @default false - Default isDownloadable state
 * @default 'download' - Default filename value
 * @default '' - Default tooltipText value
 */
@Component({
  tag: 'bds-typography',
  styleUrl: 'bds-typography.scss',
})
export class BdsTypography implements ITypography {
  private inheritedAttributes: Attributes = {};

  /** Host element reference. */
  @Element() el!: HTMLBdsTypographyElement;

  /** Typography visual variant. */
  @Prop({ reflect: true }) readonly variant: ITypography['variant'] = VARIANT_TYPOGRAPHY.DISPLAY;

  /** Typography size token. */
  @Prop({ reflect: true }) readonly size: ITypography['size'] = SIZES.M;

  /** Visual state (if supported by variant). */
  @Prop({ reflect: true }) readonly state: ITypography['state'] = STATES.DEFAULT;

  /** Additional custom CSS class. */
  @Prop() readonly customClass: string = '';

  /** HTML tag used for rendering. */
  @Prop() readonly element: ITypography['element'] = TAG_ELEMENT.P;

  /** Text alignment. */
  @Prop() readonly align: ITypography['align'] = ALIGNMENT.START;

  /** Enables text ellipsis. */
  @Prop() readonly ellipsis: ITypography['ellipsis'] = false;

  /** Max lines when ellipsis is enabled. */
  @Prop() readonly maxLines: ITypography['maxLines'] = 1;

  /** Tooltip text (variant must support it). */
  @Prop() readonly tooltipText: ITypography['tooltipText'] = '';

  /** Marks the field as required. */
  @Prop({ reflect: true }) readonly isRequired: ITypography['isRequired'] = false;

  /** For attribute when rendered as a label. */
  @Prop() readonly htmlFor: ITypography['htmlFor'] = undefined;

  /** Link href when rendered as anchor. */
  @Prop() readonly href: ITypography['href'] = null;

  /** Anchor target. */
  @Prop() readonly target: ITypography['target'] = null;

  /** Enables download behavior for anchor. */
  @Prop() readonly isDownloadable: ITypography['isDownloadable'] = false;

  /** Suggested download filename. */
  @Prop() readonly filename: ITypography['filename'] = FILENAME;

  /** Sanitized href for security. */
  @State() sanitizedHref: string = '';

  @Watch('href')
  async updateSanitizedHref() {
    if (this.getTagName === 'a' && this.href !== null) {
      const { sanitizeUrl } = await import('@braintree/sanitize-url');
      this.sanitizedHref = sanitizeUrl(this.href);
    } else this.sanitizedHref = '';
  }

  async componentWillLoad() {
    if (this.getTagName === TAG_ELEMENT.A && this.href !== null) await this.updateSanitizedHref();

    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
    };
  }

  get getTagName() {
    if (this.variant === VARIANT_TYPOGRAPHY.LINK) return TAG_ELEMENT.A;
    return this.element.toLowerCase();
  }

  private getVariantConfig() {
    return VARIANT_CONFIG[this.variant] ?? {};
  }

  private getAccessibilityTags() {
    const { isRequired = null } = this.getVariantConfig();
    const isInteractiveTag = ['a', 'label'].includes(this.getTagName);
    return {
      'aria-required': this.isRequired && isRequired,
      'aria-disabled': this.state === STATES.DISABLED && isInteractiveTag,
    };
  }

  private getVariantStateStyles(): StyleModifiers {
    const config = this.getVariantConfig();
    return {
      [`bds-typography--${this.variant}`]: true,
      [`bds-typography--align-${this.align}`]: true,
      [`bds-typography--${this.state}`]: !!(config?.states && config?.states.includes(this.state)),
      [`bds-typography--size-${this.size}`]: !!(config?.size && config?.size.includes(this.size)),
      'bds-typography--required': !!(config?.isRequired && this.isRequired),
      'bds-typography--ellipsis': this.ellipsis && this.maxLines <= 1,
      'bds-typography--ellipsis-multiline': this.ellipsis && this.maxLines > 1,
      [this.customClass]: this.customClass !== '',
    };
  }

  render() {
    const TagName = this.getTagName;
    const attributes = {
      ...getAttributesByTag(this, TagName),
      ...this.inheritedAttributes,
      ...this.getAccessibilityTags(),
    };

    const classes = this.getVariantStateStyles();
    const { canUseTooltip = null, isRequired = null } = this.getVariantConfig();

    return (
      <Host class="bds-typography">
        <TagName class={classes} style={{ webkitLineClamp: this.maxLines }} {...attributes}>
          <slot data-tooltip-trigger></slot>
          {this.isRequired && isRequired && (
            <em class="bds-typography__required-indicator" aria-hidden="true">
              *
            </em>
          )}
          {this.tooltipText && canUseTooltip && (
            <span>
              <em class="bds-typography__info-icon bds-icon-info-circle" aria-label={this.tooltipText}></em>
              <bds-tooltip>{this.tooltipText}</bds-tooltip>
            </span>
          )}
        </TagName>
      </Host>
    );
  }
}
