# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-01-12

### Added
- ✨ Initial project structure for Boreal Design System
- 🎨 Multi-brand theme support (Proximus, Masiv, Telesign, BICS)
- 📦 CSS custom properties generation with `data-theme` selector
- 🔧 SCSS variables and maps for Stencil integration
- ⚙️ Configurable CSS variable prefix (`--boreal-` by default)
- 📝 Comprehensive documentation (README, STENCIL_USAGE, TOKEN_NAMING)
- 🎯 Interactive HTML example with theme switcher
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
- `STENCIL_USAGE.md` - Specific guide for Stencil integration with examples
- `TOKEN_NAMING.md` - Token naming conventions and best practices
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

### Browser Support
- Chrome 80+
- Firefox 80+
- Safari 13+
- Edge 80+

---

## Future Improvements

### Planned Features
- [ ] Typography tokens (font families, sizes, weights, line heights)
- [ ] Shadow/elevation tokens
- [ ] Animation/transition tokens
- [ ] Breakpoint tokens for responsive design
- [ ] Component-specific token sets
- [ ] Dark mode variants
- [ ] Accessibility color contrast validation
- [ ] Token documentation generator (visual style guide)

### Performance
- [ ] Minification options for production builds
- [ ] Source maps for debugging
- [ ] Tree-shaking support for unused tokens
- [ ] CDN distribution

### Developer Experience
- [ ] VS Code extension for token autocomplete
- [ ] Figma plugin for token sync
- [ ] Live preview server for theme testing
- [ ] CLI tool for token management

---

## Breaking Changes

None yet - initial release.

---

## Migration Guide

N/A - initial release.
