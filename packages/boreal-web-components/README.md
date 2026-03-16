# @telesign/boreal-web-components

> Framework-agnostic Web Components for the Boreal Design System — built with Stencil, themed with CSS custom properties.

[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

---

## Overview

`@telesign/boreal-web-components` is the core component library of the Boreal Design System. It is built with [Stencil](https://stenciljs.com/), a compile-time tool that generates standards-based [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) — web components that run in any browser and integrate with any framework (or no framework at all).

All visual styles are driven by CSS custom properties (design tokens), enabling multi-brand theming across Proximus, Connect, Engage, and Protect.

---

## Installation

```sh
npm install @telesign/boreal-web-components
# or
pnpm add @telesign/boreal-web-components
# or
yarn add @telesign/boreal-web-components
```

---

## Setup

### Styles

Import the Boreal DS stylesheet in your application entry file:

```ts
import '@telesign/boreal-web-components/dist/boreal-web-components/boreal-web-components.css';
```

### Icon font

Add the Boreal DS icon font to the `<head>` of your `index.html`:

```html
<link
  rel="stylesheet"
  href="https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css"
/>
```

### Theming

Set the `data-theme` attribute on the `<body>` element to activate a brand theme:

```html
<body data-theme="proximus">
```

Available values: `connect` | `engage` | `protect` | `proximus`

Each theme maps to a set of CSS custom properties (design tokens) that control color, typography, spacing, and shape across all components. Changing the attribute at runtime switches the active theme instantly.

---

## Usage

### Vanilla HTML

Load the ESM bundle and stylesheet directly from the package:

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="node_modules/@telesign/boreal-web-components/dist/boreal-web-components/boreal-web-components.css"
    />
    <script
      type="module"
      src="node_modules/@telesign/boreal-web-components/dist/boreal-web-components/boreal-web-components.esm.js"
    ></script>
  </head>
  <body data-theme="proximus">
    <bds-banner variant="info">Welcome to Boreal DS</bds-banner>
  </body>
</html>
```

### Lazy Loading

If your project uses a bundler, register all components via the loader and let them load on demand:

```ts
import { defineCustomElements } from '@telesign/boreal-web-components/loader';

defineCustomElements();
```

### Standalone (tree-shakeable)

Import individual components directly to keep bundle sizes small:

```ts
import '@telesign/boreal-web-components/components/bds-banner';
```

---

## Framework Wrappers

For React and Vue applications, framework-specific wrappers provide typed props, event bindings, and (for Vue) `v-model` support out of the box.

| Package | Description | Docs |
| --- | --- | --- |
| [`@telesign/boreal-react`](https://www.npmjs.com/package/@telesign/boreal-react) | React wrapper | [README](../boreal-react/README.md) |
| [`@telesign/boreal-vue`](https://www.npmjs.com/package/@telesign/boreal-vue) | Vue 3 wrapper | [README](../boreal-vue/README.md) |

> [!NOTE]
> Both wrapper packages list `@telesign/boreal-web-components` as a dependency and install it automatically. You do not need to install it separately when using a wrapper.

---

## Events

Boreal DS components emit custom DOM events for interactive behaviour. All custom events are prefixed with `bds` followed by the action name — for example `bdsClose`, `bdsChange`, `bdsClick`.

This prefix prevents collisions with native browser events and third-party libraries.

```html
<bds-banner variant="info" enable-close>Something happened</bds-banner>

<script>
  const banner = document.querySelector('bds-banner');
  banner.addEventListener('bdsClose', (event) => {
    console.log('Banner dismissed', event.detail);
  });
</script>
```

---

## Development

### Prerequisites

This project uses [fnm](https://github.com/Schniz/fnm) to manage Node.js versions. Before running any commands, activate the correct version:

```sh
fnm use
```

You will also need [pnpm](https://pnpm.io/) as the package manager.

### Local setup

```sh
# Clone the monorepo and move into this package
git clone <repo-url> boreal-ds
cd boreal-ds

# Activate the correct Node version
fnm use

# Install all workspace dependencies from the monorepo root
pnpm install

# Build the web-components package
pnpm --filter @telesign/boreal-web-components build

# Start the Stencil dev server with file watching
pnpm --filter @telesign/boreal-web-components dev
```

### Generate a component

Stencil includes a generator that scaffolds the component structure interactively:

```sh
pnpm --filter @telesign/boreal-web-components generate
```

### Available scripts

| Script | Description |
| --- | --- |
| `build` | Production build via Stencil |
| `dev` | Dev build with watch + local server |
| `test` | Run unit tests (Jest + spec) |
| `e2e` | Run end-to-end tests (Puppeteer) |
| `generate` | Scaffold a new component interactively |

---

## Contributing

Please read the [Contributing Guidelines](../../CONTRIBUTING.md) at the monorepo root before submitting issues or pull requests.

---

## License

MIT
