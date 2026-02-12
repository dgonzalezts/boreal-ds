import { Component, Host, Prop, h } from '@stencil/core';
import { ITypography } from './types/ITypography';
import { StyleModifiers } from '@/types/stylesMap';

import { VARIANT_CONFIG } from './bds-typography-utils';

@Component({
  tag: 'bds-typography',
  styleUrl: 'bds-typography.scss',
})
export class BdsTypography implements ITypography {
  @Prop({ reflect: true }) readonly variant: ITypography['variant'] = 'display';
  @Prop({ reflect: true }) readonly size: ITypography['size'] = 'm';
  @Prop({ reflect: true }) readonly state: ITypography['state'] = 'default';

  @Prop() readonly customClass: string;

  @Prop() readonly element: ITypography['element'] = 'p';
  @Prop() readonly align: ITypography['align'] = 'start';
  @Prop() readonly ellipsis: ITypography['ellipsis'] = false;
  @Prop() readonly maxLines: ITypography['maxLines'] = 1;
  @Prop() readonly tooltip: ITypography['tooltip'] = 'This is a tooltip';

  @Prop({ reflect: true }) readonly isRequired: ITypography['isRequired'] = null;
  @Prop() readonly htmlFor: ITypography['htmlFor'] = null;

  @Prop() readonly href: ITypography['href'] = null;
  @Prop() readonly target: ITypography['target'] = null;
  @Prop() readonly isDownloadable: ITypography['isDownloadable'] = null;
  @Prop() readonly filename: ITypography['filename'] = 'download';

  private getAttributesByTag = (tagName: string): Record<string, unknown> => {
    const ATTR_MAP: Record<string, Record<string, unknown>> = {
      a: {
        href: this.state !== 'disabled' ? this.href : null,
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
