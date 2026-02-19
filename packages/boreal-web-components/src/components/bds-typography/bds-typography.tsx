import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

import type { StyleModifiers } from '@/types/stylesMap';
import { ALIGNMENT } from '@/types/alignment';
import { SIZES } from '@/types/size';
import { STATES } from '@/types/states';
import { Attributes, inheritAriaAttributes } from '@/utils/helpers/accessibility/a11y-attributes';

import type { ITypography } from './types/ITypography';
import { TAG_ELEMENT, VARIANT_TYPOGRAPHY } from './types/enum';
import { FILENAME, getAttributesByTag, VARIANT_CONFIG } from './utils/bds-typography-utils';

@Component({
  tag: 'bds-typography',
  styleUrl: 'bds-typography.scss',
})
export class BdsTypography implements ITypography {
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLBdsTypographyElement;

  @Prop({ reflect: true }) readonly variant: ITypography['variant'] = VARIANT_TYPOGRAPHY.DISPLAY;
  @Prop({ reflect: true }) readonly size: ITypography['size'] = SIZES.M;
  @Prop({ reflect: true }) readonly state: ITypography['state'];

  @Prop() readonly customClass: string;

  @Prop() readonly element: ITypography['element'] = TAG_ELEMENT.P;
  @Prop() readonly align: ITypography['align'] = ALIGNMENT.START;
  @Prop() readonly ellipsis: ITypography['ellipsis'] = false;
  @Prop() readonly maxLines: ITypography['maxLines'] = 1;
  @Prop() readonly tooltipText: ITypography['tooltipText'] = '';

  @Prop({ reflect: true }) readonly isRequired: ITypography['isRequired'] = false;

  @Prop() readonly htmlFor: ITypography['htmlFor'] = undefined;

  @Prop() readonly href: ITypography['href'] = null;
  @Prop() readonly target: ITypography['target'] = null;
  @Prop() readonly isDownloadable: ITypography['isDownloadable'] = false;
  @Prop() readonly filename: ITypography['filename'] = FILENAME;

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
