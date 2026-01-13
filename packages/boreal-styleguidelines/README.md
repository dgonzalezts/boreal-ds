# Boreal Design System - Style Guidelines

Multi-brand design token system for Proximus, Masiv, Telesign, and BICS projects.

## 🎨 Features

- **Primitive Tokens**: Color palettes, spacing, layouts, radii, etc.
- **Multi-Brand Themes**: Support for 4 different brands
- **CSS Custom Properties**: CSS variables that change based on `data-theme`
- **SCSS Variables**: For use in Stencil components
- **Configurable Prefix**: Easily modify custom property prefix
- **Automatic Validation**: Ensures all generated tokens are valid

## 📦 Installation

```bash
npm install
```

## 🔨 Usage

### Generate CSS and SCSS Files

```bash
npm run build
```

This command generates:
- `dist/css/global.css` - Global variables (primitives)
- `dist/css/boreal.css` - Complete bundle with all themes
- `dist/css/theme-{themeName}.css` - Individual theme CSS
- `dist/scss/variables/_index.scss` - SCSS variables
- `dist/scss/maps/_index.scss` - SCSS maps

### Use in HTML

```html
<!DOCTYPE html>
<html data-theme="proximus">
<head>
  <!-- Option 1: Load complete bundle -->
  <link rel="stylesheet" href="dist/css/boreal.css">

  <!-- Option 2: Load global + specific theme -->
  <link rel="stylesheet" href="dist/css/global.css">
  <link rel="stylesheet" href="dist/css/theme-proximus.css">
</head>
<body>
  <div style="background: var(--boreal-primary-base); color: var(--boreal-white);">
    Hello Proximus!
  </div>
</body>
</html>
```

### Switch Themes Dynamically

```javascript
// Switch to Masiv theme
document.documentElement.setAttribute('data-theme', 'masiv');

// Switch to Telesign theme
document.documentElement.setAttribute('data-theme', 'telesign');
```

## 🎯 Available Themes

- `proximus` (default)
- `masiv`
- `telesign`
- `bics`

## 🔧 Stencil Integration

### Load Global Styles

In your `src/global/global.css` or `src/global/app.css`:

```css
/* Load complete bundle with all themes */
@import '@boreal-ds/style-guidelines/dist/css/boreal.css';
```

### Configure SASS in Stencil

Install SASS:

```bash
npm install --save-dev @stencil/sass
```

In `stencil.config.ts`:

```typescript
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  plugins: [
    sass({
      includePaths: ['node_modules']
    })
  ],
  // ... rest of config
};
```

### Use in Components

#### Option 1: CSS Variables (Recommended for themes)

**my-component.css:**
```css
.btn-primary {
  background: var(--boreal-ui-primary);
  color: var(--boreal-white);
  padding: var(--boreal-spacing-s) var(--boreal-spacing-m);
  border-radius: var(--boreal-radius-s);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--boreal-ui-primary-dark);
}
```

#### Option 2: SCSS Variables

**my-component.scss:**
```scss
@use '@boreal-ds/style-guidelines/dist/scss/variables' as boreal;

.card {
  background: boreal.$boreal-ui-default;
  border-radius: boreal.$boreal-radius-m;
  padding: boreal.$boreal-spacing-m;
}
```

#### Option 3: SCSS Maps

```scss
@use '@boreal-ds/style-guidelines/dist/scss/maps' as maps;
@use 'sass:map';

.component {
  $spacing-m: map.get(maps.$boreal-primitives, 'spacing-m');
  padding: $spacing-m;
}
```

## ⚙️ Configuration

### Change CSS Variable Prefix

Edit `src/config/constants.ts`:

```typescript
export const CSS_VAR_PREFIX = '--boreal-'; // Change to '--br-', '--my-ds-', etc.
```

Then regenerate:

```bash
npm run build
```

## 📁 Project Structure

