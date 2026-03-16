# React Wrapper for Boreal DS

A lightweight utility that wraps Boreal DS web components so they can be used as native React components.

## Overview

React and custom elements don't integrate cleanly out of the box. Two key limitations apply:

**Data passing** — React passes all data to custom elements as HTML attributes. This works for primitive values, but breaks for objects and arrays, which get serialised as `[object Object]`.

**Event handling** — React uses a synthetic event system that cannot listen for DOM events emitted by custom elements without manual `addEventListener` calls and refs.

This wrapper solves both problems by mapping props and events onto the underlying custom element automatically.

## Installation

> [!TIP]
> Refer to the official Boreal DS documentation at [Boreal DS Storybook](https://release-current--69b1eb61625aa69a7886f854.chromatic.com/) for more details.

```sh
npm install @telesign/boreal-react
```

> [!NOTE]
> `@telesign/boreal-web-components` is a dependency of this package and will be installed automatically. You do not need to install it separately.

## Setup

### Styles

Import the Boreal DS stylesheet in your application entry file:

```tsx
// main.tsx
import '@telesign/boreal-react/css/boreal.css';
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

## Usage

```tsx
import { BdsBanner } from '@telesign/boreal-react';

function App() {
  const handleClose = () => {
    console.log('Banner closed');
  };

  return (
    <BdsBanner variant="info" enableClose onClose={handleClose}>
      Welcome to Boreal DS
    </BdsBanner>
  );
}

export default App;
```
