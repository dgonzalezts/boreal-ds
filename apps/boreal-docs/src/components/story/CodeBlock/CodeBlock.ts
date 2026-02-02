import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { CodeBlockStyles } from './CodeBlock.styles';
import { highlightJsStyles } from './highlight-js.styles';

/**
 * A Lit-based web component for displaying syntax-highlighted code blocks in Storybook documentation
 *
 * Note: This is a Lit-based web component for use in story files (.stories.tsx), not a React component.
 * Can be used in: TSX story files (Lit template rendering)
 *
 * @example
 * ```typescript
 * import { html } from 'lit';
 * import '@/components/story/CodeBlock';
 *
 * export const CodeExample = () => html`
 *   <code-block
 *     code="const example = 'Hello World';"
 *     language="javascript"
 *     code-theme="dark"
 *     title="JavaScript Example"
 *   ></code-block>
 * `;
 * ```
 */
@customElement('code-block')
export class CodeBlock extends LitElement {
  static styles = [CodeBlockStyles, highlightJsStyles];

  @property({ type: String })
  code = '';

  @property({ type: String, attribute: 'code-theme' })
  codeTheme = 'dark';

  @property({ type: String })
  language = '';

  @property({ type: String })
  title = '';

  render() {
    const codeClass = this.codeTheme === 'dark' ? 'storybook-code' : 'storybook-code light';

    return html`
      <div class="code-block-container">
        ${this.title ? html`<h3>${this.title}</h3>` : ''}
        <div class="${codeClass}">
          <pre><code class="${this.language ? `language-${this.language}` : ''}">${unsafeHTML(
            this.code
          )}</code></pre>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-block': CodeBlock;
  }
}
