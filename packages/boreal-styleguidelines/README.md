# Boreal Design System - Style Guidelines

Multi-brand design token system for Proximus, Masiv, Telesign, and BICS projects.

## 🎨 Features

- **Primitive Tokens**: Color palettes, spacing, layouts, radii, etc.
- **Multi-Brand Themes**: Support for 4 different brands
- **CSS Custom Properties**: CSS variables that change based on `data-theme`
- **SCSS Variables**: For use in Stencil components
- **Configurable Prefix**: Easily modify custom property prefix
- **Automatic Validation**: Ensures all generated tokens are valid

## ✨ What's New in 0.0.2

- **Stencil Generator**: New SCSS variables that wrap CSS custom properties for Stencil integration
- **Global Generator**: Automatically compiles global SCSS files (reset, grid, etc.)
- **Fixed Variable References**: SCSS and CSS outputs now preserve variable references instead of resolving to values
- **New Package Exports**: Added `./stencil`, `./scss`, and `./scss/global` entry points

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

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

- `dist/css/global.css` - Global variables (primitives) + compiled global styles
- `dist/css/boreal.css` - Complete bundle with all themes and global styles
- `dist/css/theme-{themeName}.css` - Individual theme CSS
- `dist/scss/_index.scss` - Main SCSS entry point
- `dist/scss/variables/_index.scss` - SCSS variables
- `dist/scss/maps/_index.scss` - SCSS maps
- `dist/scss/global/_index.scss` - Global SCSS files (reset, etc.)
- `dist/stencil/_index.scss` - Stencil integration (SCSS vars wrapping CSS vars)

### Use in HTML

```html
<!DOCTYPE html>
<html data-theme="proximus">
  <head>
    <!-- Option 1: Load complete bundle -->
    <link rel="stylesheet" href="dist/css/boreal.css" />

    <!-- Option 2: Load global + specific theme -->
    <link rel="stylesheet" href="dist/css/global.css" />
    <link rel="stylesheet" href="dist/css/theme-proximus.css" />
  </head>
  <body>
    <div
      style="background: var(--boreal-primary-base); color: var(--boreal-white);"
    >
      Hello Proximus!
    </div>
  </body>
</html>
```

### Switch Themes Dynamically

```javascript
// Switch to Masiv theme
document.documentElement.setAttribute("data-theme", "masiv");

// Switch to Telesign theme
document.documentElement.setAttribute("data-theme", "telesign");
```

## 🎯 Available Themes

- `proximus`
- `masiv`
- `telesign`
- `bics`

## 🔧 Stencil Integration

### Load Global Styles in project you use components, IMPORTANT: the stencil vars point to this.
### Go to use in projects to see more options to include in projects

In your `src/global/global.css` or `src/app.css`:

```css
/* Load complete bundle with all themes and global styles (reset, etc.) */
@import "@boreal-ds/style-guidelines/dist/css/boreal.css";
```

### Configure SASS in Stencil

Install SASS:

```bash
npm install --save-dev @stencil/sass
```

In `stencil.config.ts`:

```typescript
import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  plugins: [
    sass({
      includePaths: ["node_modules"],
    }),
  ],
  // ... rest of config
};
```

### Use in Projects

#### Option 1: CSS Variables

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

#### Option 2: SCSS Variables (Recommended for only one themes and reuse)

**my-component.scss:**

```scss
// Option A: Use main SCSS entry point (includes variables, maps, and global)
@use "@boreal-ds/style-guidelines/scss" as boreal;

// Option B: Use only variables
@use "@boreal-ds/style-guidelines/scss/variables" as boreal;

.card {
  background: boreal.$boreal-ui-default;
  border-radius: boreal.$boreal-radius-m;
  padding: boreal.$boreal-spacing-m;
}
```

#### Stencil Integration (CSS vars wrapped in SCSS) IMPORTANT: Dev Components

**my-component.scss:**

```scss
@use "@boreal-ds/style-guidelines/stencil" as boreal;

.card {
  // SCSS variables that reference CSS custom properties
  background: boreal.$boreal-ui-default; // Outputs: var(--boreal-ui-default)
  border-radius: boreal.$boreal-radius-m;
  padding: boreal.$boreal-spacing-m;
}
```

## ⚙️ Configuration

### Change CSS Variable Prefix

Edit `src/config/constants.ts`:

```typescript
export const CSS_VAR_PREFIX = "--boreal-"; // Change to '--br-', '--my-ds-', etc.
```

Then regenerate:

```bash
npm run build
```

### Package Exports

The package provides several import paths for flexibility:

```javascript
// CSS imports
import '@boreal-ds/style-guidelines'; // Main bundle (boreal.css)
import '@boreal-ds/style-guidelines/css/global'; // Only global styles
import '@boreal-ds/style-guidelines/css/theme-proximus'; // Specific theme

// SCSS imports
@use '@boreal-ds/style-guidelines/scss'; // Main SCSS entry (variables + maps + global)
@use '@boreal-ds/style-guidelines/scss/variables'; // Only variables
@use '@boreal-ds/style-guidelines/scss/maps'; // Only maps
@use '@boreal-ds/style-guidelines/scss/global'; // Only global SCSS

// Stencil integration
@use '@boreal-ds/style-guidelines/stencil'; // SCSS vars wrapping CSS vars
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
│   │   ├── css-generator.ts # CSS custom properties generation
│   │   ├── scss-generator.ts # SCSS variables and maps generation
│   │   ├── token-processor.ts # Shared token processing logic
│   │   ├── global-generator.ts # Global SCSS compilation
│   │   └── validate.ts      # Token validation
│   ├── styles/              # Base styles
│   │   └── global/
│   │       └── reset.scss   # CSS Reset
│   └── tokens/              # Design tokens
│       ├── primitives/      # Primitive tokens (colors, spacing, etc.)
│       ├── theme/           # Brand/theme tokens
│       └── usage/           # Usage tokens (semantic)
├── dist/                    # Generated files
│   ├── css/                 # CSS custom properties
│   ├── scss/                # SCSS variables and maps
│   │   ├── _index.scss      # Main SCSS entry point
│   │   ├── variables/       # SCSS variables
│   │   ├── maps/            # SCSS maps
│   │   └── global/          # Global SCSS files
│   └── stencil/             # Stencil integration
│       └── _index.scss      # SCSS vars wrapping CSS vars
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
  PROXIMUS: "proximus",
  MASIV: "masiv",
  TELESIGN: "telesign",
  BICS: "bics",
  NEW_THEME: "new-theme", // ← Add here
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

1. Modify tokens in `src/tokens/` download from figma
2. Run `npm run build`
3. Verify generated files in `dist/`
