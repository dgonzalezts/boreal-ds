# Boreal DS — React Test App

A minimal React + Vite sandbox for testing Boreal Design System components end-to-end using packed `.tgz` artifacts.

---

## Prerequisites

- [Node.js](https://nodejs.org) 22.x (see `.nvmrc` at the repo root)
- [pnpm](https://pnpm.io)

---

## Running the app

This app is started via the `scripts-boreal` pipeline, which packs the component library as a real `.tgz` artifact and installs it before launching the dev server.

From the **workspace root** (dependencies are already installed via `pnpm install`):

```bash
node scripts-boreal/bin/publish.js react
```

This command:
1. Packs `@telesign/boreal-web-components` into a `.tgz`
2. Installs it into `@telesign/boreal-react`
3. Builds `@telesign/boreal-react`
4. Packs it into a `.tgz` and installs it into this app
5. Starts this app with `pnpm dev`

For CI validation (build instead of dev server):

```bash
pnpm validate:pack
```

---

## How it works

CSS and theming are configured in two files:

**[`index.html`](index.html)** — icon font and theme:
```html
<link rel="stylesheet" href="https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css" />
<body data-theme="telesign">
```

**[`src/main.tsx`](src/main.tsx)** — design tokens, reset, fonts, typography:
```ts
import '@telesign/boreal-react/css/boreal.css';
```

Available themes for `data-theme`: `telesign` | `proximus` | `masiv` | `bics`

---

## Adding components

Import any component from `@telesign/boreal-react` and use it in [`src/App.tsx`](src/App.tsx):

```tsx
import { BdsTypography } from '@telesign/boreal-react';

function App() {
  return <BdsTypography variant="heading" element="h1">Hello Boreal</BdsTypography>;
}
```
