import { Component, Host, Prop, h } from '@stencil/core';
import { ITypography } from './types/ITypography';
// TODO create style map type
type StyleModifiers = Record<string, boolean>;

@Component({
  tag: 'bds-typography',
  styleUrl: 'bds-typography.scss',
})
export class BdsTypography implements ITypography {
  @Prop({ reflect: true }) readonly variant: ITypography['variant'] = 'display';
  @Prop({ reflect: true }) readonly size: ITypography['size'] = 'md';
  @Prop({ reflect: true }) readonly state: ITypography['state'] = 'default';

  @Prop() readonly customClass: string;

  @Prop() readonly element: ITypography['element'] = 'p';
  @Prop() readonly align: ITypography['align'] = 'start';
  @Prop() readonly ellipsis: ITypography['ellipsis'] = false;
  @Prop() readonly maxLines: ITypography['maxLines'] = 1;

  @Prop({ reflect: true }) readonly isRequired: ITypography['isRequired'] = null;
  @Prop() readonly htmlFor: ITypography['htmlFor'] = null;

  @Prop() readonly href: ITypography['href'] = null;
  @Prop() readonly target: ITypography['target'] = null;
  @Prop() readonly isDownloadable: ITypography['isDownloadable'] = null;
  @Prop() readonly filename: ITypography['filename'] = 'download';

  private getAttr(): Record<string, Record<string, unknown>> {
    return {
      a: {
        href: (this.state !== 'disabled' && this.href) || null,
        target: this.target,
        download: this.isDownloadable ? this.filename : null,
        rel: 'noopener noreferrer',
      },
      label: {
        htmlFor: this.htmlFor,
      },
    };
  }

  private getStylesByVariant(): Record<string, Record<string, boolean>> {
    return {
      helper: {
        [`bds-typography--error`]: this.state === 'error',
      },
      link: {
        [`bds-typography--disabled`]: this.state === 'disabled',
        [`bds-typography--visited`]: this.state === 'visited',
        [`bds-typography--hover`]: this.state === 'hover',
        [`bds-typography--active`]: this.state === 'active',
        [`bds-typography--focus`]: this.state === 'focus',
      },
      label: {
        [`bds-typography--required`]: this.isRequired,
        [`bds-typography--disabled`]: this.state === 'disabled',
      },
    };
  }

  private getGeneralStyles(): StyleModifiers {
    return {
      [`bds-typography--${this.variant}`]: true,
      [`text__size-${this.size}`]: true,
    };
  }

  render() {
    const TagName = this.element.toLowerCase();
    const attr: { [key: string]: unknown } = this.getAttr()[TagName] || {};

    const variants: StyleModifiers = this.getStylesByVariant()[this.variant];
    const variantStyles: StyleModifiers = variants;
    const classes = { ...this.getGeneralStyles(), ...variantStyles };

    return (
      <Host class="bds-typography">
        <TagName {...attr} class={classes}>
          <slot></slot>
          <span class="aq-icon-info-circle">i</span>
        </TagName>
      </Host>
    );
  }
}