```
boreal-styleguidelines/
├── src/
│   ├── config/              # Configuration and constants
│   │   ├── constants.ts     # CSS prefix, paths, themes
│   │   └── types.ts         # TypeScript types
│   ├── generators/          # CSS/SCSS generators
│   │   ├── generate.ts      # Main generation script
│   │   ├── style-generator.ts
│   │   ├── token-processor.ts
│   │   └── validate.ts      # Token validation
│   ├── styles/              # Base styles
│   │   └── global/
│   │       └── reset.css    # CSS Reset
│   └── tokens/              # Design tokens
│       ├── primitives/      # Primitive tokens (colors, spacing, etc.)
│       ├── theme/           # Brand/theme tokens
│       └── usage/           # Usage tokens (semantic)
├── dist/                    # Generated files
│   ├── css/                 # CSS custom properties
│   └── scss/                # SCSS variables and maps
│       ├── variables/
│       └── maps/
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

## 🔧 Available Scripts

```bash
# Clean, generate and validate all styles
npm run build

# Clean only
npm run clean

# Generate only
npm run generate

# Validate generated tokens
npm run validate
```

## 📖 Naming Conventions

### CSS Custom Properties

Format: `--{prefix}{category}-{subcategory}-{variant}`

Examples:
- `--boreal-primary-base`
- `--boreal-spacing-m`
- `--boreal-neutral-700`
- `--boreal-text-default`

### SCSS Variables

Format: `${prefix}{category}-{subcategory}-{variant}`

Examples:
- `$boreal-primary-base`
- `$boreal-spacing-m`
- `$boreal-neutral-700`

### Token Naming Rules

✅ **Allowed:**
- Lowercase letters: `a-z`
- Numbers: `0-9`
- Hyphens: `-`

❌ **Not Allowed:**
- Spaces
- Parentheses: `(` `)`
- Uppercase letters
- Special characters

**The system automatically sanitizes invalid names:**
- `"ui (components)"` → `"ui"`
- `"bg (layout)"` → `"bg"`
- `"base-alt-(text)"` → `"base-alt"`

## 🎨 Semantic vs Primitive Tokens

### Primitives
Base values that don't change between themes (e.g., `color.proximus.cobalt.cobalt-50`)

### Semantic (Usage)
Tokens that reference primitives and change based on theme:
- `primary-base` → `{color.proximus.cobalt.cobalt-40}` in Proximus theme
- `text-default` → `{neutral-700}`
- `bg-primary` → `{primary-base}`

## 📝 Adding a New Theme

1. Create `src/tokens/theme/new-theme.json`
2. Define theme tokens following existing format
3. Add theme to `src/config/constants.ts`:

```typescript
export const THEMES = {
  PROXIMUS: 'proximus',
  MASIV: 'masiv',
  TELESIGN: 'telesign',
  BICS: 'bics',
  NEW_THEME: 'new-theme', // ← Add here
} as const;
```

4. Rebuild: `npm run build`

## 🧪 Token Validation

The build process automatically validates all generated tokens to ensure:
- ✅ Valid CSS variable names (no spaces or parentheses)
- ✅ Valid SCSS variable names
- ✅ Correct format (`--boreal-{name}` or `$boreal-{name}`)

Run validation manually:

```bash
npm run validate
```

Example output:

```
🔍 Validating generated tokens...

✓ css/global.css - Valid
✓ css/boreal.css - Valid
✓ css/theme-proximus.css - Valid
✓ scss/variables/_primitives.scss - Valid

✅ All tokens are valid!
```

## 🎯 Available Token Categories

### Colors
- **Primary, Accent**: Brand colors with variants (base, light, lighter, dark, darker)
- **Semantic**: success, danger, warning, information
- **Neutral**: 900, 800, 700, 600, 500, 400, 300, 200, 100, 50
- **Usage**: text, background, UI, icon, stroke
- **Extended**: Additional color palette

### Spacing
`4xs`, `3xs`, `2xs`, `1xs`, `xs`, `s`, `m`, `ml`, `l`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`

### Layout
`xs`, `s`, `m`, `ml`, `l`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

### Border Radius
`none`, `xs2`, `xs`, `s`, `m`, `l`, `xl`, `full`

### Icons
`s`, `m`, `l`, `xl`

## 🤝 Contributing

1. Modify tokens in `src/tokens/`
2. Run `npm run build`
3. Verify generated files in `dist/`

## 📄 License

ISC

## 📚 Resources

- [CSS Custom Properties Specification](https://www.w3.org/TR/css-variables/)
- [SASS Documentation](https://sass-lang.com/documentation)
- [Design Tokens Community Group](https://github.com/design-tokens/community-group)
