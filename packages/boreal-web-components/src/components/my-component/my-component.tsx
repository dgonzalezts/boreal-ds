import { Component, Prop, h } from '@stencil/core';
import { format } from '../../utils/helpers/utils';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() readonly first: string;

  /**
   * The middle name
   */
  @Prop() readonly middle: string;

  /**
   * The last name
   */
  @Prop() readonly last: string;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  render() {
    return <div>Hello, World! I'm {this.getText()}</div>;
  }
}
