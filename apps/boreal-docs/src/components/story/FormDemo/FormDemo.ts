import { LitElement, html } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { FormDemoStyles } from './FormDemo.styles';
import '@/components/story/CodeBlock';

/**
 * A Lit-based web component for demonstrating form components with live output preview and code snippets
 *
 * Note: This is a Lit-based web component for use in story files (.stories.tsx), not a React component.
 * Can be used in: TSX story files (Lit template rendering)
 *
 * @example
 * ```typescript
 * import { html } from 'lit';
 * import '@/components/story/FormDemo';
 *
 * export const FormExample = () => html`
 *   <form-demo
 *     form-id="example-form"
 *     output-id="example-output"
 *     title="Contact Form"
 *     form-description="A simple contact form example"
 *     code-snippet="const formData = new FormData(form);"
 *   >
 *     <form slot="form">
 *       <input type="text" name="name" placeholder="Name" />
 *       <button type="submit">Submit</button>
 *     </form>
 *   </form-demo>
 * `;
 * ```
 */
@customElement('form-demo')
export class FormDemo extends LitElement {
  static styles = [FormDemoStyles];

  @property({ type: String, attribute: 'form-id' })
  formId = '';

  @property({ type: String, attribute: 'output-id' })
  outputId = '';

  @property({ type: String })
  title = '';

  @property({ type: String, attribute: 'code-snippet' })
  codeSnippet = '';

  @property({ type: Boolean })
  showCodeBlock = true;

  @property({ type: Boolean })
  showOutput = true;

  @property({ type: String, attribute: 'code-theme' })
  codeTheme = 'dark';

  @property({ type: String })
  formDescription = '';

  @queryAssignedElements({ slot: 'form', flatten: true })
  private formElements!: HTMLElement[];

  @query(`[id$="-form-output"]`)
  private outputElement!: HTMLPreElement;

  private _handleSlotChange = () => {
    requestAnimationFrame(() => {
      this.setupFormHandlers();
    });
  };

  private setupFormHandlers() {
    const formElement = this.formElements?.[0] as HTMLFormElement;

    if (!formElement || !this.outputElement) return;

    formElement.removeEventListener('submit', this._handleSubmit);
    formElement.removeEventListener('reset', this._handleReset);

    formElement.addEventListener('submit', this._handleSubmit);
    formElement.addEventListener('reset', this._handleReset);
  }

  private _handleSubmit = (event: Event) => {
    if (event.defaultPrevented) {
      this.outputElement.textContent = 'Form submission blocked by validation';
      return;
    }

    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    this.outputElement.textContent = JSON.stringify(data, null, 2);
  };

  private _handleReset = () => {
    this.outputElement.textContent = 'Submit the form to see the data here';

    this.dispatchEvent(
      new CustomEvent('form-reset', {
        bubbles: true,
        composed: true,
      })
    );
  };

  render() {
    const isInDocs = window.location.search.includes('viewMode=docs');

    return html`
      <div class="storybook-card">
        ${!isInDocs
          ? html`
              <div class="storybook-flex">
                <div class="storybook-col">
                  <h3>${this.title}</h3>
                  ${this.formDescription ? html`<p>${this.formDescription}</p>` : ''}
                  <div>
                    <slot name="form" @slotchange=${this._handleSlotChange}></slot>
                  </div>
                </div>
                ${this.showOutput
                  ? html`
                      <div class="storybook-col">
                        <h3>Form Output</h3>
                        <pre class="form-output" id="${this.outputId}">
Submit the form to see the data here
                        </pre
                        >
                      </div>
                    `
                  : ''}
              </div>
              ${this.showCodeBlock && this.codeSnippet
                ? html`
                    <code-block
                      code="${this.codeSnippet}"
                      code-theme="${this.codeTheme}"
                      title="Form Data Integration in JavaScript"
                    ></code-block>
                  `
                : ''}
            `
          : html`
              <h3>${this.title}</h3>
              ${this.formDescription ? html`<p>${this.formDescription}</p>` : ''}
              <div>
                <slot name="form" @slotchange=${this._handleSlotChange}></slot>
              </div>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-demo': FormDemo;
  }
}
