import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() readonly first: string = '';

  /**
   * The middle name
   */
  @Prop() readonly middle: string = '';

  /**
   * The last name
   */
  @Prop() readonly last: string = '';

  render() {
    return <div>Hello, World! I'm StencilJS</div>;
  }
}
