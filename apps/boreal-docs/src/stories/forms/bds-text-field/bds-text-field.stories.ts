import { html, css } from 'lit';
import { nothing } from 'lit';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import { formatHtmlSource } from '@/utils/formatters';
import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import '@/components/story/FormDemo';
import type {
  TextFieldType,
  TextFieldVariant,
  TextFieldValidationTiming,
} from '@telesign/boreal-web-components/dist/types/components/forms/bds-text-field/types/types.js';

type StoryArgs = {
  value: string;
  name: string;
  placeholder: string;
  type: TextFieldType;
  autocomplete: string;
  variant: TextFieldVariant;
  label: string;
  sublabel: string;
  icon: string;
  helperText: string;
  info: string;
  customWidth: string;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
  error: boolean;
  errorMessage: string;
  clearable: boolean;
  clearOnHover: boolean;
  validationTiming: TextFieldValidationTiming;
  pattern: string;
  minLength: number;
  maxLength: number;
  counter: boolean;
  charCount: number;
  slotPrefix: boolean;
  onBdsInput: (e: CustomEvent) => void;
  onBdsChange: (e: CustomEvent) => void;
  onBdsFocus: (e: CustomEvent) => void;
  onBdsBlur: (e: CustomEvent) => void;
  onBdsClear: () => void;
  onBdsValidationChange: (e: CustomEvent) => void;
};
type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Forms/Text Field',
  component: 'bds-text-field',
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
        transform: formatHtmlSource,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The current value of the input.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    name: {
      control: 'text',
      description: 'The name attribute submitted with the form.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Native placeholder forwarded to the inner `<input>`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password'],
      description: 'The input type. Use `password` to enable the visibility toggle.',
      table: {
        category: 'Core',
        type: { summary: 'TextFieldType' },
        defaultValue: { summary: 'text' },
      },
    },
    autocomplete: {
      control: 'text',
      description: 'Native `autocomplete` attribute forwarded to the inner `<input>`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['outline', 'plain'],
      description:
        'Visual style of the input container. `outline` shows a border; `plain` hides it at rest.',
      table: {
        category: 'Appearance',
        type: { summary: 'TextFieldVariant' },
        defaultValue: { summary: 'outline' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text rendered above the input.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    sublabel: {
      control: 'text',
      description: 'Sublabel rendered inside the input container, before the text area.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    icon: {
      control: 'text',
      description:
        'Icon font class rendered beside the sublabel inside the container (e.g. `bds-icon-settings`).',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    helperText: {
      name: 'helper-text',
      control: 'text',
      description: 'Assistive text shown below the input when there is no error.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    info: {
      control: 'text',
      description: 'Tooltip content attached to the label.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    customWidth: {
      name: 'custom-width',
      control: 'text',
      description: 'Sets a custom width via the `--bds-text-field-width` CSS custom property.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input, preventing user interaction.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required for form validation.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      name: 'readonly',
      control: 'boolean',
      description: 'Makes the input read-only. The value is still submitted with the form.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Applies the error visual state.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      name: 'error-message',
      control: 'text',
      if: { arg: 'error', eq: true },
      description:
        'Error message shown below the input when `error` is `true`. Replaces `helperText`.',
      table: {
        category: 'State',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear button when the input has a value.',
      table: {
        category: 'Actions',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearOnHover: {
      name: 'clear-on-hover',
      control: 'boolean',
      description: 'Shows a clear button that is hidden at rest and revealed on hover.',
      table: {
        category: 'Actions',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    validationTiming: {
      name: 'validation-timing',
      control: { type: 'select' },
      options: ['blur', 'input', 'change', 'submit'],
      description: 'Controls when built-in validation runs.',
      table: {
        category: 'Validation',
        type: { summary: 'TextFieldValidationTiming' },
        defaultValue: { summary: 'blur' },
      },
    },
    pattern: {
      control: 'text',
      description:
        'Native `pattern` attribute forwarded to the inner `<input>`. A regex the value must match to be valid.',
      table: {
        category: 'Validation',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    minLength: {
      name: 'min-length',
      control: 'number',
      description: 'Minimum character count. `0` means no minimum.',
      table: {
        category: 'Validation',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    maxLength: {
      name: 'max-length',
      control: 'number',
      description: 'Maximum character count. `0` means no maximum.',
      table: {
        category: 'Validation',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    counter: {
      control: 'boolean',
      description: 'Enables the character counter in the footer. Requires `charCount`.',
      table: {
        category: 'Counter',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    charCount: {
      name: 'char-count',
      control: 'number',
      if: { arg: 'counter', eq: true },
      description:
        'Maximum character count shown in the footer counter (e.g. `120` → `"45/120"`). Requires `counter`.',
      table: {
        category: 'Counter',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    slotPrefix: {
      control: false,
      name: 'slot="prefix"',
      description:
        '**Storybook control only, not a component prop.** Renders a demo icon in the prefix slot.',
      table: {
        category: 'Slots',
        disable: true,
      },
    },
    onBdsInput: {
      action: 'bdsInput emitted',
      description: 'Emitted on every keystroke with `{ value, event }`.',
      table: {
        category: 'Events',
      },
    },
    onBdsChange: {
      action: 'bdsChange emitted',
      description: 'Emitted when focus leaves after the value changed, with `{ value, event }`.',
      table: {
        category: 'Events',
      },
    },
    onBdsFocus: {
      action: 'bdsFocus emitted',
      description: 'Emitted when the input gains focus, with `{ event }`.',
      table: {
        category: 'Events',
      },
    },
    onBdsBlur: {
      action: 'bdsBlur emitted',
      description: 'Emitted when the input loses focus, with `{ event }`.',
      table: {
        category: 'Events',
      },
    },
    onBdsClear: {
      action: 'bdsClear emitted',
      description: 'Emitted when the user activates the clear button.',
      table: {
        category: 'Events',
      },
    },
    onBdsValidationChange: {
      action: 'bdsValidationChange emitted',
      description:
        'Emitted after each validation run with `{ valid, validity, value, touched, dirty }`.',
      table: {
        category: 'Events',
      },
    },
  },
  args: {
    value: '',
    name: 'text-field',
    placeholder: 'Enter text...',
    type: 'text',
    autocomplete: '',
    variant: 'outline',
    label: '',
    sublabel: '',
    icon: '',
    helperText: '',
    info: '',
    customWidth: '',
    disabled: false,
    required: false,
    readOnly: false,
    error: false,
    errorMessage: '',
    clearable: false,
    clearOnHover: false,
    validationTiming: 'blur',
    pattern: '',
    minLength: 0,
    maxLength: 0,
    counter: false,
    charCount: 0,
    slotPrefix: false,
  },
} satisfies BorealStoryMeta<StoryArgs>;

const styles = css`
  @import url('https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css');
`;

export default meta;

/**
 * Reusable render function for the TextField component stories.
 * @param args - The story arguments containing component props
 * @returns An HTML template for the TextField component
 */
const renderTextField: Story['render'] = args => html`
  <style>
    ${styles}
  </style>
  <bds-text-field
    name=${args.name}
    value=${args.value || nothing}
    type=${args.type}
    variant=${args.variant}
    ?disabled=${args.disabled}
    ?required=${args.required}
    ?error=${args.error}
    ?readonly=${args.readOnly}
    placeholder=${args.placeholder || nothing}
    label=${args.label || nothing}
    sublabel=${args.sublabel || nothing}
    icon=${args.icon || nothing}
    helper-text=${args.helperText || nothing}
    info=${args.info || nothing}
    error-message=${args.errorMessage || nothing}
    autocomplete=${args.autocomplete || nothing}
    custom-width=${args.customWidth || nothing}
    ?clearable=${args.clearable}
    ?clear-on-hover=${args.clearOnHover}
    validation-timing=${args.validationTiming || nothing}
    pattern=${args.pattern || nothing}
    min-length=${args.minLength || nothing}
    max-length=${args.maxLength || nothing}
    ?counter=${args.counter}
    char-count=${args.charCount || nothing}
    @bdsInput=${args.onBdsInput}
    @bdsChange=${args.onBdsChange}
    @bdsFocus=${args.onBdsFocus}
    @bdsBlur=${args.onBdsBlur}
    @bdsClear=${args.onBdsClear}
    @bdsValidationChange=${args.onBdsValidationChange}
  >
    ${args.slotPrefix
      ? html`<span slot="prefix">
          <em class="bds-icon-search"></em>
        </span>`
      : nothing}
  </bds-text-field>
`;

/**
 * Base outline text field in its default configuration.
 */
export const Default: Story = {
  render: renderTextField,
};

/**
 * Password type with visibility toggle button for showing/hiding the entered value.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
  render: renderTextField,
};

/**
 * Demonstrates the label row with sublabel and helper text below the input.
 */
export const WithLabel: Story = {
  args: {
    label: 'Email address',
    sublabel: 'Use your work email',
    helperText: 'We will never share your email',
    placeholder: 'you@company.com',
  },
  render: renderTextField,
};

/**
 * Error state with validation messaging — shows how the field looks when `error` is true and an `errorMessage` is set.
 */
export const WithValidation: Story = {
  args: {
    required: true,
    validationTiming: 'blur',
    error: true,
    errorMessage: 'This field is required',
    label: 'Email address',
  },
  render: renderTextField,
};

/**
 * Clear button visible with a pre-filled value — activating it emits `bdsClear` and empties the field.
 */
export const WithClear: Story = {
  args: {
    clearable: true,
    value: 'hello@example.com',
    label: 'Email address',
  },
  render: renderTextField,
};

/**
 * Character counter in the footer showing current character count against a maximum.
 */
export const WithCounter: Story = {
  args: {
    counter: true,
    charCount: 120,
    value: 'Start typing...',
    label: 'Message',
    placeholder: 'Write your message...',
  },
  render: renderTextField,
};

/**
 * Plain variant with no border at rest — border appears only on focus.
 */
export const PlainVariant: Story = {
  args: {
    variant: 'plain',
    label: 'Search',
    placeholder: 'Search...',
  },
  render: renderTextField,
};

/**
 * Disabled state — the field is non-interactive and `aria-disabled` is set.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Cannot edit this',
    label: 'Field label',
  },
  render: renderTextField,
};

/**
 * Read-only state — the value is displayed and submitted with the form but cannot be edited.
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only content',
    label: 'Field label',
  },
  render: renderTextField,
};

/**
 * Outline variant side-by-side preview — shows the default bordered visual style.
 */
export const Variants: Story = {
  args: {
    variant: 'outline',
    label: 'Outline variant',
    placeholder: 'Enter text...',
  },
  render: renderTextField,
  tags: ['!dev'],
};

/**
 * Sublabel rendered inside the input container, often used to mark a field as optional.
 */
export const WithSubLabel: Story = {
  args: {
    sublabel: '(Optional)',
    placeholder: 'Enter your first name',
    label: 'First name',
  },
  render: renderTextField,
};

/**
 * Helper text below the input — provides assistive instructions without entering an error state.
 */
export const WithHelper: Story = {
  args: {
    helperText: 'We will never share your email.',
    placeholder: 'Enter your email here',
    label: 'Email address',
  },
  render: renderTextField,
};

/**
 * Icon inside the prefix slot — useful for search fields or contextual decoration.
 */
export const WithIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    slotPrefix: true,
  },
  render: renderTextField,
};

/**
 * Required field that must be filled before form submission.
 */
export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    placeholder: 'This field is required',
    helperText: 'Click on the field and then blur it to see the validation.',
    validationTiming: 'blur',
  },
  render: renderTextField,
};

/**
 * Error state — shows the component in its invalid visual state with an error message.
 */
export const Error: Story = {
  args: {
    error: true,
    label: 'Email address',
    errorMessage: 'Please enter a valid email address',
    placeholder: 'Enter your email',
  },
  render: renderTextField,
};

/**
 * Minimum length validation — the field must contain at least the specified number of characters.
 */
export const WithMinLength: Story = {
  args: {
    label: 'Username',
    minLength: 5,
    placeholder: 'At least 5 characters',
    helperText: 'The value must be at least 5 characters long.',
    validationTiming: 'input',
    errorMessage: 'Username must be at least 5 characters.',
  },
  render: renderTextField,
};

/**
 * Pattern validation — the value must match the provided regular expression to be valid.
 */
export const WithPattern: Story = {
  args: {
    label: 'Email',
    pattern: '[^@]+@[^@]+\\.[a-zA-Z]{2,}',
    placeholder: 'you@company.com',
    helperText: 'The value must be a valid email address.',
    validationTiming: 'input',
    errorMessage: 'Please enter a valid email address.',
  },
  render: renderTextField,
};

/**
 * Custom validation message — overrides the browser default with a user-friendly error message.
 */
export const WithCustomValidationMessage: Story = {
  args: {
    label: 'Username',
    required: true,
    errorMessage: 'This is a custom error message — please fill in this field.',
    helperText: 'Click on the field and then blur it to see the validation.',
    validationTiming: 'blur',
  },
  render: renderTextField,
};

/**
 * Custom validation timing — triggers validation on every keystroke (`input`) instead of on blur.
 */
export const WithCustomValidationTiming: Story = {
  args: {
    label: 'Password',
    minLength: 8,
    validationTiming: 'input',
    placeholder: 'At least 8 characters',
    helperText:
      'Validation triggers on every input. Change timing to `blur` in the controls to compare.',
    errorMessage: 'Password must be at least 8 characters.',
  },
  render: renderTextField,
};

/**
 * Interactive form demonstrating multiple text fields working together with native HTML form
 * submission, real-time validation, and reset behaviour.
 */
export const InteractiveFormExample: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: (code: string) => {
          const formMatch = code.match(/<form[^>]*slot="form"[^>]*>[\s\S]*?<\/form>/);
          return formatHtmlSource(formMatch?.[0] ?? '');
        },
      },
    },
  },
  render: () => {
    const formId = 'text-field-form-example';
    const outputId = 'text-field-form-output';
    const isInDocs = window.location.search.includes('viewMode=docs');
    const codeSnippet = hljs.highlight(
      `// Handle form submit
form.addEventListener('submit', (event) => {
  if (event.defaultPrevented) {
    console.log('Form submission blocked by validation');
    return;
  }
  event.preventDefault();
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());
  console.log('Form submitted successfully:', formValues);
});

// Handle form reset — components reset automatically
form.addEventListener('reset', () => {
  console.log('Form reset completed');
});`,
      { language: 'javascript' }
    ).value;

    return html`
      <style>
        ${styles} .bds-form-buttons {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
      </style>
      <form-demo
        form-id="${formId}"
        output-id="${outputId}"
        title="Login Form"
        code-snippet="${codeSnippet}"
        code-theme="dark"
      >
        <form slot="form" id="${formId}">
          <bds-text-field
            name="username"
            label="Username"
            value="John Doe"
            helper-text="Your public display name."
            required
            clearable
            min-length="3"
            custom-width="100%"
          ></bds-text-field>
          <bds-text-field
            name="password"
            label="Password"
            type="password"
            value="password123"
            required
            clearable
            min-length="8"
            helper-text="Must be at least 8 characters long."
            custom-width="100%"
          ></bds-text-field>
          <bds-text-field
            name="email"
            label="Email (Optional)"
            type="text"
            value="john.doe@example.com"
            pattern="^\\S+@\\S+\\.\\S+$"
            error-message="Please enter a valid email address."
            validation-timing="input"
            helper-text="We will use this to contact you."
            custom-width="100%"
          ></bds-text-field>
          <div class="bds-form-buttons">
            <bds-button type="submit" ?disabled=${isInDocs}>Submit</bds-button>
            <bds-button type="reset" ?disabled=${isInDocs}>Reset</bds-button>
          </div>
        </form>
      </form-demo>
    `;
  },
};
