import { FloatingHooks, FloatingMixinOptions } from '@/services/floating/interfaces/Floating';
import { FloatingAnchoredProp } from '@/services/floating/interfaces/Props';
import { MixedInCtor, State } from '@stencil/core';

export interface IFloatingMixin extends FloatingHooks {
  floatingOptions: FloatingAnchoredProp;

  get options(): FloatingMixinOptions;
  get hooks(): FloatingHooks;
}

export const floatingMixin = <B extends MixedInCtor>(Base: B) => {
  class Floating extends Base {
    floatingOptions: FloatingAnchoredProp;
    floatingContent!: HTMLElement;

    @State() isVisible: boolean;

    get hooks(): FloatingHooks {
      return {};
    }

    onBeforeShow(target?: HTMLElement): boolean {
      const hookControl = this.hooks.onBeforeShow?.(target) ?? true;
      const propControl = this.floatingOptions?.onBeforeShow?.(target) ?? true;
      return hookControl && propControl;
    }

    onBeforeHide(target?: HTMLElement): boolean {
      const hookControl = this.hooks.onBeforeHide?.(target) ?? true;
      const propControl = this.floatingOptions?.onBeforeHide?.(target) ?? true;
      return hookControl && propControl;
    }

    showElement() {
      this.isVisible = true;
      this.hooks.mounted?.(this.floatingContent);
    }
    hideElement() {
      this.isVisible = false;
      this.hooks.unmounted?.(this.floatingContent);
    }

    show(target?: HTMLElement) {
      if (this.isVisible) return;
      if (!this.onBeforeShow(target)) return;

      this.showElement();

      this.onAfterShow(target);
    }

    hide(target?: HTMLElement) {
      if (!this.isVisible) return;
      if (!this.onBeforeHide(target)) return;

      this.hideElement();

      this.onAfterHide(target);
    }

    toggle(target?: HTMLElement) {
      this.isVisible ? this.hide(target) : this.show();
    }

    onAfterShow(target?: HTMLElement): void {
      this.hooks.onAfterShow?.(target);
      this.floatingOptions?.onAfterShow?.(target);
    }
    onAfterHide(target?: HTMLElement): void {
      this.hooks.onAfterHide?.(target);
      this.floatingOptions?.onAfterHide?.(target);
    }

    componentWillLoad() {
      this.isVisible = false;
      this.show = this.show.bind(this) as typeof this.show;
      this.hide = this.hide.bind(this) as typeof this.hide;
      this.toggle = this.toggle.bind(this) as typeof this.toggle;
    }
  }
  return Floating;
};
