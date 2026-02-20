import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

import type { StyleModifiers } from '@/types/stylesMap';
import { ALIGNMENT } from '@/types/alignment';
import { SIZES } from '@/types/size';
import { STATES } from '@/types/states';
import { Attributes, inheritAriaAttributes } from '@/utils/helpers/accessibility/a11y-attributes';

import type { ITypography } from './types/ITypography';
import { TAG_ELEMENT, VARIANT_TYPOGRAPHY } from './types/enum';
import { FILENAME, getAttributesByTag, VARIANT_CONFIG } from './utils/bds-typography-utils';

/** Typography component with variants, sizes, states, truncation and tooltip support. */
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
  @Prop({ reflect: true }) readonly state: ITypography['state'];

  /** Additional custom CSS class. */
  @Prop() readonly customClass: string;

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
    if (this.getTagName === 'a' && this.href) {
      const { sanitizeUrl } = await import('@braintree/sanitize-url');
      this.sanitizedHref = sanitizeUrl(this.href);
    } else this.sanitizedHref = '';
  }

  async componentWillLoad() {
    if (this.getTagName === TAG_ELEMENT.A && this.href) await this.updateSanitizedHref();

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
      [`bds-typography--${this.state}`]: config?.states && config?.states.includes(this.state),
      [`bds-typography--size-${this.size}`]: config?.size && config?.size.includes(this.size),
      [`bds-typography--required`]: config?.isRequired && this.isRequired,
      [`bds-typography--ellipsis`]: this.ellipsis && this.maxLines <= 1,
      [`bds-typography--ellipsis-multiline`]: this.ellipsis && this.maxLines > 1,
      [this.customClass]: !!this.customClass,
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
          <slot></slot>
          {this.isRequired && isRequired && (
            <em class="bds-typography__required-indicator" aria-hidden="true">
              *
            </em>
          )}
          {this.tooltipText && canUseTooltip && <em class="bds-typography__info-icon bds-icon-info-circle"></em>}
        </TagName>
      </Host>
    );
  }
}
