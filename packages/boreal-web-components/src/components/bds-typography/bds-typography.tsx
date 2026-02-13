import { Component, Host, Prop, State, h } from '@stencil/core';
import type { ITypography } from './types/ITypography';
import type { StyleModifiers } from '@/types/stylesMap';

import { FILENAME, VARIANT_CONFIG } from './bds-typography-utils';
import { TAG_ELEMENT, VARIANT_TYPOGRAPHY } from './types/enum';
import { SIZES } from '@/types/size';
import { STATES } from '@/types/states';
import { ALIGNMENT } from '@/types/alignment';

@Component({
  tag: 'bds-typography',
  styleUrl: 'bds-typography.scss',
})
export class BdsTypography implements ITypography {
  @Prop({ reflect: true }) readonly variant: ITypography['variant'] = VARIANT_TYPOGRAPHY.DISPLAY;
  @Prop({ reflect: true }) readonly size: ITypography['size'] = SIZES.M;
  @Prop({ reflect: true }) readonly state: ITypography['state'] = STATES.DEFAULT;

  // ? To apply utility classes
  @Prop() readonly customClass: string;

  @Prop() readonly element: ITypography['element'] = TAG_ELEMENT.P;
  @Prop() readonly align: ITypography['align'] = ALIGNMENT.START;
  @Prop() readonly ellipsis: ITypography['ellipsis'] = false;
  @Prop() readonly maxLines: ITypography['maxLines'] = 1;
  @Prop() readonly tooltip: ITypography['tooltip'] = 'This is a tooltip';

  @Prop({ reflect: true }) readonly isRequired: ITypography['isRequired'] = false;
  @Prop() readonly htmlFor: ITypography['htmlFor'] = null;

  @Prop() readonly href: ITypography['href'] = null;
  @Prop() readonly target: ITypography['target'] = null;
  @Prop() readonly isDownloadable: ITypography['isDownloadable'] = false;
  @Prop() readonly filename: ITypography['filename'] = FILENAME;

  @State() sanitizedHref: string = '';

  async componentWillLoad() {
    if (this.element === TAG_ELEMENT.A && this.href) {
      await this.sanitizeLink();
    }
  }

  private async sanitizeLink() {
    const { sanitizeUrl } = await import('@braintree/sanitize-url');
    this.sanitizedHref = sanitizeUrl(this.href);
  }

  // TODO move to external file
  private getAttributesByTag = (tagName: string): Record<string, unknown> => {
    const ATTR_MAP: Record<string, Record<string, unknown>> = {
      a: {
        href: this.state !== STATES.DISABLED ? this.sanitizedHref : null,
        target: this.target,
        download: this.isDownloadable ? this.filename : null,
        rel: 'noopener noreferrer',
      },
      label: {
        htmlFor: this.htmlFor,
      },
    };

    return ATTR_MAP[tagName] || {};
  };

  private getVariantConfig() {
    return VARIANT_CONFIG[this.variant] ?? {};
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
      [`bds-typography--ellipsis-multiline`]: this.maxLines > 1,
    };
  }

  render() {
    const TagName = this.element.toLowerCase();
    const attr = this.getAttributesByTag(TagName);
    const classes = { ...this.getVariantStateStyles() };

    const { canUseTooltip = null, isRequired = null } = VARIANT_CONFIG[this.variant] ?? {};

    return (
      <Host class="bds-typography">
        <TagName {...attr} class={classes} style={{ webkitLineClamp: this.maxLines }}>
          <slot></slot>
          {this.isRequired && isRequired && <em class="bds-typography__required-indicator">*</em>}
          {this.tooltip && canUseTooltip && <em class="bds-typography__info-icon bds-icon-info-circle"></em>}
        </TagName>
      </Host>
    );
  }
}
