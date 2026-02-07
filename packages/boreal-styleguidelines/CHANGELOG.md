# Changelog

All notable changes to this project will be documented in this file.

## [0.0.2] - 2026-02-06

### Added

- ✨ **Stencil Generator**: New generator creates SCSS variables that reference CSS custom properties
  - `dist/stencil/_primitives.scss` - Primitive tokens as SCSS vars wrapping CSS vars
  - `dist/stencil/_theme.scss` - Theme tokens as SCSS vars wrapping CSS vars
  - `dist/stencil/_index.scss` - Stencil index file
  - Format: `$boreal-accent-dark: var(--boreal-accent-dark);`
- 🔨 **Global Generator**: Compiles SCSS files from `src/styles/global` directory
  - Automatically compiles and includes global SCSS in CSS output
  - Copies SCSS files to `dist/scss/global/` for direct SCSS consumption
  - Supports multiple SCSS files (reset.scss, grid.scss, etc.)
  - Generated `dist/scss/global/_reset.scss` with CSS reset
- 📦 **Main SCSS Index**: Created `dist/scss/_index.scss` as single entry point
  - Forwards variables, maps, and global modules
  - Simplifies SCSS imports: `@use '@boreal-ds/style-guidelines/scss'`
- 📝 **Code Documentation**: Added basic comments to all generators and TypeScript files

### Fixed

- 🐛 **SCSS Variable References**: SCSS output now preserves variable references instead of resolving to values
  - Before: `$boreal-bg-primary: #011ac2;`
  - After: `$boreal-bg-primary: $boreal-primary-base;`
- 🐛 **CSS Variable References**: CSS output now preserves var() references
  - Before: `--boreal-neutral-700: #3d3d57;`
  - After: `--boreal-neutral-700: var(--boreal-color-telesign-onyx-onyx-700);`
- 🐛 **Self-Referencing Variables**: Fixed extended variables that referenced themselves
  - Before: `$boreal-extended-purple-darker: $boreal-extended-purple-darker;`
  - After: `$boreal-extended-purple-darker: $boreal-color-masiv-purple-purple-90;`
- 🐛 **Variable Name Sanitization**: Fixed inconsistent sanitization causing undefined variable references
  - Sanitization now applied consistently across all path conversions
  - Fixed cases like `base-alt-(text)` not matching `base-alt`

### Changed

- 🔨 **Generator Architecture**: Separated CSS and SCSS generators into dedicated files
  - `css-generator.ts` - CSS custom properties generation
  - `scss-generator.ts` - SCSS variables, maps, and stencil generation
  - `token-processor.ts` - Shared token processing logic
  - `global-generator.ts` - Global SCSS compilation
- 🗂️ **Stencil Output Location**: Moved from `dist/scss/stencil/` to `dist/stencil/`
- 📦 **Package Exports**: Updated to include new entry points
  - `./scss` - Main SCSS index (`dist/scss/_index.scss`)
  - `./scss/global` - Global SCSS index
  - `./stencil` - Stencil index
- 🧹 **Code Quality**: Removed unused code, and cleaned up implementations

### Technical Details

#### New Reference Resolution

- **SCSS Resolution**: `resolveSCSSReference()` preserves SCSS variable names
- **CSS Resolution**: `resolveCSSReference()` wraps references in `var()`
- **Self-Reference Detection**: Prevents circular dependencies in extended tokens

#### Global Generator Features

- Scans `src/styles/global/` for `.scss` files
- Compiles SCSS to CSS using sass-embedded
- Appends compiled CSS to `global.css` and `boreal.css`
- Copies SCSS files to `dist/scss/global/` with underscore prefix
- Generates index files for easy imports

#### Files Generated (Updated)

- `dist/css/global.css` - Primitives + compiled global SCSS
- `dist/css/boreal.css` - Complete bundle with primitives, themes, and global styles
- `dist/css/theme-{name}.css` - Individual theme files
- `dist/scss/_index.scss` - Main SCSS entry point
- `dist/scss/variables/_index.scss` - SCSS variables
- `dist/scss/maps/_index.scss` - SCSS maps
- `dist/scss/global/_index.scss` - Global SCSS files
- `dist/stencil/_index.scss` - Stencil integration

## [0.0.1] - 2026-01-12

### Added

- ✨ Initial project structure for Boreal Design System
- 🎨 Multi-brand theme support (Proximus, Masiv, Telesign, BICS)
- 📦 CSS custom properties generation with `data-theme` selector
- 🔧 SCSS variables and maps for Stencil integration
- ⚙️ Configurable CSS variable prefix (`--boreal-` by default)
- 📝 Comprehensive documentation
- 🧪 Token validation script to ensure valid CSS/SCSS names
- 🔄 Automatic token sanitization (removes spaces, parentheses, etc.)

### Fixed

- 🐛 **Token naming issues**: Fixed generation of invalid CSS/SCSS variable names
  - Before: `--boreal-ui (components)-default`, `--boreal-bg (layout)-primary`
  - After: `--boreal-ui-default`, `--boreal-bg-primary`
- 🧹 Sanitization now removes:
  - Parentheses and their content: `(components)`, `(text)`, `(layout)`
  - Spaces: converts to hyphens
  - Multiple consecutive hyphens: normalizes to single hyphen
  - Leading/trailing hyphens

### Changed

- 🔨 Build process now includes validation step automatically
- 📐 Token processor applies sanitization rules consistently

### Technical Details

#### Sanitization Rules Applied

1. Remove parentheses and content: `"ui (components)"` → `"ui"`
2. Convert spaces to hyphens: `"primary color"` → `"primary-color"`
3. Normalize multiple hyphens: `"spacing--large"` → `"spacing-large"`
4. Remove leading/trailing hyphens
5. Convert to lowercase

#### Files Generated

- `dist/css/global.css` - Primitive tokens (colors, spacing, etc.)
- `dist/css/boreal.css` - Complete bundle with all themes
- `dist/css/theme-{name}.css` - Individual theme files
- `dist/scss/variables/_index.scss` - SCSS variables index
- `dist/scss/maps/_index.scss` - SCSS maps index

#### Scripts Available

```bash
npm run build      # Clean, generate, and validate
npm run clean      # Remove dist folder
npm run generate   # Generate CSS and SCSS files
npm run validate   # Validate generated tokens
```

### Documentation

- `README.md` - General documentation and getting started guide
- `CHANGELOG.md` - Project changelog (this file)

### Token Structure

#### Primitives (Global)

- Colors: Brand palettes (Proximus, Masiv, Telesign, BICS)
- Spacing: `4xs` to `7xl`
- Layout: `xs` to `6xl`
- Icons: `s`, `m`, `l`, `xl`
- Radius: `none` to `full`

#### Semantic Tokens (Per Theme)

- Primary, accent, success, danger, warning, information
- Neutral colors (900-50)
- Text, background, UI, icon, stroke colors
- Extended color palette

---

## Future Improvements

### Planned Features

- [ ] Typography tokens (font families, sizes, weights, line heights)
- [ ] Shadow/elevation tokens
- [ ] Animation/transition tokens
- [ ] Breakpoint tokens for responsive design
- [ ] Token documentation generator (visual style guide)

### Performance

- [ ] Minification options for production builds
- [ ] Source maps for debugging
- [ ] Tree-shaking support for unused tokens

---

## Breaking Changes

None yet - initial release.

---

## Migration Guide

N/A - initial release.
